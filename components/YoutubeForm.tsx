"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const youtubeUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;

const formSchema = z.object({
  url: z
    .string()
    .min(1, "YouTube URL is required")
    .regex(youtubeUrlRegex, "Please enter a valid YouTube URL"),
});

export function YoutubeForm() {
    const { toast } = useToast();
    
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        url: "",
      },
    });
  
    function onSubmit(values: z.infer<typeof formSchema>) {
      toast({
        title: "Processing video",
        description: "Your video is being processed. Please wait...",
      });
      // TODO: Implement video processing logic
      console.log(values);
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
          <Button type="submit" className="w-full h-12">
            Generate Quiz
          </Button>
        </form>
      </Form>
    );
  }