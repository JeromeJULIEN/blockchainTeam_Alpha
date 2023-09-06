'use client'
import { ThirdwebProvider, ChainId,metamaskWallet,paperWallet } from '@thirdweb-dev/react'

export function ThirdWebProvider({ children }: {
  children: React.ReactNode
}) {

  return (
    <ThirdwebProvider 
        activeChain={ChainId.Mumbai} 
        clientId={process.env.THIRDWEB_CLIENT_ID}
        supportedWallets={[metamaskWallet(),paperWallet({paperClientId:"9ce73078-abaf-499c-9e66-d6ff2f36c0a7" })]}
    >
      {children}
    </ThirdwebProvider>
  )
}