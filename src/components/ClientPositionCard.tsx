
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";

const ClientPositionCard = () => {
  const { clientPosition } = useFinance();

  return (
    <Card className="w-full border-2 border-gsb-accent bg-white">
      <CardHeader className="bg-gsb-primary text-white">
        <CardTitle className="text-lg font-semibold">Your Current Debenture Position</CardTitle>
      </CardHeader>
      <CardContent className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <p className="text-sm text-gsb-muted">Product name</p>
          <p className="font-medium">{clientPosition.name}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gsb-muted">Face amount</p>
          <p className="font-medium">£{clientPosition.faceAmount.toLocaleString()}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gsb-muted">Coupon</p>
          <p className="font-medium">{clientPosition.coupon.toFixed(1)}% fixed</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gsb-muted">Purchase date</p>
          <p className="font-medium">{clientPosition.purchaseDate}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gsb-muted">Maturity date</p>
          <p className="font-medium">{clientPosition.maturityDate}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gsb-muted">Current market value</p>
          <p className="font-medium text-gsb-primary">£{clientPosition.currentMarketValue.toLocaleString()}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gsb-muted">Yield-to-maturity</p>
          <p className="font-medium">{clientPosition.yieldToMaturity.toFixed(1)}%</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientPositionCard;
