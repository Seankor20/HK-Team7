import { ReactNode } from "react";
import Navigation from "./Navigation";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />
      <main className="pb-16 md:pb-0 md:ml-64">
        {children}
      </main>
    </div>
  );
};

export default Layout;