
import { useFinance } from "@/context/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RiskProfile = () => {
  const { riskProfile } = useFinance();

  // Get color based on risk profile
  const getProfileColor = () => {
    switch (riskProfile) {
      case "Conservative":
        return "text-blue-600";
      case "Moderate":
        return "text-amber-600";
      case "Aggressive":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  // Get gauge percentage based on risk profile
  const getGaugePercentage = () => {
    switch (riskProfile) {
      case "Conservative":
        return "20%";
      case "Moderate":
        return "50%";
      case "Aggressive":
        return "80%";
      default:
        return "50%";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-gsb-primary text-white">
        <CardTitle className="text-lg">4. Real-Time Adaptive Risk Profile</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-full max-w-md">
            <div className="flex justify-between text-sm">
              <span>Conservative</span>
              <span>Moderate</span>
              <span>Aggressive</span>
            </div>
            
            {/* Risk gauge */}
            <div className="h-6 w-full bg-gray-200 rounded-full mt-1 relative">
              <div
                className="h-6 rounded-full bg-gradient-to-r from-blue-500 via-amber-500 to-red-500"
                style={{ width: "100%" }}
              />
              
              {/* Gauge indicator */}
              <div
                className="absolute top-0 -translate-x-1/2 transform"
                style={{ left: getGaugePercentage() }}
              >
                <div className="w-4 h-8 bg-white border-2 border-gray-800 rounded-full" />
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">Your current risk profile:</p>
            <h3 className={`text-2xl font-bold ${getProfileColor()}`}>
              {riskProfile}
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              {riskProfile === "Conservative"
                ? "Low risk tolerance, focusing on capital preservation."
                : riskProfile === "Moderate"
                ? "Balanced approach, seeking growth with reasonable risk."
                : "Higher risk tolerance, prioritizing growth opportunities."}
            </p>
            <p className="text-xs text-gray-400 mt-4">
              Your risk profile adapts based on your simulator usage and questions.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskProfile;
