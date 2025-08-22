import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Award, Clock, TrendingUp } from "lucide-react";

interface Student {
  id: number;
  name: string;
  avatar: string;
  score: number;
  streak: number;
  testsCompleted: number;
  onTimeSubmissions: number;
  rank: number;
}

const students: Student[] = [
  {
    id: 1,
    name: "Emma Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c?w=100&h=100&fit=crop&crop=face",
    score: 945,
    streak: 12,
    testsCompleted: 28,
    onTimeSubmissions: 26,
    rank: 1
  },
  {
    id: 2,
    name: "Noah Williams",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    score: 920,
    streak: 8,
    testsCompleted: 25,
    onTimeSubmissions: 24,
    rank: 2
  },
  {
    id: 3,
    name: "Olivia Brown",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    score: 895,
    streak: 15,
    testsCompleted: 24,
    onTimeSubmissions: 22,
    rank: 3
  },
  {
    id: 4,
    name: "Liam Davis",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    score: 880,
    streak: 6,
    testsCompleted: 23,
    onTimeSubmissions: 21,
    rank: 4
  },
  {
    id: 5,
    name: "Ava Miller",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c26ca924?w=100&h=100&fit=crop&crop=face",
    score: 865,
    streak: 10,
    testsCompleted: 22,
    onTimeSubmissions: 20,
    rank: 5
  },
  {
    id: 6,
    name: "Your Child",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    score: 850,
    streak: 7,
    testsCompleted: 21,
    onTimeSubmissions: 19,
    rank: 6
  }
];

const Leaderboard = () => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-warning" />;
      case 2:
        return <Medal className="h-6 w-6 text-muted-foreground" />;
      case 3:
        return <Award className="h-6 w-6 text-accent" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Badge className="bg-warning text-warning-foreground">🥇 Champion</Badge>;
      case 2:
        return <Badge className="bg-muted text-muted-foreground">🥈 Runner-up</Badge>;
      case 3:
        return <Badge className="bg-accent text-accent-foreground">🥉 Third Place</Badge>;
      default:
        return null;
    }
  };

  const myChild = students.find(student => student.name === "Your Child");

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Learning Leaderboard
        </h1>
        <p className="text-muted-foreground">
          Celebrating our amazing young learners!
        </p>
      </div>

      {/* Your Child's Stats */}
      {myChild && (
        <Card className="border-primary/20 bg-gradient-primary/5 shadow-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Your Child's Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarImage src={myChild.avatar} alt={myChild.name} />
                <AvatarFallback>{myChild.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{myChild.name}</h3>
                <p className="text-muted-foreground">Rank #{myChild.rank} out of {students.length}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{myChild.score}</div>
                <p className="text-sm text-muted-foreground">Total Points</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-secondary">{myChild.streak}</div>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
              <div>
                <div className="text-lg font-semibold text-accent">{myChild.testsCompleted}</div>
                <p className="text-xs text-muted-foreground">Tests Done</p>
              </div>
              <div>
                <div className="text-lg font-semibold text-success">{myChild.onTimeSubmissions}</div>
                <p className="text-xs text-muted-foreground">On Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {students.slice(0, 3).map((student, index) => (
          <Card 
            key={student.id} 
            className={`text-center ${
              index === 0 ? 'order-2 transform scale-105' : 
              index === 1 ? 'order-1' : 'order-3'
            } ${
              student.name === "Your Child" ? "border-primary/50 bg-primary/5" : ""
            }`}
          >
            <CardContent className="p-4">
              <div className="flex justify-center mb-2">
                {getRankIcon(student.rank)}
              </div>
              <Avatar className="h-12 w-12 mx-auto mb-2">
                <AvatarImage src={student.avatar} alt={student.name} />
                <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-sm mb-1">{student.name}</h3>
              <div className="text-lg font-bold text-primary">{student.score}</div>
              {getRankBadge(student.rank)}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>All Learners</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {students.map((student) => (
              <div 
                key={student.id}
                className={`flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors ${
                  student.name === "Your Child" ? "bg-primary/5 border-l-4 border-primary" : ""
                }`}
              >
                <div className="w-8 flex justify-center">
                  {getRankIcon(student.rank)}
                </div>
                
                <Avatar className="h-10 w-10">
                  <AvatarImage src={student.avatar} alt={student.name} />
                  <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="font-semibold">{student.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {student.onTimeSubmissions}/{student.testsCompleted} on time
                    </span>
                    <span>🔥 {student.streak} day streak</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">{student.score}</div>
                  <div className="text-xs text-muted-foreground">{student.testsCompleted} tests</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;