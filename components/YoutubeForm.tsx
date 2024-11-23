"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuizQuestion } from "@/app/types/quiz";
import { useState } from "react";
import { QuizLoading } from "@/components/QuizLoading";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const youtubeUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;

const formSchema = z.object({
  url: z.string().url("Please enter a valid YouTube URL"),
  quizSize: z.enum(["5", "10", "20"]).default("5")
});

interface YoutubeFormProps {
  onQuizGenerated: (questions: QuizQuestion[]) => void;
}

export function YoutubeForm({ onQuizGenerated }: YoutubeFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    toast({
      title: "Processing video",
      description: "Your video is being processed. Please wait...",
    });

    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url: values.url,
          quizSize: parseInt(values.quizSize)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate quiz");
      }

      if (data.questions) {
        onQuizGenerated(data.questions);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate quiz",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }
  
  if (isLoading) {
    return <QuizLoading />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Paste YouTube URL here..."
                  {...field}
                  className="h-12"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quizSize"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Number of questions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Questions</SelectItem>
                  <SelectItem value="10">10 Questions</SelectItem>
                  <SelectItem value="20">20 Questions</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="text-xs text-muted-foreground">
                The actual number of questions may be lower depending on the video content.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full h-12">
          Generate Quiz
        </Button>
      </form>
    </Form>
  );
}