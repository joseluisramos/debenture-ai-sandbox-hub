import { useState, useEffect } from "react";
import { useFinance } from "@/context/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MacroSimulator = () => {
  const { 
    clientPosition, 
    macroSettings, 
    updateMacroSettings, 
    resetToClientDefaults,
    analysisRecommendation,
    setAnalysisRecommendation,
    incrementHighVolatility,
    saveAnalysis
  } = useFinance();
  
  const [projectionData, setProjectionData] = useState<any[]>([]);

  // Run simulation based on macro settings
  const runSimulation = () => {
    const baselineValue = clientPosition.currentMarketValue;
    const data = [];
    
    // Check if simulation has high volatility
    const isHighVolatility = Math.abs(macroSettings.interestRateShift) > 1 || 
                           macroSettings.inflationRate > 7 ||
                           Math.abs(macroSettings.gdpGrowthProjection) > 4 ||
                           macroSettings.oilPriceVolatility > 80;
    
    if (isHighVolatility) {
      incrementHighVolatility();
    }
    
    // Create 5 year projection data
    for (let year = 0; year <= 5; year++) {
      // Calculate baseline based on formula
      const baseline = baselineValue * Math.pow((1 + 
        0.01 * macroSettings.interestRateShift - 
        0.005 * macroSettings.inflationRate + 
        0.003 * macroSettings.gdpGrowthProjection - 
        0.002 * (macroSettings.oilPriceVolatility / 100)), year);
      
      // Apply modifiers for optimistic and pessimistic scenarios
      const optimistic = baseline * Math.pow(1.005, year);
      const pessimistic = baseline * Math.pow(0.995, year);
      
      data.push({
        year,
        baseline: Math.round(baseline),
        optimistic: Math.round(optimistic),
        pessimistic: Math.round(pessimistic),
      });
    }
    
    setProjectionData(data);
  };
  
  // Run initial simulation on mount
  useEffect(() => {
    runSimulation();
  }, []);
  
  // Handle reset to client defaults
  const handleReset = () => {
    resetToClientDefaults();
    // Simulation will run in useEffect when macroSettings changes
  };
  
  // Re-run simulation when macro settings change
  useEffect(() => {
    runSimulation();
  }, [macroSettings]);
  
  // Generate recommendations based on simulation
  const getRecommendations = () => {
    const finalYear = projectionData[projectionData.length - 1];
    
    if (!finalYear) return;
    
    // Generate recommendation based on simulation outcomes
    if (finalYear.pessimistic < clientPosition.currentMarketValue) {
      setAnalysisRecommendation(
        "Analysis Recommendation: Based on the simulation, there is a risk of negative returns. Consider diversifying into more stable instruments or reducing exposure to bond market volatility."
      );
    } else if (finalYear.baseline > clientPosition.currentMarketValue * 1.2) {
      setAnalysisRecommendation(
        "Analysis Recommendation: The simulation indicates strong potential growth above market average. Consider maintaining or increasing your position in these debentures."
      );
    } else {
      setAnalysisRecommendation(
        "Analysis Recommendation: Results show moderate growth potential in line with market expectations. Consider a balanced approach with some diversification into complementary products."
      );
    }
  };
  
  // Save current analysis to local storage
  const handleSaveAnalysis = () => {
    const analysis = {
      macroSettings,
      projectionData,
      recommendation: analysisRecommendation,
      timestamp: new Date().toISOString()
    };
    
    saveAnalysis(analysis);
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-gsb-headerBg text-gsb-primary">
        <CardTitle className="text-lg">1. Dynamic Macro Scenario Simulator</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="text-gsb-primary border-gsb-primary"
          >
            Reset to Client Defaults
          </Button>
        </div>
        
        <div className="space-y-4">
          {/* Interest Rate Shift Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Interest Rate Shift</label>
              <span className="text-sm">{macroSettings.interestRateShift.toFixed(1)}%</span>
            </div>
            <Slider
              value={[macroSettings.interestRateShift]}
              min={-2}
              max={2}
              step={0.1}
              onValueChange={([value]) => updateMacroSettings({ interestRateShift: value })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gsb-muted">
              <span>-2%</span>
              <span>+2%</span>
            </div>
          </div>
          
          {/* Inflation Rate Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Inflation Rate</label>
              <span className="text-sm">{macroSettings.inflationRate.toFixed(1)}%</span>
            </div>
            <Slider
              value={[macroSettings.inflationRate]}
              min={0}
              max={10}
              step={0.1}
              onValueChange={([value]) => updateMacroSettings({ inflationRate: value })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gsb-muted">
              <span>0%</span>
              <span>10%</span>
            </div>
          </div>
          
          {/* GDP Growth Projection Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">GDP Growth Projection</label>
              <span className="text-sm">{macroSettings.gdpGrowthProjection.toFixed(1)}%</span>
            </div>
            <Slider
              value={[macroSettings.gdpGrowthProjection]}
              min={-2}
              max={6}
              step={0.1}
              onValueChange={([value]) => updateMacroSettings({ gdpGrowthProjection: value })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gsb-muted">
              <span>-2%</span>
              <span>+6%</span>
            </div>
          </div>
          
          {/* Oil Price Volatility Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Oil Price Volatility</label>
              <span className="text-sm">{macroSettings.oilPriceVolatility < 33 ? 'Low' : macroSettings.oilPriceVolatility < 66 ? 'Medium' : 'High'}</span>
            </div>
            <Slider
              value={[macroSettings.oilPriceVolatility]}
              min={0}
              max={100}
              step={1}
              onValueChange={([value]) => updateMacroSettings({ oilPriceVolatility: value })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gsb-muted">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={runSimulation}
            className="bg-gsb-primary hover:bg-gsb-secondary"
          >
            Run Simulation
          </Button>
        </div>
        
        {projectionData.length > 0 && (
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-4">5-Year Projection (£)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={projectionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" label={{ value: 'Years', position: 'bottom', offset: 0 }} />
                    <YAxis 
                      label={{ value: 'Value (£)', angle: -90, position: 'insideLeft' }}
                      domain={['auto', 'auto']}
                      tickFormatter={(value) => `£${Math.round(value / 1000)}k`}
                    />
                    <Tooltip
                      formatter={(value) => [`£${value.toLocaleString()}`, undefined]}
                      labelFormatter={(label) => `Year ${label}`}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="baseline" stroke="#0056b8" name="Baseline" strokeWidth={2} />
                    <Line type="monotone" dataKey="optimistic" stroke="#008450" name="Optimistic" strokeWidth={2} />
                    <Line type="monotone" dataKey="pessimistic" stroke="#D13438" name="Pessimistic" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                onClick={getRecommendations}
                className="text-gsb-primary border-gsb-primary"
              >
                Get Recommendations
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSaveAnalysis}
                className="text-gsb-primary border-gsb-primary"
              >
                Save Analysis
              </Button>
            </div>
            
            {analysisRecommendation && (
              <div className="bg-gsb-accent p-4 rounded-md">
                <p>{analysisRecommendation}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MacroSimulator;
