
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const PortfolioSummary = () => {
  const portfolioData = [
    { name: "Ordinary Deposit", value: 23000, color: "#6b0d0d" },
    { name: "Debentures", value: 5000, color: "#d4af37" }
  ];
  
  const totalValue = portfolioData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="w-full border bg-white">
      <CardContent className="p-4">
        <h2 className="text-lg font-medium text-black mb-1">Portfolio Summary</h2>
        <p className="text-gray-600 mb-4 text-sm">Overview of your investments</p>
        
        <div className="flex flex-col items-center mb-4">
          <h3 className="text-4xl font-medium mb-4">£{totalValue.toLocaleString()}.00</h3>
          
          <div className="w-full h-56 max-w-xs mx-auto">
            <ChartContainer 
              config={{
                ordinary: { color: "#6b0d0d" },
                debentures: { color: "#d4af37" }
              }}
            >
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 mt-3">
            {portfolioData.map((entry, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 mr-2" 
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-sm">{entry.name}: £{entry.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioSummary;
