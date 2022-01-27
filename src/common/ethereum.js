import { ethers } from 'ethers'
import humanStandardTokenAbi from '../artifacts/abi/humanStandardToken'
import converterAbi from '../artifacts/abi/converter'
import defaults from './defaults'
import xVaderAbi from '../artifacts/abi/xvader'
import linearVestingAbi from '../artifacts/abi/linearVesting'
import aphraAbi from '../artifacts/abi/aphra'
import vaderBond from '../artifacts/abi/vaderBond'
import zapEth from '../artifacts/abi/zapEth'
import airdropSnapshot from "../artifacts/json/aphraSnapshot"
const formattedAirDrop = () => {
  const airDrop = {}
  for (const x in airdropSnapshot) {
    airDrop[ethers.utils.getAddress(x)] = airdropSnapshot[x]
  }
  return airDrop
}
const approveERC20ToSpend = async (
  tokenAddress,
  spenderAddress,
  amount,
  provider,
) => {
  const contract = new ethers.Contract(
    tokenAddress,
    humanStandardTokenAbi,
    provider.getSigner(0),
  )
  return await contract.approve(spenderAddress, amount)
}

const getERC20Allowance = async (
  tokenAddress,
  ownerAddress,
  spenderAddress,
  provider,
) => {
  const contract = new ethers.Contract(
    tokenAddress,
    humanStandardTokenAbi,
    provider,
  )
  return await contract.allowance(ownerAddress, spenderAddress)
}

const getERC20BalanceOf = async (tokenAddress, address, provider) => {
  const contract = new ethers.Contract(
    tokenAddress,
    humanStandardTokenAbi,
    provider,
  )
  return await contract.balanceOf(address)
}

const resolveUnknownERC20 = async (tokenAddress, logoURI = '') => {
  let token
  const contract = new ethers.Contract(
    tokenAddress,
    humanStandardTokenAbi,
    defaults.network.provider,
  )
  const address = await contract.resolvedAddress
  const name = await contract
    .name()
    .then(r => {
      return r
    })
    .catch(err => console.log(err))
  const symbol = await contract
    .symbol()
    .then(r => {
      return r
    })
    .catch(err => console.log(err))
  const decimals = await contract
    .decimals()
    .then(r => {
      return r.toNumber()
    })
    .catch(err => console.log(err))

  if (address && name && symbol && decimals && defaults.network.chainId) {
    token = {
      chainId: defaults.network.chainId,
      address: address,
      name: name,
      symbol: symbol,
      decimals: decimals,
      logoURI: logoURI,
    }
  }
  return token
}

const estimateGasCost = async (
  contractAddress,
  abi,
  callName,
  data,
  provider,
) => {
  const contract = new ethers.Contract(
    contractAddress,
    abi,
    provider.getSigner(0),
  )
  const execute = (name, context, args) => {
    return context[name](args)
  }
  return await execute(callName, contract.estimateGas, data)
}

const convert = async (proof, amount, minVader, provider) => {
  const contract = new ethers.Contract(
    defaults.address.converter,
    converterAbi,
    provider.getSigner(0),
  )
  return await contract.convert(proof, amount, minVader)
}

const getClaimed = async addr => {
  const contract = new ethers.Contract(
    defaults.address.aphra,
    aphraAbi,
    defaults.network.provider,
  )
  return await contract.hasClaimed(addr)
}

const getSalt = async () => {
  const contract = new ethers.Contract(
    defaults.address.converter,
    converterAbi,
    defaults.network.provider,
  )
  return await contract.salt()
}

const getClaim = async account => {
  account = ethers.utils.getAddress(account)
  const airDrop = formattedAirDrop()
  // eslint-disable-next-line no-prototype-builtins
  const claim = airDrop.hasOwnProperty(account) ? airDrop[account] : 0
  // eslint-disable-next-line no-debugger
  console.log(claim)
  return claim
}

const getVester = async account => {
  const contract = new ethers.Contract(
    defaults.address.linearVesting,
    linearVestingAbi,
    defaults.network.provider,
  )
  return await contract.vest(account)
}

const claim = async (to, amount, proof, provider) => {
  const contract = new ethers.Contract(
    defaults.address.aphra,
    aphraAbi,
    provider.getSigner(0),
  )
  return await contract.claim(to, amount, proof)
}

const stakeVader = async (amount, provider) => {
  const contract = new ethers.Contract(
    defaults.address.xvader,
    xVaderAbi,
    provider.getSigner(0),
  )
  return await contract.enter(amount)
}

const unstakeVader = async (shares, provider) => {
  const contract = new ethers.Contract(
    defaults.address.xvader,
    xVaderAbi,
    provider.getSigner(0),
  )
  return await contract.leave(shares)
}

const bondInfo = async (bondContractAddress, depositorAddress) => {
  const contract = new ethers.Contract(
    bondContractAddress,
    vaderBond,
    defaults.network.provider,
  )
  return await contract.bondInfo(depositorAddress)
}

const bondPrice = async bondContractAddress => {
  const contract = new ethers.Contract(
    bondContractAddress,
    vaderBond,
    defaults.network.provider,
  )
  return await contract.bondPrice()
}

const bondCurrentDebt = async bondContractAddress => {
  const contract = new ethers.Contract(
    bondContractAddress,
    vaderBond,
    defaults.network.provider,
  )
  return await contract.currentDebt()
}

const bondDebtDecay = async bondContractAddress => {
  const contract = new ethers.Contract(
    bondContractAddress,
    vaderBond,
    defaults.network.provider,
  )
  return await contract.debtDecay()
}

const bondDebtRatio = async bondContractAddress => {
  const contract = new ethers.Contract(
    bondContractAddress,
    vaderBond,
    defaults.network.provider,
  )
  return await contract.debtRatio()
}

const bondLastDecay = async bondContractAddress => {
  const contract = new ethers.Contract(
    bondContractAddress,
    vaderBond,
    defaults.network.provider,
  )
  return await contract.lastDecay()
}

const bondPayoutFor = async (bondContractAddress, value) => {
  const contract = new ethers.Contract(
    bondContractAddress,
    vaderBond,
    defaults.network.provider,
  )
  return await contract.payoutFor(value)
}

const bondMaxPayout = async bondContractAddress => {
  const contract = new ethers.Contract(
    bondContractAddress,
    vaderBond,
    defaults.network.provider,
  )
  return await contract.maxPayout()
}

const bondPendingPayoutFor = async (bondContractAddress, depositorAccount) => {
  const contract = new ethers.Contract(
    bondContractAddress,
    vaderBond,
    defaults.network.provider,
  )
  return await contract.pendingPayoutFor(depositorAccount)
}

const bondPercentVestedFor = async bondContractAddress => {
  const contract = new ethers.Contract(
    bondContractAddress,
    vaderBond,
    defaults.network.provider,
  )
  return await contract.percentVestedFor()
}

const bondPayoutToken = async bondContractAddress => {
  const contract = new ethers.Contract(
    bondContractAddress,
    vaderBond,
    defaults.network.provider,
  )
  return await contract.payoutToken()
}

const bondPrincipalToken = async bondContractAddress => {
  const contract = new ethers.Contract(
    bondContractAddress,
    vaderBond,
    defaults.network.provider,
  )
  return await contract.principalToken()
}

const bondTerms = async bondContractAddress => {
  const contract = new ethers.Contract(
    bondContractAddress,
    vaderBond,
    defaults.network.provider,
  )
  return await contract.terms()
}

const bondTotalDebt = async bondContractAddress => {
  const contract = new ethers.Contract(
    bondContractAddress,
    vaderBond,
    defaults.network.provider,
  )
  return await contract.totalDebt()
}

const bondTreasury = async bondContractAddress => {
  const contract = new ethers.Contract(
    bondContractAddress,
    vaderBond,
    defaults.network.provider,
  )
  return await contract.treasury()
}

const bondDeposit = async (
  amount,
  maxPrice,
  depositor,
  bondContractAddress,
  provider,
) => {
  const contract = new ethers.Contract(
    bondContractAddress,
    vaderBond,
    provider.getSigner(0),
  )
  return await contract.deposit(amount, maxPrice, depositor)
}

const bondRedeem = async (bondContractAddress, depositor, provider) => {
  const contract = new ethers.Contract(
    bondContractAddress,
    vaderBond,
    provider.getSigner(0),
  )
  return await contract.redeem(depositor)
}

const zapDeposit = async (zapContractAddress, amount, minPayout, provider) => {
  const contract = new ethers.Contract(
    zapContractAddress,
    zapEth,
    provider.getSigner(0),
  )
  const options = {
    value: amount,
  }
  return await contract.zap(minPayout, options)
}

export {
  approveERC20ToSpend,
  getERC20BalanceOf,
  resolveUnknownERC20,
  estimateGasCost,
  getERC20Allowance,
  convert,
  bondInfo,
  bondPrice,
  bondCurrentDebt,
  bondDebtDecay,
  stakeVader,
  unstakeVader,
  bondDebtRatio,
  bondLastDecay,
  bondPayoutFor,
  bondPendingPayoutFor,
  bondPayoutToken,
  bondPercentVestedFor,
  bondPrincipalToken,
  bondTerms,
  bondTotalDebt,
  bondTreasury,
  bondDeposit,
  bondRedeem,
  bondMaxPayout,
  getSalt,
  getClaimed,
  getClaim,
  getVester,
  claim,
  resolveUnknownERC20 as resolveERC20,
  zapDeposit,
  formattedAirDrop,
}
