import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import type { Question } from '../../types';

interface QuizCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  showFeedback: boolean;
  timeLeft?: number;
  onSelectAnswer: (index: number) => void;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  showFeedback,
  timeLeft,
  onSelectAnswer,
}: QuizCardProps) {
  const getOptionClass = (index: number) => {
    const base = 'w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer';

    if (!showFeedback) {
      if (selectedAnswer === index) {
        return `${base} border-orange-500 bg-orange-50 text-orange-900`;
      }
      return `${base} border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50/50 text-gray-800`;
    }

    // Show feedback
    if (index === question.correctAnswer) {
      return `${base} border-green-500 bg-green-50 text-green-900`;
    }
    if (selectedAnswer === index && index !== question.correctAnswer) {
      return `${base} border-red-500 bg-red-50 text-red-900`;
    }
    return `${base} border-gray-200 bg-gray-50 text-gray-500`;
  };

  const getLabelClass = (index: number) => {
    const base = 'w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5';
    if (!showFeedback) {
      if (selectedAnswer === index) {
        return `${base} bg-orange-500 text-white`;
      }
      return `${base} bg-gray-100 text-gray-600`;
    }
    if (index === question.correctAnswer) return `${base} bg-green-500 text-white`;
    if (selectedAnswer === index) return `${base} bg-red-500 text-white`;
    return `${base} bg-gray-100 text-gray-400`;
  };

  const isWarning = timeLeft !== undefined && timeLeft <= 30 && timeLeft > 0;
  const isDanger = timeLeft !== undefined && timeLeft <= 10 && timeLeft > 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-500">
            Question <span className="text-orange-500">{questionNumber}</span> / {totalQuestions}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: totalQuestions }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-6 rounded-full transition-colors ${
                  i < questionNumber - 1
                    ? 'bg-green-500'
                    : i === questionNumber - 1
                    ? 'bg-orange-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        {timeLeft !== undefined && (
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${
              isDanger
                ? 'bg-red-100 text-red-600 animate-pulse'
                : isWarning
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Clock size={14} />
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </div>
        )}
      </div>

      {/* Question */}
      <div className="px-6 py-5">
        <p className="text-lg font-semibold text-gray-900 leading-relaxed">{question.text}</p>
      </div>

      {/* Options */}
      <div className="px-6 pb-5 space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !showFeedback && onSelectAnswer(index)}
            disabled={showFeedback}
            className={getOptionClass(index)}
          >
            <span className={getLabelClass(index)}>{OPTION_LABELS[index]}</span>
            <span className="text-sm leading-relaxed pt-0.5">{option}</span>
            {showFeedback && index === question.correctAnswer && (
              <CheckCircle size={18} className="text-green-500 flex-shrink-0 ml-auto mt-0.5" />
            )}
            {showFeedback && selectedAnswer === index && index !== question.correctAnswer && (
              <XCircle size={18} className="text-red-500 flex-shrink-0 ml-auto mt-0.5" />
            )}
          </button>
        ))}
      </div>

      {/* Explanation */}
      {showFeedback && (
        <div className={`mx-6 mb-5 p-4 rounded-xl ${
          selectedAnswer === question.correctAnswer
            ? 'bg-green-50 border border-green-200'
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-start gap-2">
            {selectedAnswer === question.correctAnswer ? (
              <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`font-semibold text-sm mb-1 ${
                selectedAnswer === question.correctAnswer ? 'text-green-800' : 'text-red-700'
              }`}>
                {selectedAnswer === question.correctAnswer ? 'Correct!' : 'Incorrect'}
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">{question.explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
