
import { Button } from "@/components/ui/button";
import { Bell, User } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardHeader = () => {
  return (
    <header className="bg-[#6b0d0d] text-white w-full">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <div className="h-10 w-10 flex items-center justify-center">
              <img 
                src="/lovable-uploads/d59127df-7730-412d-9679-d47eb083448b.png" 
                alt="GSB Logo" 
                className="h-8 w-8 object-contain"
              />
            </div>
            <div className="ml-2">
              <div className="font-serif font-bold text-lg">Gibraltar Savings Bank</div>
              <div className="text-xs">Est. 1882</div>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center ml-8 space-x-6">
            <Link to="/dashboard" className="hover:underline font-medium">Dashboard</Link>
            <span className="text-white/70 cursor-not-allowed font-medium">Accounts</span>
            <span className="text-white/70 cursor-not-allowed font-medium">Documents</span>
            <span className="text-white/70 cursor-not-allowed font-medium">Simulator</span>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-white/70 hover:bg-transparent cursor-not-allowed" disabled>
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white/70 hover:bg-transparent cursor-not-allowed" disabled>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4l3 3" />
            </svg>
          </Button>
          <div className="relative">
            <Button variant="ghost" size="icon" className="text-white/70 hover:bg-transparent cursor-not-allowed" disabled>
              <div className="h-6 w-6 rounded-full bg-white/70 text-[#6b0d0d] flex items-center justify-center font-medium">
                2
              </div>
            </Button>
          </div>
          <div className="bg-white text-[#6b0d0d] px-3 py-1 rounded-md font-medium">
            JL
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
