import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Award, Clock, TrendingUp } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import castle from "@/assets/castle.png";

interface user {
  id: number;
  name: string;
  avatar: string;
  score: number;
  streak: number;
  testsCompleted: number;
  onTimeSubmissions: number;
  rank: number;
}

const students: user[] = [
  {
    id: 1,
    name: "Chi Wing Wang",
    avatar: "",
    score: 945,
    streak: 12,
    testsCompleted: 28,
    onTimeSubmissions: 26,
    rank: 1
  },
  {
    id: 2,
    name: "Rainbow Cheng",
    avatar: "",
    score: 920,
    streak: 8,
    testsCompleted: 25,
    onTimeSubmissions: 24,
    rank: 2
  },
  {
    id: 3,
    name: "Cici Leung",
    avatar: "",
    score: 895,
    streak: 15,
    testsCompleted: 24,
    onTimeSubmissions: 22,
    rank: 3
  },
  {
    id: 4,
    name: "Yoyo Pan",
    avatar: "",
    score: 880,
    streak: 6,
    testsCompleted: 23,
    onTimeSubmissions: 21,
    rank: 4
  },
  {
    id: 5,
    name: "Ava Wang",
    avatar: "",
    score: 865,
    streak: 10,
    testsCompleted: 22,
    onTimeSubmissions: 20,
    rank: 5
  },
  {
    id: 6,
    name: "Sean Pong",
    avatar: "",
    score: 850,
    streak: 7,
    testsCompleted: 21,
    onTimeSubmissions: 19,
    rank: 6
  }
];

const Leaderboard = () => {
  const { t } = useI18n();
  
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
        return <Badge className="bg-warning text-warning-foreground">{t('leaderboard.champion')}</Badge>;
      case 2:
        return <Badge className="bg-muted text-muted-foreground">{t('leaderboard.runnerUp')}</Badge>;
      case 3:
        return <Badge className="bg-accent text-accent-foreground">{t('leaderboard.thirdPlace')}</Badge>;
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
          {t('leaderboard.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('leaderboard.subtitle')}
        </p>
      </div>

      {/* Your Child's Stats */}
      {myChild && (
        <Card className="border-primary/20 bg-gradient-primary/5 shadow-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {t('leaderboard.yourChildProgress')}
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
                <p className="text-muted-foreground">{t('leaderboard.rankOutOf', { rank: myChild.rank, total: students.length })}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{myChild.score}</div>
                <p className="text-sm text-muted-foreground">{t('leaderboard.totalPoints')}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-secondary">{myChild.streak}</div>
                <p className="text-xs text-muted-foreground">{t('leaderboard.dayStreak')}</p>
              </div>
              <div>
                <div className="text-lg font-semibold text-accent">{myChild.testsCompleted}</div>
                <p className="text-xs text-muted-foreground">{t('leaderboard.testsDone')}</p>
              </div>
              <div>
                <div className="text-lg font-semibold text-success">{myChild.onTimeSubmissions}</div>
                <p className="text-xs text-muted-foreground">{t('leaderboard.onTime')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mountain Castle Leaderboard */}
      <div className="relative mb-8">
        {/* Castle Title */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-blue-700 mb-2">🏰 Castle Leaderboard 👑</h2>
          <p className="text-sm text-muted-foreground">King on top • Others climbing to reach the castle</p>
        </div>
        
        {/* Castle Background */}
        <div className="relative h-[500px] bg-gradient-to-b from-blue-900 via-blue-700 via-blue-500 to-blue-300 rounded-t-3xl overflow-hidden shadow-2xl">
          {/* Sky with stars */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-blue-800 to-blue-600"></div>
          
          {/* Decorative clouds */}
          <div className="absolute top-8 left-8 opacity-70 animate-pulse">
            <div className="w-20 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-lg"></div>
            <div className="w-16 h-8 bg-white/60 backdrop-blur-sm rounded-full -mt-6 ml-3 shadow-md"></div>
          </div>
          <div className="absolute top-20 right-16 opacity-50 animate-pulse" style={{animationDelay: '1s'}}>
            <div className="w-24 h-12 bg-white/70 backdrop-blur-sm rounded-full shadow-lg"></div>
            <div className="w-18 h-9 bg-white/50 backdrop-blur-sm rounded-full -mt-8 ml-4 shadow-md"></div>
          </div>
          <div className="absolute top-32 left-1/2 opacity-40 animate-pulse" style={{animationDelay: '2s'}}>
            <div className="w-16 h-8 bg-white/60 backdrop-blur-sm rounded-full shadow-md"></div>
          </div>
          
          {/* Large Castle Background */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              {/* Castle base - very wide */}
              <div className="w-80 h-32 bg-gradient-to-b from-gray-400 via-gray-300 to-gray-200 border-4 border-gray-600 rounded-t-3xl shadow-2xl relative">
                {/* Castle entrance */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-gray-700 rounded-t border-2 border-gray-800"></div>
                {/* Windows */}
                <div className="absolute top-8 left-8 w-6 h-4 bg-blue-200 rounded border border-gray-500"></div>
                <div className="absolute top-8 right-8 w-6 h-4 bg-blue-200 rounded border border-gray-500"></div>
                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-blue-200 rounded border border-gray-500"></div>
              </div>
              
              {/* Castle towers */}
              <div className="flex justify-center gap-4 -mt-2">
                <div className="w-16 h-24 bg-gradient-to-b from-gray-200 to-gray-400 rounded-t-2xl border-2 border-gray-600 shadow-xl"></div>
                <div className="w-20 h-32 bg-gradient-to-b from-gray-100 to-gray-300 rounded-t-3xl border-2 border-gray-600 shadow-2xl relative">
                  {/* Main tower window */}
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-blue-200 rounded border border-gray-500"></div>
                  {/* Main tower flag */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 shadow-md"></div>
                    <div className="w-6 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-sm shadow-md"></div>
                  </div>
                </div>
                <div className="w-16 h-24 bg-gradient-to-b from-gray-200 to-gray-400 rounded-t-2xl border-2 border-gray-600 shadow-xl"></div>
              </div>
              
              {/* Castle glow effect */}
              <div className="absolute inset-0 bg-yellow-200/20 rounded-full blur-2xl scale-150"></div>
            </div>
          </div>

          {/* Mountain path */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-700 to-transparent"></div>
          
          {/* Enhanced climbing path indicators with glow effects */}
          <div className="absolute left-1/4 top-32 w-2 h-10 bg-gradient-to-b from-green-400 to-green-600 rounded-full opacity-80 shadow-lg shadow-green-400/50"></div>
          <div className="absolute right-1/4 top-80 w-2 h-10 bg-gradient-to-b from-green-400 to-green-600 rounded-full opacity-80 shadow-lg shadow-green-400/50"></div>
          <div className="absolute left-1/4 top-160 w-2 h-10 bg-gradient-to-b from-green-400 to-green-600 rounded-full opacity-80 shadow-lg shadow-green-400/50"></div>
          <div className="absolute right-1/4 top-240 w-2 h-10 bg-gradient-to-b from-green-400 to-green-600 rounded-full opacity-80 shadow-lg shadow-green-400/50"></div>
          <div className="absolute left-1/4 top-320 w-2 h-10 bg-gradient-to-b from-green-400 to-green-600 rounded-full opacity-80 shadow-lg shadow-green-400/50"></div>
          <div className="absolute right-1/4 top-400 w-2 h-10 bg-gradient-to-b from-green-400 to-green-600 rounded-full opacity-80 shadow-lg shadow-green-400/50"></div>
          
          {/* Floating achievement orbs */}
          <div className="absolute left-1/6 top-48 w-3 h-3 bg-yellow-300 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute right-1/6 top-120 w-2 h-2 bg-blue-300 rounded-full animate-pulse opacity-60" style={{animationDelay: '1s'}}></div>
          <div className="absolute left-1/6 top-200 w-2 h-2 bg-purple-300 rounded-full animate-pulse opacity-60" style={{animationDelay: '2s'}}></div>
          <div className="absolute right-1/6 top-280 w-3 h-3 bg-pink-300 rounded-full animate-pulse opacity-60" style={{animationDelay: '0.5s'}}></div>
          
          {/* Students positioned around the castle - King on top, others climbing */}
          {students.slice(0, 6).map((student, index) => {
            const level = index + 1;
            const isTop3 = level <= 3;
            
            let topPosition, horizontalPosition;
            
            if (level === 1) {
              // King (1st rank) - standing on top of the castle
              topPosition = 80; // On top of main tower
              horizontalPosition = 'left-1/2'; // Center of castle
            } else if (level === 2) {
              // 2nd rank - right below the king
              topPosition = 120; // Below the king
              horizontalPosition = 'left-1/2'; // Center, below king
            } else {
              // Others (3rd-6th) - climbing up to the castle
              const climbLevel = level - 2; // 1, 2, 3, 4
              topPosition = 160 + (climbLevel - 1) * 40; // 160, 200, 240, 280
              
              // Alternate sides for climbers
              horizontalPosition = climbLevel % 2 === 1 ? 'left-1/6' : 'right-1/6';
            }
            
            return (
              <div 
                key={student.id}
                className={`absolute ${horizontalPosition} transform -translate-x-1/2 text-center`}
                style={{ top: `${topPosition}px` }}
              >
                {/* Enhanced Student avatar with royal styling for king */}
                <div className={`relative ${level === 1 ? 'scale-175' : isTop3 ? 'scale-150' : 'scale-125'} transition-all duration-300 hover:scale-110`}>
                  {/* Avatar with enhanced borders and effects */}
                  <div className="relative">
                    <Avatar className={`mx-auto border-4 ${
                      level === 1 ? 'h-20 w-20 border-yellow-400 shadow-2xl shadow-yellow-400/50 bg-gradient-to-br from-yellow-100 to-yellow-300' :
                      level === 2 ? 'h-18 w-18 border-gray-300 shadow-xl shadow-gray-300/50 bg-gradient-to-br from-gray-100 to-gray-300' :
                      level === 3 ? 'h-16 w-16 border-amber-600 shadow-lg shadow-amber-600/50 bg-gradient-to-br from-amber-100 to-amber-300' :
                      'h-16 w-16 border-green-300 shadow-md bg-gradient-to-br from-green-100 to-green-300'
                    } transition-all duration-300 hover:shadow-2xl`}>
                      <AvatarImage src={student.avatar} alt={student.name} />
                      <AvatarFallback className={`text-lg font-bold ${
                        level === 1 ? 'bg-gradient-to-br from-yellow-100 to-yellow-300' :
                        level === 2 ? 'bg-gradient-to-br from-gray-100 to-gray-300' :
                        level === 3 ? 'bg-gradient-to-br from-amber-100 to-amber-300' :
                        'bg-gradient-to-br from-green-100 to-green-300'
                      }`}>
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Enhanced rank badge with glow */}
                    <div className="absolute -top-3 -right-3 transform hover:scale-110 transition-transform">
                      {getRankIcon(student.rank)}
                    </div>
                    
                    {/* Special crown for the king */}
                    {level === 1 && (
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-3xl animate-pulse">
                        👑
                      </div>
                    )}
                    
                    {/* Floating particles for top 3 */}
                    {isTop3 && (
                      <div className="absolute -top-2 -left-2 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
                    )}
                  </div>
                  
                  {/* Enhanced score and rank display */}
                  <div className="mt-3 text-center">
                    <div className="mt-1 text-xs font-medium text-white bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
                      #{level}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Enhanced mountain base with grass and flowers */}
        <div className="h-16 bg-gradient-to-t from-green-600 via-green-500 to-green-400 rounded-b-3xl relative overflow-hidden">
          {/* Grass texture */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-green-700 to-green-500"></div>
          
          {/* Decorative flowers */}
          <div className="absolute bottom-2 left-1/4 w-2 h-2 bg-yellow-300 rounded-full"></div>
          <div className="absolute bottom-3 left-1/4 w-1 h-1 bg-green-600 rounded-full"></div>
          <div className="absolute bottom-2 right-1/4 w-2 h-2 bg-pink-300 rounded-full"></div>
          <div className="absolute bottom-3 right-1/4 w-1 h-1 bg-green-600 rounded-full"></div>
          <div className="absolute bottom-2 left-1/2 w-2 h-2 bg-blue-300 rounded-full"></div>
          <div className="absolute bottom-3 left-1/2 w-1 h-1 bg-green-600 rounded-full"></div>
        </div>
        
        {/* Enhanced motivational message */}
        <div className="text-center mt-6 p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 rounded-2xl border-2 border-blue-200 shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">🏰</span>
            <span className="text-2xl">👑</span>
            <span className="text-2xl">⭐</span>
          </div>
          <p className="text-sm font-medium text-gray-700">
            {t('leaderboard.subtitle')} Climb to become the next king of the castle!
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            The throne awaits the worthy! 🎯
          </p>
        </div>
      </div>

      {/* Full Leaderboard - Gamified Table */}
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
        <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-300" />
            {t('leaderboard.allLearners')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {students.map((student, index) => (
              <div 
                key={student.id}
                className={`flex items-center gap-4 p-4 hover:bg-green-100/50 transition-all duration-200 ${
                  student.name === "Your Child" ? "bg-primary/10 border-l-4 border-primary shadow-md" : ""
                } ${
                  index === 0 ? "bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-400" :
                  index === 1 ? "bg-gradient-to-r from-gray-50 to-gray-100 border-l-4 border-gray-400" :
                  index === 2 ? "bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-400" :
                  "hover:shadow-sm"
                }`}
              >
                {/* Rank with special styling for top 3 */}
                <div className="w-12 flex justify-center">
                  <div className={`relative ${index < 3 ? 'scale-110' : ''}`}>
                    {getRankIcon(student.rank)}
                    {index < 3 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
                
                {/* Avatar with rank-based border */}
                <Avatar className={`h-12 w-12 border-2 ${
                  index === 0 ? 'border-yellow-400 shadow-lg shadow-yellow-400/30' :
                  index === 1 ? 'border-gray-400 shadow-lg shadow-gray-400/30' :
                  index === 2 ? 'border-amber-500 shadow-lg shadow-amber-500/30' :
                  'border-green-300'
                }`}>
                  <AvatarImage src={student.avatar} alt={student.name} />
                  <AvatarFallback className="font-bold text-sm">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                {/* Student info with progress bar */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{student.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-500' :
                          index === 2 ? 'bg-amber-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${(student.score / students[0].score) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {Math.round((student.score / students[0].score) * 100)}%
                    </span>
                  </div>
                </div>
                
                {/* Score and stats */}
                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    index === 0 ? 'text-yellow-600' :
                    index === 1 ? 'text-gray-600' :
                    index === 2 ? 'text-amber-600' :
                    'text-primary'
                  }`}>
                    {student.score}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {student.testsCompleted} {t('leaderboard.tests')} • {student.streak} {t('leaderboard.dayStreak')}
                  </div>
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