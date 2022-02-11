module.exports = [
  {
    type: 'constructor',
    inputs: [
      {
        internalType: 'contract ERC20',
        name: '_UNDERLYING',
        type: 'address',
      },
    ],
  },
  {
    type: 'function',
    name: 'DOMAIN_SEPARATOR',
    inputs: [],
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'UNDERLYING',
    inputs: [],
    outputs: [
      {
        internalType: 'contract ERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'allowance',
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'approve',
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'authority',
    inputs: [],
    outputs: [
      {
        internalType: 'contract Authority',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'balanceOfUnderlying',
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'claimFees',
    inputs: [
      {
        internalType: 'uint256',
        name: 'avTokenAmount',
        type: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'decimals',
    inputs: [],
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'deposit',
    inputs: [
      {
        internalType: 'uint256',
        name: 'underlyingAmount',
        type: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'depositIntoStrategy',
    inputs: [
      {
        internalType: 'contract Strategy',
        name: 'strategy',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'underlyingAmount',
        type: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'destroy',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'distrustStrategy',
    inputs: [
      {
        internalType: 'contract Strategy',
        name: 'strategy',
        type: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'exchangeRate',
    inputs: [],
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'feePercent',
    inputs: [],
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getStrategyData',
    inputs: [
      {
        internalType: 'contract Strategy',
        name: '',
        type: 'address',
      },
    ],
    outputs: [
      {
        internalType: 'bool',
        name: 'trusted',
        type: 'bool',
      },
      {
        internalType: 'uint248',
        name: 'balance',
        type: 'uint248',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getWithdrawalStack',
    inputs: [],
    outputs: [
      {
        internalType: 'contract Strategy[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'harvest',
    inputs: [
      {
        internalType: 'contract Strategy[]',
        name: 'strategies',
        type: 'address[]',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'harvestDelay',
    inputs: [],
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'harvestWindow',
    inputs: [],
    outputs: [
      {
        internalType: 'uint128',
        name: '',
        type: 'uint128',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'initialize',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'isInitialized',
    inputs: [],
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'lastHarvest',
    inputs: [],
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'lastHarvestWindowStart',
    inputs: [],
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'lockedProfit',
    inputs: [],
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'maxLockedProfit',
    inputs: [],
    outputs: [
      {
        internalType: 'uint128',
        name: '',
        type: 'uint128',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'name',
    inputs: [],
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'nextHarvestDelay',
    inputs: [],
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'nonces',
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'permit',
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'v',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'popFromWithdrawalStack',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'pushToWithdrawalStack',
    inputs: [
      {
        internalType: 'contract Strategy',
        name: 'strategy',
        type: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'redeem',
    inputs: [
      {
        internalType: 'uint256',
        name: 'avTokenAmount',
        type: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'replaceWithdrawalStackIndex',
    inputs: [
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
      {
        internalType: 'contract Strategy',
        name: 'replacementStrategy',
        type: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'replaceWithdrawalStackIndexWithTip',
    inputs: [
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'seizeStrategy',
    inputs: [
      {
        internalType: 'contract Strategy',
        name: 'strategy',
        type: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setAuthority',
    inputs: [
      {
        internalType: 'contract Authority',
        name: 'newAuthority',
        type: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setFeePercent',
    inputs: [
      {
        internalType: 'uint256',
        name: 'newFeePercent',
        type: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setHarvestDelay',
    inputs: [
      {
        internalType: 'uint64',
        name: 'newHarvestDelay',
        type: 'uint64',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setHarvestWindow',
    inputs: [
      {
        internalType: 'uint128',
        name: 'newHarvestWindow',
        type: 'uint128',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setOwner',
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setTargetFloatPercent',
    inputs: [
      {
        internalType: 'uint256',
        name: 'newTargetFloatPercent',
        type: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setUnderlyingIsWETH',
    inputs: [
      {
        internalType: 'bool',
        name: 'newUnderlyingIsWETH',
        type: 'bool',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setWithdrawalStack',
    inputs: [
      {
        internalType: 'contract Strategy[]',
        name: 'newStack',
        type: 'address[]',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'swapWithdrawalStackIndexes',
    inputs: [
      {
        internalType: 'uint256',
        name: 'index1',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'index2',
        type: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'symbol',
    inputs: [],
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'targetFloatPercent',
    inputs: [],
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalFloat',
    inputs: [],
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalHoldings',
    inputs: [],
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalUnderlyingHeld',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalStrategyHoldings',
    inputs: [],
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalSupply',
    inputs: [],
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'transfer',
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'transferFrom',
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'trustStrategy',
    inputs: [
      {
        internalType: 'contract Strategy',
        name: 'strategy',
        type: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'underlyingIsWETH',
    inputs: [],
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'withdraw',
    inputs: [
      {
        internalType: 'uint256',
        name: 'underlyingAmount',
        type: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'withdrawFromStrategy',
    inputs: [
      {
        internalType: 'contract Strategy',
        name: 'strategy',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'underlyingAmount',
        type: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'withdrawalStack',
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        internalType: 'contract Strategy',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'Approval',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'AuthorityUpdated',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newAuthority',
        type: 'address',
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Deposit',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
      },
      {
        name: 'underlyingAmount',
        type: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'FeePercentUpdated',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newFeePercent',
        type: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'FeesClaimed',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
      },
      {
        name: 'avTokenAmount',
        type: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Harvest',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
      },
      {
        name: 'strategies',
        type: 'address[]',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'HarvestDelayUpdateScheduled',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newHarvestDelay',
        type: 'uint64',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'HarvestDelayUpdated',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newHarvestDelay',
        type: 'uint64',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'HarvestWindowUpdated',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newHarvestWindow',
        type: 'uint128',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Initialized',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnerUpdated',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        type: 'address',
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'StrategyDeposit',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
      },
      {
        name: 'strategy',
        type: 'address',
        indexed: true,
      },
      {
        name: 'underlyingAmount',
        type: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'StrategyDistrusted',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
      },
      {
        name: 'strategy',
        type: 'address',
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'StrategySeized',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
      },
      {
        name: 'strategy',
        type: 'address',
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'StrategyTrusted',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
      },
      {
        name: 'strategy',
        type: 'address',
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'StrategyWithdrawal',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
      },
      {
        name: 'strategy',
        type: 'address',
        indexed: true,
      },
      {
        name: 'underlyingAmount',
        type: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'TargetFloatPercentUpdated',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newTargetFloatPercent',
        type: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      {
        name: 'from',
        type: 'address',
        indexed: true,
      },
      {
        name: 'to',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'UnderlyingIsWETHUpdated',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newUnderlyingIsWETH',
        type: 'bool',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Withdraw',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
      },
      {
        name: 'underlyingAmount',
        type: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'WithdrawalStackIndexReplaced',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
      },
      {
        name: 'index',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'replacedStrategy',
        type: 'address',
        indexed: true,
      },
      {
        name: 'replacementStrategy',
        type: 'address',
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'WithdrawalStackIndexReplacedWithTip',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
      },
      {
        name: 'index',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'replacedStrategy',
        type: 'address',
        indexed: true,
      },
      {
        name: 'previousTipStrategy',
        type: 'address',
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'WithdrawalStackIndexesSwapped',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
      },
      {
        name: 'index1',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'index2',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newStrategy1',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newStrategy2',
        type: 'address',
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'WithdrawalStackPopped',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
      },
      {
        name: 'poppedStrategy',
        type: 'address',
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'WithdrawalStackPushed',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
      },
      {
        name: 'pushedStrategy',
        type: 'address',
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'WithdrawalStackSet',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
      },
      {
        name: 'replacedWithdrawalStack',
        type: 'address[]',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'receive',
  },
]
