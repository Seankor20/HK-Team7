import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Calendar,
  BookOpen,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  PlusCircle,
  Lock,
  Brain,
  List,
  Link,
  FileText
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSupabase } from "@/hooks/use-supabase";
import { useSearchParams } from "react-router-dom";

interface Quiz {
  id: string;
  created_at: string;
  title: string;
  description: string;
  due_date: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  type: 'quiz' | 'homework';
}

interface Question {
  id: string;
  question: string;
  option: string[];
  correct_answer: number;
  explanation?: string;
}

const Homework = () => {
  const { user, loading: authLoading } = useSupabase();
  const [searchParams] = useSearchParams();
  const [homework, setHomework] = useState<Quiz[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingHomework, setEditingHomework] = useState<Quiz | null>(null);
  const [isQuizMode, setIsQuizMode] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: ''
  });

  // Check if user has access to homework management
  const canManageHomework = false;

  // Check for edit parameter in URL
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId && canManageHomework) {
      const homeworkToEdit = homework.find(hw => hw.id === editId);
      if (homeworkToEdit) {
        startEditing(homeworkToEdit);
      }
    }
  }, [searchParams, homework, canManageHomework]);

  // Redirect unauthorized users
  if (!authLoading && !canManageHomework) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
          <p className="text-lg text-muted-foreground">
            You don't have permission to access the Homework Manager.
          </p>
          <p className="text-sm text-muted-foreground">
            Only teachers, NGO staff, and administrators can manage homework assignments.
          </p>
          <Button onClick={() => window.history.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Fetch homework from Supabase (filtered by type = 'homework')
  useEffect(() => {
    fetchHomework();
  }, []);

  const fetchHomework = async () => {
    setLoading(true);
    try {
      console.log('Fetching homework from Supabase...');
      
      // First, let's see what's in the quiz table
      const { data: allQuizzes, error: allError } = await supabase
        .from('quiz')
        .select('*');
      
      console.log('All quizzes in table:', { allQuizzes, allError });
      
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

  // Fetch questions for a specific quiz/homework
  const fetchQuizQuestions = async (quizId: string) => {
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select(`
          *,
          question:question_id(*)
        `)
        .eq('quiz_id', quizId);
      
      if (error) {
        console.error('Error fetching quiz questions:', error);
        return;
      }
      
      const questionData = data?.map(item => item.question).filter(Boolean) || [];
      setQuestions(questionData);
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
    }
  };

  // Create new homework (stored in quiz table with type = 'homework')
  const createHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const homeworkData = {
        title: formData.title,
        description: formData.description,
        due_date: formData.due_date,
        status: 'pending',
        type: 'homework' as const
      };

      console.log('Creating homework with data:', homeworkData);

      const { data, error } = await supabase
        .from('quiz')
        .insert([homeworkData])
        .select()
        .single();
      
      console.log('Insert response:', { data, error });
      
      if (error) {
        console.error('Error creating homework:', error);
        return;
      }
      
      if (data) {
        console.log('Successfully created homework:', data);
        setHomework(prev => [data, ...prev]);
        setFormData({ title: '', description: '', due_date: '' });
        setIsQuizMode(false);
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Error creating homework:', error);
    }
  };

  // Update homework status
  const updateHomeworkStatus = async (homeworkId: string, newStatus: Quiz['status']) => {
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

  // Delete homework
  const deleteHomework = async (homeworkId: string) => {
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

  // Edit homework
  const editHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHomework) return;
    
    try {
      const { data, error } = await supabase
        .from('quiz')
        .update({
          title: formData.title,
          description: formData.description,
          due_date: formData.due_date
        })
        .eq('id', editingHomework.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating homework:', error);
        return;
      }
      
      if (data) {
        setHomework(prev => prev.map(hw => 
          hw.id === editingHomework.id ? data : hw
        ));
        setFormData({ title: '', description: '', due_date: '' });
        setEditingHomework(null);
      }
    } catch (error) {
      console.error('Error updating homework:', error);
    }
  };

  const startEditing = (hw: Quiz) => {
    setEditingHomework(hw);
    setFormData({
      title: hw.title,
      description: hw.description,
      due_date: hw.due_date
    });
  };

  const cancelEditing = () => {
    setEditingHomework(null);
    setFormData({ title: '', description: '', due_date: '' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'in-progress':
        return 'bg-blue-500 text-white';
      case 'pending':
        return 'bg-gray-500 text-white';
      case 'overdue':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in-progress':
        return <Clock className="h-4 w-4" />;
      case 'pending':
        return <BookOpen className="h-4 w-4" />;
      case 'overdue':
        return <Clock className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Homework Manager
        </h1>
        <p className="text-lg text-muted-foreground">
          Create, track, and complete your homework assignments
        </p>
      </div>

      {/* Create Homework Button */}
      <div className="flex justify-center">
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Create New Homework
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(showCreateForm || editingHomework) && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>
              {editingHomework ? 'Edit Homework' : 'Create New Homework'}
            </CardTitle>
            <CardDescription>
              {editingHomework ? 'Update your homework assignment' : 'Add a new homework assignment'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={editingHomework ? editHomework : createHomework} className="space-y-6">
              {/* Basic Homework Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter homework title"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the homework assignment"
                  rows={3}
                  required
                />
              </div>

              {/* Quiz Mode Toggle */}
              {!editingHomework && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="quiz-mode"
                    checked={isQuizMode}
                    onChange={(e) => setIsQuizMode(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="quiz-mode" className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Link to Existing Quiz
                  </Label>
                </div>
              )}

              {/* Quiz Selection Section */}
              {isQuizMode && (
                <div className="space-y-4 border rounded-lg p-4 bg-muted/50">
                  <h3 className="text-lg font-semibold">Select Quiz</h3>
                  
                  {/* This section is no longer needed as quizzes are not directly linked here */}
                  {/* It's kept for now, but the logic for selecting a quiz is removed */}
                  {/* <p className="text-sm text-muted-foreground">
                    No quizzes available. Create quizzes first in the Quiz section.
                  </p> */}
                  
                  {/* The selectedQuizId state and its logic are removed */}
                  {/* {selectedQuizId && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-sm text-blue-800">
                        <strong>Selected Quiz:</strong> {quizzes.find(q => q.id === selectedQuizId)?.title}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Students will take this quiz to complete the homework assignment.
                      </p>
                    </div>
                  )} */}
                </div>
              )}
              
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingHomework ? 'Update Homework' : 'Create Homework'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={editingHomework ? cancelEditing : () => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Homework List */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Your Homework Assignments</h2>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading homework...</p>
          </div>
        ) : homework.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">No homework assignments created yet!</p>
            <p className="text-sm text-muted-foreground">
              Create your first homework assignment to get started.
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
                    <Badge className={`ml-2 ${getStatusColor(hw.status)}`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(hw.status)}
                        {hw.status}
                      </div>
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
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    {/* Status Update Button */}
                    {hw.status === 'completed' ? (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateHomeworkStatus(hw.id, 'in-progress')}
                        className="flex-1"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Mark In Progress
                      </Button>
                    ) : (
                      <Button 
                        size="sm"
                        onClick={() => updateHomeworkStatus(hw.id, 'completed')}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {hw.status === 'in-progress' ? 'Mark Complete' : 'Start'}
                      </Button>
                    )}
                    
                    {/* Management Buttons - Only for Teachers/NGOs */}
                    {canManageHomework && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => startEditing(hw)}
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
    </div>
  );
};

export default Homework;
