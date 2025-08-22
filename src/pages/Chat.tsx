import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Users, MessageCircle, Search } from "lucide-react";

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

const Chat = () => {
  const [selectedRoom, setSelectedRoom] = useState(chatRooms[0]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the backend
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const getRoomIcon = (type: string) => {
    switch (type) {
      case "teacher":
        return "👩‍🏫";
      case "parent":
        return "👨‍👩‍👧‍👦";
      default:
        return "📢";
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

  const filteredRooms = chatRooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
        {/* Chat Rooms List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Chat Rooms
            </CardTitle>
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
            <ScrollArea className="h-[400px]">
              <div className="space-y-1 p-4">
                {filteredRooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedRoom.id === room.id
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{getRoomIcon(room.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm truncate">{room.name}</h3>
                          {room.unreadCount > 0 && (
                            <Badge className="bg-destructive text-destructive-foreground h-5 w-5 text-xs p-0 flex items-center justify-center">
                              {room.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate mb-1">
                          {room.lastMessage}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{room.lastTime}</span>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />
                            {room.participants}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader className="flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{getRoomIcon(selectedRoom.type)}</div>
              <div>
                <CardTitle>{selectedRoom.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getBadgeColor(selectedRoom.type)}>
                    {selectedRoom.type === "teacher" ? "Teacher Chat" : 
                     selectedRoom.type === "parent" ? "Parent Group" : 
                     "Announcements"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {selectedRoom.participants} participants
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
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

            {/* Message Input */}
            <div className="p-4 border-t border-border">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;