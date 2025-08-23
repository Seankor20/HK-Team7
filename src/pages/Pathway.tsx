import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Star, 
  Play, 
  Calendar,
  Target,
  TrendingUp,
  Book,
  PenTool,
  Clock,
  Brain,
  Heart,
  Rocket,
  BookOpen,
  Lightbulb,
  Palette
} from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";



interface Homework {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
  description: string;
}

const Pathway = () => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'materials' | 'homework' | 'quiz'>('materials');

  // Sample completed materials for display
  const completedMaterials = [
    {
      id: '1',
      title: 'Numbers & Counting',
      type: 'lesson',
      difficulty: 'beginner',
      estimatedTime: 15,
      xpReward: 50,
      icon: '🔢',
      color: 'bg-gradient-to-br from-blue-400 to-blue-600',
      category: 'math'
    },
    {
      id: '2',
      title: 'Letter Recognition',
      type: 'lesson',
      difficulty: 'beginner',
      estimatedTime: 20,
      xpReward: 50,
      icon: '🔤',
      color: 'bg-gradient-to-br from-green-400 to-green-600',
      category: 'language'
    },
    {
      id: '3',
      title: 'Basic Addition',
      type: 'lesson',
      difficulty: 'intermediate',
      estimatedTime: 25,
      xpReward: 75,
      icon: '➕',
      color: 'bg-gradient-to-br from-purple-400 to-purple-600',
      category: 'math'
    }
  ];

  const homework: Homework[] = [
    {
      id: 'hw1',
      title: 'Practice Counting 1-20',
      subject: 'Mathematics',
      dueDate: '2025-01-25',
      status: 'completed',
      difficulty: 'easy',
      estimatedTime: 10,
      description: 'Count objects around the house and write numbers 1-20'
    },
    {
      id: 'hw2',
      title: 'Letter Sound Practice',
      subject: 'Language',
      dueDate: '2025-01-27',
      status: 'in-progress',
      difficulty: 'medium',
      estimatedTime: 15,
      description: 'Practice letter sounds A-Z with flashcards'
    },
    {
      id: 'hw3',
      title: 'Color Mixing Activity',
      subject: 'Art',
      dueDate: '2025-01-30',
      status: 'pending',
      difficulty: 'easy',
      estimatedTime: 20,
      description: 'Mix primary colors to create secondary colors'
    }
  ];

  const totalXP = completedMaterials.reduce((sum, unit) => sum + unit.xpReward, 0);
  const progressPercentage = (completedMaterials.length / 8) * 100; // Assuming 8 total units



  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-gradient-to-r from-green-400 to-green-600 text-white';
      case 'intermediate':
        return 'bg-gradient-to-r from-yellow-400 to-orange-600 text-white';
      case 'advanced':
        return 'bg-gradient-to-r from-red-400 to-red-600 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'math':
        return <Brain className="h-4 w-4" />;
      case 'language':
        return <BookOpen className="h-4 w-4" />;
      case 'science':
        return <Lightbulb className="h-4 w-4" />;
      case 'art':
        return <Palette className="h-4 w-4" />;
      case 'social':
        return <Heart className="h-4 w-4" />;
      case 'life-skills':
        return <Target className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const getHomeworkStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-green-400 to-green-600 text-white';
      case 'in-progress':
        return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white';
      case 'pending':
        return 'bg-muted text-muted-foreground';
      case 'overdue':
        return 'bg-gradient-to-r from-red-400 to-red-600 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };



  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Enhanced Header with Progress Overview */}
      <div className="text-center space-y-6">
        <div className="relative">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Learning Center
          </h1>
          <div className="absolute -top-2 -right-2">
            <Rocket className="h-8 w-8 text-primary animate-bounce" />
          </div>
        </div>
        
        {/* Enhanced Progress Stats with Graphics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <Card className="text-center bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-primary">{totalXP}</div>
              <div className="text-sm text-muted-foreground">Total XP</div>
            </CardContent>
          </Card>
          
          <Card className="text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full">
                  <Target className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-primary">{completedMaterials.length}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          
          <Card className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-primary">{Math.round(progressPercentage)}%</div>
              <div className="text-sm text-muted-foreground">Progress</div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Progress Bar with Graphics */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <Progress value={progressPercentage} className="h-4" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-medium text-primary bg-background px-2">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            {completedMaterials.length} of 8 units completed
          </p>
        </div>
      </div>

      {/* Enhanced Navigation Tabs */}
      <div className="flex justify-center">
        <div className="flex bg-muted rounded-xl p-2 shadow-lg">
          <Button
            variant={activeTab === 'materials' ? 'default' : 'ghost'}
            size="lg"
            onClick={() => setActiveTab('materials')}
            className="rounded-lg px-6"
          >
            <Book className="h-5 w-5 mr-2" />
            Materials
          </Button>
          <Button
            variant={activeTab === 'homework' ? 'default' : 'ghost'}
            size="lg"
            onClick={() => setActiveTab('homework')}
            className="rounded-lg px-6"
          >
            <PenTool className="h-5 w-5 mr-2" />
            Homework
          </Button>
          <Button
            variant={activeTab === 'quiz' ? 'default' : 'ghost'}
            size="lg"
            onClick={() => setActiveTab('quiz')}
            className="rounded-lg px-6"
          >
            <Brain className="h-5 w-5 mr-2" />
            Quiz
          </Button>
        </div>
      </div>

      {/* Quiz Tab */}
      {activeTab === 'quiz' && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Quiz Challenge
            </h2>
            <p className="text-lg text-muted-foreground">
              Test your knowledge and earn XP! 🧠
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-red-400 to-pink-500 rounded-full w-20 h-20 flex items-center justify-center">
                  <Brain className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-red-700">Ready for a Challenge?</CardTitle>
                <CardDescription className="text-lg text-red-600">
                  Take quizzes to test your knowledge and track your progress
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-red-600">5</div>
                    <div className="text-sm text-muted-foreground">Questions per Quiz</div>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-red-600">100</div>
                    <div className="text-sm text-muted-foreground">XP per Quiz</div>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-red-600">∞</div>
                    <div className="text-sm text-muted-foreground">Unlimited Attempts</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-3 text-lg hover:scale-105 transition-all duration-300"
                    onClick={() => window.location.href = '/quiz'}
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Start Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Enhanced Materials Tab */}
      {activeTab === 'materials' && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Learning Materials
            </h2>
            <p className="text-lg text-muted-foreground">
              Access all your completed lessons and resources 📚
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {completedMaterials.map((material) => (
              <Card key={material.id} className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`${material.color} p-2 rounded-lg shadow-lg`}>
                      <span className="text-2xl">{material.icon}</span>
                    </div>
                    <div>
                      <CardTitle className="text-base">{material.title}</CardTitle>
                      <CardDescription className="capitalize text-xs">{material.type}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-center justify-between text-xs">
                    <Badge variant="secondary" className={getDifficultyColor(material.difficulty)}>
                      {material.difficulty}
                    </Badge>
                    <span className="text-muted-foreground">
                      {material.estimatedTime}m
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center text-xs">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="font-medium text-yellow-600">{material.xpReward} XP earned</span>
                  </div>

                  <Button variant="outline" size="sm" className="w-full hover:bg-primary hover:text-primary-foreground text-xs">
                    <Play className="h-3 w-3 mr-1" />
                    Review
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Homework Tab */}
      {activeTab === 'homework' && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Homework & Assignments
            </h2>
            <p className="text-lg text-muted-foreground">
              Track your assignments and learning tasks ✏️
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {homework.map((hw) => (
              <Card key={hw.id} className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{hw.title}</CardTitle>
                      <CardDescription className="text-primary font-medium text-xs">{hw.subject}</CardDescription>
                    </div>
                    <Badge className={getHomeworkStatusColor(hw.status)}>
                      {hw.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 p-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">{hw.description}</p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Due: {new Date(hw.dueDate).toLocaleDateString()}
                    </span>
                    <span className="text-muted-foreground">
                      {hw.estimatedTime}m
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className={getDifficultyColor(hw.difficulty)}>
                      {hw.difficulty}
                    </Badge>
                    
                    <Button 
                      size="sm"
                      variant={hw.status === 'completed' ? 'outline' : 'default'}
                      className="hover:scale-105 transition-transform text-xs"
                    >
                      {hw.status === 'completed' ? 'Completed' : 
                       hw.status === 'in-progress' ? 'Continue' : 'Start'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Pathway;
