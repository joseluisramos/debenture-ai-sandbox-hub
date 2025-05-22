
import { useFinance } from "@/context/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const OpportunityAlerts = () => {
  const { alerts } = useFinance();

  // Get alert styles based on severity
  const getAlertStyles = (severity: string) => {
    switch (severity) {
      case 'danger':
        return "border-gsb-danger bg-red-50";
      case 'warning':
        return "border-gsb-warning bg-yellow-50";
      case 'info':
      default:
        return "border-gsb-primary bg-gsb-accent";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-gsb-headerBg text-gsb-primary">
        <CardTitle className="text-lg">3. Unexpected Opportunity Alerts</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {alerts.length === 0 ? (
          <div className="text-center p-8 text-gsb-muted">
            <p>No alerts at the moment.</p>
            <p className="text-sm mt-2">Adjust macro settings to trigger alerts.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <Alert key={alert.id} className={getAlertStyles(alert.severity)}>
                <AlertTitle className={`font-medium ${alert.severity === 'danger' ? 'text-red-800' : alert.severity === 'warning' ? 'text-amber-800' : 'text-blue-800'}`}>
                  {alert.severity === 'danger' ? 'Critical Alert' : alert.severity === 'warning' ? 'Warning' : 'Opportunity'}
                </AlertTitle>
                <AlertDescription className={alert.severity === 'danger' ? 'text-red-700' : alert.severity === 'warning' ? 'text-amber-700' : 'text-blue-700'}>
                  {alert.message}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OpportunityAlerts;
