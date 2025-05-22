
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useFinance } from "@/context/FinanceContext";

const DebtureDetails = () => {
  const { clientPosition } = useFinance();

  return (
    <Card className="w-full border bg-white">
      <CardHeader className="bg-gsb-primary text-white">
        <CardTitle className="text-lg font-semibold">5 Year Economic Development Registered Debentures</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium text-gray-600">Product name</TableCell>
              <TableCell className="font-medium">{clientPosition.name}</TableCell>
              <TableCell className="font-medium text-gray-600">Face amount</TableCell>
              <TableCell className="font-medium">£{clientPosition.faceAmount.toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-gray-600">Coupon</TableCell>
              <TableCell className="font-medium">{clientPosition.coupon.toFixed(1)}% fixed</TableCell>
              <TableCell className="font-medium text-gray-600">Purchase date</TableCell>
              <TableCell className="font-medium">{clientPosition.purchaseDate}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-gray-600">Maturity date</TableCell>
              <TableCell className="font-medium">{clientPosition.maturityDate}</TableCell>
              <TableCell className="font-medium text-gray-600">Current market value</TableCell>
              <TableCell className="font-medium text-gsb-primary">£{clientPosition.currentMarketValue.toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-gray-600">Yield-to-maturity</TableCell>
              <TableCell className="font-medium">{clientPosition.yieldToMaturity.toFixed(1)}%</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DebtureDetails;
