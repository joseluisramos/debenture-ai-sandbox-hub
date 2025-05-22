
import { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LiquidityForecasting = () => {
  const { clientPosition, redeemPercentage, updateRedeemPercentage } = useFinance();
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [rebalanceRecommendation, setRebalanceRecommendation] = useState<string | null>(null);

  // Run forecast based on redemption percentage
  const runForecast = () => {
    const currentValue = clientPosition.currentMarketValue;
    const redeemAmount = currentValue * (redeemPercentage / 100);
    const remainingValue = currentValue - redeemAmount;
    const data = [];
    
    // Generate random forecasted values
    for (let month = 0; month <= 12; month++) {
      // Add some random variation to each month (-2% to +2% per year, divided by 12 for monthly)
      const randomModifier = 1 + (Math.random() * 0.04 - 0.02) * (month / 12);
      const forecastValue = remainingValue * randomModifier;
      
      // Calculate cash position (starting with redeemed amount)
      // This decreases slightly over time to simulate spending
      const cashPosition = redeemAmount * (1 - month * 0.01);
      
      data.push({
        month,
        portfolio: Math.round(forecastValue),
        cash: Math.round(cashPosition > 0 ? cashPosition : 0)
      });
    }
    
    setForecastData(data);
    
    // Generate rebalance recommendation
    const finalMonth = data[data.length - 1];
    const initialValue = data[0].portfolio;
    const finalValue = finalMonth.portfolio;
    const percentChange = ((finalValue - initialValue) / initialValue) * 100;
    
    if (percentChange < -3) {
      // Calculate how much to move to cash (money market fund)
      const movePercentage = Math.round(Math.abs(percentChange));
      setRebalanceRecommendation(
        `Based on the negative forecast (${percentChange.toFixed(1)}%), recommend moving ${movePercentage}% from debentures into a money-market fund for capital preservation.`
      );
    } else if (percentChange > 4) {
      setRebalanceRecommendation(
        `Strong positive forecast (+${percentChange.toFixed(1)}%). Recommend maintaining current allocation with minimal cash holdings.`
      );
    } else {
      setRebalanceRecommendation(
        `Moderate forecast (${percentChange.toFixed(1)}%). Recommend maintaining a balanced 85/15 split between debentures and cash reserves.`
      );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-gsb-headerBg text-gsb-primary">
        <CardTitle className="text-lg">5. Liquidity Forecasting & Rebalancing</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">% Redeem</label>
              <span className="text-sm">{redeemPercentage.toFixed(0)}%</span>
            </div>
            <Slider
              value={[redeemPercentage]}
              min={0}
              max={100}
              step={1}
              onValueChange={([value]) => updateRedeemPercentage(value)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gsb-muted">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gsb-muted mb-2">
              Redeem amount: £{Math.round((clientPosition.currentMarketValue * redeemPercentage) / 100).toLocaleString()}
            </p>
            <Button 
              onClick={runForecast}
              className="bg-gsb-primary hover:bg-gsb-secondary"
            >
              Run Forecast
            </Button>
          </div>
        </div>
        
        {forecastData.length > 0 && (
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-4">12-Month Cash Flow Projection</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={forecastData} barGap={0} barCategoryGap={10}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" label={{ value: 'Month', position: 'bottom', offset: 0 }} />
                    <YAxis 
                      label={{ value: 'Value (£)', angle: -90, position: 'insideLeft' }}
                      domain={[0, 'auto']}
                      tickFormatter={(value) => `£${Math.round(value / 1000)}k`}
                    />
                    <Tooltip
                      formatter={(value) => [`£${value.toLocaleString()}`, undefined]}
                      labelFormatter={(label) => `Month ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="portfolio" name="Portfolio Value" fill="#0056b8" />
                    <Bar dataKey="cash" name="Cash Position" fill="#008450" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {rebalanceRecommendation && (
              <div className="bg-gsb-accent p-4 rounded-md">
                <h3 className="font-medium mb-2">Rebalancing Recommendation:</h3>
                <p>{rebalanceRecommendation}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiquidityForecasting;
