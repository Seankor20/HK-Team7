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
  Palette,
  Edit,
  Trash2,
  FileText,
  CheckCircle
} from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { supabase } from "@/lib/supabase";
import { useSupabase } from "@/hooks/use-supabase";

interface Homework {
  id: string;
  created_at: string;
  title: string;
  due_date: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  description: string;
  type: 'quiz' | 'homework';
}

interface CompletedMaterial {
  id: string;
  title: string;
  type: string;
  difficulty: string;
  estimated_time: number;
  xp_reward: number;
  icon: string;
  color: string;
  category: string;
  completed_at: string;
}

const Pathway = () => {
  const { t } = useI18n();
  const { user, profile, loading: authLoading } = useSupabase();
  const [activeTab, setActiveTab] = useState<'materials' | 'homework' | 'quiz'>('materials');
  const [homework, setHomework] = useState<Homework[]>([]);
  const [completedMaterials, setCompletedMaterials] = useState<CompletedMaterial[]>([]);
  const [loading, setLoading] = useState(false);
  const [materialsLoading, setMaterialsLoading] = useState(false);

  // Check if user has access to homework management
  const canManageHomework = profile?.role === 'teacher' || profile?.role === 'ngo' || profile?.role === 'admin';

  // Log authentication state
  useEffect(() => {
    console.log('Authentication state:', { 
      user: user?.id, 
      profile: profile, 
      authLoading, 
      canManageHomework 
    });
  }, [user, profile, authLoading, canManageHomework]);

  // Fetch homework from Supabase (filtered by type = 'homework')
  useEffect(() => {
    // Temporarily allow fetching without authentication for testing
    fetchHomework();
  }, []);

  const fetchHomework = async () => {
    setLoading(true);
    try {
      console.log('Fetching homework from Supabase...');
      console.log('Current user:', user?.id);
      console.log('Current session:', user ? 'Authenticated' : 'Not authenticated');
      
      // First, let's see what's in the quiz table
      const { data: allQuizzes, error: allError } = await supabase
        .from('quiz')
        .select('*');
      
      console.log('All quizzes in table:', { allQuizzes, allError });
      
      // Let's also check the structure of each quiz
      if (allQuizzes && allQuizzes.length > 0) {
        console.log('First quiz structure:', allQuizzes[0]);
        console.log('All quiz types:', allQuizzes.map(q => ({ id: q.id, title: q.title, type: q.type, status: q.status })));
      }
      
      // Now filter for homework
      const { data, error } = await supabase
        .from('quiz')
        .select('*')
        .eq('type', 'homework')
        .order('due_date', { ascending: true });
      
      console.log('Filtered homework response:', { data, error });
      console.log('SQL query: SELECT * FROM quiz WHERE type = \'homework\' ORDER BY due_date ASC');
      
      if (error) {
        console.error('Error fetching homework:', error);
        // Check if it's an RLS error
        if (error.message.includes('RLS') || error.message.includes('permission')) {
          console.error('This looks like an RLS (Row Level Security) error');
        }
        return;
      }
      
      console.log('Homework data received:', data);
      setHomework(data || []);
    } catch (error) {
      console.error('Error fetching homework:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (homeworkId: string, newStatus: Homework['status']) => {
    try {
      const { data, error } = await supabase
        .from('quiz')
        .update({ status: newStatus })
        .eq('id', homeworkId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating homework status:', error);
        return;
      }
      
      if (data) {
        setHomework(prev => prev.map(hw => 
          hw.id === homeworkId ? data : hw
        ));
      }
    } catch (error) {
      console.error('Error updating homework status:', error);
    }
  };

  const deleteHomework = async (homeworkId: string) => {
    if (!canManageHomework) return;
    
    if (!confirm('Are you sure you want to delete this homework?')) return;
    
    try {
      const { error } = await supabase
        .from('quiz')
        .delete()
        .eq('id', homeworkId);
      
      if (error) {
        console.error('Error deleting homework:', error);
        return;
      }
      
      setHomework(prev => prev.filter(hw => hw.id !== homeworkId));
    } catch (error) {
      console.error('Error deleting homework:', error);
    }
  };

  const completedHomework = homework.filter(hw => hw.status === 'completed');
  const totalXP = completedHomework.length * 100; // 100 XP per completed homework
  const progressPercentage = homework.length > 0 ? (completedHomework.length / homework.length) * 100 : 0;


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
        <div className="flex justify-center items-center gap-4 max-w-5xl mx-auto">
          <Card className="text-center bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 flex-1 max-w-[200px]">
            <CardContent className="p-3">
              <div className="flex items-center justify-center mb-2">
                <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="text-xl font-bold text-primary">{totalXP}</div>
              <div className="text-xs text-muted-foreground">Total XP</div>
            </CardContent>
          </Card>
          
          <Card className="text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 flex-1 max-w-[200px]">
            <CardContent className="p-3">
              <div className="flex items-center justify-center mb-2">
                <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full">
                  <Target className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="text-xl font-bold text-primary">{completedHomework.length}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          
          <Card className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 flex-1 max-w-[200px]">
            <CardContent className="p-3">
              <div className="flex items-center justify-center mb-2">
                <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="text-xl font-bold text-primary">{Math.round(progressPercentage)}%</div>
              <div className="text-xs text-muted-foreground">Progress</div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Progress Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Learning Progress</span>
            <span className="text-sm font-medium text-primary">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0</span>
            <span>{homework.length} units</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg bg-muted p-1">
          <Button
            variant={activeTab === 'materials' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('materials')}
            className="rounded-md"
          >
            <Book className="h-4 w-4 mr-1" />
            Learning Materials
          </Button>
          <Button
            variant={activeTab === 'homework' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('homework')}
            className="rounded-md"
          >
            <PenTool className="h-4 w-4 mr-1" />
            Homework
          </Button>
          <Button
            variant={activeTab === 'quiz' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('quiz')}
            className="rounded-md"
          >
            <Brain className="h-4 w-4 mr-1" />
            Quiz
          </Button>
        </div>
      </div>

      {/* Learning Materials Tab */}
      {activeTab === 'materials' && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Learning Materials
            </h2>
            <p className="text-lg text-muted-foreground">
              Track your completed homework and earn XP! 📚
            </p>
          </div>

          <div className="text-center py-8">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              Learning materials tracking coming soon!
            </p>
            <p className="text-sm text-muted-foreground">
              For now, focus on completing your homework assignments.
            </p>
          </div>
        </div>
      )}

      {/* Homework Tab */}
      {activeTab === 'homework' && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Homework & Assignments
            </h2>
            <p className="text-lg text-muted-foreground">
              {canManageHomework 
                ? 'Manage and track homework assignments ✏️' 
                : 'Complete your assigned homework assignments ✏️'
              }
            </p>
          </div>

          {/* Management Button - Only for Teachers/NGOs */}
          {canManageHomework && (
            <div className="flex justify-center">
              <Button
                onClick={() => window.location.href = '/homework'}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <PenTool className="h-5 w-5 mr-2" />
                Manage Homework
              </Button>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading homework...</p>
            </div>
          ) : homework.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                {canManageHomework ? 'No homework assignments created yet!' : 'No homework assigned yet!'}
              </p>
              <p className="text-sm text-muted-foreground">
                {canManageHomework 
                  ? 'Create your first homework assignment to get started.' 
                  : 'Check back later for new assignments.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {homework.map((hw) => (
                <Card key={hw.id} className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50 border-2 hover:border-primary/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 mb-2">{hw.title}</CardTitle>
                        <CardDescription className="text-sm text-gray-600 leading-relaxed">
                          {hw.description}
                        </CardDescription>
                      </div>
                      <Badge className={`ml-2 ${getHomeworkStatusColor(hw.status)}`}>
                        {hw.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Due Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-medium">Due:</span>
                      <span className="text-gray-700">{new Date(hw.due_date).toLocaleDateString()}</span>
                    </div>

                    {/* Created Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>Created: {new Date(hw.created_at).toLocaleDateString()}</span>
                    </div>

                    {/* Type Badge */}
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        <FileText className="h-3 w-3 mr-1" />
                        {hw.type === 'homework' ? 'Homework' : 'Quiz'}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      {hw.status === 'completed' ? (
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(hw.id, 'in-progress')}
                          className="flex-1"
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          Mark In Progress
                        </Button>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => handleStatusUpdate(hw.id, 'completed')}
                          className="flex-1"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {hw.status === 'in-progress' ? 'Mark Complete' : 'Start'}
                        </Button>
                      )}
                      
                      {canManageHomework && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.location.href = `/homework?edit=${hw.id}`}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => deleteHomework(hw.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

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

    </div>
  );
};

export default Pathway;
