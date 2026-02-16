
import React from 'react';
import { QuizSession } from '../types';
import { CheckCircle, XCircle, Download, Brain } from './Icons';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';

interface QuizResultProps {
  session: QuizSession;
  onReset: () => void;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-xl rounded-lg text-sm font-medium">
        <p className="text-slate-900 mb-1">{data.name}</p>
        <p className={`${data.score === 1 || data.name === 'Correct' ? 'text-indigo-600' : 'text-slate-400'}`}>
          {data.name === 'Correct' || data.name === 'Incorrect' 
            ? `${payload[0].value} Questions` 
            : data.score === 1 ? 'Correct ✨' : 'Incorrect ❌'}
        </p>
      </div>
    );
  }
  return null;
};

export const QuizResult: React.FC<QuizResultProps> = ({ session, onReset }) => {
  const { quiz, answers } = session;
  let correctCount = 0;

  const barData = quiz.questions.map((q, idx) => {
    const isCorrect = answers[idx] === q.correctAnswerIndex;
    if (isCorrect) correctCount++;
    return {
      name: `Q${idx + 1}`,
      score: isCorrect ? 1 : 0,
      fullTitle: `Question ${idx + 1}`,
      color: isCorrect ? '#4f46e5' : '#e2e8f0'
    };
  });

  const scorePercentage = Math.round((correctCount / quiz.questions.length) * 100);
  
  const pieData = [
    { name: 'Correct', value: correctCount, color: '#4f46e5' },
    { name: 'Incorrect', value: quiz.questions.length - correctCount, color: '#f1f5f9' }
  ];

  const handleDownload = () => {
    const quizData = JSON.stringify({
      topic: quiz.topic,
      difficulty: quiz.difficulty,
      score: scorePercentage,
      questions: quiz.questions,
      studentAnswers: answers
    }, null, 2);
    
    const blob = new Blob([quizData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quiz-${quiz.topic.replace(/\s+/g, '-').toLowerCase()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusMessage = () => {
    if (scorePercentage >= 90) return { title: "Brilliant!", text: "You've mastered this topic!", color: "text-green-600" };
    if (scorePercentage >= 70) return { title: "Great Job!", text: "You have a solid understanding.", color: "text-indigo-600" };
    if (scorePercentage >= 50) return { title: "Good Effort!", text: "Keep practicing to improve further.", color: "text-amber-600" };
    return { title: "Keep Learning!", text: "Try reviewing the explanations below.", color: "text-red-600" };
  };

  const status = getStatusMessage();

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        {/* Summary Header */}
        <div className="p-8 md:p-12 text-center bg-indigo-50/30 border-b border-indigo-100/50">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 rotate-3">
              <Brain className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">{status.title}</h1>
          <p className="text-slate-500 text-lg mb-10">{status.text}</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Charts Section */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 md:p-8 rounded-3xl border border-indigo-100 shadow-sm">
              
              {/* Pie Chart: Overall Score */}
              <div className="flex flex-col items-center">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Overall Performance</p>
                <div className="relative w-full h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        animationBegin={200}
                        animationDuration={1000}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                    <span className="text-4xl font-black text-slate-800">{scorePercentage}%</span>
                    <span className="text-[10px] uppercase tracking-tighter text-slate-400 font-bold">Accuracy</span>
                  </div>
                </div>
              </div>

              {/* Bar Chart: Question Breakdown */}
              <div className="flex flex-col items-center">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Question Breakdown</p>
                <div className="w-full h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} 
                      />
                      <YAxis hide domain={[0, 1]} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                      <Bar dataKey="score" radius={[4, 4, 4, 4]} barSize={20}>
                        {barData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Quick Stats Section */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Correct</p>
                <p className="text-3xl font-black text-indigo-600">{correctCount}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Missed</p>
                <p className="text-3xl font-black text-slate-300">{quiz.questions.length - correctCount}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Difficulty</p>
                <p className="text-lg font-black text-slate-700 capitalize">{quiz.difficulty}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center flex flex-col justify-center">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total</p>
                <p className="text-xl font-black text-slate-700">{quiz.questions.length} Qs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-white border-b border-slate-100 flex flex-wrap gap-4 justify-center">
          <button
            onClick={onReset}
            className="flex-1 min-w-[200px] px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 group"
          >
            <span className="group-hover:translate-x-[-2px] transition-transform">←</span>
            Start New Session
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold transition-all shadow-xl shadow-slate-200"
          >
            <Download className="w-5 h-5" />
            Export Quiz Report
          </button>
        </div>

        {/* Detailed Review */}
        <div className="p-8 md:p-12 bg-slate-50/50">
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-1.5 h-8 bg-indigo-600 rounded-full"></div>
            <h2 className="text-2xl font-black text-slate-800">Review & Insights</h2>
          </div>
          
          <div className="space-y-8">
            {quiz.questions.map((q, idx) => {
              const isCorrect = answers[idx] === q.correctAnswerIndex;
              return (
                <div key={idx} className={`group bg-white p-8 rounded-3xl border transition-all duration-300 hover:shadow-xl ${isCorrect ? 'border-indigo-50 hover:border-indigo-100' : 'border-red-50 hover:border-red-100'}`}>
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                         <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${isCorrect ? 'bg-indigo-100 text-indigo-700' : 'bg-red-100 text-red-700'}`}>
                           {isCorrect ? 'Correct' : 'Incorrect'}
                         </span>
                         <span className="text-slate-300 text-[10px] font-bold">QUESTION {idx + 1}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 leading-snug">{q.question}</h3>
                    </div>
                    <div className={`flex-shrink-0 ml-4 p-2 rounded-xl ${isCorrect ? 'bg-indigo-50 text-indigo-600' : 'bg-red-50 text-red-500'}`}>
                      {isCorrect ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = answers[idx] === optIdx;
                      const isCorrectOpt = q.correctAnswerIndex === optIdx;
                      
                      let variantClass = "bg-slate-50 border-slate-100 text-slate-500";
                      if (isCorrectOpt) variantClass = "bg-green-50 border-green-200 text-green-700 font-bold ring-2 ring-green-100 ring-offset-2";
                      if (isSelected && !isCorrectOpt) variantClass = "bg-red-50 border-red-200 text-red-600 font-bold";

                      return (
                        <div key={optIdx} className={`relative px-5 py-4 rounded-xl border-2 transition-all flex items-center ${variantClass}`}>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-[10px] font-black ${isCorrectOpt ? 'bg-green-600 text-white' : isSelected ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                            {String.fromCharCode(65 + optIdx)}
                          </div>
                          <span className="text-sm">{opt}</span>
                          {isSelected && !isCorrectOpt && <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase shadow-sm">Your Pick</span>}
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="flex items-center space-x-2 mb-2">
                       <Brain className="w-4 h-4 text-indigo-500" />
                       <p className="text-xs font-black text-indigo-700 uppercase tracking-widest">The "Why"</p>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
