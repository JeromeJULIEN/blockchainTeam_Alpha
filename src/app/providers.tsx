'use client'
import { RecoveryShareManagement } from '@paperxyz/embedded-wallet-service-sdk'
import { ThirdwebProvider, ChainId,metamaskWallet,paperWallet } from '@thirdweb-dev/react'

export function ThirdWebProvider({ children }: {
  children: React.ReactNode
}) {
  
  return (
    <ThirdwebProvider 
    activeChain={ChainId.Mumbai} 
    clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
    supportedWallets={[metamaskWallet(),paperWallet({paperClientId:process.env.NEXT_PUBLIC_PAPER_CLIENT_ID!,advancedOptions:{
      recoveryShareManagement: RecoveryShareManagement.AWS_MANAGED
    }})]}
    >
      {children}
    </ThirdwebProvider>
  )
}