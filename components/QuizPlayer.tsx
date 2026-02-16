
import React, { useState, useEffect, useCallback } from 'react';
import { Quiz, QuizSession } from '../types';
import { ProgressBar } from './ProgressBar';
import { Timer as TimerIcon, Brain } from './Icons';

interface QuizPlayerProps {
  quiz: Quiz;
  onComplete: (session: QuizSession) => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({ quiz, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.questions.length * 60); // 1 minute per question
  const [startTime] = useState(Date.now());

  const currentQuestion = quiz.questions[currentIndex];

  const handleFinish = useCallback(() => {
    onComplete({
      quiz,
      startTime,
      endTime: Date.now(),
      answers,
      isFinished: true
    });
  }, [quiz, startTime, answers, onComplete]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, handleFinish]);

  const handleOptionSelect = (optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentIndex]: optionIndex }));
  };

  const nextQuestion = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-slate-50 p-6 border-b border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-800 truncate max-w-[200px] md:max-w-sm">
                {quiz.topic}
              </h2>
            </div>
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full font-mono font-bold ${timeLeft < 30 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-indigo-50 text-indigo-600'}`}>
              <TimerIcon className="w-4 h-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-slate-500">
              <span>Question {currentIndex + 1} of {quiz.questions.length}</span>
              <span>{Math.round(((currentIndex + 1) / quiz.questions.length) * 100)}% Complete</span>
            </div>
            <ProgressBar current={currentIndex + 1} total={quiz.questions.length} />
          </div>
        </div>

        {/* Question Area */}
        <div className="p-8">
          <h3 className="text-2xl font-semibold text-slate-800 mb-8 leading-relaxed">
            {currentQuestion.question}
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = answers[currentIndex] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  className={`group relative flex items-center p-5 text-left rounded-xl border-2 transition-all duration-200 hover:scale-[1.01] active:scale-95 ${
                    isSelected 
                      ? 'border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-50' 
                      : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full mr-4 text-sm font-bold transition-colors ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className={`text-lg font-medium ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <button
            onClick={prevQuestion}
            disabled={currentIndex === 0}
            className="px-6 py-2.5 rounded-lg font-semibold text-slate-600 hover:bg-white border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Previous
          </button>
          
          <button
            onClick={nextQuestion}
            className="px-10 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-lg shadow-indigo-200 transition-all transform active:translate-y-0.5"
          >
            {currentIndex === quiz.questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
};
