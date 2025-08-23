import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users } from "lucide-react";
import { RealtimeChat } from "@/components/realtime-chat";
import { createClient } from "@/lib/supabase/client";

interface ChatRoom {
  id: string;
  name: string;
  type: "parent" | "teacher" | "general";
  last_message?: string;
  participant_count?: number;
  created_at: string;
}

const ChatMessages = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [room, setRoom] = useState(null)
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const loadRoomAndUser = async () => {
      if (!roomId) {
        navigate("/chat");
        return;
      }
      setRoom(roomId)
      try {
        setError(null);

        // Get current user from auth
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error('Auth error:', userError);
          setError('Authentication error');
          return;
        }

        if (!user) {
          setError('No authenticated user found');
          navigate("/chat");
          return;
        }
          
        setCurrentUser(user);

      } catch (error) {
        console.error('Error loading room or user:', error);
        setError('Failed to load chat room');
      } finally {
        setLoading(false);
      }
    };

    loadRoomAndUser();
  }, [roomId, navigate, supabase]);

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "teacher":
        return "bg-primary text-primary-foreground";
      case "parent":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <div className="text-center">Loading chat room...</div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <div className="text-center text-red-600">
                <p className="mb-4">Error: {error}</p>
                <Button onClick={() => navigate("/chat")}>Back to Chat Rooms</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!room || !currentUser) {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <div className="text-center text-red-600">
                <p className="mb-4">Room or user not found</p>
                <Button onClick={() => navigate("/chat")}>Back to Chat Rooms</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-background flex flex-col">
      {/* Header */}
      <div className="p-4 md:p-8 flex-shrink-0">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/chat")}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <CardTitle className="text-lg">{room.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getBadgeColor(room.type)}>
                    {room.type === "teacher" ? "Teacher Chat" : 
                     room.type === "parent" ? "Parent Group" : 
                     "Announcements"}
                  </Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {room.participant_count || 0} participants
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Real-time Chat */}
      <div className="flex-1 px-4 md:p-8 overflow-hidden" style={{ height: 'calc(100vh - 280px)' }}>
        <Card className="h-full">
          <CardContent className="h-full p-0">
            <RealtimeChat
              roomId={room.id}
              userId={currentUser.id}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatMessages;
