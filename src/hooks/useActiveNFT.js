import React, { useEffect, useState, createContext, useContext } from 'react'
import { useWallet } from 'use-wallet'
import { ethers } from 'ethers'
import {
  getClaim,
  getVeBalanceOfNFT,
  getVeNFTsOfAddress,
} from '../common/ethereum'
import defaults from '../common/defaults'
import { useLocalStorage } from 'react-use'

export const ActiveNFTContext = createContext({
  activeNFT: ethers.BigNumber.from('0'),
})

// eslint-disable-next-line react/prop-types
export const ActiveNFTProvider = ({ children }) => {
  const wallet = useWallet()
  const [activeNFT, setActiveNFTState] = useState(ethers.BigNumber.from('0'))

  const [activeNFTBalance, setActiveNFTBalance] = useState(
    ethers.BigNumber.from('0'),
  )
  const [userNFTs, setUserNFTs] = useState({})

  useEffect(async () => {
    if (wallet.account) {
      const nfts = await getVeNFTsOfAddress(wallet.account)
      const nftObjs = {}
      for (const ve of nfts) {
        nftObjs[ve.toString()] = ethers.utils.formatEther(
          await getVeBalanceOfNFT(ve),
        )
      }
      console.log(nftObjs)
      setUserNFTs(nftObjs)
      const balance = await getVeBalanceOfNFT(nfts[0])
      setActiveNFTBalance(ethers.utils.formatEther(balance))
      setActiveNFTState(nfts[0])
    }
  }, [wallet.account])

  // Context values passed to consumer
  const value = {
    activeNFT,
    setActiveNFT: async nft => {
      setActiveNFTState(nft.toString())
      const balance = await getVeBalanceOfNFT(nft)
      setActiveNFTBalance(ethers.utils.formatEther(balance))
    },
    activeNFTBalance,
    userNFTs,
  }

  return (
    <ActiveNFTContext.Provider value={value}>
      {children}
    </ActiveNFTContext.Provider>
  )
}

export const useActiveNFT = () => {
  const { userNFTs, activeNFT, setActiveNFT, activeNFTBalance } =
    useContext(ActiveNFTContext)
  return { userNFTs, activeNFT, setActiveNFT, activeNFTBalance }
}
