export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
  }
  
  export interface QuizState {
    questions: QuizQuestion[];
    currentQuestion: number;
    score: number;
    showResults: boolean;
  }