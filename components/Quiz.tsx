import { useState } from "react";
import { Button } from "./ui/button";
import { QuizQuestion } from "@/app/types/quiz";
import { QuizResults } from "./QuizResults";

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
  onNewQuiz: () => void;
}

export function Quiz({ questions, onComplete, onNewQuiz }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (selectedIndex: number) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestion] = selectedIndex;
    setUserAnswers(newUserAnswers);

    if (selectedIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      onComplete(score + (selectedIndex === questions[currentQuestion].correctAnswer ? 1 : 0));
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setScore(0);
    setUserAnswers([]);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <QuizResults
        questions={questions}
        userAnswers={userAnswers}
        score={score}
        onRetry={handleRetry}
        onNewQuiz={onNewQuiz}
      />
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {questions.length}
        </p>
        <h2 className="mt-2 text-xl font-semibold break-words">{question.question}</h2>
      </div>
      <div className="grid gap-3">
        {question.options.map((option, index) => (
          <Button
            key={index}
            variant="outline"
            className="text-left whitespace-normal break-words h-auto py-3"
            onClick={() => handleAnswer(index)}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}