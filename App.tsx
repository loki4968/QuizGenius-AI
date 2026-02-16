
import React, { useState, useCallback } from 'react';
import { QuizForm } from './components/QuizForm';
import { QuizPlayer } from './components/QuizPlayer';
import { QuizResult } from './components/QuizResult';
import { generateQuiz } from './services/geminiService';
import { AppState, Difficulty, Quiz, QuizSession } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('IDLE');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (topic: string, difficulty: Difficulty, count: number) => {
    setState('GENERATING');
    setError(null);
    try {
      const questions = await generateQuiz(topic, difficulty, count);
      const newQuiz: Quiz = {
        id: crypto.randomUUID(),
        topic,
        difficulty,
        questions,
        createdAt: Date.now()
      };
      setQuiz(newQuiz);
      setState('PLAYING');
    } catch (err) {
      console.error(err);
      setError('Oops! We had trouble generating your quiz. Let\'s try again with a different topic.');
      setState('IDLE');
    }
  };

  const handleComplete = useCallback((sessionData: QuizSession) => {
    setSession(sessionData);
    setState('FINISHED');
  }, []);

  const reset = () => {
    setState('IDLE');
    setQuiz(null);
    setSession(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={reset}
          >
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 8.105 4 4 0 0 0 8 0 4 4 0 0 0 .52-8.105 4 4 0 0 0-2.526-5.77A3 3 0 1 0 12 5z" /></svg>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">QuizGenius</span>
          </div>
          
          <div className="flex items-center space-x-4">
             <span className="hidden md:inline text-sm font-medium text-slate-500">Free AI Education Tool</span>
             {state !== 'IDLE' && (
               <button 
                 onClick={reset}
                 className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
               >
                 Cancel
               </button>
             )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {error && (
          <div className="max-w-2xl mx-auto mt-6 px-4">
            <div className="bg-red-50 border-2 border-red-100 text-red-700 p-4 rounded-2xl flex items-center space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {state === 'IDLE' && (
          <QuizForm 
            onGenerate={handleGenerate} 
            isLoading={state === 'GENERATING'} 
          />
        )}

        {state === 'GENERATING' && (
           <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
             <div className="relative mb-8">
                <div className="w-24 h-24 bg-indigo-100 rounded-3xl animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
             </div>
             <h2 className="text-3xl font-extrabold text-slate-800 mb-4 animate-bounce">AI is Crafting Your Quiz...</h2>
             <p className="text-lg text-slate-500 max-w-sm">We're researching facts, generating questions, and verifying answers to ensure a quality experience.</p>
           </div>
        )}

        {state === 'PLAYING' && quiz && (
          <QuizPlayer 
            quiz={quiz} 
            onComplete={handleComplete} 
          />
        )}

        {state === 'FINISHED' && session && (
          <QuizResult 
            session={session} 
            onReset={reset} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-100 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} QuizGenius AI. Designed for students, powered by Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
