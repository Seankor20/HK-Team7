import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Trophy, RotateCcw } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What comes after the number 5?",
    options: ["4", "6", "7", "3"],
    correctAnswer: 1,
    explanation: "Great job! 6 comes after 5 when we count: 1, 2, 3, 4, 5, 6!"
  },
  {
    id: 2,
    question: "Which letter comes first in the alphabet?",
    options: ["B", "A", "C", "D"],
    correctAnswer: 1,
    explanation: "Perfect! A is the first letter in the alphabet!"
  },
  {
    id: 3,
    question: "What color do you get when you mix red and yellow?",
    options: ["Purple", "Orange", "Green", "Blue"],
    correctAnswer: 1,
    explanation: "Excellent! Red + Yellow = Orange. You're learning about colors!"
  },
  {
    id: 4,
    question: "How many legs does a cat have?",
    options: ["2", "3", "4", "5"],
    correctAnswer: 2,
    explanation: "That's right! Cats have 4 legs, just like dogs and many other animals!"
  },
  {
    id: 5,
    question: "What shape has 3 sides?",
    options: ["Circle", "Triangle", "Square", "Rectangle"],
    correctAnswer: 1,
    explanation: "Amazing! A triangle has exactly 3 sides and 3 corners!"
  }
];

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }

    setShowResult(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setQuizCompleted(false);
  };

  const progress = ((currentQuestion + (quizCompleted ? 1 : 0)) / questions.length) * 100;

  if (quizCompleted) {
    const percentage = (score / questions.length) * 100;
    const isExcellent = percentage >= 80;
    const isGood = percentage >= 60;

    return (
      <div className="p-4 md:p-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-success rounded-full flex items-center justify-center">
              <Trophy className="h-8 w-8 text-success-foreground" />
            </div>
            <CardTitle className="text-2xl md:text-3xl">
              {isExcellent ? "Fantastic Work! 🌟" : isGood ? "Great Job! 👏" : "Keep Learning! 💪"}
            </CardTitle>
            <CardDescription className="text-lg">
              You answered {score} out of {questions.length} questions correctly!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {Math.round(percentage)}%
            </div>
            
            <Badge 
              className={`text-lg px-4 py-2 ${
                isExcellent ? 'bg-success' : isGood ? 'bg-accent' : 'bg-warning'
              }`}
            >
              {isExcellent ? 'Excellent!' : isGood ? 'Good Work!' : 'Keep Trying!'}
            </Badge>

            <p className="text-muted-foreground">
              {isExcellent 
                ? "You're a superstar learner! Keep up the amazing work!" 
                : isGood 
                ? "You're doing great! Practice makes perfect!" 
                : "Learning is a journey! Try again and you'll do even better!"}
            </p>

            <div className="flex gap-4 justify-center">
              <Button onClick={resetQuiz} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button>
                Next Lesson
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Learning Quiz</h1>
          <p className="text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl text-center">
              {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className={`h-auto p-4 text-left justify-start text-wrap ${
                    selectedAnswer === index 
                      ? "bg-primary text-primary-foreground shadow-glow" 
                      : "hover:bg-muted"
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <span className="flex-1">{option}</span>
                </Button>
              ))}
            </div>

            {showResult && selectedAnswer !== null && (
              <Card className={`mt-4 ${
                selectedAnswer === question.correctAnswer 
                  ? "border-success bg-success/5" 
                  : "border-destructive bg-destructive/5"
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {selectedAnswer === question.correctAnswer ? (
                      <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                    )}
                    <div>
                      <p className={`font-medium ${
                        selectedAnswer === question.correctAnswer 
                          ? "text-success" 
                          : "text-destructive"
                      }`}>
                        {selectedAnswer === question.correctAnswer ? "Correct!" : "Not quite right"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button 
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className="w-full"
              size="lg"
            >
              {currentQuestion + 1 === questions.length ? "Finish Quiz" : "Next Question"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;