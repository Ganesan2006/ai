import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle2, XCircle, Award, ChevronRight } from 'lucide-react';
import { Badge } from './ui/badge';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface AssessmentQuizProps {
  moduleId: string;
  moduleName: string;
  questions: Question[];
  onComplete: (score: number, results: any) => void;
}

export function AssessmentQuiz({ moduleId, moduleName, questions, onComplete }: AssessmentQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answerIndex
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowResults(false);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const results = questions.map((q, idx) => ({
      question: q.question,
      userAnswer: selectedAnswers[idx],
      correctAnswer: q.correctAnswer,
      isCorrect: selectedAnswers[idx] === q.correctAnswer,
      explanation: q.explanation
    }));

    const correctCount = results.filter(r => r.isCorrect).length;
    const score = Math.round((correctCount / questions.length) * 100);

    setQuizComplete(true);
    onComplete(score, results);
  };

  const showAnswer = () => {
    setShowResults(true);
  };

  const currentQ = questions[currentQuestion];
  const hasAnswered = selectedAnswers[currentQuestion] !== undefined;
  const isCorrect = selectedAnswers[currentQuestion] === currentQ.correctAnswer;

  if (quizComplete) {
    const correctCount = Object.keys(selectedAnswers).filter(
      (key) => selectedAnswers[parseInt(key)] === questions[parseInt(key)].correctAnswer
    ).length;
    const score = Math.round((correctCount / questions.length) * 100);

    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Award className="w-10 h-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Assessment Complete!</CardTitle>
          <CardDescription>
            You've completed the {moduleName} assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {score}%
            </p>
            <p className="text-gray-600">
              {correctCount} out of {questions.length} correct
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Performance Breakdown</h4>
            {questions.map((q, idx) => {
              const userAnswer = selectedAnswers[idx];
              const correct = userAnswer === q.correctAnswer;
              
              return (
                <Card key={q.id} className={correct ? 'border-green-200' : 'border-red-200'}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      {correct ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium mb-2">Question {idx + 1}</p>
                        <p className="text-sm text-gray-600">{q.question}</p>
                        {!correct && (
                          <Alert className="mt-3">
                            <AlertDescription className="text-sm">
                              <strong>Correct answer:</strong> {q.options[q.correctAnswer]}
                              <br />
                              <strong>Explanation:</strong> {q.explanation}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex gap-3 pt-4">
            <Button className="flex-1" onClick={() => window.location.reload()}>
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <CardTitle>{moduleName} Assessment</CardTitle>
            <Badge variant="outline">
              Question {currentQuestion + 1} of {questions.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg mb-4">{currentQ.question}</h3>
          
          <RadioGroup
            value={selectedAnswers[currentQuestion]?.toString()}
            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
          >
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => (
                <div
                  key={idx}
                  className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedAnswers[currentQuestion] === idx
                      ? 'border-blue-600 bg-blue-50'
                      : 'hover:border-gray-300'
                  } ${
                    showResults && idx === currentQ.correctAnswer
                      ? 'border-green-600 bg-green-50'
                      : ''
                  } ${
                    showResults && selectedAnswers[currentQuestion] === idx && idx !== currentQ.correctAnswer
                      ? 'border-red-600 bg-red-50'
                      : ''
                  }`}
                >
                  <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                  <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                  {showResults && idx === currentQ.correctAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                  {showResults && selectedAnswers[currentQuestion] === idx && idx !== currentQ.correctAnswer && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {showResults && (
          <Alert>
            <AlertDescription>
              <strong>Explanation:</strong> {currentQ.explanation}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3 pt-4">
          {!showResults && hasAnswered && (
            <Button variant="outline" onClick={showAnswer} className="flex-1">
              Check Answer
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!hasAnswered}
            className="flex-1"
          >
            {currentQuestion < questions.length - 1 ? (
              <>
                Next Question
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              'Submit Assessment'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
