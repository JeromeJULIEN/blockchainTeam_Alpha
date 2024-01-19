'use client'
import { RecoveryShareManagement } from '@paperxyz/embedded-wallet-service-sdk'
import { ThirdwebProvider, ChainId,metamaskWallet,paperWallet,embeddedWallet } from '@thirdweb-dev/react'

export function ThirdWebProvider({ children }: {
  children: React.ReactNode
}) {
  
  return (
    <ThirdwebProvider 
      activeChain={ChainId.Mumbai} 
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
      // authConfig={{
      //   domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN as string,
      //   authUrl: "/api/auth"
      // }}
      supportedWallets={[
        metamaskWallet(),
        // paperWallet({
        //   paperClientId:process.env.NEXT_PUBLIC_PAPER_CLIENT_ID!,
        // }),
        embeddedWallet({
          recommended: true
        }),
      ]}
    >
      {children}
    </ThirdwebProvider>
  )
}