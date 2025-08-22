import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, ArrowLeft, Users } from "lucide-react";

interface ChatRoom {
  id: number;
  name: string;
  type: "parent" | "teacher" | "general";
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  participants: number;
}

interface Message {
  id: number;
  sender: string;
  avatar: string;
  message: string;
  time: string;
  isMe: boolean;
  senderType: "parent" | "teacher";
}

const messages: Message[] = [
  {
    id: 1,
    sender: "Miss Sarah",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c26ca924?w=50&h=50&fit=crop&crop=face",
    message: "Good morning parents! I wanted to share that the children have been doing wonderfully with their number recognition exercises.",
    time: "9:30 AM",
    isMe: false,
    senderType: "teacher"
  },
  {
    id: 2,
    sender: "Emma's Mom",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
    message: "Thank you Miss Sarah! Emma has been practicing at home and she's so excited about counting.",
    time: "9:45 AM",
    isMe: false,
    senderType: "parent"
  },
  {
    id: 3,
    sender: "You",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
    message: "That's wonderful to hear! My child has been asking about the math games. Are there any you'd recommend for home practice?",
    time: "10:00 AM",
    isMe: true,
    senderType: "parent"
  },
  {
    id: 4,
    sender: "Miss Sarah",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c26ca924?w=50&h=50&fit=crop&crop=face",
    message: "Absolutely! I'll share some interactive counting games in our learning materials section. They're perfect for reinforcing what we learn in class.",
    time: "10:15 AM",
    isMe: false,
    senderType: "teacher"
  },
  {
    id: 5,
    sender: "Noah's Dad",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
    message: "This is so helpful! Love how engaged the kids are with learning.",
    time: "10:30 AM",
    isMe: false,
    senderType: "parent"
  }
];

const ChatMessages = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [newMessage, setNewMessage] = useState("");
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (location.state?.room) {
      setRoom(location.state.room);
    } else {
      // If no room data, redirect back to chat rooms
      navigate("/chat");
    }
  }, [location.state, navigate]);

  // Scroll to bottom when messages change or component mounts
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, room]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the backend
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

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

  if (!room) {
    return null;
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
                    {room.participants} participants
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Messages - Fixed height with scroll */}
      <div className="px-4 md:px-8 overflow-hidden" style={{ height: 'calc(100vh - 280px)' }}>
        <Card className="h-full">
          <CardContent className="h-full p-0">
            <ScrollArea ref={scrollAreaRef} className="h-full" type="always">
              <div className="p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.isMe ? "flex-row-reverse" : ""}`}
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={message.avatar} alt={message.sender} />
                      <AvatarFallback>{message.sender.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className={`max-w-[70%] ${message.isMe ? "text-right" : ""}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-semibold ${
                          message.senderType === "teacher" ? "text-primary" : "text-foreground"
                        }`}>
                          {message.sender}
                        </span>
                        <span className="text-xs text-muted-foreground">{message.time}</span>
                      </div>
                      <div className={`p-3 rounded-lg ${
                        message.isMe 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      }`}>
                        <p className="text-sm">{message.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Message Input - Fixed at bottom of screen (replaces navigation) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-border bg-background z-50 shadow-lg">
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
