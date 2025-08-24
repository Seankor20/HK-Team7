import { useState, useEffect, useMemo, useCallback } from "react";
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
  const [pdfProcessing, setPdfProcessing] = useState(false);
  const [showGeneratedQuestions, setShowGeneratedQuestions] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingHomework, setEditingHomework] = useState<Quiz | null>(null);
  const [isQuizMode, setIsQuizMode] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    pdfFile: undefined as File | undefined
  });

  // Check if user has access to homework management
  const canManageHomework = useMemo(() => {
    return user?.user_metadata?.role === 'teacher' || user?.user_metadata?.role === 'ngo' || user?.user_metadata?.role === 'admin';
  }, [user?.user_metadata?.role]);

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

  // Fetch homework from Supabase (filtered by type = 'homework')
  const fetchHomework = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching homework from Supabase...');
      
      // First, let's see what's in the quiz table (which contains both homework and quiz assignments)
      const { data: allAssignments, error: allError } = await supabase
        .from('quiz')
        .select('*');
      
      console.log('All assignments in quiz table:', { allAssignments, allError });
      
      // Now filter for homework
      const { data, error } = await supabase
        .from('quiz')
        .select('*')
        .eq('type', 'homework')
        .order('due_date', { ascending: true });
      
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
  }, []);

  useEffect(() => {
    if (canManageHomework) {
      fetchHomework();
    }
  }, [canManageHomework, fetchHomework]);

  // Create new homework (stored in quiz table with type = 'homework')
  const createHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    setPdfProcessing(true);
    setShowGeneratedQuestions(false);
    try {
      // First, create the homework assignment
      const homeworkData = {
        title: formData.title,
        description: formData.description,
        due_date: formData.due_date,
        status: 'pending',
        type: 'homework' as const
      };

      const { data, error } = await supabase
        .from('quiz')
        .insert([homeworkData])
        .select()
        .single();

      if (error) {
        setPdfProcessing(false);
        console.error('Error creating homework:', error);
        return;
      }

      if (data) {
        setFormData({ title: '', description: '', due_date: '', pdfFile: undefined });
        setIsQuizMode(false);

        // After homework is created, process the uploaded PDF if present
        if (formData.pdfFile) {
          const pdfFilename = formData.pdfFile.name;
          await processHomeworkPdf(pdfFilename);
        }
        // Only close the create form after PDF processing (or immediately if no PDF)
        setShowCreateForm(false);
      }
    } catch (error) {
      setPdfProcessing(false);
      console.error('Error creating homework:', error);
    }
  };
  // Process PDF after upload and homework creation
  const processHomeworkPdf = async (pdfFilename: string) => {
    setPdfProcessing(true);
    setShowGeneratedQuestions(false);
    console.log('Processing PDF:', pdfFilename);
    try {
      const res = await fetch('http://127.0.0.1:5000/process_homework_pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdf_filename: pdfFilename }),
      });
      const data = await res.json();
      console.log(data);
      if (data.success) {
        setGeneratedQuestions(data.results[0].text_image_pairs);
        console.log(generatedQuestions);
        setShowGeneratedQuestions(true);
      } else {
        alert(data.error || 'Failed to process PDF');
      }
    } catch (err) {
      alert('Error processing PDF');
    } finally {
      setPdfProcessing(false);
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
        setFormData({ title: '', description: '', due_date: '', pdfFile: undefined });
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
      due_date: hw.due_date,
      pdfFile: undefined
    });
  };

  const cancelEditing = () => {
    setEditingHomework(null);
    setFormData({ title: '', description: '', due_date: '', pdfFile: undefined });
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
    <div className="p-4 md:p-8 space-y-6 relative">
      {/* PDF Processing Loading Overlay */}
      
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Homework Manager
        </h1>
        <p className="text-lg text-muted-foreground">
          Create, track, and complete your homework assignments
        </p>
      </div>

      {/* Create Homework Button and Form, or Loading (mutually exclusive) */}
      {pdfProcessing ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-6"></div>
          <p className="text-xl font-semibold text-blue-700">Processing uploaded PDF...</p>
        </div>
      ) : (
        <>
          <div className="flex justify-center">
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Create New Homework
            </Button>
          </div>

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
                      placeholder=" Describe the homework assignment"
                      rows={3}
                      required
                    />
                  </div>

                  {/* PDF Upload Section */}
                  <div className="space-y-3">
                    <Label htmlFor="pdf-upload">Attach PDF (Optional)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        id="pdf-upload"
                        accept=".pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFormData(prev => ({ ...prev, pdfFile: file }));
                          }
                        }}
                        className="hidden"
                      />
                      <label htmlFor="pdf-upload" className="cursor-pointer">
                        <div className="space-y-2">
                          <FileText className="h-8 w-8 mx-auto text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              {formData.pdfFile ? formData.pdfFile.name : 'Click to upload PDF'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formData.pdfFile ? 'PDF file selected' : 'PDF files only'}
                            </p>
                          </div>
                        </div>
                      </label>
                    </div>
                    {formData.pdfFile && (
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-800">{formData.pdfFile.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setFormData(prev => ({ ...prev, pdfFile: undefined }))}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Quiz Selection Section (if needed in future) */}
                  {/* ...existing code... */}
                  <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      className="flex-1" 
                      disabled={pdfProcessing}
                    >
                      {pdfProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing PDF...
                        </>
                      ) : (
                        editingHomework ? 'Update Homework' : 'Create Homework'
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={editingHomework ? cancelEditing : () => setShowCreateForm(false)}
                      disabled={pdfProcessing}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Generated Questions Section */}
      {showGeneratedQuestions && Array.isArray(generatedQuestions) && generatedQuestions.length > 0 && (
        <div className="max-w-2xl mx-auto my-8 p-6 bg-gradient-to-br from-white to-gray-50 border-2 hover:border-primary/20 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-yellow-800">Generated Questions</h2>
          <ol className="space-y-8 list-decimal list-inside">
            {generatedQuestions.map((q, idx) => (
              <li key={idx} className="bg-white rounded-lg p-4 shadow-md">
                {q.image_link && (
                  <div className="mb-3 flex justify-center">
                    <img
                      src={(() => {
                        // Remove everything up to and including /HK-Team7
                        const idx = q.image_link.indexOf('/HK-Team7');
                        return idx !== -1 ? '.' + q.image_link.substring(idx + '/HK-Team7'.length) : q.image_link;
                      })()}
                      alt={`Question ${idx + 1} image`}
                      className="max-h-48 max-w-xs object-contain rounded border"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="font-semibold text-gray-800 mb-2">{q.question}</div>
                <ul className="space-y-2 mb-2">
                  {[q.right_ans, ...(Array.isArray(q.wrong_ans) ? q.wrong_ans.slice(0, 3) : [])].map((opt, i) => (
                    <li key={i} className={i === 0 ? 'font-bold text-green-700 flex items-center gap-2' : 'text-gray-700 flex items-center gap-2'}>
                      <span className="inline-block px-3 py-1 rounded border mr-2 bg-gray-50">
                        {String.fromCharCode(65 + i)}.
                      </span>
                      <span>{opt}</span>
                      {i === 0 && <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Correct</span>}
                    </li>
                  ))}
                </ul>
                {q.reason && (
                  <div className="mt-2 text-xs text-blue-700 italic">Reason: {q.reason}</div>
                )}
              </li>
            ))}
          </ol>
          <div className="flex gap-4 mt-6 justify-end">
            <Button variant="outline">Edit</Button>
            <Button className="bg-blue-600 text-white">Submit</Button>
          </div>
        </div>
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
