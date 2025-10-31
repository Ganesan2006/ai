import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { Play, CheckCircle2, AlertCircle, Lightbulb } from 'lucide-react';
import { Badge } from './ui/badge';

interface CodeEditorProps {
  challenge: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    starterCode: string;
    solution: string;
    testCases: Array<{
      input: string;
      expectedOutput: string;
    }>;
    hints: string[];
  };
  onComplete?: (challengeId: string) => void;
}

export function CodeEditor({ challenge, onComplete }: CodeEditorProps) {
  const [code, setCode] = useState(challenge.starterCode);
  const [output, setOutput] = useState('');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [showHints, setShowHints] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const runCode = () => {
    setIsRunning(true);
    setOutput('');
    setTestResults([]);

    // Simulate code execution (in a real app, this would be server-side)
    setTimeout(() => {
      try {
        // Simple evaluation for demo purposes
        // In production, use a sandboxed execution environment
        const results = challenge.testCases.map((testCase, idx) => {
          // This is a simplified mock - actual implementation would run code safely
          const passed = Math.random() > 0.3; // Mock pass/fail
          return {
            index: idx + 1,
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual: passed ? testCase.expectedOutput : 'Error',
            passed
          };
        });

        setTestResults(results);
        const allPassed = results.every(r => r.passed);
        
        if (allPassed) {
          setOutput('✅ All test cases passed! Great job!');
          if (onComplete) {
            onComplete(challenge.id);
          }
        } else {
          setOutput(`❌ ${results.filter(r => !r.passed).length} test case(s) failed. Keep trying!`);
        }
      } catch (error: any) {
        setOutput(`Error: ${error.message}`);
      } finally {
        setIsRunning(false);
      }
    }, 1000);
  };

  const showNextHint = () => {
    if (hintIndex < challenge.hints.length - 1) {
      setHintIndex(hintIndex + 1);
    }
    setShowHints(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle>{challenge.title}</CardTitle>
            <CardDescription className="mt-2">{challenge.description}</CardDescription>
          </div>
          <Badge className={getDifficultyColor(challenge.difficulty)}>
            {challenge.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="code" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="code">Code Editor</TabsTrigger>
            <TabsTrigger value="results">Test Results</TabsTrigger>
          </TabsList>

          <TabsContent value="code" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Your Code</label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={showNextHint}
                    disabled={hintIndex >= challenge.hints.length - 1 && showHints}
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    {showHints ? 'Next Hint' : 'Get Hint'}
                  </Button>
                  <Button
                    onClick={runCode}
                    disabled={isRunning}
                    size="sm"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isRunning ? 'Running...' : 'Run Code'}
                  </Button>
                </div>
              </div>

              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="font-mono text-sm min-h-[300px]"
                placeholder="Write your code here..."
              />
            </div>

            {showHints && (
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Hint {hintIndex + 1}:</strong> {challenge.hints[hintIndex]}
                </AlertDescription>
              </Alert>
            )}

            {output && (
              <Alert variant={output.includes('✅') ? 'default' : 'destructive'}>
                <AlertDescription>{output}</AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            {testResults.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Run your code to see test results</p>
              </div>
            ) : (
              <div className="space-y-3">
                {testResults.map((result) => (
                  <Card key={result.index} className={result.passed ? 'border-green-200' : 'border-red-200'}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        {result.passed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        )}
                        <div className="flex-1 space-y-1">
                          <p className="font-medium">Test Case {result.index}</p>
                          <div className="text-sm space-y-1">
                            <p><span className="text-gray-600">Input:</span> {result.input}</p>
                            <p><span className="text-gray-600">Expected:</span> {result.expected}</p>
                            <p className={result.passed ? 'text-green-600' : 'text-red-600'}>
                              <span className="text-gray-600">Actual:</span> {result.actual}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
