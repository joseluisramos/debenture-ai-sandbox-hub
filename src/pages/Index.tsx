
import { FinanceProvider } from "@/context/FinanceContext";
import PortfolioSummary from "@/components/PortfolioSummary";
import DebtureDetails from "@/components/DebtureDetails";
import DashboardHeader from "@/components/DashboardHeader";
import WelcomeBar from "@/components/WelcomeBar";
import MacroSimulator from "@/components/MacroSimulator";
import OpportunityAlerts from "@/components/OpportunityAlerts";
import RiskProfile from "@/components/RiskProfile";
import VideoReport from "@/components/VideoReport";
import FinancialChatbot from "@/components/FinancialChatbot";
import LiquidityForecasting from "@/components/LiquidityForecasting";

const Index = () => {
  return (
    <FinanceProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <DashboardHeader />
        <WelcomeBar />
        
        <div className="container mx-auto py-6 px-4 flex-1">
          <div className="space-y-6">
            {/* Top Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <PortfolioSummary />
              <DebtureDetails />
            </div>
            
            {/* Second Row */}
            <div className="grid grid-cols-1 gap-6 mb-6">
              <MacroSimulator />
            </div>
            
            {/* Third Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <OpportunityAlerts />
              <RiskProfile />
            </div>
            
            {/* Fourth Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <VideoReport />
              <LiquidityForecasting />
            </div>
            
            {/* Fifth Row */}
            <div className="grid grid-cols-1 gap-6 mb-6">
              <FinancialChatbot />
            </div>
          </div>
        </div>
      </div>
    </FinanceProvider>
  );
};

export default Index;
