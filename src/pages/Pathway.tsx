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
  Trash2
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
  const { profile } = useSupabase();
  const [activeTab, setActiveTab] = useState<'materials' | 'homework' | 'quiz'>('materials');
  const [homework, setHomework] = useState<Homework[]>([]);
  const [completedMaterials, setCompletedMaterials] = useState<CompletedMaterial[]>([]);
  const [loading, setLoading] = useState(false);
  const [materialsLoading, setMaterialsLoading] = useState(false);

  // Check if user has access to homework management
  const canManageHomework = profile?.role === 'teacher' || profile?.role === 'ngo' || profile?.role === 'admin';

  // Fetch homework from Supabase
  useEffect(() => {
    fetchHomework();
  }, []);

  const fetchHomework = async () => {
    setLoading(true);
    try {
      console.log('Fetching homework from Supabase...');
      const { data, error } = await supabase
        .from('homework')
        .select('*')
        .order('due_date', { ascending: true });
      
      console.log('Supabase response:', { data, error });
      
      if (error) {
        console.error('Error fetching homework:', error);
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

  // Fetch completed materials from Supabase
  useEffect(() => {
    fetchCompletedMaterials();
  }, []);

  const fetchCompletedMaterials = async () => {
    setMaterialsLoading(true);
    try {
      const { data, error } = await supabase
        .from('completed_materials')
        .select('*')
        .order('completed_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching completed materials:', error);
        return;
      }
      
      setCompletedMaterials(data || []);
    } catch (error) {
      console.error('Error fetching completed materials:', error);
    } finally {
      setMaterialsLoading(false);
    }
  };

  // Handle homework status updates
  const handleStatusUpdate = async (homeworkId: string, newStatus: Homework['status']) => {
    try {
      const { data, error } = await supabase
        .from('homework')
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

  // Delete homework (only for teachers/NGOs)
  const deleteHomework = async (homeworkId: string) => {
    if (!canManageHomework) return;
    
    if (!confirm('Are you sure you want to delete this homework?')) return;
    
    try {
      const { error } = await supabase
        .from('homework')
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

  const totalXP = completedMaterials.reduce((sum, unit) => sum + (unit.xp_reward || 0), 0);
  const progressPercentage = completedMaterials.length > 0 ? (completedMaterials.length / 8) * 100 : 0; // Assuming 8 total units


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

        {/* Overall Progress Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Learning Progress</span>
            <span className="text-sm font-medium text-primary">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0</span>
            <span>8 units</span>
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
            <Book className="h-4 w-4 mr-2" />
            Learning Materials
          </Button>
          <Button
            variant={activeTab === 'homework' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('homework')}
            className="rounded-md"
          >
            <PenTool className="h-4 w-4 mr-2" />
            {canManageHomework ? 'Homework' : 'My Homework'}
          </Button>
          <Button
            variant={activeTab === 'quiz' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('quiz')}
            className="rounded-md"
          >
            <Brain className="h-4 w-4 mr-2" />
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
              Track your completed lessons and earn XP! 📚
            </p>
          </div>

          {materialsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading materials...</p>
            </div>
          ) : completedMaterials.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No materials completed yet!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedMaterials.map((unit) => (
                <Card key={unit.id} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
                  <div className={`h-32 ${unit.color} flex items-center justify-center`}>
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                      {unit.icon}
                    </span>
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{unit.title}</CardTitle>
                        <CardDescription className="text-primary font-medium">
                          {unit.type.charAt(0).toUpperCase() + unit.type.slice(1)}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {unit.estimated_time}m
                      </span>
                      <span className="text-muted-foreground flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        {unit.xp_reward} XP
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                      </div>
                      
                      <Button 
                        size="sm"
                        variant="outline"
                        className="hover:scale-105 transition-transform"
                      >
                        Review
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {homework.map((hw) => (
                <Card key={hw.id} className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{hw.title}</CardTitle>
                        <CardDescription className="text-primary font-medium text-xs">
                          Created: {new Date(hw.created_at).toLocaleDateString()}
                        </CardDescription>
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
                        Due: {new Date(hw.due_date).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {/* Status Update Button - Available for all users */}
                      {hw.status === 'completed' ? (
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(hw.id, 'in-progress')}
                          className="flex-1"
                        >
                          Mark In Progress
                        </Button>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => handleStatusUpdate(hw.id, 'completed')}
                          className="flex-1"
                        >
                          {hw.status === 'in-progress' ? 'Mark Complete' : 'Start'}
                        </Button>
                      )}
                      
                      {/* Management Buttons - Only for Teachers/NGOs */}
                      {canManageHomework && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.location.href = `/homework?edit=${hw.id}`}
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

    </div>
  );
};

export default Pathway;
