"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ValidatorList } from "./ValidatorList"
import { BalanceCards } from "./BalanceCards"

interface DashboardTabsProps {
  walletInfo: any
  selectedCurrency: string
  formatNumber: (value: number) => string
  formatCurrency: (amount: number, currency: string) => string
  isBalanceLoading: boolean
}

export function DashboardTabs({
  walletInfo,
  selectedCurrency,
  formatNumber,
  formatCurrency,
  isBalanceLoading,
}: DashboardTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="overview">Wallet overview</TabsTrigger>
        <TabsTrigger value="staking">Staking</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        {walletInfo.type === "Keplr" &&
          (isBalanceLoading ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm">Loading...</span>
              <p>Fetching balances...</p>
            </div>
          ) : (
            <>
              <div className="w-full bg-white p-6 rounded-lg shadow">
                <h3 className="text-2xl font-bold mb-4">Wallet Balances</h3>
                <BalanceCards
                  totalValue={formatNumber(
                    Number(walletInfo.portfolioValue || "0") *
                      (walletInfo.exchangeRates?.[selectedCurrency.toLowerCase() as "usd" | "eur"] || 0),
                  )}
                  availableValue={formatNumber(
                    Number(walletInfo.availableAmount || "0") *
                      (walletInfo.exchangeRates?.[selectedCurrency.toLowerCase() as "usd" | "eur"] || 0),
                  )}
                  stakingValue={formatNumber(
                    Number(walletInfo.stakedAmount || "0") *
                      (walletInfo.exchangeRates?.[selectedCurrency.toLowerCase() as "usd" | "eur"] || 0),
                  )}
                  currency={selectedCurrency === "USD" ? "$" : "€"}
                />
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">Wallet Information</h3>
                  <p>
                    <strong>Connected to:</strong> {walletInfo.type}
                  </p>
                  {walletInfo.name && (
                    <p>
                      <strong>Name:</strong> {walletInfo.name}
                    </p>
                  )}
                  <p>
                    <strong>Address:</strong> {walletInfo.address}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">Exchange Rates</h3>
                  <p>1 ATOM = {formatCurrency(walletInfo.exchangeRates?.usd || 0, "USD")}</p>
                  <p>1 ATOM = {formatCurrency(walletInfo.exchangeRates?.eur || 0, "EUR")}</p>
                </div>
              </div>
            </>
          ))}
      </TabsContent>

      <TabsContent value="staking" className="space-y-6">
        {walletInfo.validatorInfo && walletInfo.validatorInfo.length > 0 && (
          <ValidatorList
            validators={walletInfo.validatorInfo}
            exchangeRates={walletInfo.exchangeRates || { usd: 0, eur: 0 }}
            selectedCurrency={selectedCurrency}
          />
        )}
      </TabsContent>
    </Tabs>
  )
}

