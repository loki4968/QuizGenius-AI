
import React, { useState } from 'react';
import { Difficulty } from '../types';
import { Brain } from './Icons';

interface QuizFormProps {
  onGenerate: (topic: string, difficulty: Difficulty, count: number) => void;
  isLoading: boolean;
}

export const QuizForm: React.FC<QuizFormProps> = ({ onGenerate, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [count, setCount] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerate(topic, difficulty, count);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 mb-20 px-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-2xl shadow-xl mb-6">
          <Brain className="w-10 h-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">QuizGenius AI</h1>
        <p className="text-lg text-slate-500 max-w-md mx-auto">
          Elevate your learning with AI-generated quizzes on any topic. Instant results, deep insights.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 space-y-8">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
            Topic or Subject
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Ancient Rome, Quantum Physics, JS React Hooks..."
            required
            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all text-lg placeholder:text-slate-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
              Difficulty
            </label>
            <div className="flex gap-2">
              {Object.values(Difficulty).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold capitalize transition-all border-2 ${
                    difficulty === d 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' 
                      : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-indigo-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
              Questions
            </label>
            <select
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-slate-700 appearance-none"
            >
              {[5, 10, 15, 20].map(n => (
                <option key={n} value={n}>{n} Questions</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !topic.trim()}
          className={`w-full py-5 rounded-2xl text-xl font-bold transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 ${
            isLoading || !topic.trim() 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
              : 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200 hover:bg-indigo-700'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              Generating...
            </>
          ) : (
            'Generate Quiz'
          )}
        </button>
      </form>
    </div>
  );
};
