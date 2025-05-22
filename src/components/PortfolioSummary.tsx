
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
      <CardContent className="p-3">
        <h2 className="text-sm font-medium text-black mb-0">Portfolio Summary</h2>
        <p className="text-gray-600 mb-2 text-xs">Overview of your investments</p>
        
        <div className="flex flex-col items-center">
          <h3 className="text-2xl font-medium mb-2">£{totalValue.toLocaleString()}.00</h3>
          
          <div className="w-full h-40 max-w-xs mx-auto">
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
                  innerRadius={40}
                  outerRadius={60}
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
          
          <div className="flex flex-wrap justify-center gap-4 mt-1">
            {portfolioData.map((entry, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-2 h-2 mr-1" 
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-xs">{entry.name}: £{entry.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioSummary;
