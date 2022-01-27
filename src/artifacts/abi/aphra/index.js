module.exports = [
    {
        'type': 'constructor',
        'inputs': [
            {
                'internalType': 'bytes32',
                'name': 'merkleRoot_',
                'type': 'bytes32',
            },
            {
                'internalType': 'address',
                'name': 'minter_',
                'type': 'address',
            },
            {
                'internalType': 'uint256',
                'name': 'mintingAllowedAfter_',
                'type': 'uint256',
            },
        ],
    },
    {
        'type': 'function',
        'name': 'DELEGATION_TYPEHASH',
        'inputs': [],
        'outputs': [
            {
                'internalType': 'bytes32',
                'name': '',
                'type': 'bytes32',
            },
        ],
        'constant': null,
        'stateMutability': 'view',
    },
    {
        'type': 'function',
        'name': 'DOMAIN_SEPARATOR',
        'inputs': [],
        'outputs': [
            {
                'internalType': 'bytes32',
                'name': '',
                'type': 'bytes32',
            },
        ],
        'constant': null,
        'stateMutability': 'view',
    },
    {
        'type': 'function',
        'name': 'PERMIT_TYPEHASH',
        'inputs': [],
        'outputs': [
            {
                'internalType': 'bytes32',
                'name': '',
                'type': 'bytes32',
            },
        ],
        'constant': null,
        'stateMutability': 'view',
    },
    {
        'type': 'function',
        'name': 'allowance',
        'inputs': [
            {
                'internalType': 'address',
                'name': '',
                'type': 'address',
            },
            {
                'internalType': 'address',
                'name': '',
                'type': 'address',
            },
        ],
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256',
            },
        ],
        'constant': null,
        'stateMutability': 'view',
    },
    {
        'type': 'function',
        'name': 'approve',
        'inputs': [
            {
                'internalType': 'address',
                'name': 'spender',
                'type': 'address',
            },
            {
                'internalType': 'uint256',
                'name': 'amount',
                'type': 'uint256',
            },
        ],
        'outputs': [
            {
                'internalType': 'bool',
                'name': '',
                'type': 'bool',
            },
        ],
        'constant': null,
        'stateMutability': 'nonpayable',
    },
    {
        'type': 'function',
        'name': 'balanceOf',
        'inputs': [
            {
                'internalType': 'address',
                'name': '',
                'type': 'address',
            },
        ],
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256',
            },
        ],
        'constant': null,
        'stateMutability': 'view',
    },
    {
        'type': 'function',
        'name': 'burn',
        'inputs': [
            {
                'internalType': 'uint256',
                'name': 'amount',
                'type': 'uint256',
            },
        ],
        'outputs': [],
        'constant': null,
        'stateMutability': 'nonpayable',
    },
    {
        'type': 'function',
        'name': 'checkpoints',
        'inputs': [
            {
                'internalType': 'address',
                'name': '',
                'type': 'address',
            },
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256',
            },
        ],
        'outputs': [
            {
                'internalType': 'uint32',
                'name': 'fromTimestamp',
                'type': 'uint32',
            },
            {
                'internalType': 'uint96',
                'name': 'votes',
                'type': 'uint96',
            },
        ],
        'constant': null,
        'stateMutability': 'view',
    },
    {
        'type': 'function',
        'name': 'claim',
        'inputs': [
            {
                'internalType': 'address',
                'name': 'to',
                'type': 'address',
            },
            {
                'internalType': 'uint256',
                'name': 'amount',
                'type': 'uint256',
            },
            {
                'internalType': 'bytes32[]',
                'name': 'proof',
                'type': 'bytes32[]',
            },
        ],
        'outputs': [],
        'constant': null,
        'stateMutability': 'nonpayable',
    },
    {
        'type': 'function',
        'name': 'decimals',
        'inputs': [],
        'outputs': [
            {
                'internalType': 'uint8',
                'name': '',
                'type': 'uint8',
            },
        ],
        'constant': null,
        'stateMutability': 'view',
    },
    {
        'type': 'function',
        'name': 'delegate',
        'inputs': [
            {
                'internalType': 'address',
                'name': 'delegatee',
                'type': 'address',
            },
        ],
        'outputs': [],
        'constant': null,
        'stateMutability': 'nonpayable',
    },
    {
        'type': 'function',
        'name': 'delegateBySig',
        'inputs': [
            {
                'internalType': 'address',
                'name': 'delegatee',
                'type': 'address',
            },
            {
                'internalType': 'uint256',
                'name': 'nonce',
                'type': 'uint256',
            },
            {
                'internalType': 'uint256',
                'name': 'deadline',
                'type': 'uint256',
            },
            {
                'internalType': 'uint8',
                'name': 'v',
                'type': 'uint8',
            },
            {
                'internalType': 'bytes32',
                'name': 'r',
                'type': 'bytes32',
            },
            {
                'internalType': 'bytes32',
                'name': 's',
                'type': 'bytes32',
            },
        ],
        'outputs': [],
        'constant': null,
        'stateMutability': 'nonpayable',
    },
    {
        'type': 'function',
        'name': 'delegates',
        'inputs': [
            {
                'internalType': 'address',
                'name': 'delegator',
                'type': 'address',
            },
        ],
        'outputs': [
            {
                'internalType': 'address',
                'name': '',
                'type': 'address',
            },
        ],
        'constant': null,
        'stateMutability': 'view',
    },
    {
        'type': 'function',
        'name': 'getCurrentVotes',
        'inputs': [
            {
                'internalType': 'address',
                'name': 'account',
                'type': 'address',
            },
        ],
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256',
            },
        ],
        'constant': null,
        'stateMutability': 'view',
    },
    {
        'type': 'function',
        'name': 'getPriorVotes',
        'inputs': [
            {
                'internalType': 'address',
                'name': 'account',
                'type': 'address',
            },
            {
                'internalType': 'uint256',
                'name': 'timestamp',
                'type': 'uint256',
            },
        ],
        'outputs': [
            {
                'internalType': 'uint96',
                'name': '',
                'type': 'uint96',
            },
        ],
        'constant': null,
        'stateMutability': 'view',
    },
    {
        'type': 'function',
        'name': 'hasClaimed',
        'inputs': [
            {
                'internalType': 'address',
                'name': '',
                'type': 'address',
            },
        ],
        'outputs': [
            {
                'internalType': 'bool',
                'name': '',
                'type': 'bool',
            },
        ],
        'constant': null,
        'stateMutability': 'view',
    },
    {
        'type': 'function',
        'name': 'merkleRoot',
        'inputs': [],
        'outputs': [
            {
                'internalType': 'bytes32',
                'name': '',
                'type': 'bytes32',
            },
        ],
        'constant': null,
        'stateMutability': 'view',
    },
    {
        'type': 'function',
        'name': 'minimumTimeBetweenMints',
        'inputs': [],
        'outputs': [
            {
                'internalType': 'uint32',
                'name': '',
                'type': 'uint32',
            },
        ],
        'constant': null,
        'stateMutability': 'view',
    },
    {
        'type': 'function',
        'name': 'mint',
        'inputs': [
            {
                'internalType': 'uint256',
                'name': 'rawAmount',
                'type': 'uint256',
            },
        ],
        'outputs': [],
        'constant': null,
        'stateMutability': 'nonpayable',
    },
    {
        'type': 'function',
        'name': 'mintCap',
        'inputs': [],
        'outputs': [
            {
                'internalType': 'uint8',
                'name': '',
                'type': 'uint8',
            },
        ],
        'constant': null,
        'stateMutability': 'view',
    },
    {
        'type': 'function',
        'name': 'minter',
        'inputs': [],
        'outputs': [
            {
                'internalType': 'address',
                'name': '',
                'type': 'address',
            },
        ],
        'constant': null,
        'stateMutability': 'view',
    },
    {
        'type': 'function',
        'name': 'mintingAllowedAfter',
        'inputs': [],
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256',
            },
        ],
        'constant': null,
        'stateMutability': 'view',
    },
    {
        'type': 'function',
        'name': 'name',
        'inputs': [],
        'outputs': [
            {
                'internalType': 'string',
                'name': '',
                'type': 'string',
            },
        ],
        'constant': null,
        'stateMutability': 'view',
    },
    {
        'type': 'function',
        'name': 'nonces',
        'inputs': [
            {
                'internalType': 'address',
                'name': '',
                'type': 'address',
            },
        ],
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256',
            },
        ],
        'constant': null,
        'stateMutability': 'view',
    },
    {
        'type': 'function',
        'name': 'numCheckpoints',
        'inputs': [
            {
                'internalType': 'address',
                'name': '',
                'type': 'address',
            },
        ],
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256',
            },
        ],
        'constant': null,
        'stateMutability': 'view',
    },
    {
        'type': 'function',
        'name': 'permit',
        'inputs': [
            {
                'internalType': 'address',
                'name': 'owner',
                'type': 'address',
            },
            {
                'internalType': 'address',
                'name': 'spender',
                'type': 'address',
            },
            {
                'internalType': 'uint256',
                'name': 'value',
                'type': 'uint256',
            },
            {
                'internalType': 'uint256',
                'name': 'deadline',
                'type': 'uint256',
            },
            {
                'internalType': 'uint8',
                'name': 'v',
                'type': 'uint8',
            },
            {
                'internalType': 'bytes32',
                'name': 'r',
                'type': 'bytes32',
            },
            {
                'internalType': 'bytes32',
                'name': 's',
                'type': 'bytes32',
            },
        ],
        'outputs': [],
        'constant': null,
        'stateMutability': 'nonpayable',
    },
    {
        'type': 'function',
        'name': 'setMinter',
        'inputs': [
            {
                'internalType': 'address',
                'name': 'newMinter_',
                'type': 'address',
            },
        ],
        'outputs': [],
        'constant': null,
        'stateMutability': 'nonpayable',
    },
    {
        'type': 'function',
        'name': 'symbol',
        'inputs': [],
        'outputs': [
            {
                'internalType': 'string',
                'name': '',
                'type': 'string',
            },
        ],
        'constant': null,
        'stateMutability': 'view',
    },
    {
        'type': 'function',
        'name': 'totalSupply',
        'inputs': [],
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256',
            },
        ],
        'constant': null,
        'stateMutability': 'view',
    },
    {
        'type': 'function',
        'name': 'transfer',
        'inputs': [
            {
                'internalType': 'address',
                'name': 'to',
                'type': 'address',
            },
            {
                'internalType': 'uint256',
                'name': 'amount',
                'type': 'uint256',
            },
        ],
        'outputs': [
            {
                'internalType': 'bool',
                'name': '',
                'type': 'bool',
            },
        ],
        'constant': null,
        'stateMutability': 'nonpayable',
    },
    {
        'type': 'function',
        'name': 'transferFrom',
        'inputs': [
            {
                'internalType': 'address',
                'name': 'from',
                'type': 'address',
            },
            {
                'internalType': 'address',
                'name': 'to',
                'type': 'address',
            },
            {
                'internalType': 'uint256',
                'name': 'amount',
                'type': 'uint256',
            },
        ],
        'outputs': [
            {
                'internalType': 'bool',
                'name': '',
                'type': 'bool',
            },
        ],
        'constant': null,
        'stateMutability': 'nonpayable',
    },
    {
        'type': 'event',
        'name': 'Approval',
        'inputs': [
            {
                'name': 'owner',
                'type': 'address',
                'indexed': true,
            },
            {
                'name': 'spender',
                'type': 'address',
                'indexed': true,
            },
            {
                'name': 'amount',
                'type': 'uint256',
                'indexed': false,
            },
        ],
        'anonymous': false,
    },
    {
        'type': 'event',
        'name': 'Claim',
        'inputs': [
            {
                'name': 'to',
                'type': 'address',
                'indexed': true,
            },
            {
                'name': 'amount',
                'type': 'uint256',
                'indexed': false,
            },
        ],
        'anonymous': false,
    },
    {
        'type': 'event',
        'name': 'DelegateChanged',
        'inputs': [
            {
                'name': 'delegator',
                'type': 'address',
                'indexed': true,
            },
            {
                'name': 'fromDelegate',
                'type': 'address',
                'indexed': true,
            },
            {
                'name': 'toDelegate',
                'type': 'address',
                'indexed': true,
            },
        ],
        'anonymous': false,
    },
    {
        'type': 'event',
        'name': 'DelegateVotesChanged',
        'inputs': [
            {
                'name': 'delegate',
                'type': 'address',
                'indexed': true,
            },
            {
                'name': 'previousBalance',
                'type': 'uint256',
                'indexed': false,
            },
            {
                'name': 'newBalance',
                'type': 'uint256',
                'indexed': false,
            },
        ],
        'anonymous': false,
    },
    {
        'type': 'event',
        'name': 'MinterChanged',
        'inputs': [
            {
                'name': 'minter',
                'type': 'address',
                'indexed': true,
            },
            {
                'name': 'newMinter',
                'type': 'address',
                'indexed': true,
            },
        ],
        'anonymous': false,
    },
    {
        'type': 'event',
        'name': 'Transfer',
        'inputs': [
            {
                'name': 'from',
                'type': 'address',
                'indexed': true,
            },
            {
                'name': 'to',
                'type': 'address',
                'indexed': true,
            },
            {
                'name': 'amount',
                'type': 'uint256',
                'indexed': false,
            },
        ],
        'anonymous': false,
    },
    {
        'type': 'error',
        'name': 'AlreadyClaimed',
        'inputs': [],
    },
    {
        'type': 'error',
        'name': 'InvalidNonce',
        'inputs': [],
    },
    {
        'type': 'error',
        'name': 'InvalidSignature',
        'inputs': [],
    },
    {
        'type': 'error',
        'name': 'MintCapExceeded',
        'inputs': [
            {
                'internalType': 'uint256',
                'name': 'maxAllowed',
                'type': 'uint256',
            },
            {
                'internalType': 'uint256',
                'name': 'mintAttempt',
                'type': 'uint256',
            },
        ],
    },
    {
        'type': 'error',
        'name': 'NoArrayParity',
        'inputs': [],
    },
    {
        'type': 'error',
        'name': 'NoMintYet',
        'inputs': [],
    },
    {
        'type': 'error',
        'name': 'NotDetermined',
        'inputs': [],
    },
    {
        'type': 'error',
        'name': 'NotInMerkle',
        'inputs': [],
    },
    {
        'type': 'error',
        'name': 'NotMinter',
        'inputs': [],
    },
    {
        'type': 'error',
        'name': 'NullAddress',
        'inputs': [],
    },
    {
        'type': 'error',
        'name': 'SignatureExpired',
        'inputs': [],
    },
    {
        'type': 'error',
        'name': 'Uint32max',
        'inputs': [],
    },
    {
        'type': 'error',
        'name': 'Uint96max',
        'inputs': [],
    },
]
