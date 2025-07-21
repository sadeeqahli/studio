
"use client";

import * as React from "react";
import { getFootballNews } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Bot, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AiNewsPage() {
  const [query, setQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [response, setResponse] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError("Please enter a question.");
      return;
    }

    setIsLoading(true);
    setResponse(null);
    setError(null);

    const result = await getFootballNews(query);

    setIsLoading(false);

    if (result.data) {
      setResponse(result.data.newsSummary);
    } else {
      setError(result.error || "An unknown error occurred.");
    }
  };

  return (
    <div>
      <h1 className="text-lg font-semibold md:text-2xl mb-4">AI Football Assistant</h1>
      <Card>
        <CardHeader>
          <CardTitle>Get Football News & Scores</CardTitle>
          <CardDescription>Ask our AI assistant for the latest football news, live scores, or match summaries.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="query">Your Question</Label>
              <Input
                id="query"
                placeholder="e.g., 'Latest transfer news for Manchester United' or 'Who won the Arsenal match yesterday?'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Getting Answer...
                </>
              ) : (
                "Ask Assistant"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {response && (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bot className="h-6 w-6 text-primary" /> AI Response
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                    {response}
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
