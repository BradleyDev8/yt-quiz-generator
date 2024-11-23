import React, { useEffect, useState } from 'react';
import { Brain, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function QuizLoading() {
  const loadingPhrases = [
    "Generating challenging questions...",
    "Preparing your quiz experience...",
    "Crafting the perfect questions...",
    "Almost ready..."
  ];

  const [phrase, setPhrase] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setPhrase((prev) => (prev + 1) % loadingPhrases.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [loadingPhrases.length]);

  return (
    <Card className="bg-white shadow-lg">
      <CardContent className="p-12">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="relative">
            <Brain className="w-16 h-16 text-primary" />
            <Loader2 className="w-16 h-16 absolute top-0 left-0 animate-spin text-primary/30" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Creating Your Quiz
            </h2>
            <p className="text-muted-foreground min-h-[24px] transition-all duration-200">
              {loadingPhrases[phrase]}
            </p>
          </div>

          <div className="flex space-x-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};