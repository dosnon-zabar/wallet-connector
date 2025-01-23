"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { connectMetaMask, connectKeplr, fetchKeplrBalances } from "../utils/walletUtils"
import { ValidatorList } from "./ValidatorList"
import { Layout } from "./Layout"
import { AuthLayout } from "./auth-layout"
import { ValidatorsPage, fetchValidators } from "./ValidatorsPage"
import { BalanceCards } from "./BalanceCards"
import { DashboardTabs } from "./DashboardTabs"
import { LayoutDashboard, Users } from "lucide-react"

type WalletInfo = {
  address: string
  type: "MetaMask" | "Keplr"
  name?: string
  availableAmount?: string
  stakedAmount?: string
  claimableReward?: string
  portfolioValue?: string
  exchangeRates?: {
    usd: number
    eur: number
  }
  validatorInfo?: Array<{
    validatorAddress: string
    validatorName: string
    stakedAmount: string
    claimableReward: string
  }>
} | null

type Validator = {
  // Define your Validator type here
}

export default function WalletConnector() {
  const [walletInfo, setWalletInfo] = useState<WalletInfo>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isBalanceLoading, setIsBalanceLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "EUR">("USD")
  const [currentPage, setCurrentPage] = useState<string>("dashboard")
  const [isConnected, setIsConnected] = useState(false)
  const [validators, setValidators] = useState<Validator[]>([])
  const [validatorLoadError, setValidatorLoadError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBalances() {
      if (walletInfo?.type === "Keplr" && walletInfo.address) {
        setIsBalanceLoading(true)
        try {
          const balances = await fetchKeplrBalances(walletInfo.address)
          setWalletInfo((prev) => (prev ? { ...prev, ...balances } : null))
        } catch (error) {
          console.error("Failed to fetch balances:", error)
          setError("Failed to fetch wallet balances. Please try again.")
        } finally {
          setIsBalanceLoading(false)
        }
      }
    }

    if (walletInfo?.type === "Keplr") {
      fetchBalances()
    }
  }, [walletInfo?.address, walletInfo?.type])

  const handleConnectWallet = async (walletType: "MetaMask" | "Keplr") => {
    setIsLoading(true)
    setError(null)
    setValidatorLoadError(null)
    try {
      const info = walletType === "MetaMask" ? await connectMetaMask() : await connectKeplr()
      setWalletInfo(info as WalletInfo)
      setIsConnected(true)

      // Load validator data
      try {
        const validatorsData = await fetchValidators()
        setValidators(validatorsData)
      } catch (err) {
        console.error("Failed to load validators:", err)
        setValidatorLoadError("Failed to load validators. You can try again on the Validators page.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Connection error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = () => {
    setWalletInfo(null)
    setError(null)
    setIsConnected(false)
    setCurrentPage("dashboard")
  }

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency as "USD" | "EUR")
  }

  const handlePageChange = (page: string) => {
    setCurrentPage(page)
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: currency }).format(amount)
  }

  const formatNumber = (value: number): string => {
    return value.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const content = (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Dashboard</h2>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <div className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex items-center space-x-2">
          <span className="text-sm">Loading...</span>
          <p>Connecting to wallet...</p>
        </div>
      ) : walletInfo ? (
        <DashboardTabs
          walletInfo={walletInfo}
          selectedCurrency={selectedCurrency}
          formatNumber={formatNumber}
          formatCurrency={formatCurrency}
          isBalanceLoading={isBalanceLoading}
        />
      ) : (
        <p>Not connected to any wallet</p>
      )}

      <div className="flex space-x-4">
        {!walletInfo && (
          <>
            <Button
              onClick={() => handleConnectWallet("MetaMask")}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              {isLoading ? <span className="text-sm">Loading...</span> : null}
              <span>Connect MetaMask</span>
            </Button>
            <Button
              onClick={() => handleConnectWallet("Keplr")}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              {isLoading ? <span className="text-sm">Loading...</span> : null}
              <span>Connect Keplr</span>
            </Button>
          </>
        )}
      </div>
    </div>
  )

  const loginContent = (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6" />
          <CardTitle className="text-2xl">Crypto Wallet Connector</CardTitle>
        </div>
        <CardDescription>Connect your wallet to access your portfolio</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <div className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col gap-4">
          <Button onClick={() => handleConnectWallet("Keplr")} disabled={isLoading} className="w-full">
            {isLoading ? <span className="text-sm">Loading...</span> : null}
            Connect with Keplr
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  if (!isConnected) {
    return <AuthLayout>{loginContent}</AuthLayout>
  }

  return (
    <Layout
      onCurrencyChange={handleCurrencyChange}
      onDisconnect={handleDisconnect}
      onPageChange={handlePageChange}
      selectedCurrency={selectedCurrency}
      isConnected={isConnected}
    >
      {currentPage === "dashboard" && <div className="space-y-6">{content}</div>}
      {currentPage === "validators" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Validators</h2>
          </div>
          {validatorLoadError ? (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription className="flex flex-col items-center">
                <p>{validatorLoadError}</p>
                <Button
                  onClick={async () => {
                    try {
                      const validatorsData = await fetchValidators()
                      setValidators(validatorsData)
                      setValidatorLoadError(null)
                    } catch (err) {
                      console.error("Failed to load validators:", err)
                      setValidatorLoadError("Failed to load validators. Please try again.")
                    }
                  }}
                  className="mt-2"
                >
                  Retry Loading Validators
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <ValidatorsPage initialValidators={validators} />
          )}
        </div>
      )}
    </Layout>
  )
}

