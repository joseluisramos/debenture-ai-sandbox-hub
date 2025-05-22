
import { FinanceProvider } from "@/context/FinanceContext";
import PortfolioSummary from "@/components/PortfolioSummary";
import DebtureDetails from "@/components/DebtureDetails";
import DashboardHeader from "@/components/DashboardHeader";
import WelcomeBar from "@/components/WelcomeBar";

const Index = () => {
  return (
    <FinanceProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <DashboardHeader />
        <WelcomeBar />
        
        <div className="container mx-auto py-6 px-4 flex-1">
          <div className="space-y-6">
            {/* Portfolio Summary Card */}
            <div className="mb-6">
              <PortfolioSummary />
            </div>
            
            {/* Debenture Details */}
            <div className="mb-6">
              <DebtureDetails />
            </div>
          </div>
        </div>
      </div>
    </FinanceProvider>
  );
};

export default Index;
