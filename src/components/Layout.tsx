import type React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { TopBar } from "./TopBar"
import { LayoutDashboard, Users, BarChart2, Settings } from "lucide-react"

interface LayoutProps {
  children: React.ReactNode
  onCurrencyChange: (currency: string) => void
  onDisconnect: () => void
  onPageChange: (page: string) => void
  selectedCurrency: string
  isConnected: boolean
}

export function Layout({
  children,
  onCurrencyChange,
  onDisconnect,
  onPageChange,
  selectedCurrency,
  isConnected,
}: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar className="w-64">
          <SidebarHeader className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6" />
              <h1 className="text-xl font-bold">Crypto Wallet Connector</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#" className="flex items-center space-x-2" onClick={() => onPageChange("dashboard")}>
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#" className="flex items-center space-x-2" onClick={() => onPageChange("validators")}>
                    <Users className="w-5 h-5" />
                    <span>Validators</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#" className="flex items-center space-x-2" onClick={() => onPageChange("wallets")}>
                    <div className="w-5 h-5" />
                    <span>Wallets</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#" className="flex items-center space-x-2" onClick={() => onPageChange("analytics")}>
                    <BarChart2 className="w-5 h-5" />
                    <span>Analytics</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#" className="flex items-center space-x-2" onClick={() => onPageChange("settings")}>
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 w-full flex flex-col overflow-hidden">
          <TopBar
            onCurrencyChange={onCurrencyChange}
            onDisconnect={onDisconnect}
            selectedCurrency={selectedCurrency}
            isConnected={isConnected}
          />
          <main className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto bg-gray-100">
            <div className="w-full h-full p-6 overflow-auto">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

