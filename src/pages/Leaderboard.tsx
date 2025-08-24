import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Award, Clock, TrendingUp } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import castle from "../assets/castle.jpg";
import { useEffect, useState } from "react";

// Import avatar images
import ciciAvatar from "@/assets/cici2.png";
import yoyoAvatar from "@/assets/yoyo2.png";
import avaAvatar from "@/assets/ava2.png";
import shaunAvatar from "@/assets/shaun.png";
import angelAvatar from "@/assets/angel2.png";
import kingAvatar from "@/assets/avatar_king.png";
import girl from "@/assets/girl.png";

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
  
const Leaderboard = () => {
  const { t } = useI18n();
  
  // Animation state for level 6 student
  const [level6Score, setLevel6Score] = useState(100);
  const [level6Position, setLevel6Position] = useState('75%');
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Start animation after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
      setLevel6Score(180);
              setLevel6Position('30%');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Create students array with dynamic ranking
  const createStudentsArray = () => {
    const baseStudents = [
      {
        id: 1,
        name: "Chi Wing Wang",
        avatar: kingAvatar,
        score: 945,
        streak: 12,
        testsCompleted: 28,
        onTimeSubmissions: 26
      },
      {
        id: 2,
        name: "Rainbow Cheng",
        avatar: girl,
        score: 920,
        streak: 8,
        testsCompleted: 25,
        onTimeSubmissions: 24
      },
      {
        id: 3,
        name: "Cici Leung",
        avatar: ciciAvatar,
        score: 895,
        streak: 15,
        testsCompleted: 24,
        onTimeSubmissions: 22
      },
      {
        id: 4,
        name: "Yoyo Pan",
        avatar: yoyoAvatar,
        score: 250,
        streak: 6,
        testsCompleted: 23,
        onTimeSubmissions: 21
      },
      {
        id: 5,
        name: "Ava Wang",
        avatar: avaAvatar,
        score: 200,
        streak: 10,
        testsCompleted: 22,
        onTimeSubmissions: 20
      },
      {
        id: 6,
        name: "Shaun Pong",
        avatar: shaunAvatar,
        score: level6Score,
        streak: 7,
        testsCompleted: 21,
        onTimeSubmissions: 19
      },
      {
        id: 7,
        name: "Angel Pang",
        avatar: angelAvatar,
        score: 140,
        streak: 10,
        testsCompleted: 22,
        onTimeSubmissions: 20
      }
    ];
    
    // Sort by score (highest to lowest) and assign ranks
    return baseStudents
      .sort((a, b) => b.score - a.score)
      .map((student, index) => ({
        ...student,
        rank: index + 1
      }));
  };
  
  const students = createStudentsArray();
  
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-accent" />;
      case 2:
        return <Medal className="h-6 w-6 text-muted-foreground" />;
      case 3:
        return <Award className="h-4 w-4 text-accent" />;
      default:
        return 
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

      {/* Mountain Castle Leaderboard */}
      <div className="relative mb-8">
        {/* Castle Title */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-blue-700 mb-2">{t('leaderboard.castleTitle')}</h2>
          <p className="text-sm text-muted-foreground">{t('leaderboard.castleSubtitle')}</p>
        </div>
        
        {/* Castle Background */}
        <div className="relative h-[500px] bg-gradient-to-b from-blue-900 via-blue-700 via-blue-500 to-blue-300 rounded-3xl overflow-hidden shadow-2xl">
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
          
          <div className="absolute inset-0">
            <img 
              src={castle} 
              alt="Castle" 
              className="w-full h-full object-cover drop-shadow-2xl"
              style={{ filter: 'brightness(1.1) contrast(1.1)' }}
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-green-800 via-green-600 to-transparent"></div>
          
          <div className="absolute left-1/4 top-32 w-3 h-12 bg-gradient-to-b from-green-400 to-green-600 rounded-full opacity-90 shadow-lg shadow-green-400/50 animate-pulse"></div>
          <div className="absolute right-1/4 top-80 w-3 h-12 bg-gradient-to-b from-green-400 to-green-600 rounded-full opacity-90 shadow-lg shadow-green-400/50 animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute left-1/4 top-160 w-3 h-12 bg-gradient-to-b from-green-400 to-green-600 rounded-full opacity-90 shadow-lg shadow-green-400/50 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute right-1/4 top-240 w-3 h-12 bg-gradient-to-b from-green-400 to-green-600 rounded-full opacity-90 shadow-lg shadow-green-400/50 animate-pulse" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute left-1/4 top-320 w-3 h-12 bg-gradient-to-b from-green-400 to-green-600 rounded-full opacity-90 shadow-lg shadow-green-400/50 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute right-1/4 top-400 w-3 h-12 bg-gradient-to-b from-green-400 to-green-600 rounded-full opacity-90 shadow-lg shadow-green-400/50 animate-pulse" style={{animationDelay: '2.5s'}}></div>
          
          <div className="absolute left-1/3 top-200 w-2 h-8 bg-gradient-to-b from-green-300 to-green-500 rounded-full opacity-70 shadow-md shadow-green-300/40"></div>
          <div className="absolute right-1/3 top-280 w-2 h-8 bg-gradient-to-b from-green-300 to-green-500 rounded-full opacity-70 shadow-md shadow-green-300/40"></div>
          <div className="absolute left-1/3 top-360 w-2 h-8 bg-gradient-to-b from-green-300 to-green-500 rounded-full opacity-70 shadow-md shadow-green-300/40"></div>
          
          <div className="absolute left-1/6 top-48 w-4 h-4 bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full animate-pulse opacity-80 shadow-lg shadow-yellow-300/50"></div>
          <div className="absolute right-1/6 top-120 w-3 h-3 bg-gradient-to-r from-blue-300 to-blue-400 rounded-full animate-pulse opacity-80 shadow-lg shadow-blue-300/50" style={{animationDelay: '1s'}}></div>
          <div className="absolute left-1/6 top-200 w-3 h-3 bg-gradient-to-r from-purple-300 to-purple-400 rounded-full animate-pulse opacity-80 shadow-lg shadow-purple-300/50" style={{animationDelay: '2s'}}></div>
          <div className="absolute right-1/6 top-280 w-4 h-4 bg-gradient-to-r from-pink-300 to-pink-400 rounded-full animate-pulse opacity-80 shadow-lg shadow-pink-300/50" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute left-1/2 top-160 w-3 h-3 bg-gradient-to-r from-green-300 to-green-400 rounded-full animate-pulse opacity-80 shadow-lg shadow-green-300/50" style={{animationDelay: '1.5s'}}></div>
          
          <div className="absolute left-1/5 top-180 w-2 h-2 bg-gray-600 rounded-full opacity-60"></div>
          <div className="absolute right-1/5 top-220 w-1.5 h-1.5 bg-gray-500 rounded-full opacity-60"></div>
          <div className="absolute left-1/5 top-260 w-1.5 h-1.5 bg-gray-600 rounded-full opacity-60"></div>
          <div className="absolute right-1/5 top-300 w-2 h-2 bg-gray-500 rounded-full opacity-60"></div>
          
          <div className="absolute left-1/6 top-140 w-3 h-3 bg-green-700 rounded-full opacity-70"></div>
          <div className="absolute right-1/6 top-180 w-2.5 h-2.5 bg-green-700 rounded-full opacity-70"></div>
          <div className="absolute left-1/6 top-320 w-2.5 h-2.5 bg-green-700 rounded-full opacity-70"></div>
          <div className="absolute right-1/6 top-360 w-3 h-3 bg-green-700 rounded-full opacity-70"></div>
          
          {students.slice(0, 8).map((student, index) => {
            const currentRank = student.rank;
            const isTop3 = currentRank <= 3;
            
            let topPosition, horizontalPosition;
            
            if (currentRank === 1) {
              topPosition = '10%'; 
              horizontalPosition = '50%';
            } else if (currentRank === 2) {
              topPosition = '30%'; 
              horizontalPosition = '30%';
            } else if (currentRank === 3) {
              topPosition = '35%'; 
              horizontalPosition = '75%';
            } else if (currentRank === 4 ){
              topPosition = '55%'; 
              horizontalPosition = '25%';
            } else if (currentRank === 5) {
              topPosition = '75%'; 
              horizontalPosition = '10%'; 
            } else if (student.name === "Shaun Pong") {
              topPosition = '80%'; 
              horizontalPosition = level6Position; 
            } else if (student.name === "Angel Pang") {
              topPosition = '80%'; 
              horizontalPosition = '52%';
            } else {
              topPosition = '80%'; 
              horizontalPosition = '50%';
            }
            
            return (
              <div 
                key={student.id}
                className="absolute transform -translate-x-1/2 text-center"
                style={{ 
                  top: topPosition, 
                  left: horizontalPosition,
                  transition: 'all 1s ease-in-out'
                }}
              >
                {/* Enhanced Student avatar with royal styling for king */}
                                <div                 className={`relative transition-all duration-300 hover:scale-110 ${
                  'scale-100'
                }`}>
                  {/* Avatar with enhanced borders and effects */}
                  <div className="relative">
                    <Avatar className={`mx-auto border-4 ${
                      currentRank === 1 ? 'h-24 w-24 border-yellow-400 shadow-2xl shadow-yellow-400/50 bg-gradient-to-br from-yellow-100 to-yellow-300' :
                      currentRank === 2 ? 'h-20 w-20 border-gray-300 shadow-xl shadow-gray-300/50 bg-gradient-to-br from-gray-100 to-gray-300' :
                      currentRank === 3 ? 'h-16 w-16 border-amber-600 shadow-lg shadow-amber-600/50 bg-gradient-to-br from-amber-100 to-amber-300' :
                      currentRank === 4 ? 'h-16 w-16 border-green-400 shadow-md shadow-green-400/30 bg-gradient-to-br from-green-100 to-green-300' :
                      currentRank === 5 ? 'h-14 w-14 border-blue-400 shadow-md shadow-blue-400/30 bg-gradient-to-br from-blue-100 to-blue-300' :
                      'h-14 w-14 border-purple-400 shadow-md bg-gradient-to-br from-purple-100 to-purple-300'
                    } transition-all duration-300 hover:shadow-2xl`}>
                      <AvatarImage src={student.avatar} alt={student.name} />
                      <AvatarFallback className={`font-bold ${
                        currentRank === 1 ? 'text-2xl bg-gradient-to-br from-yellow-100 to-yellow-300' :
                        currentRank === 2 ? 'text-xl bg-gradient-to-br from-gray-100 to-gray-300' :
                        currentRank === 3 ? 'text-lg bg-gradient-to-br from-amber-100 to-amber-300' :
                        currentRank === 4 ? 'text-base bg-gradient-to-br from-green-100 to-green-300' :
                        currentRank === 5 ? 'text-sm bg-gradient-to-br from-blue-100 to-blue-300' :
                        'text-sm bg-gradient-to-br from-purple-100 to-purple-300'
                      }`}>
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Special crown for the king */}
                    {currentRank === 1 && (
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-3xl animate-pulse">
                        👑
                      </div>
                    )}
                    
                    {/* Floating particles for top 3 */}
                    {isTop3 && (
                      <div className="absolute -top-2 -left-2 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
                    )}
                  </div>
                  
                  {/* Trophy/Medal positioned between avatar and rank */}
                  <div className="mt-2 text-center">
                    <div className="text-xs font-medium text-white bg-black/30 backdrop-blur-sm rounded-full px-2 py-1 transition-all duration-1000">
                      #{currentRank} / {student.score}XP
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
    
        
        {/* Enhanced motivational message */}
        <div className="text-center mt-6 p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 rounded-2xl border-2 border-blue-200 shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">🏰</span>
            <span className="text-2xl">👑</span>
            <span className="text-2xl">⭐</span>
          </div>
          <p className="text-sm font-medium text-gray-700">
            {t('leaderboard.subtitle')} {t('leaderboard.climbToBecomeKing')}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {t('leaderboard.throneAwaits')}
          </p>
        </div>
      </div>

      {/* Full Leaderboard - Gamified Table */}
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50to-blue-50">
        <CardHeader className="bg-gradient-to-r from-green-600 rounded-t-md to-blue-600 text-white">
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
                <div className="w-12 flex justify-center">
                  <div className={`relative ${index < 3 ? 'scale-110' : ''}`}>
                    {getRankIcon(student.rank)}
                    {index < 3 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
                
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