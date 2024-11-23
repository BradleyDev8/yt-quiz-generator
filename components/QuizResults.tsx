import { CheckCircle, XCircle } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { QuizQuestion } from "@/app/types/quiz";
import { Button } from "@/components/ui/button";

interface QuizResultsProps {
  questions: QuizQuestion[];
  userAnswers: number[];
  score: number;
  onRetry: () => void;
  onNewQuiz: () => void;
}

export function QuizResults({ questions, userAnswers, score, onRetry, onNewQuiz }: QuizResultsProps) {
  return (
    <Card className="bg-white shadow-lg">
      <CardHeader className="text-center border-b border-gray-100 pb-6">
        <h1 className="text-2xl font-bold">Quiz Results</h1>
        <p className={`font-semibold mt-2 ${
          score === questions.length ? 'text-green-600' : 'text-blue-600'
        }`}>
          You scored {score} out of {questions.length}
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {questions.map((question, questionIndex) => {
            const userAnswer = userAnswers[questionIndex];
            const isCorrect = userAnswer === question.correctAnswer;

            return (
              <div key={questionIndex} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                  )}
                  <div className="space-y-3 w-full">
                    <h3 className="font-medium text-gray-900">{question.question}</h3>
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`p-3 rounded-md ${
                            optionIndex === question.correctAnswer
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : optionIndex === userAnswer && userAnswer !== question.correctAnswer
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-gray-50 text-gray-600'
                          }`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 text-center space-x-4">
          <Button onClick={onRetry} variant="outline">
            Retry Quiz
          </Button>
          <Button onClick={onNewQuiz} variant="default">
            New Quiz
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
