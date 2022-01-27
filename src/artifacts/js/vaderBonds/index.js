import defaults from '../../../common/defaults'
export default [
  {
    name: 'Uniswap V2 APHRA / USDV LP',
    address: '0x1b96d82b8b13c75d4ce347a53284b10d93b63684',
    zap: '0x781b2844605298fb45c653dc1ef0d0b941293323',
    principal: {
      address: '0x452c60e1e3ae0965cd27db1c7b3a525d197ca0aa',
      name: 'Uniswap APHRA/USDV LP',
      symbol: 'UNI-V2',
      decimals: 18,
    },
    token0: {
      address: defaults?.address.aphra,
      name: 'APHRA',
      symbol: 'APHRA',
      decimals: 18,
      logoURI:
        'https://raw.githubusercontent.com/vetherasset/branding/main/vader/vader-symbol-w-ring.png',
    },
    token1: {
      address: defaults?.address.usdv,
      name: 'USDV',
      symbol: 'USDV',
      decimals: 18,
      logoURI:
        'https://raw.githubusercontent.com/aphrafinance//65a55cc1d1e89e1549b3d119d296ac8d701a37ea/src/assets/png/eth-diamond-purple-purple.png',
    },
    payout: {
      address: defaults?.address.aphra,
      name: 'APHRA',
      symbol: 'APHRA',
      decimals: 18,
      logoURI:
        'https://raw.githubusercontent.com/vetherasset/branding/main/vader/vader-symbol-w-ring.png',
    },
  },
  {
    name: 'Vader',
    address: '0x1b96d82b8b13c75d4ce347a53284b10d93b63684',
    zap: '0x781b2844605298fb45c653dc1ef0d0b941293323',
    principal: {
      address: defaults?.address.vader,
      name: 'Convex Finance',
      symbol: 'CVX',
      decimals: 18,
    },
    token0: {
      address: defaults?.address.vader,
      name: 'Convex Finance',
      symbol: 'CVX',
      decimals: 18,
      logoURI:
        'https://raw.githubusercontent.com/vetherasset/branding/main/vader/vader-symbol-w-ring.png',
    },
    payout: {
      address: defaults?.address.aphra,
      name: 'APHRA',
      symbol: 'APHRA',
      decimals: 18,
      logoURI:
        'https://raw.githubusercontent.com/vetherasset/branding/main/vader/vader-symbol-w-ring.png',
    },
  },
  {
    name: 'Vader',
    address: '0x1b96d82b8b13c75d4ce347a53284b10d93b63684',
    zap: '0x781b2844605298fb45c653dc1ef0d0b941293323',
    principal: {
      address: '0x452c60e1e3ae0965cd27db1c7b3a525d197ca0aa',
      name: 'Vader',
      symbol: 'Vader',
      decimals: 18,
    },
    token0: {
      address: defaults?.address.vader,
      name: 'VADER',
      symbol: 'VADER',
      decimals: 18,
      logoURI:
        'https://raw.githubusercontent.com/vetherasset/branding/main/vader/vader-symbol-w-ring.png',
    },
    payout: {
      address: defaults?.address.aphra,
      name: 'APHRA',
      symbol: 'APHRA',
      decimals: 18,
      logoURI:
        'https://raw.githubusercontent.com/vetherasset/branding/main/vader/vader-symbol-w-ring.png',
    },
  },
]
