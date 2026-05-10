import React, { useState, useMemo } from 'react';
import { Search, Filter, X, BookOpen, CheckCircle, PlayCircle, Clock, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { COURSES } from '../data/curriculum';
import CourseCard from '../components/ui/CourseCard';
import type { CourseCategory, DifficultyLevel } from '../types';

const TRACKS = [
  { id: 'all', label: 'All Courses' },
  { id: 'core_awareness', label: 'Core Security' },
  { id: 'bpo_data_security', label: 'BPO Security' },
  { id: 'm365_security', label: 'Microsoft 365' },
  { id: 'it_helpdesk', label: 'IT & Helpdesk' },
  { id: 'ai_modern_threats', label: 'AI Threats' },
];

type StatusFilter = 'all' | 'in_progress' | 'completed' | 'not_started';

const MOCK_PROGRESS: Record<string, { status: 'not_started' | 'in_progress' | 'completed'; progress: number }> = {
  'crs-001': { status: 'completed', progress: 100 },
  'crs-002': { status: 'in_progress', progress: 65 },
  'crs-003': { status: 'not_started', progress: 0 },
  'crs-004': { status: 'not_started', progress: 0 },
  'crs-005': { status: 'not_started', progress: 0 },
  'crs-006': { status: 'in_progress', progress: 30 },
  'crs-007': { status: 'not_started', progress: 0 },
  'crs-008': { status: 'not_started', progress: 0 },
};

export default function Courses() {
  const { user } = useAuth();
  const [activeTrack, setActiveTrack] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [diffFilter, setDiffFilter] = useState<DifficultyLevel | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const getCourseStatus = (courseId: string) => {
    if (user?.completedCourses.includes(courseId)) return 'completed';
    return MOCK_PROGRESS[courseId]?.status || 'not_started';
  };

  const getCourseProgress = (courseId: string) => {
    if (user?.completedCourses.includes(courseId)) return 100;
    return MOCK_PROGRESS[courseId]?.progress || 0;
  };

  const filteredCourses = useMemo(() => {
    return COURSES.filter(course => {
      if (activeTrack !== 'all' && course.category !== activeTrack) return false;
      if (diffFilter !== 'all' && course.difficulty !== diffFilter) return false;
      if (statusFilter !== 'all') {
        const s = getCourseStatus(course.id);
        if (s !== statusFilter) return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          course.title.toLowerCase().includes(q) ||
          course.description.toLowerCase().includes(q) ||
          course.tags.some(t => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [activeTrack, diffFilter, statusFilter, searchQuery, user]);

  const requiredCourses = filteredCourses.filter(c => c.isRequired);
  const otherCourses = filteredCourses.filter(c => !c.isRequired);

  const totalCompleted = COURSES.filter(c => getCourseStatus(c.id) === 'completed').length;
  const totalInProgress = COURSES.filter(c => getCourseStatus(c.id) === 'in_progress').length;

  const clearFilters = () => {
    setSearchQuery('');
    setDiffFilter('all');
    setStatusFilter('all');
    setActiveTrack('all');
  };

  const hasFilters = searchQuery || diffFilter !== 'all' || statusFilter !== 'all' || activeTrack !== 'all';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Library</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {COURSES.length} courses available • {totalCompleted} completed • {totalInProgress} in progress
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
            <CheckCircle size={14} />
            <span className="font-medium">{totalCompleted} Complete</span>
          </div>
          <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
            <PlayCircle size={14} />
            <span className="font-medium">{totalInProgress} In Progress</span>
          </div>
        </div>
      </div>

      {/* Track tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {TRACKS.map(track => (
          <button
            key={track.id}
            onClick={() => setActiveTrack(track.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
              activeTrack === track.id
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-600'
            }`}
          >
            {track.label}
          </button>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses, topics, tags..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <select
              value={diffFilter}
              onChange={e => setDiffFilter(e.target.value as DifficultyLevel | 'all')}
              className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as StatusFilter)}
              className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700"
            >
              <option value="all">All Status</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
              >
                <X size={14} />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Filter size={14} />
            <span>Showing <span className="font-semibold text-gray-900">{filteredCourses.length}</span> of {COURSES.length} courses</span>
          </div>
        </div>
      </div>

      {/* Required courses */}
      {requiredCourses.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-5 bg-red-500 rounded-full" />
              <h2 className="text-lg font-semibold text-gray-900">Required Training</h2>
            </div>
            <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">
              {requiredCourses.filter(c => getCourseStatus(c.id) !== 'completed').length} pending
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {requiredCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                status={getCourseStatus(course.id)}
                progress={getCourseProgress(course.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other courses */}
      {otherCourses.length > 0 && (
        <div>
          {requiredCourses.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-5 bg-blue-500 rounded-full" />
              <h2 className="text-lg font-semibold text-gray-900">Additional Training</h2>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                status={getCourseStatus(course.id)}
                progress={getCourseProgress(course.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {filteredCourses.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No courses found</h3>
          <p className="text-gray-500 text-sm mb-4">Try adjusting your filters or search query</p>
          <button
            onClick={clearFilters}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* XP Summary */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-yellow-500" />
            <span className="text-sm font-semibold text-gray-700">Total Available XP from all courses</span>
          </div>
          <span className="text-lg font-bold text-orange-500">
            {COURSES.reduce((sum, c) => sum + c.xpReward, 0).toLocaleString()} XP
          </span>
        </div>
        <div className="mt-2 flex gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><Clock size={12} />Total: {COURSES.reduce((sum, c) => sum + c.duration, 0)} minutes</span>
          <span>{COURSES.length} courses across {TRACKS.length - 1} tracks</span>
        </div>
      </div>
    </div>
  );
}
