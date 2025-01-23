import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface CurrencyOption {
  name: string
  code: string
  symbol: string
  icon: string
}

const currencies: CurrencyOption[] = [
  { name: "United States Dollar", code: "USD", symbol: "$", icon: "💵" },
  { name: "Euro", code: "EUR", symbol: "€", icon: "💶" },
  { name: "Pound Sterling", code: "GBP", symbol: "£", icon: "💷" },
  { name: "Canadian Dollar", code: "CAD", symbol: "CA$", icon: "💵" },
  { name: "Australian Dollar", code: "AUD", symbol: "AU$", icon: "💵" },
  { name: "Russian Ruble", code: "RUB", symbol: "₽", icon: "💵" },
  { name: "Korean Won", code: "KRW", symbol: "₩", icon: "💵" },
  { name: "Hong Kong Dollar", code: "HKD", symbol: "HK$", icon: "💵" },
  { name: "Chinese Yuan", code: "CNY", symbol: "¥", icon: "💴" },
  { name: "Japanese Yen", code: "JPY", symbol: "¥", icon: "💴" },
  { name: "Indian Rupee", code: "INR", symbol: "₹", icon: "💵" },
]

interface TopBarProps {
  onCurrencyChange: (currency: string) => void
  onDisconnect: () => void
  selectedCurrency: string
  isConnected: boolean
}

export function TopBar({ onCurrencyChange, onDisconnect, selectedCurrency, isConnected }: TopBarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleCurrencyChange = (currency: string) => {
    onCurrencyChange(currency)
    setIsOpen(false)
  }

  return (
    <div className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-[180px] justify-start">
                <span className="mr-2">{currencies.find((c) => c.code === selectedCurrency)?.icon}</span>
                {selectedCurrency}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Select Currency</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {currencies.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => handleCurrencyChange(currency.code)}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-lg hover:bg-accent",
                      currency.code === selectedCurrency && "bg-accent",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{currency.icon}</span>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{currency.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {currency.code} - {currency.symbol}
                        </span>
                      </div>
                    </div>
                    {currency.code === selectedCurrency && (
                      <svg
                        className="h-4 w-4 text-primary"
                        fill="none"
                        strokeWidth="2"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
        {isConnected && (
          <Button onClick={onDisconnect} variant="ghost" className="h-9 rounded-full">
            Disconnect
          </Button>
        )}
      </div>
    </div>
  )
}

