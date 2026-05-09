import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  BookOpen,
  MessageSquare,
  Award,
  List,
  X,
  PlayCircle,
} from 'lucide-react';
import { COURSES } from '../data/curriculum';
import type { Slide, Module } from '../types';
import ProgressBar from '../components/ui/ProgressBar';

export default function CourseViewer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const course = COURSES.find(c => c.id === id);

  const [activeModuleIdx, setActiveModuleIdx] = useState(0);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [completedSlides, setCompletedSlides] = useState<Set<string>>(new Set());
  const [showNotes, setShowNotes] = useState(false);
  const [showModules, setShowModules] = useState(true);

  // Load saved progress from localStorage
  useEffect(() => {
    if (!course) return;
    const saved = localStorage.getItem(`cs_progress_${course.id}`);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setCompletedSlides(new Set(data.completedSlides || []));
        setActiveModuleIdx(data.moduleIdx || 0);
        setActiveSlideIdx(data.slideIdx || 0);
      } catch { /* ignore */ }
    }
  }, [course?.id]);

  // Save progress
  useEffect(() => {
    if (!course) return;
    localStorage.setItem(`cs_progress_${course.id}`, JSON.stringify({
      completedSlides: Array.from(completedSlides),
      moduleIdx: activeModuleIdx,
      slideIdx: activeSlideIdx,
    }));
  }, [completedSlides, activeModuleIdx, activeSlideIdx, course?.id]);

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <BookOpen size={48} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Course not found</h2>
        <button
          onClick={() => navigate('/courses')}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const module: Module = course.modules[activeModuleIdx];
  const slides: Slide[] = module.content;
  const currentSlide = slides[activeSlideIdx];
  const slideKey = `${module.id}_${currentSlide.id}`;

  const totalSlides = course.modules.reduce((sum, m) => sum + m.content.length, 0);
  const completedCount = completedSlides.size;
  const overallProgress = Math.round((completedCount / totalSlides) * 100);

  const isModuleComplete = (mod: Module) =>
    mod.content.every(s => completedSlides.has(`${mod.id}_${s.id}`));

  const handleNext = () => {
    setCompletedSlides(prev => new Set(prev).add(slideKey));
    if (activeSlideIdx < slides.length - 1) {
      setActiveSlideIdx(activeSlideIdx + 1);
    } else if (activeModuleIdx < course.modules.length - 1) {
      setActiveModuleIdx(activeModuleIdx + 1);
      setActiveSlideIdx(0);
    }
  };

  const handlePrev = () => {
    if (activeSlideIdx > 0) {
      setActiveSlideIdx(activeSlideIdx - 1);
    } else if (activeModuleIdx > 0) {
      setActiveModuleIdx(activeModuleIdx - 1);
      setActiveSlideIdx(course.modules[activeModuleIdx - 1].content.length - 1);
    }
  };

  const handleCompleteModule = () => {
    // Mark all slides in module as complete
    const newSet = new Set(completedSlides);
    module.content.forEach(s => newSet.add(`${module.id}_${s.id}`));
    setCompletedSlides(newSet);
    navigate(`/quiz/${course.id}`);
  };

  const isLastSlide =
    activeModuleIdx === course.modules.length - 1 &&
    activeSlideIdx === slides.length - 1;

  const isFirstSlide = activeModuleIdx === 0 && activeSlideIdx === 0;

  const getSlideTypeStyle = (type: string) => {
    switch (type) {
      case 'scenario': return 'border-orange-300 bg-orange-50';
      case 'infographic': return 'border-blue-300 bg-blue-50';
      case 'video': return 'border-purple-300 bg-purple-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  const getSlideTypeBadge = (type: string) => {
    const map: Record<string, { label: string; cls: string }> = {
      content: { label: 'Content', cls: 'bg-gray-100 text-gray-600' },
      scenario: { label: 'Scenario', cls: 'bg-orange-100 text-orange-700' },
      infographic: { label: 'Infographic', cls: 'bg-blue-100 text-blue-700' },
      video: { label: 'Video', cls: 'bg-purple-100 text-purple-700' },
    };
    return map[type] || map['content'];
  };

  const badge = getSlideTypeBadge(currentSlide.type);

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 rounded-xl mb-4 p-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/courses')}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Back to Courses</span>
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-bold text-gray-900 text-sm sm:text-base truncate">{course.title}</h1>
            <span className="text-xs text-gray-500">{module.title}</span>
          </div>
          <ProgressBar value={overallProgress} size="sm" showPercent={true} className="mt-1 max-w-xs" />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`p-2 rounded-lg text-sm flex items-center gap-1.5 transition-colors ${showNotes ? 'bg-orange-100 text-orange-600' : 'text-gray-500 hover:bg-gray-100'}`}
            title="Toggle speaker notes"
          >
            <MessageSquare size={16} />
            <span className="hidden sm:inline text-xs font-medium">Notes</span>
          </button>
          <button
            onClick={() => setShowModules(!showModules)}
            className={`p-2 rounded-lg text-sm flex items-center gap-1.5 transition-colors ${showModules ? 'bg-orange-100 text-orange-600' : 'text-gray-500 hover:bg-gray-100'}`}
            title="Toggle module list"
          >
            <List size={16} />
            <span className="hidden sm:inline text-xs font-medium">Modules</span>
          </button>
        </div>
      </div>

      <div className="flex gap-4 flex-1">
        {/* Module sidebar */}
        {showModules && (
          <div className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-sm">Course Modules</h3>
              <p className="text-xs text-gray-500 mt-0.5">{completedCount} / {totalSlides} slides complete</p>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {course.modules.map((mod, mIdx) => {
                const modComplete = isModuleComplete(mod);
                const isActive = mIdx === activeModuleIdx;
                return (
                  <div key={mod.id} className="mb-1">
                    <button
                      onClick={() => { setActiveModuleIdx(mIdx); setActiveSlideIdx(0); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                        isActive ? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {modComplete ? (
                          <CheckCircle size={16} className="text-green-500" />
                        ) : isActive ? (
                          <PlayCircle size={16} className="text-orange-500" />
                        ) : (
                          <Circle size={16} className="text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{mod.title}</p>
                        <p className="text-xs text-gray-400">{mod.content.length} slides • {mod.duration} min</p>
                      </div>
                    </button>
                    {isActive && (
                      <div className="pl-11 pr-4 pb-2">
                        {mod.content.map((slide, sIdx) => {
                          const key = `${mod.id}_${slide.id}`;
                          const isDone = completedSlides.has(key);
                          const isCurrent = sIdx === activeSlideIdx;
                          return (
                            <button
                              key={slide.id}
                              onClick={() => setActiveSlideIdx(sIdx)}
                              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors mb-0.5 text-left ${
                                isCurrent ? 'bg-orange-100 text-orange-700 font-medium' : isDone ? 'text-green-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {isDone ? <CheckCircle size={10} /> : <Circle size={10} />}
                              <span className="truncate">{slide.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Main content area */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Slide */}
          <div className={`flex-1 bg-white rounded-xl border-2 shadow-sm p-6 lg:p-8 ${getSlideTypeStyle(currentSlide.type)}`}>
            <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}>{badge.label}</span>
                <span className="text-xs text-gray-500">Slide {activeSlideIdx + 1} of {slides.length}</span>
              </div>
              <div className="text-xs text-gray-500">
                Module {activeModuleIdx + 1}: {module.title}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">{currentSlide.title}</h2>

            {currentSlide.type === 'scenario' ? (
              <div className="space-y-3">
                {currentSlide.content.map((line, i) => (
                  <div key={i} className={`flex items-start gap-3 p-4 rounded-xl ${i === 0 ? 'bg-orange-100 border border-orange-300' : 'bg-white border border-orange-200'}`}>
                    <span className="text-orange-500 font-bold text-sm flex-shrink-0 mt-0.5">
                      {i === 0 ? '📋' : line.startsWith('Red Flag') ? '🚩' : line.startsWith('Correct') ? '✅' : '→'}
                    </span>
                    <p className={`text-sm leading-relaxed ${i === 0 ? 'font-semibold text-orange-800' : 'text-gray-700'}`}>{line}</p>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="space-y-3">
                {currentSlide.content.map((line, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-orange-600 text-xs font-bold">{i + 1}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm">{line}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Speaker Notes */}
          {showNotes && currentSlide.speakerNotes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare size={14} className="text-yellow-600" />
                  <span className="text-sm font-semibold text-yellow-800">Trainer Notes</span>
                </div>
                <button onClick={() => setShowNotes(false)} className="text-yellow-500 hover:text-yellow-700">
                  <X size={14} />
                </button>
              </div>
              <p className="text-sm text-yellow-700 leading-relaxed">{currentSlide.speakerNotes}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-4 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={isFirstSlide}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlideIdx(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === activeSlideIdx
                      ? 'bg-orange-500 w-5'
                      : completedSlides.has(`${module.id}_${slides[idx].id}`)
                      ? 'bg-green-400'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {isLastSlide ? (
              <button
                onClick={handleCompleteModule}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                <Award size={16} />
                Take Quiz
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 text-sm font-medium text-orange-500 hover:text-orange-700 transition-colors"
              >
                Next
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
