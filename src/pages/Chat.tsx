import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Search, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ChatRoom {
  id: number;
  name: string;
  type: "parent" | "teacher" | "general";
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  participants: number;
}

const chatRooms: ChatRoom[] = [
  {
    id: 1,
    name: "Miss Sarah's Class",
    type: "teacher",
    lastMessage: "Great progress this week everyone!",
    lastTime: "2 min ago",
    unreadCount: 2,
    participants: 15
  },
  {
    id: 2,
    name: "Math Learning Parents",
    type: "parent",
    lastMessage: "Has anyone tried the new counting games?",
    lastTime: "15 min ago",
    unreadCount: 0,
    participants: 8
  },
  {
    id: 3,
    name: "Reading Together",
    type: "parent",
    lastMessage: "My daughter loves the new stories!",
    lastTime: "1 hour ago",
    unreadCount: 3,
    participants: 12
  },
  {
    id: 4,
    name: "General Announcements",
    type: "general",
    lastMessage: "New learning materials available",
    lastTime: "2 hours ago",
    unreadCount: 1,
    participants: 25
  }
];

const Chat = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

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

  const handleRoomSelect = (room: ChatRoom) => {
    navigate(`/chat/${room.id}`, { state: { room } });
  };

  const filteredRooms = chatRooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Chat Rooms
            </CardTitle>
            <p className="text-muted-foreground">
              Select a chat room to start a conversation
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1 p-4">
              {filteredRooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => handleRoomSelect(room)}
                  className="p-4 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 border border-transparent hover:border-border"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{room.name}</h3>
                        <Badge className={getBadgeColor(room.type)}>
                          {room.type === "teacher" ? "Teacher Chat" : 
                           room.type === "parent" ? "Parent Group" : 
                           "Announcements"}
                        </Badge>
                        {room.unreadCount > 0 && (
                          <Badge className="bg-destructive text-destructive-foreground h-6 w-6 text-xs p-0 flex items-center justify-center">
                            {room.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {room.lastMessage}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{room.lastTime}</span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {room.participants} participants
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;