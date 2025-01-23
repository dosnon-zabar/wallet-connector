import { Sidebar, SidebarHeader, SidebarItem, SidebarContent } from "@radix-ui/react-sidebar"
import { Zap } from "lucide-react"

function CryptoWalletConnector() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Zap />
        <h1>Crypto Wallet Connector</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarItem>Item 1</SidebarItem>
        <SidebarItem>Item 2</SidebarItem>
      </SidebarContent>
    </Sidebar>
  )
}

export default CryptoWalletConnector

