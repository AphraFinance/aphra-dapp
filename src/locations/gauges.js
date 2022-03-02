import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Button,
  Flex,
  Spacer,
  HStack,
  Text,
  Tab,
  TabList,
  Tabs,
  TabPanels,
  TabPanel,
  Input,
  InputGroup,
  InputRightAddon,
  useToast,
  Link,
  Image,
  Spinner,
} from '@chakra-ui/react'
import defaults from '../common/defaults'
import { useWallet } from 'use-wallet'
import { BigNumber, ethers } from 'ethers'
import {
  getERC20BalanceOf,
  getERC20Allowance,
  approveERC20ToSpend,
  getGaugeBalanceOf,
  gaugeWithdraw,
  gaugeDeposit,
  gaugeClaimAndExit,
  getVeBalanceOfNFT,
  getVeNFTsOfAddress,
  getVotesForNFT,
  setVotesForNFT,
  getGaugeEarned,
  getGaugeWeight,
  getTotalWeight,
} from '../common/ethereum'
import {
  approved,
  rejected,
  failed,
  walletNotConnected,
  noAmount,
  tokenValueTooSmall,
  noToken0,
  exception,
  insufficientBalance,
  gaugeWithdrawMessage,
  gaugeDepositMessage,
  votedSuccessfully,
} from '../messages'
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from '@chakra-ui/react'
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'
import { txnErrHandler, txnHandler } from './vaults'
import { prettifyNumber } from '../common/utils'
import v0 from '../artifacts/json/v0.json'

const totalPowerUsed = voteValues => {
  if (!voteValues) return 0
  return Object.values(voteValues).reduce(
    (totalVal, val) => totalVal + parseInt(val),
    0,
  )
}

const Gauge = props => {
  const [assets] = useState(defaults.gauges)
  const voteDefaults = 0
  const wallet = useWallet()
  const [voteValues, setVoteValues] = useState({})
  const [activeTokenId, setActiveTokenId] = useState({})
  const [remainingVotePower, setRemainingVotePower] = useState(0)
  const [working, setWorking] = useState(false)
  const toast = useToast()

  const submitVote = () => {
    if (!working) {
      if (!wallet.account) {
        toast(walletNotConnected)
      } else if (voteValues) {
        // format vote values
        const assetVotes = []
        const assetWeights = []
        for (const [asset, weight] of Object.entries(voteValues)) {
          if (parseInt(weight) > 0) {
            assetVotes.push(asset)

            assetWeights.push(BigNumber.from(weight.toString()))
          }
        }
        const provider = new ethers.providers.Web3Provider(wallet.ethereum)
        setVotesForNFT(activeTokenId, assetVotes, assetWeights, provider).then(
          tx =>
            txnHandler(tx, votedSuccessfully, toast, null).catch(err =>
              txnErrHandler(err, toast, null),
            ),
        )
      } else {
        toast(noAmount)
      }
    }
  }

  useEffect(async () => {
    const totalVotes = await getVeBalanceOfNFT(activeTokenId)
    if (totalVotes.toString() !== '0') {
      defaults.gauges.map(async el => {
        const votes = await getVotesForNFT(
          activeTokenId,
          el.gaugeAsset.address,
        ).catch(err => console.log(err))
        if (votes) {
          setVoteValues(old => ({
            ...old,
            [`${el.gaugeAsset.address}`]: Math.floor(
              votes.mul(100).div(totalVotes).toNumber(),
            ),
          }))
        }
        setRemainingVotePower(100 - totalPowerUsed(voteValues))
      })
    }
  }, [wallet.account, activeTokenId, setRemainingVotePower, setVoteValues])

  useEffect(async () => {
    if (wallet.account) {
      const nfts = await getVeNFTsOfAddress(wallet.account)
      setActiveTokenId(nfts[0])
    }
  }, [wallet.account, setActiveTokenId])
  return (
    <Box
      minHeight="634.95px"
      maxWidth={defaults.layout.container.xl.width}
      m="0 auto"
      p={{ base: '5rem 1.2rem 0', md: '5rem 1.2rem 0' }}
      {...props}
    >
      <Flex flexDir={{ base: 'column', md: 'row' }}>
        <HStack spacing={'2rem'}>
          {assets.map(el => (
            <Flex key={`flex-${el.gauge}`} flexDir={'column'}>
              <GaugeItem asset={el} />
              {activeTokenId && (
                <Flex justifyContent={'center'} mt={'2rem'}>
                  <NumberInput
                    size={'lg'}
                    onChange={value => {
                      const newState = {}
                      if (
                        totalPowerUsed(voteValues) < 100 ||
                        value < voteValues[`${el.gaugeAsset.address}`]
                      ) {
                        newState[`${el.gaugeAsset.address}`] = value
                      }
                      setVoteValues(old => ({
                        ...old,
                        ...newState,
                      }))
                      setRemainingVotePower(100 - totalPowerUsed(voteValues))
                    }}
                    value={voteValues[el.gaugeAsset?.address] || 0}
                    defaultValue={voteDefaults}
                    max={100}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Flex>
              )}
            </Flex>
          ))}
        </HStack>
      </Flex>
      {activeTokenId && (
        <Flex mt={'2rem'} justifyContent={'center'} flexDir={'row'}>
          <Flex justifyContent={'center'} flexDir={'row'}>
            <HStack>
              <Flex>
                <Button
                  onClick={() => {
                    setVoteValues({})
                  }}
                >
                  Reset
                </Button>
              </Flex>
              <Spacer />

              <Flex>Voting Power Used {totalPowerUsed(voteValues)}%</Flex>
              <Spacer />
              <Flex>
                <Button onClick={() => submitVote()}>Vote</Button>
              </Flex>
            </HStack>
          </Flex>
        </Flex>
      )}
    </Box>
  )
}

export const GaugeItem = props => {
  GaugeItem.propTypes = {
    asset: PropTypes.object,
  }

  const { asset } = props
  const wallet = useWallet()
  const [balance0, setToken0balance] = useState(ethers.BigNumber.from('0'))
  const [balance1, setToken1balance] = useState(ethers.BigNumber.from('0'))
  const [refreshDataToken, setRefreshDataToken] = useState(Date.now())
  const [totalWeight, setTotalWeight] = useState(ethers.BigNumber.from('0'))
  const [gaugeWeight, setGaugeWeight] = useState(ethers.BigNumber.from('0'))

  useEffect(() => {
    if (wallet?.account && asset) {
      const provider = new ethers.providers.Web3Provider(wallet.ethereum)

      getGaugeBalanceOf(asset.gauge, wallet.account, provider)
        .then(data => {
          setToken1balance(data)
        })
        .catch(err => {
          console.log(err)
        })

      getTotalWeight()
        .then(data => {
          setTotalWeight(data)
        })
        .catch(err => console.log(err))
    }
  }, [wallet?.account, refreshDataToken, asset.gauge])

  useEffect(() => {
    if (wallet?.account && asset) {
      getGaugeWeight(asset.address)
        .then(weight => {
          console.log(weight.toString())
          setGaugeWeight(weight.mul(100).div(totalWeight))
        })
        .catch(err => console.log(err))
    }
  }, [wallet?.account, refreshDataToken, asset.gauge, totalWeight])

  useEffect(() => {
    if (wallet?.account) {
      getERC20BalanceOf(
        asset.address,
        wallet.account,
        defaults.network.provider,
      )
        .then(data => {
          setToken0balance(data)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }, [wallet?.account, refreshDataToken])
  return (
    <Flex layerStyle="colorful" height="482.95px">
      <Tabs width="100%" isFitted colorScheme="bluish">
        <TabList mb="1rem">
          <Tab
            p="1.5rem 0"
            _focus={{
              boxShadow: '0',
              borderRadius: '24px 0 0 0',
            }}
          >
            <Text as="h3" m="0" fontSize="1.24rem">
              Deposit
            </Text>
          </Tab>
          <Tab
            p="1.5rem 0"
            _focus={{
              boxShadow: '0',
              borderRadius: '0 24px 0 0',
            }}
          >
            <Text as="h3" m="0" fontSize="1.24rem">
              Withdraw
            </Text>
          </Tab>
        </TabList>
        <TabPanels p={{ base: '0 0.9rem', md: '0 2.6rem' }}>
          <TabPanel p="0">
            <DepositPanel
              asset={asset}
              totalWeight={totalWeight}
              gaugeWeight={gaugeWeight}
              balance={balance0}
              balance1={balance1}
              refreshData={setRefreshDataToken}
            />
          </TabPanel>
          <TabPanel p="0">
            <WithdrawPanel
              asset={asset}
              totalWeight={totalWeight}
              gaugeWeight={gaugeWeight}
              balance={balance1}
              refreshData={setRefreshDataToken}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  )
}

const DepositPanel = props => {
  DepositPanel.propTypes = {
    asset: PropTypes.object,
    balance: PropTypes.object.isRequired,
    balance1: PropTypes.object.isRequired,
    totalWeight: PropTypes.object.isRequired,
    gaugeWeight: PropTypes.object.isRequired,
    refreshData: PropTypes.func,
  }
  const { asset, balance1, totalWeight, gaugeWeight } = props
  const wallet = useWallet()
  const toast = useToast()
  const [value, setValue] = useState(0)
  const [inputAmount, setInputAmount] = useState('')
  const [activeTokenId, setActiveTokenId] = useState(null)
  const [token0] = useState(asset)
  const [token0Approved, setToken0Approved] = useState(false)
  const [working, setWorking] = useState(false)

  const submit = () => {
    if (!working) {
      if (!wallet.account) {
        toast(walletNotConnected)
      } else if (!token0) {
        toast(noToken0)
      } else if (token0 && !token0Approved) {
        const provider = new ethers.providers.Web3Provider(wallet.ethereum)
        setWorking(true)
        approveERC20ToSpend(
          token0.address,
          token0.gauge,
          defaults.network.erc20.maxApproval,
          provider,
        )
          .then(tx => {
            tx.wait(defaults.network.tx.confirmations)
              .then(() => {
                setWorking(false)
                setToken0Approved(true)
                toast(approved)
              })
              .catch(e => {
                setWorking(false)
                if (e.code === 4001) toast(rejected)
                if (e.code === -32016) toast(exception)
              })
          })
          .catch(err => {
            setWorking(false)
            if (err.code === 'INSUFFICIENT_FUNDS') {
              console.log(
                'Insufficient balance: Your account balance is insufficient.',
              )
              toast(insufficientBalance)
            } else if (err.code === 4001) {
              console.log(
                'Transaction rejected: Your have decided to reject the transaction..',
              )
              toast(rejected)
            } else {
              console.log(err)
              toast(failed)
            }
          })
      } else if (value > 0) {
        if (props.balance.gte(value)) {
          const provider = new ethers.providers.Web3Provider(wallet.ethereum)
          setWorking(true)

          // TODO: associate their veNFT, no boost atm so no associations.
          gaugeDeposit(value, token0.gauge, 0, provider)
            .then(tx => {
              tx.wait(defaults.network.tx.confirmations).then(r => {
                setWorking(false)
                props.refreshData(Date.now())
                toast({
                  ...gaugeDepositMessage(token0),
                  description: (
                    <Link
                      variant="underline"
                      _focus={{
                        boxShadow: '0',
                      }}
                      href={`${defaults.api.etherscanUrl}/tx/${r.transactionHash}`}
                      isExternal
                    >
                      <Box>
                        Click here to view transaction on{' '}
                        <i>
                          <b>Etherscan</b>
                        </i>
                        .
                      </Box>
                    </Link>
                  ),
                  duration: defaults.toast.txHashDuration,
                })
              })
            })
            .catch(err => {
              setWorking(false)
              if (err.code === 4001) {
                console.log(
                  'Transaction rejected: Your have decided to reject the transaction..',
                )
                toast(rejected)
              } else if (err.code === -32016) {
                toast(exception)
              } else {
                console.log(err)
                toast(failed)
              }
            })
        } else {
          toast(insufficientBalance)
        }
      } else {
        toast(noAmount)
      }
    }
  }
  useEffect(async () => {
    if (wallet.account) {
      const nfts = await getVeNFTsOfAddress(wallet.account)
      setActiveTokenId(nfts[0])
    }
  }, [wallet.account, setActiveTokenId])
  useEffect(() => {
    if (wallet.account && token0) {
      setWorking(true)
      getERC20Allowance(
        token0.address,
        wallet.account,
        token0.gauge,
        defaults.network.provider,
      ).then(n => {
        setWorking(false)
        if (n.gt(0)) setToken0Approved(true)
      })
    }
    return () => {
      setWorking(false)
      setToken0Approved(false)
    }
  }, [wallet.account, token0])

  return (
    <>
      <Flex mt="4.2rem" flexDir="column">
        <Flex alignItems="center" justifyContent="space-between">
          <Text
            as="h4"
            fontSize={{ base: '1rem', md: '1.24rem' }}
            fontWeight="bolder"
          >
            Amount
          </Text>
        </Flex>
        <Flex layerStyle="inputLike">
          <InputGroup>
            <Input
              variant="transparent"
              flex="1"
              fontSize="1.3rem"
              fontWeight="bold"
              placeholder="0.0"
              value={inputAmount}
              onChange={e => {
                if (isNaN(e.target.value)) {
                  setInputAmount(prev => prev)
                } else {
                  setInputAmount(String(e.target.value))
                  if (Number(e.target.value) > 0) {
                    try {
                      setValue(
                        ethers.utils.parseUnits(
                          String(e.target.value),
                          token0.decimals,
                        ),
                      )
                    } catch (err) {
                      if (err.code === 'NUMERIC_FAULT') {
                        toast(tokenValueTooSmall)
                      }
                    }
                  }
                }
              }}
            />
            <InputRightAddon
              width="auto"
              borderTopLeftRadius="0.375rem"
              borderBottomLeftRadius="0.375rem"
              paddingInlineStart="0.5rem"
              paddingInlineEnd="0.5rem"
            >
              <Flex
                cursor="pointer"
                zIndex="1"
                onClick={() =>
                  window.open(`https://etherscan.io/address/${token0.gauge}`)
                }
              >
                <Box d="flex" alignItems="center">
                  <Image
                    width="24px"
                    height="24px"
                    mr="5px"
                    src={token0.logoURI}
                    alt={`${token0.name} token`}
                  />
                  <Box as="h3" m="0" fontSize="1.02rem" fontWeight="bold">
                    {token0.symbol}
                  </Box>
                </Box>
              </Flex>
            </InputRightAddon>
          </InputGroup>
        </Flex>
        <Flex mt=".6rem" justifyContent="flex-end" flexDir="row">
          <Button
            variant="outline"
            size="sm"
            mr="0.4rem"
            onClick={() => {
              setInputAmount(
                ethers.utils.formatUnits(
                  props.balance.div(100).mul(25),
                  token0.decimals,
                ),
              )
              setValue(props.balance.div(100).mul(25))
            }}
          >
            25%
          </Button>
          <Button
            variant="outline"
            size="sm"
            mr="0.4rem"
            onClick={() => {
              setInputAmount(
                ethers.utils.formatUnits(
                  props.balance.div(100).mul(50),
                  token0.decimals,
                ),
              )
              setValue(props.balance.div(100).mul(50))
            }}
          >
            50%
          </Button>
          <Button
            variant="outline"
            size="sm"
            mr="0.4rem"
            onClick={() => {
              setInputAmount(
                ethers.utils.formatUnits(
                  props.balance.div(100).mul(75),
                  token0.decimals,
                ),
              )
              setValue(props.balance.div(100).mul(75))
            }}
          >
            75%
          </Button>
          <Button
            variant="outline"
            size="sm"
            mr="0.4rem"
            onClick={() => {
              setInputAmount(
                ethers.utils.formatUnits(props.balance, token0.decimals),
              )
              setValue(props.balance)
            }}
          >
            MAX
          </Button>
        </Flex>
        <Flex mt="5.05rem" justifyContent="center" flexDir="column">
          <Flex justifyContent="center">
            <Button
              minWidth="100%"
              size="lg"
              variant="solidRadial"
              disabled={working}
              onClick={() => submit()}
            >
              <Text as="span" fontWeight="bold">
                {wallet.account && (
                  <>
                    {!working && (
                      <>
                        {token0 && !token0Approved && (
                          <>Approve {token0.symbol}</>
                        )}
                        {token0 && token0Approved && <>Gauge Deposit</>}
                      </>
                    )}
                    {working && (
                      <>
                        <Spinner />
                      </>
                    )}
                  </>
                )}
                {!wallet.account && <>Gauge Deposit</>}
              </Text>
            </Button>
          </Flex>
          {balance1 && (
            <Flex mt={'0.8rem'} justifyContent={'center'}>
              <Flex>Receiving {gaugeWeight.toString()} % of the votes</Flex>
            </Flex>
          )}
        </Flex>
      </Flex>
    </>
  )
}

const WithdrawPanel = props => {
  WithdrawPanel.propTypes = {
    asset: PropTypes.object,
    balance: PropTypes.object.isRequired,
    totalWeight: PropTypes.object.isRequired,
    gaugeWeight: PropTypes.object.isRequired,
    refreshData: PropTypes.func,
  }
  const { asset, balance, totalWeight, gaugeWeight } = props
  const wallet = useWallet()
  const toast = useToast()
  const [value, setValue] = useState(0)
  const [inputAmount, setInputAmount] = useState('')
  const [token0] = useState(asset)
  const [working, setWorking] = useState(false)
  const [earned, setEarned] = useState('0')

  useEffect(() => {
    getGaugeEarned(
      defaults.address.aphra,
      asset.gauge,
      wallet.account,
      defaults.network.provider,
    )
      .then(result => {
        if (result.gt(0)) {
          setEarned(ethers.utils.formatEther(result.toNumber()))
        }
      })
      .catch(e => console.log(e))
  }, [wallet.account, setEarned, asset.gauge])

  const claimAndExit = () => {
    if (!working) {
      if (!wallet.account) {
        toast(walletNotConnected)
      } else if (!token0) {
        toast(noToken0)
      } else if (value > 0) {
        if (props.balance.gte(value)) {
          const provider = new ethers.providers.Web3Provider(wallet.ethereum)
          setWorking(true)
          gaugeClaimAndExit(token0.gauge, provider).then(tx =>
            txnHandler(tx, gaugeWithdrawMessage(asset), toast, () => {
              setWorking(false)
              props.refreshData(Date.now())
            }).catch(err =>
              txnErrHandler(err, toast, () => {
                setWorking(false)
              }),
            ),
          )
        } else {
          toast(insufficientBalance)
        }
      } else {
        toast(noAmount)
      }
    }
  }
  const submit = () => {
    if (!working) {
      if (!wallet.account) {
        toast(walletNotConnected)
      } else if (!token0) {
        toast(noToken0)
      } else if (value > 0) {
        if (props.balance.gte(value)) {
          const provider = new ethers.providers.Web3Provider(wallet.ethereum)
          setWorking(true)
          gaugeWithdraw(value, token0.gauge, provider)
            .then(tx => {
              tx.wait(defaults.network.tx.confirmations).then(r => {
                setWorking(false)
                props.refreshData(Date.now())
                toast({
                  ...gaugeWithdrawMessage(asset),
                  description: (
                    <Link
                      _focus={{
                        boxShadow: '0',
                      }}
                      href={`${defaults.api.etherscanUrl}/tx/${r.transactionHash}`}
                      isExternal
                    >
                      <Box>
                        Click here to view transaction on{' '}
                        <i>
                          <b>Etherscan</b>
                        </i>
                        .
                      </Box>
                    </Link>
                  ),
                  duration: defaults.toast.txHashDuration,
                })
              })
            })
            .catch(err => {
              setWorking(false)
              if (err.code === 4001) {
                console.log(
                  'Transaction rejected: Your have decided to reject the transaction..',
                )
                toast(rejected)
              } else if (err.code === -32016) {
                toast(exception)
              } else {
                console.log(err)
                toast(failed)
              }
            })
        } else {
          toast(insufficientBalance)
        }
      } else {
        toast(noAmount)
      }
    }
  }
  return (
    <>
      <Flex mt="2.2rem" flexDir="column">
        <Flex alignItems="center" justifyContent="space-between">
          <Text
            as="h4"
            fontSize={{ base: '1rem', md: '1.24rem' }}
            fontWeight="bolder"
          >
            Staking:{' '}
            {prettifyNumber(ethers.utils.formatEther(balance.toString()))}
          </Text>
        </Flex>
        <Flex layerStyle="inputLike">
          <InputGroup>
            <Input
              variant="transparent"
              flex="1"
              fontSize="1.3rem"
              fontWeight="bold"
              placeholder="0.0"
              value={inputAmount}
              onChange={e => {
                if (isNaN(e.target.value)) {
                  setInputAmount(prev => prev)
                } else {
                  setInputAmount(String(e.target.value))
                  if (Number(e.target.value) > 0) {
                    try {
                      setValue(
                        ethers.utils.parseUnits(
                          String(e.target.value),
                          token0.decimals,
                        ),
                      )
                    } catch (err) {
                      if (err.code === 'NUMERIC_FAULT') {
                        toast(tokenValueTooSmall)
                      }
                    }
                  }
                }
              }}
            />
            <InputRightAddon
              width="auto"
              borderTopLeftRadius="0.375rem"
              borderBottomLeftRadius="0.375rem"
              paddingInlineStart="0.5rem"
              paddingInlineEnd="0.5rem"
            >
              <Flex cursor="default" zIndex="1">
                <Box d="flex" alignItems="center">
                  <Image
                    width="24px"
                    height="24px"
                    mr="5px"
                    src={token0.logoURI}
                    alt={`${token0.name} token`}
                  />
                  <Box as="h3" m="0" fontSize="1.02rem" fontWeight="bold">
                    {token0.symbol}
                  </Box>
                </Box>
              </Flex>
            </InputRightAddon>
          </InputGroup>
        </Flex>
        <Flex mt=".6rem" justifyContent="flex-end" flexDir="row">
          <Button
            variant="outline"
            size="sm"
            mr="0.4rem"
            onClick={() => {
              setInputAmount(
                ethers.utils.formatUnits(
                  props.balance.div(100).mul(25),
                  token0.decimals,
                ),
              )
              setValue(props.balance.div(100).mul(25))
            }}
          >
            25%
          </Button>
          <Button
            variant="outline"
            size="sm"
            mr="0.4rem"
            onClick={() => {
              setInputAmount(
                ethers.utils.formatUnits(
                  props.balance.div(100).mul(50),
                  token0.decimals,
                ),
              )
              setValue(props.balance.div(100).mul(50))
            }}
          >
            50%
          </Button>
          <Button
            variant="outline"
            size="sm"
            mr="0.4rem"
            onClick={() => {
              setInputAmount(
                ethers.utils.formatUnits(
                  props.balance.div(100).mul(75),
                  token0.decimals,
                ),
              )
              setValue(props.balance.div(100).mul(75))
            }}
          >
            75%
          </Button>
          <Button
            variant="outline"
            size="sm"
            mr="0.4rem"
            onClick={() => {
              setInputAmount(
                ethers.utils.formatUnits(props.balance, token0.decimals),
              )
              setValue(props.balance)
            }}
          >
            MAX
          </Button>
        </Flex>
        <Flex mt="2.05rem" justifyContent="center" flexDir={'column'}>
          <Button
            minWidth="100%"
            size="lg"
            variant="solidRadial"
            disabled={working}
            onClick={() => submit()}
          >
            <Text as="span" fontWeight="bold">
              {wallet.account && (
                <>
                  {!working && <>Withdraw</>}
                  {working && (
                    <>
                      <Spinner />
                    </>
                  )}
                </>
              )}
              {!wallet.account && <>Withdraw</>}
            </Text>
          </Button>
          <Flex
            mt={'2.5rem'}
            alignItems="center"
            justifyContent="space-between"
          >
            <Text
              as="h4"
              fontSize={{ base: '1rem', md: '1.24rem' }}
              fontWeight="bolder"
            >
              Earned: {earned} APHRA
            </Text>
          </Flex>

          <Button
            minWidth="100%"
            size="lg"
            variant="solidRadial"
            disabled={working}
            onClick={() => claimAndExit()}
          >
            <Text as="span" fontWeight="bold">
              {wallet.account && (
                <>
                  {!working && <>Claim Rewards</>}
                  {working && (
                    <>
                      <Spinner />
                    </>
                  )}
                </>
              )}
              {!wallet.account && <>Claim Rewards</>}
            </Text>
          </Button>
        </Flex>
      </Flex>
    </>
  )
}

export default Gauge
