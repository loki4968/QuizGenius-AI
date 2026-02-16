
export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export interface Question {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  topic: string;
  difficulty: Difficulty;
  questions: Question[];
  createdAt: number;
}

export interface QuizSession {
  quiz: Quiz;
  startTime: number;
  endTime?: number;
  answers: Record<number, number>; // questionIndex: optionIndex
  isFinished: boolean;
}

export type AppState = 'IDLE' | 'GENERATING' | 'PLAYING' | 'FINISHED';
