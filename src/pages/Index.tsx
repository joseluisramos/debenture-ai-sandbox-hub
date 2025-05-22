
import { FinanceProvider } from "@/context/FinanceContext";
import ClientPositionCard from "@/components/ClientPositionCard";
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
            {/* Only showing Client Position card on initial view */}
            <div className="mb-6">
              <ClientPositionCard />
            </div>
          </div>
        </div>
      </div>
    </FinanceProvider>
  );
};

export default Index;
