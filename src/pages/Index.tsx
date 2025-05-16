
import { FinanceProvider } from "@/context/FinanceContext";
import ClientPositionCard from "@/components/ClientPositionCard";
import MacroSimulator from "@/components/MacroSimulator";
import FinancialChatbot from "@/components/FinancialChatbot";
import OpportunityAlerts from "@/components/OpportunityAlerts";
import RiskProfile from "@/components/RiskProfile";
import LiquidityForecasting from "@/components/LiquidityForecasting";
import VideoReport from "@/components/VideoReport";

const Index = () => {
  return (
    <FinanceProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-6 px-4">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-gsb-primary mb-2">Gibraltar Savings Bank</h1>
            <h2 className="text-lg text-gsb-secondary">AI-Powered Finance Playground</h2>
          </header>
          
          <div className="space-y-6">
            {/* Client Position */}
            <div className="mb-6">
              <ClientPositionCard />
            </div>
            
            {/* Two columns layout for interactive modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <MacroSimulator />
                <RiskProfile />
                <VideoReport />
              </div>
              <div className="space-y-6">
                <FinancialChatbot />
                <OpportunityAlerts />
                <LiquidityForecasting />
              </div>
            </div>
          </div>
        </div>
      </div>
    </FinanceProvider>
  );
};

export default Index;
