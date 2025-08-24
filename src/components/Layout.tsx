import { ReactNode } from "react";
import Navigation from "./Navigation";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-background transition-colors duration-300">
      <Navigation />
      <main className="pt-16 pb-16 md:pt-0 md:pb-0 md:ml-64">
        {children}
      </main>
    </div>
  );
};

export default Layout;