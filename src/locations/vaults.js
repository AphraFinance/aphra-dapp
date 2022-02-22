import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { useLocalStorage, useSessionStorage } from 'react-use'
import {
  Box,
  Badge,
  Flex,
  Text,
  Button,
  Input,
  InputGroup,
  InputRightAddon,
  InputRightElement,
  Image,
  Link,
  Spinner,
  useToast,
  Container,
  useDisclosure,
  Checkbox,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useBreakpointValue,
  useRadio,
  useRadioGroup,
  HStack,
  Tag,
  TagLabel,
  TagLeftIcon,
  Heading,
  ScaleFade,
  Tooltip,
  Fade,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react'
import { TokenSelector } from '../components/TokenSelector'
import { BigNumber, ethers } from 'ethers'
import defaults from '../common/defaults'
import { ChevronDownIcon, CheckCircleIcon } from '@chakra-ui/icons'
import {
  getERC20Allowance,
  approveERC20ToSpend,
  vaultDeposit,
  vaultWithdraw,
  gaugeDeposit,
} from '../common/ethereum'
import { useWallet } from 'use-wallet'
import {
  insufficientBalance,
  rejected,
  failed,
  walletNotConnected,
  noAmount,
  noToken0,
  approved,
  assetDeposited,
  assetWithdrawn,
  staked,
} from '../messages'
import { useERC20Balance } from '../hooks/useERC20Balance'
import { getPercentage, prettifyNumber } from '../common/utils'
import Stake from './stake'

const Vaults = props => {
  const wallet = useWallet()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isSelect, setIsSelect] = useState(-1)
  const [tokenSelect, setTokenSelect] = useState(false)
  const [vaultApproved, setVaultApproved] = useState(false)
  const [gaugeApproved, setGaugeApproved] = useState(false)
  const [setDepositGauge, depositGaugeEnabled] = useState(false)
  const [submitOption, setSubmitOption] = useLocalStorage(
    'acquireSubmitOption23049',
    false,
  )
  const balance = useERC20Balance(
    !submitOption ? tokenSelect?.address : tokenSelect?.vault,
  )
  const balanceVault = useERC20Balance(tokenSelect?.vault)
  const [inputAmount, setInputAmount] = useState('')
  const [inputAmountGauge, setInputAmountGauge] = useState('')
  const [value, setValue] = useState(0)
  const [valueGauge, setValueGauge] = useState(0)

  const [working, setWorking] = useState(false)

  const submitGauge = () => {
    if (!working) {
      if (!wallet.account) {
        toast(walletNotConnected)
      } else if (!tokenSelect) {
        toast(noToken0)
      } else if (gaugeApproved && depositGaugeEnabled) {
        const provider = new ethers.providers.Web3Provider(wallet.ethereum)
        setWorking(true)
        // need to fetch any active veNFT's they might have to let them choose which one to deposit into for boosting when enabled
        gaugeDeposit(valueGauge, tokenSelect.gauge, 0, provider)
          .then(tx =>
            txnHandler(tx, approved, () => {
              setVaultApproved(true)
            }),
          )
          .catch(err => errHandler(err))
      }
    }
  }
  const errHandler = async err => {
    setWorking(false)
    if (err.code === 4001) {
      console.log(
        'Transaction rejected: Your have decided to reject the transaction..',
      )
      toast(rejected)
    } else {
      console.log(err)
      toast(failed)
    }
  }
  const txnHandler = async (tx, messageObj, cb) => {
    const r = await tx.wait(defaults.network.tx.confirmations)
    cb(r)
    toast({
      ...messageObj,
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
  }

  const submit = () => {
    if (!working) {
      if (!wallet.account) {
        toast(walletNotConnected)
      } else if (!tokenSelect) {
        toast(noToken0)
      } else if (
        (!vaultApproved && !submitOption) ||
        (!gaugeApproved && depositGaugeEnabled)
      ) {
        const provider = new ethers.providers.Web3Provider(wallet.ethereum)
        setWorking(true)

        const approves = []
        if (!vaultApproved) {
          approves.push(
            approveERC20ToSpend(
              tokenSelect.address,
              tokenSelect.vault,
              defaults.network.erc20.maxApproval,
              provider,
            ).then(tx =>
              txnHandler(tx, approved, () => {
                setVaultApproved(true)
              }),
            ),
          )
        }

        // need to have a toggle to deposit into the gauge as well on a single deposit
        // withdraw comes from the gauge landing page
        if (!gaugeApproved && depositGaugeEnabled) {
          //
          debugger
          approves.push(
            approveERC20ToSpend(
              tokenSelect.vault,
              tokenSelect.gauge,
              defaults.network.erc20.maxApproval,
              provider,
            ).then(txGauge =>
              txnHandler(txGauge, approved, () => {
                setGaugeApproved(true)
                setWorking(false)
              }),
            ),
          )
        }

        Promise.all(approves)
          .then(() => {
            setWorking(false)
          })
          .catch(err => errHandler(err))
      } else if ((vaultApproved && value > 0) || submitOption) {
        const provider = new ethers.providers.Web3Provider(wallet.ethereum)
        if (balance?.data?.gte(value)) {
          setWorking(true)

          new Promise(resolve => {
            if (!submitOption) {
              // handle also depositing to the gauge in single user action
              resolve(vaultDeposit(value, tokenSelect.vault, provider))
            } else {
              // remove from gauge is done on the gauge page.
              resolve(vaultWithdraw(value, tokenSelect.vault, provider))
            }
          })
            .then(tx => {
              return tx.wait(defaults.network.tx.confirmations).then(r => {
                setWorking(false)
                setVaultApproved(true)
                const message = !submitOption ? assetDeposited : assetWithdrawn
                toast({
                  ...message,
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
            .catch(err => errHandler(err))
        } else {
          toast(insufficientBalance)
        }
      } else {
        toast(noAmount)
      }
    }
  }

  useEffect(() => {
    if (wallet.account && tokenSelect) {
      setWorking(true)
      Promise.all([
        getERC20Allowance(
          tokenSelect.address,
          wallet.account,
          tokenSelect.vault,
          defaults.network.provider,
        ).then(n => {
          setVaultApproved(false)
          if (n.gt(0)) setVaultApproved(true)
        }),

        getERC20Allowance(
          tokenSelect.vault,
          wallet.account,
          tokenSelect.gauge,
          defaults.network.provider,
        ).then(n => {
          setGaugeApproved(false)
          if (n.gt(0)) setGaugeApproved(true)
        }),
      ]).then(() => {
        setWorking(false)
      })
    }
    return () => {
      setWorking(false)
      setVaultApproved(false)
      setGaugeApproved(false)
    }
  }, [wallet.account, tokenSelect])

  return (
    <>
      <Box
        minHeight="634.95px"
        maxWidth={defaults.layout.container.lg.width}
        m="0 auto"
        p={{ base: '5rem 1.2rem 0', md: '5rem 1.2rem 0' }}
        {...props}
      >
        <Flex flexDir={{ base: 'column', md: 'row' }}>
          <Flex
            flexDir="column"
            w="100%"
            paddingRight={{ base: '0', md: '2rem' }}
            paddingTop={{ base: '0', md: '2.33rem' }}
            justifyContent="flex-start"
          >
            <Flex marginBottom={{ base: '1.2rem', md: '0' }}>
              <Container mb="23px" p="0">
                <>
                  <Heading
                    as="h1"
                    size="md"
                    fontSize={{ base: '1.10rem', md: '1.25rem' }}
                  >
                    Aphra Vaults
                  </Heading>

                  <Box as="p" fontSize={{ base: '0.9rem', md: '1rem' }}>
                    <b>Aphra vaults</b> accept deposits in assets that are
                  </Box>
                  <Box as="p" fontSize={{ base: '0.9rem', md: '1rem' }}>
                    <i>Aphra Vaults</i> continuously compounds, and when you
                    unstake your <i>vault token</i>, you&lsquo;ll receive your
                    original deposited <b>asset</b> plus any additional{' '}
                    <i>yield</i> accrued.
                  </Box>
                </>
              </Container>
            </Flex>
          </Flex>
          <Flex
            w="100%"
            maxW="49ch"
            m="0 auto"
            minH={{ base: 'auto', md: '478.65px' }}
            p={{ base: '2rem 0.9rem', md: '2rem 2.6rem' }}
            layerStyle="colorful"
            flexDir="column"
          >
            <Text
              align="center"
              fontSize={{ base: '1.25rem', md: '1.55rem' }}
              fontWeight="bolder"
            >
              Aphra Vaults
            </Text>
            <Text
              align="center"
              fontSize={{ base: '0.91rem', md: '1.12rem' }}
              display="block"
              mb="2rem"
            >
              Deposit Asset&apos;s into the Vaults
            </Text>

            <Text as="h4" fontSize="1.24rem" fontWeight="bolder">
              Token
            </Text>
            <Flex marginBottom="0.7rem">
              <Button
                variant="outline"
                w="100%"
                size="lg"
                textTransform="none"
                leftIcon={
                  tokenSelect ? (
                    <Image
                      width="24px"
                      height="24px"
                      src={tokenSelect.logoURI}
                      alt={`${tokenSelect.name} token`}
                    />
                  ) : (
                    ''
                  )
                }
                rightIcon={<ChevronDownIcon />}
                onClick={() => {
                  if (wallet.account) {
                    onOpen()
                    setIsSelect(0)
                  } else {
                    toast(walletNotConnected)
                  }
                }}
              >
                {tokenSelect && <>{tokenSelect.symbol}</>}
                {!tokenSelect && <>Select a token</>}
              </Button>
            </Flex>

            <>
              <SubmitOptions
                pointerEvents={!tokenSelect ? 'none' : ''}
                opacity={!tokenSelect ? '0.5' : '1'}
                set={setSubmitOption}
                setting={submitOption}
              />
              <Text
                mt="2rem"
                as="h4"
                fontSize="1.1rem"
                fontWeight="bolder"
                mr="0.66rem"
                opacity={!tokenSelect ? '0.5' : '1'}
              >
                Deposit Amount
              </Text>
              <Flex
                layerStyle="inputLike"
                cursor={!tokenSelect ? 'not-allowed' : ''}
                opacity={!tokenSelect ? '0.5' : '1'}
              >
                <Box flex="1">
                  <InputGroup>
                    <Input
                      variant="transparent"
                      flex="1"
                      disabled={!tokenSelect}
                      _disabled={{
                        opacity: '0.5',
                        cursor: 'not-allowed',
                      }}
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
                            setValue(
                              ethers.utils.parseUnits(
                                String(e.target.value),
                                18,
                              ),
                            )
                          } else {
                            setValue(ethers.BigNumber.from('0'))
                          }
                        }
                      }}
                    />
                    {tokenSelect && (
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
                              src={tokenSelect.logoURI}
                              alt={`${tokenSelect.name} token`}
                            />
                            <Box
                              as="h3"
                              m="0"
                              fontSize="1.02rem"
                              fontWeight="bold"
                            >
                              {submitOption && <>av</>}
                              {tokenSelect.symbol}
                            </Box>
                          </Box>
                        </Flex>
                      </InputRightAddon>
                    )}
                  </InputGroup>
                </Box>
              </Flex>

              <Flex mt=".6rem" justifyContent="flex-end" flexDir="row">
                <Button
                  variant="outline"
                  size="sm"
                  mr="0.4rem"
                  onClick={() => {
                    let localAmount = balance?.data?.div(100).mul(25)
                    if (!localAmount) {
                      localAmount = '0;'
                    }
                    setInputAmount(
                      ethers.utils.formatUnits(
                        balance?.data?.div(100).mul(25),
                        tokenSelect.decimals,
                      ),
                    )
                    setValue(balance?.data?.div(100).mul(25))
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
                        balance?.data?.div(100).mul(50),
                        tokenSelect.decimals,
                      ),
                    )
                    setValue(balance?.data?.div(100).mul(50))
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
                        balance?.data?.div(100).mul(75),
                        tokenSelect.decimals,
                      ),
                    )
                    setValue(balance?.data?.div(100).mul(75))
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
                      ethers.utils.formatUnits(
                        balance?.data,
                        tokenSelect.decimals,
                      ),
                    )
                    setValue(balance?.data)
                  }}
                >
                  MAX
                </Button>
              </Flex>
            </>
            <Button
              variant="solidRadial"
              mt="1rem"
              size="lg"
              minWidth="230px"
              textTransform="uppercase"
              disabled={working}
              onClick={() => submit()}
            >
              {wallet.account && (
                <>
                  {!working && tokenSelect && (
                    <>
                      {!vaultApproved && (
                        <>
                          {submitOption && <>Withdraw</>}
                          {!submitOption && <>Approve {tokenSelect.symbol}</>}
                        </>
                      )}
                      {vaultApproved && (
                        <>
                          {submitOption && <>Withdraw</>}
                          {!submitOption && <>Deposit</>}
                        </>
                      )}
                    </>
                  )}
                  {!working && !tokenSelect && <>Deposit</>}
                  {working && (
                    <>
                      <Spinner />
                    </>
                  )}
                </>
              )}
              {!wallet.account && <>Deposit</>}
            </Button>
            <>
              {tokenSelect?.vault?.gauge !== '' && (
                <>
                  <GagueActiveTag mt={'2rem'} />
                  <Text
                    as="h4"
                    fontSize="1.1rem"
                    fontWeight="bolder"
                    mr="0.66rem"
                    opacity={!tokenSelect ? '0.5' : '1'}
                  >
                    Vault Shares
                  </Text>
                  <Flex
                    layerStyle="inputLike"
                    cursor={!tokenSelect ? 'not-allowed' : ''}
                    opacity={!tokenSelect ? '0.5' : '1'}
                  >
                    <Box flex="1">
                      <InputGroup>
                        <Input
                          variant="transparent"
                          flex="1"
                          disabled={!tokenSelect}
                          _disabled={{
                            opacity: '0.5',
                            cursor: 'not-allowed',
                          }}
                          fontSize="1.3rem"
                          fontWeight="bold"
                          placeholder="0.0"
                          value={inputAmountGauge}
                          onChange={e => {
                            if (isNaN(e.target.value)) {
                              setInputAmountGauge(prev => prev)
                            } else {
                              setInputAmountGauge(String(e.target.value))
                              if (Number(e.target.value) > 0) {
                                setValueGauge(
                                  ethers.utils.parseUnits(
                                    String(e.target.value),
                                    18,
                                  ),
                                )
                              } else {
                                setValueGauge(ethers.BigNumber.from('0'))
                              }
                            }
                          }}
                        />
                        {tokenSelect && (
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
                                  src={tokenSelect.logoURI}
                                  alt={`${tokenSelect.name} token`}
                                />
                                <Box
                                  as="h3"
                                  m="0"
                                  fontSize="1.02rem"
                                  fontWeight="bold"
                                >
                                  <>av</>
                                  {tokenSelect.symbol}
                                </Box>
                              </Box>
                            </Flex>
                          </InputRightAddon>
                        )}
                      </InputGroup>
                    </Box>
                  </Flex>

                  <Flex mt=".6rem" justifyContent="flex-end" flexDir="row">
                    <Button
                      variant="outline"
                      size="sm"
                      mr="0.4rem"
                      onClick={() => {
                        let localAmount = balanceVault?.data?.div(100).mul(25)
                        if (!localAmount) {
                          localAmount = '0;'
                        }
                        setInputAmountGauge(
                          ethers.utils.formatUnits(
                            balanceVault?.data?.div(100).mul(25),
                            tokenSelect.decimals,
                          ),
                        )
                        setValueGauge(balanceVault?.data?.div(100).mul(25))
                      }}
                    >
                      25%
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      mr="0.4rem"
                      onClick={() => {
                        setInputAmountGauge(
                          ethers.utils.formatUnits(
                            balanceVault?.data?.div(100).mul(50),
                            tokenSelect.decimals,
                          ),
                        )
                        setValueGauge(balanceVault?.data?.div(100).mul(50))
                      }}
                    >
                      50%
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      mr="0.4rem"
                      onClick={() => {
                        setInputAmountGauge(
                          ethers.utils.formatUnits(
                            balanceVault?.data?.div(100).mul(75),
                            tokenSelect.decimals,
                          ),
                        )
                        setValueGauge(balanceVault?.data?.div(100).mul(75))
                      }}
                    >
                      75%
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      mr="0.4rem"
                      onClick={() => {
                        setInputAmountGauge(
                          ethers.utils.formatUnits(
                            balanceVault?.data,
                            tokenSelect.decimals,
                          ),
                        )
                        setValueGauge(balanceVault?.data)
                      }}
                    >
                      MAX
                    </Button>
                  </Flex>
                </>
              )}
            </>

            <Button
              variant="solidRadial"
              mt="1rem"
              size="lg"
              minWidth="230px"
              textTransform="uppercase"
              disabled={valueGauge === 0 || working}
              onClick={() => submitGauge()}
            >
              {wallet.account && (
                <>
                  {!working && <>Gauge Deposit</>}
                  {working && (
                    <>
                      <Spinner />
                    </>
                  )}
                </>
              )}
              {!wallet.account && <>Gauge Deposit</>}
            </Button>
          </Flex>
        </Flex>
      </Box>
      <TokenSelector
        isSelect={isSelect}
        setToken0={setTokenSelect}
        tokenList={defaults.vaultable}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      />
    </>
  )
}

const GagueActiveTag = () => {
  return (
    <Box mt="2rem" as="h3" fontWeight="bold" textAlign="center" fontSize="1rem">
      <Badge
        as="div"
        fontSize={{ base: '0.6rem', md: '0.75rem' }}
        background="rgb(214, 188, 250)"
        color="rgb(128, 41, 251)"
      >
        Gauge Active
      </Badge>
    </Box>
  )
}

const RadioCard = props => {
  RadioCard.propTypes = {
    children: PropTypes.any,
    set: PropTypes.func.isRequired,
    setting: PropTypes.bool.isRequired,
    pointerEvents: PropTypes.string,
  }

  const { getInputProps, getCheckboxProps } = useRadio(props)
  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <>
      <Box as="label" width="100%">
        <input {...input} />
        <Box
          {...checkbox}
          borderWidth="1px"
          borderRadius="12px"
          fontWeight="600"
          textAlign="center"
          cursor="pointer"
          pointerEvents={props.pointerEvents}
          _hover={{
            background: 'rgba(255,255,255, 0.08)',
          }}
          _checked={{
            color: 'bluish.300',
            borderColor: 'bluish.300',
            borderWidth: '2px',
          }}
          p="0.75rem 1.25rem"
        >
          {props.children}
        </Box>
      </Box>
    </>
  )
}

const SubmitOptions = props => {
  SubmitOptions.propTypes = {
    set: PropTypes.func.isRequired,
    setting: PropTypes.bool.isRequired,
    opacity: PropTypes.string,
    pointerEvents: PropTypes.string,
  }

  const options = ['Deposit', 'Withdraw']

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'action',
    value: !props.setting ? 'Deposit' : 'Withdraw',
    onChange: () => props.set(!props.setting),
  })
  const group = getRootProps()

  return (
    <HStack
      {...group}
      mt="0.7rem"
      lineHeight="normal"
      opacity={props.opacity}
      pointerEvents={props.pointerEvents}
    >
      {options.map(value => {
        const radio = getRadioProps({ value })
        return (
          <RadioCard
            set={props.set}
            setting={props.setting}
            key={value}
            {...radio}
          >
            {value}
          </RadioCard>
        )
      })}
    </HStack>
  )
}

export default Vaults
