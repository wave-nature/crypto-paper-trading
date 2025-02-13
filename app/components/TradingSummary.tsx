import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TradingSummaryProps {
  profitableTradesCount: number
  lossTradesCount: number
  totalTradesCount: number
  mostProfitableTrade: number
  biggestLossTrade: number
}

export default function TradingSummary({
  profitableTradesCount,
  lossTradesCount,
  totalTradesCount,
  mostProfitableTrade,
  biggestLossTrade,
}: TradingSummaryProps) {
  const profitablePercentage = (profitableTradesCount / totalTradesCount) * 100 || 0
  const lossPercentage = (lossTradesCount / totalTradesCount) * 100 || 0

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Trading Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Profitable Trades</h3>
            <p className="text-2xl font-bold">
              {profitableTradesCount} ({profitablePercentage.toFixed(2)}%)
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Loss Trades</h3>
            <p className="text-2xl font-bold">
              {lossTradesCount} ({lossPercentage.toFixed(2)}%)
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Total Trades</h3>
            <p className="text-2xl font-bold">{totalTradesCount}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Most Profitable Trade</h3>
            <p className="text-2xl font-bold text-green-500">${mostProfitableTrade.toFixed(2)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Biggest Loss Trade</h3>
            <p className="text-2xl font-bold text-red-500">${biggestLossTrade.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

