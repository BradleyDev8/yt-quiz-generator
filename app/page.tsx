import { Brain, Youtube } from "lucide-react";
import { YoutubeForm } from "@/components/YoutubeForm";
import FeatureCard from "@/components/FeatureCard";
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="flex items-center space-x-4">
            <Youtube className="h-12 w-12 text-red-500" />
            <Brain className="h-12 w-12 text-blue-500" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Youtube Quix Generator
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            Transform any educational YouTube video into an interactive quiz using AI technology.
            Just paste your video URL below to get started.
          </p>
          <div className="w-full max-w-[600px] rounded-xl border bg-card p-8 shadow-lg">
            <YoutubeForm />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<Youtube className="h-6 w-6" />}
              title="Video Processing"
              description="Paste any YouTube URL and we'll handle the rest"
            />
            <FeatureCard
              icon={<Brain className="h-6 w-6" />}
              title="AI-Powered"
              description="Advanced AI generates relevant quiz questions"
            />
            <FeatureCard
              icon={<Brain className="h-6 w-6" />}
              title="Interactive Learning"
              description="Engage with content through dynamic quizzes"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
