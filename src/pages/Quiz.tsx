import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Trophy, RotateCcw, Loader2 } from "lucide-react";
import { questionService } from "@/lib/supabase-services";
import type { Database } from "@/lib/supabase";
import dino from "@/assets/dino.jpg";

type Question = Database['public']['Tables']['question']['Row'];

const Quiz = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Fetch questions from Supabase
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // You can choose one of these methods:
        // const questionsData = await questionService.getAllQuestions();
        // const questionsData = await questionService.getQuestionsByCategory('math');
        const questionsData = await questionService.getRandomQuestions(5);
        
        // Debug: Log the data structure
        console.log('Fetched questions:', questionsData);
        if (questionsData.length > 0) {
          console.log('First question structure:', questionsData[0]);
        }
        
        if (questionsData.length === 0) {
          setError('No questions found. Please try again later.');
        } else {
          // Validate question structure
          const validQuestions = questionsData.filter(q => {
            const isValid = q.question && q.option && Array.isArray(q.option) && q.option.length > 0;
            if (!isValid) {
              console.warn('Invalid question structure:', q);
            }
            return isValid;
          });
          
          if (validQuestions.length === 0) {
            setError('No valid questions found. Please check your database structure.');
          } else {
            setQuestions(validQuestions);
          }
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null || showResult) return; // Prevent multiple calls

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (selectedAnswer === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }

    // Show result first
    setShowResult(true);
  };

  const handleContinue = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setQuizCompleted(false);
  };

  const goToLearning = () => {
    // Store quiz completion data in localStorage for progress tracking
    const quizData = {
      id: `quiz_${Date.now()}`, // Unique quiz completion ID
      completed: true,
      score: score,
      totalQuestions: questions.length,
      percentage: Math.round((score / questions.length) * 100),
      completedAt: new Date().toISOString(),
      type: 'quiz',
      xpEarned: Math.round((score / questions.length) * 100) // XP based on score percentage
    };
    
    localStorage.setItem('lastQuizCompletion', JSON.stringify(quizData));
    
    // Navigate to learning pathway page
    navigate('/pathway');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-cover bg-center p-4 md:p-8" style={{ backgroundImage: `url(${dino})` }}>
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Loading Quiz...</h2>
          <p className="text-muted-foreground">Please wait while we prepare your questions.</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-cover bg-center p-8 md:p-8" style={{ backgroundImage: `url(${dino})` }}>
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="mx-auto mb-4 w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold text-destructive">Error Loading Quiz</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + (quizCompleted ? 1 : 0)) / questions.length) * 100;

  if (quizCompleted) {
    const percentage = (score / questions.length) * 100;
    const isExcellent = percentage >= 80;
    const isGood = percentage >= 60;

    return (
      <div className="min-h-screen bg-cover bg-center p-8 md:p-8" style={{ backgroundImage: `url(${dino})` }}>
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
                              <Button onClick={goToLearning}>
                  <Trophy className="h-4 w-4 mr-2" />
                  View Progress
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];

  // Safety check for question structure
  if (!question || !question.option || !Array.isArray(question.option)) {
    console.error('Invalid question structure:', question);
    return (
      <div className="min-h-screen bg-cover bg-center p-8 md:p-8" style={{ backgroundImage: `url(${dino})` }}>
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="mx-auto mb-4 w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold text-destructive">Question Format Error</h2>
          <p className="text-muted-foreground">
            The question format is invalid. Please check your database structure.
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Helpers to support image questions via URL or JSON with { imageUrl, text }
  const isImageUrl = (url: string) => /^(https?:)?\/\/.*\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(url) || /^data:image\//.test(url);
  const parseImageFromString = (value: string | null | undefined): { imageUrl: string; text?: string } | null => {
    if (!value) return null;
    try {
      const parsed = JSON.parse(value as string);
      if (parsed && typeof parsed === 'object' && typeof parsed.imageUrl === 'string') {
        return { imageUrl: parsed.imageUrl as string, text: typeof parsed.text === 'string' ? parsed.text : undefined };
      }
    } catch {}
    if (typeof value === 'string' && isImageUrl(value)) return { imageUrl: value };
    return null;
  };
  const qMedia = parseImageFromString((question as any).question as string);

  return (
    <div className="min-h-screen bg-cover bg-center p-8 md:p-8" style={{ backgroundImage: `url(${dino})` }}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">What is in the picture?</h1>
          <p className="font-bold">
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="shadow-card">
          <CardHeader>
            {qMedia ? (
              <div className="flex flex-col items-center gap-2">
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <img
                  src={qMedia.imageUrl}
                  alt={qMedia.text || 'question image'}
                  className="max-h-[320px] object-contain rounded-lg border"
                  loading="lazy"
                />
                {qMedia.text && (
                  <CardTitle className="text-base md:text-lg text-center mt-1">{qMedia.text}</CardTitle>
                )}
              </div>
            ) : (
              <CardTitle className="text-xl md:text-2xl text-center">
                {(question as any).question}
              </CardTitle>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {question.option.map((option, index) => (
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
                selectedAnswer === question.correct_answer 
                  ? "border-success bg-success/5" 
                  : "border-destructive bg-destructive/5"
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {selectedAnswer === question.correct_answer ? (
                      <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                    )}
                    <div>
                      <p className={`font-medium ${
                        selectedAnswer === question.correct_answer 
                          ? "text-success" 
                          : "text-destructive"
                      }`}>
                        {selectedAnswer === question.correct_answer ? "Correct!" : "Not quite right"}
                      </p>
                      {question.explanation && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {question.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button 
              onClick={showResult ? handleContinue : handleNextQuestion}
              disabled={selectedAnswer === null}
              className="w-full"
              size="lg"
            >
              {showResult 
                ? (currentQuestion + 1 === questions.length ? "Finish Quiz" : "Next Question")
                : "Submit Answer"
              }
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;