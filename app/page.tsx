"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Play, SkipBack, SkipForward, Trash2, Youtube } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoQueue, setVideoQueue] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState("");

  const extractVideoId = (url: string) => {
    // Regular expressions to match different YouTube URL formats
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return match[2];
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoUrl.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    const id = extractVideoId(videoUrl);

    if (id) {
      // Add the video ID to the queue
      setVideoQueue((prev) => [...prev, id]);
      // Clear the input field
      setVideoUrl("");
      setError("");
    } else {
      setError("Invalid YouTube URL. Please enter a valid YouTube link.");
    }
  };

  const playNext = () => {
    if (currentIndex < videoQueue.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const playPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const removeFromQueue = (index: number) => {
    const newQueue = [...videoQueue];
    newQueue.splice(index, 1);
    setVideoQueue(newQueue);

    // Adjust current index if necessary
    if (index <= currentIndex && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (newQueue.length === 0) {
      setCurrentIndex(0);
    }
  };

  const currentVideoId = videoQueue.length > 0 ? videoQueue[currentIndex] : "";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex items-center">
          <div className="flex items-center gap-2">
            <Youtube className="h-6 w-6 text-red-600" />
            <h1 className="text-xl font-bold">YouTube Jam</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">
              Embed YouTube Videos
            </h2>
            <p className="text-muted-foreground">
              Paste YouTube links below to add them to your playback queue.
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Paste YouTube URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full"
                  />
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </div>
                <Button type="submit" className="w-full">
                  Add to Queue
                </Button>
              </form>
            </CardContent>
          </Card>

          {videoQueue.length > 0 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                  Now Playing ({currentIndex + 1} of {videoQueue.length})
                </h3>
                <div className="aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                  <iframe
                    src={`https://www.youtube.com/embed/${currentVideoId}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  ></iframe>
                </div>

                <div className="flex justify-center gap-4 pt-2">
                  <Button
                    variant="outline"
                    onClick={playPrevious}
                    disabled={currentIndex === 0}
                    size="icon"
                  >
                    <SkipBack className="h-4 w-4" />
                    <span className="sr-only">Previous video</span>
                  </Button>
                  <Button
                    onClick={playNext}
                    disabled={currentIndex >= videoQueue.length - 1}
                    size="icon"
                  >
                    <SkipForward className="h-4 w-4" />
                    <span className="sr-only">Next video</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                  Your Queue ({videoQueue.length} videos)
                </h3>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                  {videoQueue.map((id, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-md border ${
                        index === currentIndex ? "bg-muted border-primary" : ""
                      }`}
                    >
                      <div className="flex-shrink-0 w-24 h-16 overflow-hidden rounded bg-muted">
                        <img
                          src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`}
                          alt="Video thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          YouTube Video {index + 1}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          ID: {id}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {index !== currentIndex && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCurrentIndex(index)}
                          >
                            <Play className="h-4 w-4" />
                            <span className="sr-only">Play</span>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromQueue(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="bg-muted rounded-lg p-6 space-y-4">
            <h3 className="text-xl font-semibold">How It Works</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Copy a YouTube video URL from your browser</li>
              <li>Paste the URL in the input field above</li>
              <li>
                Click the "Add to Queue" button to add it to your playlist
              </li>
              <li>Add multiple videos to create a queue</li>
              <li>Use the navigation buttons to move between videos</li>
            </ol>
            <p className="text-sm text-muted-foreground">
              Supported URL formats: youtube.com/watch, youtu.be/,
              youtube.com/embed, and more.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t">
        <div className="container mx-auto py-4 px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} YouTube Queue Player. This is not
            affiliated with YouTube.
          </p>
        </div>
      </footer>
    </div>
  );
}
