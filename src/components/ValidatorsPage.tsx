import React, { useState, useMemo, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown, Search, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Validator {
  operator_address: string
  description: {
    moniker: string
    identity: string
  }
  tokens: string
  thumbnail: string | null
}

interface ValidatorsPageProps {
  initialValidators?: Validator[]
}

const COSMOS_REST_URL = "https://rest.cosmos.directory/cosmoshub"

export const fetchValidators = async (): Promise<Validator[]> => {
  try {
    const response = await fetch(
      `${COSMOS_REST_URL}/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED&pagination.limit=200`,
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()

    // Fetch additional info for each validator
    const validatorsWithInfo = await Promise.all(
      data.validators.map(async (validator: any) => {
        try {
          const infoResponse = await fetch(
            `https://keybase.io/_/api/1.0/user/lookup.json?fields=pictures&key_suffix=${validator.description.identity}`,
          )
          if (!infoResponse.ok) {
            throw new Error(`HTTP error! status: ${infoResponse.status}`)
          }
          const infoData = await infoResponse.json()
          const thumbnail = infoData.them?.[0]?.pictures?.primary?.url || null

          return {
            ...validator,
            thumbnail,
          }
        } catch (error) {
          console.error(`Failed to fetch thumbnail for validator ${validator.description.moniker}:`, error)
          return {
            ...validator,
            thumbnail: null,
          }
        }
      }),
    )

    return validatorsWithInfo
  } catch (error) {
    console.error("Failed to fetch validators:", error)
    throw new Error("Failed to load validators. Please check your internet connection and try again.")
  }
}

export function ValidatorsPage({ initialValidators = [] }: ValidatorsPageProps) {
  const [validators, setValidators] = useState<Validator[]>(initialValidators)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState<"name" | "votingPower">("votingPower")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [isLoading, setIsLoading] = useState(initialValidators.length === 0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadValidators = async () => {
      if (initialValidators.length === 0) {
        try {
          setIsLoading(true)
          const fetchedValidators = await fetchValidators()
          setValidators(fetchedValidators)
        } catch (err) {
          setError("Failed to load validators. Please try again later.")
          console.error(err)
        } finally {
          setIsLoading(false)
        }
      } else {
        setValidators(initialValidators)
        setIsLoading(false)
      }
    }

    loadValidators()
  }, [initialValidators])

  const retryFetch = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const fetchedValidators = await fetchValidators()
      setValidators(fetchedValidators)
    } catch (err) {
      setError("Failed to load validators. Please check your internet connection and try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSort = (column: "name" | "votingPower") => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const filteredAndSortedValidators = useMemo(() => {
    return validators
      .filter((validator) => validator.description.moniker.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (sortColumn === "name") {
          return sortDirection === "asc"
            ? a.description.moniker.localeCompare(b.description.moniker)
            : b.description.moniker.localeCompare(a.description.moniker)
        } else {
          const aVotingPower = Number.parseInt(a.tokens)
          const bVotingPower = Number.parseInt(b.tokens)
          return sortDirection === "asc" ? aVotingPower - bVotingPower : bVotingPower - aVotingPower
        }
      })
  }, [validators, searchTerm, sortColumn, sortDirection])

  const handleStake = (validatorAddress: string) => {
    // Implémenter la logique de staking ici
    console.log(`Staking with validator ${validatorAddress}`)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading validators...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription className="flex flex-col items-center">
          <p>{error}</p>
          <Button onClick={retryFetch} className="mt-2">
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      <h1 className="text-2xl font-bold">Cosmos Hub Validators</h1>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search validators"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="flex-grow overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("name")} className="cursor-pointer">
                Name {sortColumn === "name" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("votingPower")} className="cursor-pointer">
                Voting Power {sortColumn === "votingPower" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedValidators.map((validator) => (
              <TableRow key={validator.operator_address}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {validator.thumbnail && (
                      <img
                        src={validator.thumbnail || "/placeholder.svg"}
                        alt={`${validator.description.moniker} thumbnail`}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <span>{validator.description.moniker}</span>
                  </div>
                </TableCell>
                <TableCell>{Number.parseInt(validator.tokens).toLocaleString()}</TableCell>
                <TableCell>
                  <Button onClick={() => handleStake(validator.operator_address)}>Stake</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

