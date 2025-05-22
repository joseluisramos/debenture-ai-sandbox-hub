
import { FinanceProvider } from "@/context/FinanceContext";
import MacroSimulator from "@/components/MacroSimulator";
import OpportunityAlerts from "@/components/OpportunityAlerts";
import RiskProfile from "@/components/RiskProfile";
import VideoReport from "@/components/VideoReport";
import FinancialChatbot from "@/components/FinancialChatbot";
import LiquidityForecasting from "@/components/LiquidityForecasting";
import DashboardHeader from "@/components/DashboardHeader";

const Dashboard = () => {
  return (
    <FinanceProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <DashboardHeader />
        
        <div className="container mx-auto py-6 px-4 flex-1">
          <h1 className="text-2xl font-bold text-gsb-primary mb-6">Dashboard</h1>
          
          <div className="space-y-6">
            {/* First Row - MacroSimulator and FinancialChatbot side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <MacroSimulator />
              <FinancialChatbot />
            </div>
            
            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <OpportunityAlerts />
              <RiskProfile />
            </div>
            
            {/* Third Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <VideoReport />
              <LiquidityForecasting />
            </div>
          </div>
        </div>
      </div>
    </FinanceProvider>
  );
};

export default Dashboard;
