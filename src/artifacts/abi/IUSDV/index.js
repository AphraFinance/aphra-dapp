module.exports = [{ 'inputs':[{ 'internalType':'contract IERC20Extended', 'name':'_vader', 'type':'address' }], 'stateMutability':'nonpayable', 'type':'constructor' }, { 'anonymous':false, 'inputs':[{ 'indexed':true, 'internalType':'address', 'name':'owner', 'type':'address' }, { 'indexed':true, 'internalType':'address', 'name':'spender', 'type':'address' }, { 'indexed':false, 'internalType':'uint256', 'name':'value', 'type':'uint256' }], 'name':'Approval', 'type':'event' }, { 'anonymous':false, 'inputs':[{ 'indexed':false, 'internalType':'uint256', 'name':'previousDailyLimit', 'type':'uint256' }, { 'indexed':false, 'internalType':'uint256', 'name':'dailyLimit', 'type':'uint256' }], 'name':'DailyLimitChanged', 'type':'event' }, { 'anonymous':false, 'inputs':[{ 'indexed':false, 'internalType':'uint256', 'name':'previousExchangeFee', 'type':'uint256' }, { 'indexed':false, 'internalType':'uint256', 'name':'exchangeFee', 'type':'uint256' }], 'name':'ExchangeFeeChanged', 'type':'event' }, { 'anonymous':false, 'inputs':[{ 'indexed':false, 'internalType':'address', 'name':'previous', 'type':'address' }, { 'indexed':false, 'internalType':'address', 'name':'current', 'type':'address' }], 'name':'GuardianSet', 'type':'event' }, { 'anonymous':false, 'inputs':[{ 'indexed':false, 'internalType':'address', 'name':'user', 'type':'address' }, { 'indexed':false, 'internalType':'enum IUSDV.LockTypes', 'name':'lockType', 'type':'uint8' }, { 'indexed':false, 'internalType':'uint256', 'name':'lockAmount', 'type':'uint256' }, { 'indexed':false, 'internalType':'uint256', 'name':'lockRelease', 'type':'uint256' }], 'name':'LockClaimed', 'type':'event' }, { 'anonymous':false, 'inputs':[{ 'indexed':false, 'internalType':'address', 'name':'user', 'type':'address' }, { 'indexed':false, 'internalType':'enum IUSDV.LockTypes', 'name':'lockType', 'type':'uint8' }, { 'indexed':false, 'internalType':'uint256', 'name':'lockAmount', 'type':'uint256' }, { 'indexed':false, 'internalType':'uint256', 'name':'lockRelease', 'type':'uint256' }], 'name':'LockCreated', 'type':'event' }, { 'anonymous':false, 'inputs':[{ 'indexed':false, 'internalType':'bool', 'name':'status', 'type':'bool' }], 'name':'LockStatusSet', 'type':'event' }, { 'anonymous':false, 'inputs':[{ 'indexed':false, 'internalType':'address', 'name':'minter', 'type':'address' }], 'name':'MinterSet', 'type':'event' }, { 'anonymous':false, 'inputs':[{ 'indexed':true, 'internalType':'address', 'name':'previousOwner', 'type':'address' }, { 'indexed':true, 'internalType':'address', 'name':'newOwner', 'type':'address' }], 'name':'OwnershipTransferred', 'type':'event' }, { 'anonymous':false, 'inputs':[{ 'indexed':true, 'internalType':'address', 'name':'from', 'type':'address' }, { 'indexed':true, 'internalType':'address', 'name':'to', 'type':'address' }, { 'indexed':false, 'internalType':'uint256', 'name':'value', 'type':'uint256' }], 'name':'Transfer', 'type':'event' }, { 'anonymous':false, 'inputs':[{ 'indexed':false, 'internalType':'address', 'name':'previous', 'type':'address' }, { 'indexed':false, 'internalType':'address', 'name':'current', 'type':'address' }], 'name':'ValidatorSet', 'type':'event' }, { 'inputs':[{ 'internalType':'address', 'name':'owner', 'type':'address' }, { 'internalType':'address', 'name':'spender', 'type':'address' }], 'name':'allowance', 'outputs':[{ 'internalType':'uint256', 'name':'', 'type':'uint256' }], 'stateMutability':'view', 'type':'function' }, { 'inputs':[{ 'internalType':'address', 'name':'spender', 'type':'address' }, { 'internalType':'uint256', 'name':'amount', 'type':'uint256' }], 'name':'approve', 'outputs':[{ 'internalType':'bool', 'name':'', 'type':'bool' }], 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[{ 'internalType':'address', 'name':'account', 'type':'address' }], 'name':'balanceOf', 'outputs':[{ 'internalType':'uint256', 'name':'', 'type':'uint256' }], 'stateMutability':'view', 'type':'function' }, { 'inputs':[{ 'internalType':'address', 'name':'account', 'type':'address' }, { 'internalType':'uint256', 'name':'uAmount', 'type':'uint256' }, { 'internalType':'uint256', 'name':'vAmount', 'type':'uint256' }, { 'internalType':'uint256', 'name':'exchangeFee', 'type':'uint256' }, { 'internalType':'uint256', 'name':'window', 'type':'uint256' }], 'name':'burn', 'outputs':[{ 'internalType':'uint256', 'name':'', 'type':'uint256' }], 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[{ 'internalType':'uint256', 'name':'i', 'type':'uint256' }], 'name':'claim', 'outputs':[{ 'internalType':'uint256', 'name':'', 'type':'uint256' }], 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[], 'name':'claimAll', 'outputs':[{ 'internalType':'uint256', 'name':'usdvAmount', 'type':'uint256' }, { 'internalType':'uint256', 'name':'vaderAmount', 'type':'uint256' }], 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[], 'name':'decimals', 'outputs':[{ 'internalType':'uint8', 'name':'', 'type':'uint8' }], 'stateMutability':'view', 'type':'function' }, { 'inputs':[{ 'internalType':'address', 'name':'spender', 'type':'address' }, { 'internalType':'uint256', 'name':'subtractedValue', 'type':'uint256' }], 'name':'decreaseAllowance', 'outputs':[{ 'internalType':'bool', 'name':'', 'type':'bool' }], 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[{ 'internalType':'address', 'name':'account', 'type':'address' }], 'name':'getLockCount', 'outputs':[{ 'internalType':'uint256', 'name':'', 'type':'uint256' }], 'stateMutability':'view', 'type':'function' }, { 'inputs':[], 'name':'guardian', 'outputs':[{ 'internalType':'address', 'name':'', 'type':'address' }], 'stateMutability':'view', 'type':'function' }, { 'inputs':[{ 'internalType':'address', 'name':'spender', 'type':'address' }, { 'internalType':'uint256', 'name':'addedValue', 'type':'uint256' }], 'name':'increaseAllowance', 'outputs':[{ 'internalType':'bool', 'name':'', 'type':'bool' }], 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[], 'name':'isLocked', 'outputs':[{ 'internalType':'bool', 'name':'', 'type':'bool' }], 'stateMutability':'view', 'type':'function' }, { 'inputs':[{ 'internalType':'address', 'name':'', 'type':'address' }, { 'internalType':'uint256', 'name':'', 'type':'uint256' }], 'name':'locks', 'outputs':[{ 'internalType':'enum IUSDV.LockTypes', 'name':'token', 'type':'uint8' }, { 'internalType':'uint256', 'name':'amount', 'type':'uint256' }, { 'internalType':'uint256', 'name':'release', 'type':'uint256' }], 'stateMutability':'view', 'type':'function' }, { 'inputs':[{ 'internalType':'address', 'name':'account', 'type':'address' }, { 'internalType':'uint256', 'name':'vAmount', 'type':'uint256' }, { 'internalType':'uint256', 'name':'uAmount', 'type':'uint256' }, { 'internalType':'uint256', 'name':'exchangeFee', 'type':'uint256' }, { 'internalType':'uint256', 'name':'window', 'type':'uint256' }], 'name':'mint', 'outputs':[{ 'internalType':'uint256', 'name':'', 'type':'uint256' }], 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[], 'name':'minter', 'outputs':[{ 'internalType':'address', 'name':'', 'type':'address' }], 'stateMutability':'view', 'type':'function' }, { 'inputs':[], 'name':'name', 'outputs':[{ 'internalType':'string', 'name':'', 'type':'string' }], 'stateMutability':'view', 'type':'function' }, { 'inputs':[], 'name':'owner', 'outputs':[{ 'internalType':'address', 'name':'', 'type':'address' }], 'stateMutability':'view', 'type':'function' }, { 'inputs':[], 'name':'renounceOwnership', 'outputs':[], 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[{ 'internalType':'address', 'name':'_guardian', 'type':'address' }], 'name':'setGuardian', 'outputs':[], 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[{ 'internalType':'bool', 'name':'_lock', 'type':'bool' }], 'name':'setLock', 'outputs':[], 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[{ 'internalType':'address', 'name':'_minter', 'type':'address' }], 'name':'setMinter', 'outputs':[], 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[{ 'internalType':'contract IUnlockValidator', 'name':'_validator', 'type':'address' }], 'name':'setValidator', 'outputs':[], 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[], 'name':'symbol', 'outputs':[{ 'internalType':'string', 'name':'', 'type':'string' }], 'stateMutability':'view', 'type':'function' }, { 'inputs':[], 'name':'totalSupply', 'outputs':[{ 'internalType':'uint256', 'name':'', 'type':'uint256' }], 'stateMutability':'view', 'type':'function' }, { 'inputs':[{ 'internalType':'address', 'name':'recipient', 'type':'address' }, { 'internalType':'uint256', 'name':'amount', 'type':'uint256' }], 'name':'transfer', 'outputs':[{ 'internalType':'bool', 'name':'', 'type':'bool' }], 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[{ 'internalType':'address', 'name':'sender', 'type':'address' }, { 'internalType':'address', 'name':'recipient', 'type':'address' }, { 'internalType':'uint256', 'name':'amount', 'type':'uint256' }], 'name':'transferFrom', 'outputs':[{ 'internalType':'bool', 'name':'', 'type':'bool' }], 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[{ 'internalType':'address', 'name':'newOwner', 'type':'address' }], 'name':'transferOwnership', 'outputs':[], 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[], 'name':'vader', 'outputs':[{ 'internalType':'contract IERC20Extended', 'name':'', 'type':'address' }], 'stateMutability':'view', 'type':'function' }, { 'inputs':[], 'name':'validator', 'outputs':[{ 'internalType':'contract IUnlockValidator', 'name':'', 'type':'address' }], 'stateMutability':'view', 'type':'function' }]
