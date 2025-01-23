import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface BalanceCardsProps {
  totalValue: string
  availableValue: string
  stakingValue: string
  currency: string
}

export function BalanceCards({ totalValue, availableValue, stakingValue, currency }: BalanceCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-xl border bg-card p-6 shadow">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-medium text-muted-foreground">Total Wallet Value</h3>
          <p className="text-3xl font-bold">
            {currency}
            {totalValue}
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium text-muted-foreground">Total Available Value</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                    <span className="h-4 w-4 flex items-center justify-center text-xs font-bold">i</span>
                    <span className="sr-only">Available balance info</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Amount available for transfer or staking</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-3xl font-bold">
            {currency}
            {availableValue}
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium text-muted-foreground">Total Staking Value</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                    <span className="h-4 w-4 flex items-center justify-center text-xs font-bold">i</span>
                    <span className="sr-only">Staking balance info</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total value of staked tokens</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-3xl font-bold">
            {currency}
            {stakingValue}
          </p>
        </div>
      </div>
    </div>
  )
}

