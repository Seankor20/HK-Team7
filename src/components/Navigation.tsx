import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  BookOpen, 
  Trophy, 
  MessageCircle, 
  User 
} from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/quiz", label: "Learning Quiz", icon: BookOpen },
    { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { path: "/chat", label: "Chat", icon: MessageCircle },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 md:top-0 md:bottom-auto md:left-0 md:right-auto md:w-64 md:h-screen md:border-t-0 md:border-r">
      <div className="flex md:flex-col md:h-full">
        <div className="hidden md:block p-6 border-b border-border">
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            KidsLearn
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Learning Together
          </p>
        </div>
        
        <div className="flex w-full md:flex-col md:flex-1 md:p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex-1 flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 p-3 md:p-3 md:rounded-lg transition-all duration-200",
                  isActive 
                    ? "text-primary bg-primary/10 md:bg-gradient-primary md:text-primary-foreground md:shadow-glow" 
                    : "text-muted-foreground hover:text-primary hover:bg-muted md:hover:bg-primary/5"
                )}
              >
                <Icon className="h-5 w-5 md:h-4 md:w-4" />
                <span className="text-xs md:text-sm font-medium">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;