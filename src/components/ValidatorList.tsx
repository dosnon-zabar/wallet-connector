import * as React from "react"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type ValidatorInfo = {
  validatorAddress: string
  validatorName: string
  stakedAmount: string
  claimableReward: string
  thumbnail: string | null
}

type ValidatorListProps = {
  validators: ValidatorInfo[]
  exchangeRates: {
    usd: number
    eur: number
  }
  selectedCurrency: "USD" | "EUR"
}

export function ValidatorList({ validators, exchangeRates, selectedCurrency }: ValidatorListProps) {
  const [expandedValidator, setExpandedValidator] = useState<string | null>(null)

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("fr-FR", {
      style: "currency",
      currency: selectedCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const toggleExpand = (validatorAddress: string) => {
    setExpandedValidator(expandedValidator === validatorAddress ? null : validatorAddress)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staking Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Validator</TableHead>
              <TableHead>Amount Staked</TableHead>
              <TableHead>Rewards</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {validators.map((validator) => (
              <React.Fragment key={validator.validatorAddress}>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {validator.thumbnail && (
                        <img
                          src={validator.thumbnail || "/placeholder.svg"}
                          alt={`${validator.validatorName} thumbnail`}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium">{validator.validatorName}</span>
                        <span className="text-sm text-muted-foreground">
                          {validator.validatorAddress.slice(0, 12)}...
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {formatCurrency(
                          Number(validator.stakedAmount) *
                            exchangeRates[selectedCurrency.toLowerCase() as "usd" | "eur"],
                        )}
                      </span>
                      <span className="text-sm text-muted-foreground">{validator.stakedAmount} ATOM</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {formatCurrency(
                          Number(validator.claimableReward) *
                            exchangeRates[selectedCurrency.toLowerCase() as "usd" | "eur"],
                        )}
                      </span>
                      <span className="text-sm text-muted-foreground">{validator.claimableReward} ATOM</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(validator.validatorAddress)}
                      className="w-full"
                    >
                      {expandedValidator === validator.validatorAddress ? "▲" : "▼"}
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedValidator === validator.validatorAddress && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <div className="p-4 bg-muted/50 rounded-md space-y-2">
                        <p>
                          <strong>Validator Address:</strong> {validator.validatorAddress}
                        </p>
                        <div className="flex gap-8">
                          <div>
                            <p className="text-sm text-muted-foreground">Total Staked</p>
                            <p className="font-medium">
                              {formatCurrency(
                                Number(validator.stakedAmount) *
                                  exchangeRates[selectedCurrency.toLowerCase() as "usd" | "eur"],
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Claimable Rewards</p>
                            <p className="font-medium">
                              {formatCurrency(
                                Number(validator.claimableReward) *
                                  exchangeRates[selectedCurrency.toLowerCase() as "usd" | "eur"],
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

