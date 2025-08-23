import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Search, ArrowRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

interface ChatRoom {
  id: string;
  name: string;
  type: "parent" | "teacher" | "general";
  last_message?: string;
  participant_count?: number;
  created_at: string;
}

const Chat = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomType, setNewRoomType] = useState<"parent" | "teacher" | "general">("parent");
  const [chatRoomsList, setChatRoomsList] = useState<ChatRoom[]>([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load current user and chat rooms

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        // Get current user from auth
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          // If no auth or JWT, redirect to home
          navigate("/", { replace: true });
          return;
        }
        setCurrentUser(user);
        // Load chat rooms
        const { data: rooms, error: roomsError } = await supabase
          .from('ChatRooms')
          .select('*')
          .order('created_at', { ascending: false });

        if (roomsError) {
          return;
        }
        setChatRoomsList(rooms || []);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [supabase]);

  const handleRoomSelect = (room: ChatRoom) => {
    navigate(`/chat/${room.id}`);
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim() || !currentUser) return;

    try {
      // Create new chat room
      const { data: newRoom, error: roomError } = await supabase
        .from('ChatRooms')
        .insert({
          name: newRoomName.trim(),
          type: newRoomType,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (roomError) {
        console.error('Error creating room:', roomError);
        throw roomError;
      }

      // Update local state
      setChatRoomsList(prev => [newRoom, ...prev]);
      setNewRoomName("");
      setNewRoomType("parent");
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating room:', error);
      setError('Failed to create chat room');
    }
  };

  const filteredRooms = chatRoomsList.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Only show loading spinner overlay, not a full page block
  const loadingOverlay = loading ? (
    <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-50">
      <div className="text-center">Loading chat rooms...</div>
    </div>
  ) : null;

  // Show error as a banner, but still render the main UI
  const errorBanner = error ? (
    <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">
      <p className="mb-2">Error: {error}</p>
      <Button onClick={() => window.location.reload()}>Retry</Button>
    </div>
  ) : null;

  return (
    <div className="p-4 md:p-8 relative">
      {loadingOverlay}
      <div className="max-w-4xl mx-auto">
        {errorBanner}
        <Card>
          <CardHeader>
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Chat Rooms
              </CardTitle>
            </div>
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
            <div className="space-y-6 p-4">
              {/* General Announcements Section */}
              <Card>
                <CardHeader className="pb-3">
              <CardTitle className="text-lg text-muted-foreground">📢&nbsp;&nbsp;General Announcements</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-1">
                    {filteredRooms.filter(room => room.type === "general").length === 0 && (
                      <div className="text-muted-foreground text-sm">No general announcement rooms yet.</div>
                    )}
                    {filteredRooms
                      .filter(room => room.type === "general")
                      .map((room) => (
                        <div
                          key={room.id}
                          onClick={() => handleRoomSelect(room)}
                          className="p-4 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 border border-transparent hover:border-border"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg">{room.name}</h3>
                              </div>
                              {room.last_message && (
                                <p className="text-sm text-muted-foreground mb-2">
                                  {room.last_message}
                                </p>
                              )}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>{room.participant_count || 0} participants</span>
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

              {/* Teacher Chat Section */}
              <Card>
                <CardHeader className="pb-3">
              <CardTitle className="text-lg text-muted-foreground">👩‍🏫&nbsp;&nbsp;Teacher Chat</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-1">
                    {filteredRooms.filter(room => room.type === "teacher").length === 0 && (
                      <div className="text-muted-foreground text-sm">No teacher chat rooms yet.</div>
                    )}
                    {filteredRooms
                      .filter(room => room.type === "teacher")
                      .map((room) => (
                        <div
                          key={room.id}
                          onClick={() => handleRoomSelect(room)}
                          className="p-4 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 border border-transparent hover:border-border"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg">{room.name}</h3>
                              </div>
                              {room.last_message && (
                                <p className="text-sm text-muted-foreground mb-2">
                                  {room.last_message}
                                </p>
                              )}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>{room.participant_count || 0} participants</span>
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

              {/* Parents Chat Section */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-muted-foreground">👨‍👩‍👧‍👦&nbsp;&nbsp;Parents Chat</CardTitle>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Create Room
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create New Parent Chat Room</DialogTitle>
                          <DialogDescription>
                            Create a new chat room for parents to discuss and share experiences.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="room-name">Room Name</Label>
                            <Input
                              id="room-name"
                              placeholder="Enter room name..."
                              value={newRoomName}
                              onChange={(e) => setNewRoomName(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreateRoom} disabled={!newRoomName.trim()}>
                            Create Room
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-1">
                    {filteredRooms.filter(room => room.type === "parent").length === 0 && (
                      <div className="text-muted-foreground text-sm">No parent chat rooms yet.</div>
                    )}
                    {filteredRooms
                      .filter(room => room.type === "parent")
                      .map((room) => (
                        <div
                          key={room.id}
                          onClick={() => handleRoomSelect(room)}
                          className="p-4 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 border border-transparent hover:border-border"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg">{room.name}</h3>
                              </div>
                              {room.last_message && (
                                <p className="text-sm text-muted-foreground mb-2">
                                  {room.last_message}
                                </p>
                              )}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>{room.participant_count || 0} participants</span>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;