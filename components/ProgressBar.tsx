
import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = Math.round((current / total) * 100);
  return (
    <div className="w-full bg-slate-200 rounded-full h-2.5">
      <div 
        className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};
