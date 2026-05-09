import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Zap, Star, Lock, CheckCircle, PlayCircle, RotateCcw, AlertCircle } from 'lucide-react';
import type { Course } from '../../types';
import ProgressBar from './ProgressBar';

interface CourseCardProps {
  course: Course;
  progress?: number;      // 0-100 completion percentage
  status?: 'not_started' | 'in_progress' | 'completed';
  isLocked?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  core_awareness: 'bg-blue-100 text-blue-700',
  bpo_data_security: 'bg-purple-100 text-purple-700',
  m365_security: 'bg-indigo-100 text-indigo-700',
  it_helpdesk: 'bg-cyan-100 text-cyan-700',
  ai_modern_threats: 'bg-pink-100 text-pink-700',
};

const CATEGORY_LABELS: Record<string, string> = {
  core_awareness: 'Core Security',
  bpo_data_security: 'BPO Security',
  m365_security: 'Microsoft 365',
  it_helpdesk: 'IT & Helpdesk',
  ai_modern_threats: 'AI Threats',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'text-green-600',
  intermediate: 'text-yellow-600',
  advanced: 'text-red-600',
};

const DIFFICULTY_STARS: Record<string, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};

const GRADIENT_MAP: Record<string, string> = {
  core_awareness: 'from-blue-500 to-indigo-600',
  bpo_data_security: 'from-purple-500 to-violet-600',
  m365_security: 'from-indigo-500 to-blue-600',
  it_helpdesk: 'from-cyan-500 to-teal-600',
  ai_modern_threats: 'from-pink-500 to-rose-600',
};

export default function CourseCard({ course, progress = 0, status = 'not_started', isLocked = false }: CourseCardProps) {
  const navigate = useNavigate();

  const handleAction = () => {
    if (isLocked) return;
    if (status === 'completed') {
      navigate(`/courses/${course.id}`);
    } else {
      navigate(`/courses/${course.id}`);
    }
  };

  const buttonConfig = {
    not_started: { label: 'Start Course', icon: <PlayCircle size={16} />, cls: 'bg-orange-500 hover:bg-orange-600 text-white' },
    in_progress: { label: 'Continue', icon: <PlayCircle size={16} />, cls: 'bg-orange-500 hover:bg-orange-600 text-white' },
    completed: { label: 'Review', icon: <RotateCcw size={16} />, cls: 'bg-gray-100 hover:bg-gray-200 text-gray-700' },
  };

  const btn = buttonConfig[status];
  const stars = DIFFICULTY_STARS[course.difficulty];

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col ${isLocked ? 'opacity-60' : ''}`}
    >
      {/* Thumbnail */}
      <div className={`relative h-36 bg-gradient-to-br ${GRADIENT_MAP[course.category]} flex items-center justify-center`}>
        <span className="text-5xl">{course.thumbnail}</span>
        {isLocked && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Lock size={32} className="text-white" />
          </div>
        )}
        {status === 'completed' && (
          <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
            <CheckCircle size={16} className="text-white" />
          </div>
        )}
        {course.isRequired && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <AlertCircle size={10} />
            Required
          </div>
        )}
        {/* XP Badge */}
        <div className="absolute bottom-2 right-2 bg-black/50 text-yellow-400 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Zap size={10} />
          {course.xpReward} XP
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category + Difficulty */}
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[course.category]}`}>
            {CATEGORY_LABELS[course.category]}
          </span>
          <div className={`flex items-center gap-0.5 ${DIFFICULTY_COLORS[course.difficulty]}`}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < stars ? 'fill-current' : 'opacity-20'}
              />
            ))}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1 mb-3">
          {course.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {course.duration} min
          </span>
          <span className="capitalize">{course.difficulty}</span>
          <span>{course.modules.length} modules</span>
        </div>

        {/* Progress bar */}
        {status === 'in_progress' && (
          <div className="mb-3">
            <ProgressBar value={progress} size="sm" showPercent={true} />
          </div>
        )}
        {status === 'completed' && (
          <div className="mb-3">
            <div className="w-full bg-green-100 rounded-full h-1.5">
              <div className="bg-green-500 h-1.5 rounded-full w-full" />
            </div>
            <p className="text-xs text-green-600 font-medium mt-1">Completed ✓</p>
          </div>
        )}

        {/* Action button */}
        <button
          onClick={handleAction}
          disabled={isLocked}
          className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-150 ${btn.cls} ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {btn.icon}
          {btn.label}
        </button>
      </div>
    </div>
  );
}
