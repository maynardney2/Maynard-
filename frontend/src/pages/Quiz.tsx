import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Trophy,
  XCircle,
  RotateCcw,
  BookOpen,
  Award,
  Clock,
  CheckCircle,
  ArrowRight,
  Home,
  AlertTriangle,
} from 'lucide-react';
import { COURSES } from '../data/curriculum';
import QuizCard from '../components/ui/QuizCard';
import type { Question } from '../types';

const PASSING_SCORE = 80;

interface WrongAnswer {
  question: Question;
  selectedAnswer: number;
}

export default function Quiz() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const course = COURSES.find(c => c.id === courseId);
  const allQuestions: Question[] = course?.modules.flatMap(m => m.quiz.questions) ?? [];

  const [questions] = useState<Question[]>(() => {
    // Take up to 10 questions, shuffle
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(10, shuffled.length));
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(() => new Array(questions.length).fill(null));
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(questions.length * 60); // 1 min per question
  const [timeTaken, setTimeTaken] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [showWrongReview, setShowWrongReview] = useState(false);

  const currentQuestion = questions[currentIdx];

  // Timer
  useEffect(() => {
    if (quizComplete) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinish();
          return 0;
        }
        setTimeTaken(t => t + 1);
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [quizComplete]);

  const handleFinish = useCallback(() => {
    const correct = answers.filter((a, i) => a === questions[i]?.correctAnswer).length;
    const scoreVal = Math.round((correct / questions.length) * 100);
    setScore(scoreVal);
    setQuizComplete(true);

    const wrong: WrongAnswer[] = [];
    questions.forEach((q, i) => {
      if (answers[i] !== q.correctAnswer) {
        wrong.push({ question: q, selectedAnswer: answers[i] ?? -1 });
      }
    });
    setWrongAnswers(wrong);
  }, [answers, questions]);

  const handleSelectAnswer = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    const newAnswers = [...answers];
    newAnswers[currentIdx] = selectedAnswer;
    setAnswers(newAnswers);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      handleFinish();
    }
  };

  const handleRetake = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setAnswers(new Array(questions.length).fill(null));
    setWrongAnswers([]);
    setTimeLeft(questions.length * 60);
    setTimeTaken(0);
    setQuizComplete(false);
    setScore(0);
    setShowWrongReview(false);
  };

  if (!course || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <AlertTriangle size={48} className="text-orange-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Quiz not available</h2>
        <button onClick={() => navigate('/courses')} className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold">
          Back to Courses
        </button>
      </div>
    );
  }

  // Results screen
  if (quizComplete) {
    const passed = score >= PASSING_SCORE;
    const correctCount = answers.filter((a, i) => a === questions[i]?.correctAnswer).length;
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    const circumference = 2 * Math.PI * 45;
    const dashOffset = circumference - (score / 100) * circumference;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Results header */}
        <div className={`rounded-2xl p-8 text-center ${passed ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-red-500 to-red-600'} text-white`}>
          <div className="flex justify-center mb-4">
            {passed ? <Trophy size={56} className="text-yellow-300" /> : <XCircle size={56} className="text-white/80" />}
          </div>
          <h2 className="text-3xl font-bold mb-2">{passed ? 'Congratulations! 🎉' : 'Keep Practicing'}</h2>
          <p className="text-white/90 text-lg">
            {passed
              ? `You passed with ${score}%! Certificate earned.`
              : `You scored ${score}%. You need ${PASSING_SCORE}% to pass.`}
          </p>
        </div>

        {/* Score circle + stats */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* Animated score circle */}
            <div className="flex-shrink-0">
              <svg width="120" height="120" className="-rotate-90">
                <circle cx="60" cy="60" r="45" stroke="#e5e7eb" strokeWidth="10" fill="none" />
                <circle
                  cx="60" cy="60" r="45"
                  stroke={passed ? '#22c55e' : '#ef4444'}
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
              </svg>
              <div className="text-center -mt-[76px]">
                <p className={`text-3xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>{score}%</p>
                <p className="text-xs text-gray-500">Score</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <CheckCircle size={20} className="text-green-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-gray-900">{correctCount}</p>
                <p className="text-xs text-gray-500">Correct</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <XCircle size={20} className="text-red-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-gray-900">{questions.length - correctCount}</p>
                <p className="text-xs text-gray-500">Incorrect</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <Clock size={20} className="text-blue-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-gray-900">{minutes}:{String(seconds).padStart(2, '0')}</p>
                <p className="text-xs text-gray-500">Time Taken</p>
              </div>
            </div>
          </div>

          {/* Certificate message */}
          {passed && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
              <Award size={24} className="text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-800 text-sm">Certificate Earned!</p>
                <p className="text-green-700 text-xs">
                  You've earned a certificate for completing "{course.title}". Download it from your Profile page.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {!passed && (
            <button
              onClick={handleRetake}
              className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-xl font-semibold transition-colors"
            >
              <RotateCcw size={18} />
              Retake Quiz
            </button>
          )}
          {passed && (
            <button
              onClick={() => navigate('/courses')}
              className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-xl font-semibold transition-colors"
            >
              <ArrowRight size={18} />
              Continue Learning
            </button>
          )}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-colors"
          >
            <Home size={18} />
            Dashboard
          </button>
          {wrongAnswers.length > 0 && (
            <button
              onClick={() => setShowWrongReview(!showWrongReview)}
              className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-colors"
            >
              <BookOpen size={18} />
              Review Mistakes ({wrongAnswers.length})
            </button>
          )}
        </div>

        {/* Wrong answers review */}
        {showWrongReview && wrongAnswers.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <XCircle size={18} className="text-red-500" />
              Incorrect Answers Review
            </h3>
            {wrongAnswers.map(({ question, selectedAnswer: sa }, i) => (
              <QuizCard
                key={question.id}
                question={question}
                questionNumber={i + 1}
                totalQuestions={wrongAnswers.length}
                selectedAnswer={sa}
                showFeedback={true}
                onSelectAnswer={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Quiz in progress
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">{course.title}</p>
          <p className="text-xs text-gray-500">Quiz Assessment</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-gray-500">Pass mark</p>
            <p className="text-sm font-bold text-orange-500">{PASSING_SCORE}%</p>
          </div>
        </div>
      </div>

      {/* Question */}
      <QuizCard
        question={currentQuestion}
        questionNumber={currentIdx + 1}
        totalQuestions={questions.length}
        selectedAnswer={selectedAnswer}
        showFeedback={showFeedback}
        timeLeft={timeLeft}
        onSelectAnswer={handleSelectAnswer}
      />

      {/* Action buttons */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-3">
        <button
          onClick={() => navigate(`/courses/${courseId}`)}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1.5 transition-colors"
        >
          <BookOpen size={14} />
          Return to Course
        </button>
        <div className="flex items-center gap-3">
          {!showFeedback ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              {currentIdx < questions.length - 1 ? 'Next Question' : 'See Results'}
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
