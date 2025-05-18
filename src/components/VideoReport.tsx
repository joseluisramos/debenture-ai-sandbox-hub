
import { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const VideoReport = () => {
  const { reportVisible, setReportVisible } = useFinance();
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = () => {
    setIsLoading(true);
    
    // Simulate generation delay
    setTimeout(() => {
      setIsLoading(false);
      setReportVisible(true);
    }, 1500);
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-gsb-secondary text-white">
        <CardTitle className="text-lg">6. Personalized Video-Audio Portfolio Report</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {!reportVisible ? (
          <div className="flex flex-col items-center justify-center p-6">
            <p className="mb-4 text-center">
              Generate a personalized report based on your current portfolio and simulation results.
            </p>
            <Button 
              onClick={handleGenerateReport}
              disabled={isLoading}
              className="bg-gsb-primary hover:bg-gsb-secondary"
            >
              {isLoading ? "Generating Report..." : "Generate Report"}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="font-medium mb-2">Your Personalized Portfolio Report</p>
            <video controls width="100%" className="rounded-md" src="public/demo-report.mp4">
              Your browser does not support the video tag.
            </video>
            <p className="text-sm text-gsb-muted">
              This demonstration video shows how AI-generated reports can provide personalized insights into your portfolio.
            </p>
            <Button
              variant="outline"
              onClick={() => setReportVisible(false)}
              className="text-gsb-primary border-gsb-primary"
            >
              Close Report
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoReport;
