import { ApolloClient, InMemoryCache } from '@apollo/client'
import { QueryClient } from 'react-query'
import { ethers } from 'ethers'
import tokenListSources from '../tokenListSources'
import vaderBonds from '../artifacts/js/vaderBonds'
import vaderTokens from '../artifacts/json/vaderTokens'
import snapshot from '../artifacts/json/aphraSnapshot'
import AphraLogo from '../assets/png/aphra-token.png'
import v0 from '../artifacts/json/v0.json'
const defaults = {}
defaults.aphraContracts = v0
defaults.network = {}
defaults.network.chainId = Number(process.env.REACT_APP_CHAIN_ID)
defaults.network.provider = new ethers.providers.FallbackProvider(
  [
    {
      provider: new ethers.providers.AlchemyProvider(
        defaults.network.chainId,
        process.env.REACT_APP_ALCHEMY_KEY,
      ),
      weight: 1,
      priority: 1,
      stallTimeout: 2000,
    },
    {
      provider: new ethers.providers.InfuraProvider(
        defaults.network.chainId,
        process.env.REACT_APP_INFURA_KEY,
      ),
      weight: 1,
      priority: 2,
      stallTimeout: 2000,
    },
  ],
  1,
)

defaults.network.connectors = {
  frame: {
    meta: {
      key: 'injected',
      name: 'Frame',
      logo: 'https://raw.githubusercontent.com/floating/frame/0.5/asset/png/FrameLogo512.png',
    },
  },
  walletconnect: {
    rpc: {
      [defaults.network.chainId]:
        defaults.network.chainId === 1
          ? `https://eth-mainnet.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_KEY}`
          : defaults.network.chainId === 42
          ? `https://eth-kovan.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_KEY}` //eslint-disable-line
          : undefined, //eslint-disable-line
    },
    meta: {
      key: 'walletconnect',
      name: 'WalletConnect',
      logo:
        'https://raw.githubusercontent.com/vetherasset/' +
        'vader-dapp/main/src/assets/svg/icons/' +
        'walletconnect.svg',
    },
  },

  metamask: {
    meta: {
      key: 'injected',
      name: 'MetaMask',
      logo:
        'https://raw.githubusercontent.com/vetherasset/' +
        'vader-dapp/main/src/assets/svg/icons/' +
        'metamask.svg',
    },
  },
  walletlink: {
    // WalletLink supports only ChainID 1
    chainId: defaults.network.chainId,
    url:
      defaults.network.chainId === 1
        ? `https://eth-mainnet.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_KEY}`
        : undefined,
    appName: 'Aphra Finance',
    appLogoUrl:
      'https://raw.githubusercontent.com/vetherasset/' +
      'branding/main/vader/vader-logo-wo-ring.svg',
    meta: {
      key: 'walletlink',
      name: 'Coinbase Wallet',
      logo:
        'https://raw.githubusercontent.com/vetherasset/' +
        'vader-dapp/main/src/assets/svg/icons/' +
        'coinbasewallet.svg',
    },
  },
  other: {
    meta: {
      key: 'injected',
      name: 'Other',
      logo:
        'https://raw.githubusercontent.com/vetherasset/' +
        'vader-dapp/main/src/assets/svg/icons/' +
        'otherwallets.svg',
    },
  },
}
defaults.network.autoConnect = true
defaults.network.pollInterval = 100000

defaults.network.tx = {}
defaults.network.tx.confirmations = 1

defaults.network.blockTime = {}
defaults.network.blockTime.hour = 262

defaults.network.erc20 = {}
defaults.network.erc20.maxApproval = '302503999000000000299700000'

defaults.api = {}
defaults.api.staleTime = 100000
defaults.api.client = new QueryClient()

defaults.api.graphql = {}
defaults.api.graphql.uri = {}
defaults.api.graphql.uri.vaderProtocol =
  defaults.network.chainId === 1
    ? 'https://api.thegraph.com/subgraphs/name/satoshi-naoki/vader-protocol-mainnet'
    : defaults.network.chainId === 42
    ? 'https://api.thegraph.com/subgraphs/name/satoshi-naoki/vader-protocol'
    : undefined
defaults.api.graphql.uri.uniswapV2 =
  defaults.network.chainId === 1
    ? 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'
    : defaults.network.chainId === 42
    ? 'https://thegraph.com/hosted-service/subgraph/sc0vu/uniswap-v2-kovan'
    : undefined

defaults.api.graphql.cache = new InMemoryCache()

defaults.api.graphql.client = {}
defaults.api.graphql.client.vaderProtocol = new ApolloClient({
  uri: defaults.api.graphql.uri.vaderProtocol,
  cache: defaults.api.graphql.cache,
})
defaults.api.graphql.client.uniswapV2 = new ApolloClient({
  uri: defaults.api.graphql.uri.uniswapV2,
  cache: defaults.api.graphql.cache,
})

defaults.api.graphql.pollInterval = 100000

defaults.api.etherscanUrl =
  defaults.network.chainId === 1
    ? 'https://etherscan.io/'
    : defaults.network.chainId === 42
    ? 'https://kovan.etherscan.io/'
    : undefined

defaults.address = {}
defaults.address.airdrop = v0.AirdropClaim.address
defaults.address.routerModule =
  defaults.network.chainId === 1
    ? '0x2602278EE1882889B946eb11DC0E810075650983'
    : defaults.network.chainId === 42
    ? '0xB46dbd07ce34813623FB0643b21DCC8D0268107D'
    : undefined
defaults.address.vader =
  defaults.network.chainId === 1
    ? '0x2602278EE1882889B946eb11DC0E810075650983'
    : defaults.network.chainId === 42
    ? '0xB46dbd07ce34813623FB0643b21DCC8D0268107D'
    : undefined
defaults.address.aphra =
  defaults.network.chainId === 1
    ? v0.AphraToken.address
    : defaults.network.chainId === 42
    ? undefined
    : undefined
defaults.address.veAphra =
  defaults.network.chainId === 1
    ? v0.veAPHRA.address
    : defaults.network.chainId === 42
    ? ''
    : undefined
defaults.address.usdv3Crv =
  defaults.network.chainId === 1
    ? '0x7abd51bba7f9f6ae87ac77e1ea1c5783ada56e5c'
    : defaults.network.chainId === 42
    ? '0x7abd51bba7f9f6ae87ac77e1ea1c5783ada56e5c'
    : undefined
defaults.address.xvader =
  defaults.network.chainId === 1
    ? '0x665ff8fAA06986Bd6f1802fA6C1D2e7d780a7369'
    : defaults.network.chainId === 42
    ? '0x0AA1056Ee563C14484fCC530625cA74575C97512'
    : undefined
defaults.address.usdv =
  defaults.network.chainId === 1
    ? '0xea3Fb6f331735252E7Bfb0b24b3B761301293DBe'
    : defaults.network.chainId === 42
    ? '0xfd87ba583bd2071713fb5CB12086536a26eec18e'
    : undefined

defaults.address.uniswapV2 = {}
defaults.address.uniswapV2.vaderEthPair =
  '0x452c60e1e3ae0965cd27db1c7b3a525d197ca0aa'
defaults.address.uniswapV2.usdcEthPair =
  '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc'

defaults.tokenList = {}
defaults.tokenList.default = vaderTokens
defaults.tokenList.sources = tokenListSources

defaults.aphra = {
  chainId: defaults.network.chainId,
  address: defaults.address.aphra,
  name: 'APHRA',
  symbol: 'APHRA',
  decimals: 18,
  logoURI: AphraLogo,
}
defaults.factoryAddresses = {
  gauge: v0.GaugeFactory.address,
  bribe: v0.BribeFactory.address,
  vault: v0.VaultFactory.address,
}
defaults.voter = {
  address: v0.Voter.address,
}

defaults.ether = {
  name: 'ETHER',
  symbol: 'ETH',
  decimals: 18,
  logoURI:
    'https://raw.githubusercontent.com/vetherasset/vader-dapp/main/src/assets/png/eth-diamond-purple-purple.png',
  isEther: true,
}

defaults.vader = {
  vault: v0.avVADER.address,
  gauge: v0.avVADERGauge.address,
  bribe: v0.avVADERBribe.address,
  chainId: defaults.network.chainId,
  address: defaults.address.vader,
  name: 'VADER',
  symbol: 'VADER',
  decimals: 18,
  logoURI:
    'https://raw.githubusercontent.com/vetherasset/branding/main/vader/vader-symbol-w-ring.png',
}
defaults.xvader = {
  vault: null,
  chainId: defaults.network.chainId,
  address: defaults.address.xvader,
  name: 'xVADER',
  symbol: 'xVADER',
  decimals: 18,
  logoURI:
    'https://raw.githubusercontent.com/vetherasset/branding/main/xvader/xvader-symbol-w-ring.png',
}

defaults.usdv = {
  vault: v0.avUSDV.address,
  gauge: v0.avUSDVGauge.address,
  bribe: v0.avUSDVBribe.address,
  chainId: defaults.network.chainId,
  address: defaults.address.usdv,
  name: 'USDV',
  symbol: 'USDV',
  decimals: 18,
  logoURI:
    'https://raw.githubusercontent.com/vetherasset/branding/main/usdv/usdv-symbol-w-ring.png',
}

defaults.veAphra = {
  chainId: defaults.network.chainId,
  address: v0.veAPHRA.address,
  name: 'veAPHRA',
  symbol: 'veAPHRA',
  decimals: 18,
  logoURI: defaults.aphra.logoURI,
}
defaults.usdv3Crv = {
  vault: v0.avVADER.address,
  gauge: v0.avVADERGauge.address,
  bribe: v0.avVADERBribe.address,
  chainId: defaults.network.chainId,
  address: defaults.address.usdv3Crv,
  name: 'USDV3Crv',
  symbol: 'USDV3Crv',
  decimals: 18,
  logoURI: '/curvefi.svg',
}

defaults.redeemables = [
  {
    ...defaults.aphra,
    convertsTo: 'veAPHRA',
    snapshot: snapshot,
  },
]

defaults.stakeable = [...[defaults.usdv3Crv]]
defaults.gauges = [
  ...[defaults.usdv3Crv],
  ...[defaults.avUSDV],
  ...[defaults.avVADER],
]
defaults.unstakeable = [...[defaults.usdv3Crv]]
defaults.vaultable = [
  ...[defaults.vader],
  ...[defaults.usdv],
  ...[defaults.usdv3Crv],
]

defaults.bonds = vaderBonds
defaults.bondConsideredSoldOutMinVader = ethers.BigNumber.from(
  '300000000000000000000',
)
defaults.bondZapMinPayoutAllowed = '10000000000000000'

defaults.xVaderAPRBasedNumberOfRecords = 14

defaults.layout = {}
defaults.layout.header = {}
defaults.layout.header.width = '100%'
defaults.layout.header.padding = '1.2rem 1rem'
defaults.layout.header.minHeight = '98.4px'

defaults.layout.container = {}
defaults.layout.container.xl = {}
defaults.layout.container.xl.width = '75rem'
defaults.layout.container.lg = {}
defaults.layout.container.lg.width = '65rem'
defaults.layout.container.lg.padding = { base: '0 1.25rem', md: '0 2.5rem' }
defaults.layout.container.md = {}
defaults.layout.container.md.width = '840px'
defaults.layout.container.sm = {}
defaults.layout.container.sm.width = '768px'

defaults.toast = {}
defaults.toast.duration = 5000
defaults.toast.txHashDuration = 8000
defaults.toast.closable = true
defaults.toast.position = 'top'

export default defaults
