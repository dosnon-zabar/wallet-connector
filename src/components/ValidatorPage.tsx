import React from "react"
import { ValidatorList } from "./ValidatorList"

interface ValidatorPageProps {
  walletInfo: any
  selectedCurrency: "USD" | "EUR"
}

export function ValidatorPage({ walletInfo, selectedCurrency }: ValidatorPageProps) {
  if (!walletInfo || !walletInfo.validatorInfo) {
    return <div>No validator information available. Please connect your wallet.</div>
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Validators</h2>
      <ValidatorList
        validators={walletInfo.validatorInfo}
        exchangeRates={walletInfo.exchangeRates || { usd: 0, eur: 0 }}
        selectedCurrency={selectedCurrency}
      />
    </div>
  )
}

