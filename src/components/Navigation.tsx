import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTranslation } from 'react-i18next';
import { useSupabase } from "@/hooks/use-supabase";
import { 
  Home, 
  BookOpen, 
  Trophy, 
  MessageCircle, 
  User,
  Map,
  PenTool
} from "lucide-react";
import LanguageSwitcher from './LanguageSwitcher';
import { Badge } from "./ui/badge";

const Navigation = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { user, profile } = useSupabase();

  // Check if user has access to homework management
  const canManageHomework = profile?.role === 'teacher' || profile?.role === 'ngo' || profile?.role === 'admin';

  const navItems = [
    { path: "/", label: t('common.home'), icon: Home },
    { path: "/pathway", label: "Learning Path", icon: Map },
    // Only show homework for teachers, NGOs, and admins
    ...(canManageHomework ? [{ path: "/homework", label: "Homework", icon: PenTool }] : []),
    { path: "/leaderboard", label: t('common.leaderboard'), icon: Trophy },
    { path: "/chat", label: t('common.chat'), icon: MessageCircle },
    { path: "/profile", label: t('common.profile'), icon: User },
  ];

  return (
    <>
      {/* Mobile Header with Language Switcher - Fixed at top */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-card border-b border-border z-40 p-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
              KidsLearn
            </h1>
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 md:top-0 md:bottom-auto md:left-0 md:right-auto md:w-64 md:h-screen md:border-t-0 md:border-r">
        <div className="flex md:flex-col md:h-full">
          {/* Desktop Header */}
          <div className="hidden md:block p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  KidsLearn
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Learning Together
                </p>
                {/* Role Display */}
                {profile && (
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">
                      Role: {profile.role || 'student'}
                    </Badge>
                  </div>
                )}
              </div>
              <LanguageSwitcher />
            </div>
          </div>
          
          {/* Navigation Items */}
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
    </>
  );
};

export default Navigation;