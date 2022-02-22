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
import { ethers } from 'ethers'
import {
  getERC20BalanceOf,
  getERC20Allowance,
  approveERC20ToSpend,
  getGaugeBalanceOf,
  gaugeWithdraw,
  gaugeDeposit,
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
} from '../messages'

const Gauge = props => {
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
          <GaugeItem asset={defaults.usdv3Crv} />
          <GaugeItem asset={defaults.avVADER} />
          <GaugeItem asset={defaults.avUSDV} />
        </HStack>
      </Flex>
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

  useEffect(() => {
    if (wallet?.account) {
      getGaugeBalanceOf(asset.gauge, wallet.account, defaults.network.provider)
        .then(data => {
          setToken1balance(data)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }, [wallet?.account, refreshDataToken])

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
              balance={balance0}
              refreshData={setRefreshDataToken}
            />
          </TabPanel>
          <TabPanel p="0">
            <WithdrawPanel
              asset={asset}
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
    refreshData: PropTypes.func,
  }
  const { asset } = props
  const wallet = useWallet()
  const toast = useToast()
  const [value, setValue] = useState(0)
  const [inputAmount, setInputAmount] = useState('')
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

          // TODO: associate their veNFT
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
        <Flex mt="5.05rem" justifyContent="center">
          <Button
            minWidth="230px"
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
      </Flex>
    </>
  )
}

const WithdrawPanel = props => {
  WithdrawPanel.propTypes = {
    asset: PropTypes.object,
    balance: PropTypes.object.isRequired,
    refreshData: PropTypes.func,
  }
  const { asset } = props
  const wallet = useWallet()
  const toast = useToast()
  const [value, setValue] = useState(0)
  const [inputAmount, setInputAmount] = useState('')
  const [token0] = useState(asset)
  const [working, setWorking] = useState(false)

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
        <Flex mt="5.05rem" justifyContent="center">
          <Button
            minWidth="230px"
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
        </Flex>
      </Flex>
    </>
  )
}

export default Gauge
