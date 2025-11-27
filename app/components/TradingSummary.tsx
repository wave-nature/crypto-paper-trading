import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { readableCurrency } from "@/utils/helpers"

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
    <Card className="border-violet-500/20 bg-gradient-to-br from-violet-50/50 to-white dark:from-violet-950/20 dark:to-background">
      <CardHeader>
        <CardTitle className="bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent">Trading Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Profitable Trades</h3>
            <p className="text-2xl font-bold text-violet-600">
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
            <p className="text-2xl font-bold text-violet-600">{totalTradesCount}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Most Profitable Trade</h3>
            <p className="text-2xl font-bold text-green-500">{readableCurrency(mostProfitableTrade)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Biggest Loss Trade</h3>
            <p className="text-2xl font-bold text-red-500">{readableCurrency(biggestLossTrade)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
