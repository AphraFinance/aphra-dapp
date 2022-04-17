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
  useRadio,
  useRadioGroup,
  HStack,
  Heading,
} from '@chakra-ui/react'
import { GaugeItem } from './gauges'
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
} from '../messages'
import { useERC20Balance } from '../hooks/useERC20Balance'

export const txnErrHandler = async (err, toast, cb) => {
  if (cb) cb()
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
export const txnHandler = async (tx, messageObj, toast, cb) => {
  const r = await tx.wait(defaults.network.tx.confirmations)
  if (cb) cb(r)
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

const VaultText = () => {
  return (
    <Container mb="23px" p="0">
      <>
        <Heading
          as="h1"
          size="md"
          fontSize={{ base: '1.10rem', md: '1.25rem' }}
        >
          Aphra Vaults
        </Heading>

        <Box as="p" mb="3" fontSize={{ base: '0.9rem', md: '1rem' }}>
          After you have deposited an Asset in one of the Aphra Vaults, you’ll
          receive a vault token. Next, head over to the{' '}
          <Link to="/gauges" style={{ fontColor: 'white', fontWeight: 'bold' }}>
            Gauges
          </Link>{' '}
          tab to stake this Vault Token to earn rewards.
        </Box>

        <Box as="p" fontSize={{ base: '0.9rem', md: '1rem' }}>
          If you want to deposit your xVader, head straight to the Gauges tab.
          Deposits in Aphra Vaults are continuously compounded. When you
          withdraw your Vault Token, you&apos;ll receive your original Asset
          plus any additional Yield that accrued.
        </Box>
      </>
    </Container>
  )
}

const Vaults = props => {
  const wallet = useWallet()
  const toast = useToast()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isSelect, setIsSelect] = useState(-1)
  const [tokenSelect, setTokenSelect] = useState(false)
  const [vaultApproved, setVaultApproved] = useState(false)
  const [submitOption, setSubmitOption] = useLocalStorage(
    'acquireSubmitOption23049',
    false,
  )
  const balance = useERC20Balance(
    !submitOption ? tokenSelect?.address : tokenSelect?.vault,
  )
  const [inputAmount, setInputAmount] = useState('')
  const [value, setValue] = useState(0)
  const [working, setWorking] = useState(false)

  const submit = () => {
    if (!working) {
      if (!wallet.account) {
        toast(walletNotConnected)
      } else if (!tokenSelect) {
        toast(noToken0)
      } else if (!vaultApproved && !submitOption) {
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
              txnHandler(tx, approved, toast, () => {
                setVaultApproved(true)
              }),
            ),
          )
        }
        Promise.all(approves)
          .then(() => {
            setWorking(false)
          })
          .catch(err =>
            txnErrHandler(err, toast, () => {
              setWorking(false)
            }),
          )
      } else if ((vaultApproved && value > 0) || submitOption) {
        const provider = new ethers.providers.Web3Provider(wallet.ethereum)
        if (balance?.data?.gte(value)) {
          setWorking(true)
          new Promise(resolve => {
            if (!submitOption) {
              resolve(vaultDeposit(value, tokenSelect.vault, provider))
            } else {
              resolve(vaultWithdraw(value, tokenSelect.vault, provider))
            }
          })
            .then(tx =>
              txnHandler(
                tx,
                !submitOption ? assetDeposited : assetWithdrawn,
                toast,
                () => {
                  setWorking(false)
                  setVaultApproved(true)
                },
              ),
            )
            .catch(err =>
              txnErrHandler(err, toast, () => {
                setWorking(false)
                setVaultApproved(true)
              }),
            )
        } else {
          toast(insufficientBalance)
        }
      } else {
        toast(noAmount)
      }
    }
  }

  useEffect(() => {
    if (wallet.account && tokenSelect?.vault) {
      setWorking(true)
      getERC20Allowance(
        tokenSelect.address,
        wallet.account,
        tokenSelect.vault,
        defaults.network.provider,
      )
        .then(n => {
          setVaultApproved(false)
          if (n.gt(0)) setVaultApproved(true)
        })
        .then(() => {
          setWorking(false)
        })
    }
    return () => {
      setWorking(false)
      setVaultApproved(false)
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
              <VaultText />
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
              Withdraw Assets from Vaults
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

            {(tokenSelect?.vault !== null || !tokenSelect) && (
              <>
                <>
                  {/* <SubmitOptions
                    pointerEvents={!tokenSelect ? 'none' : ''}
                    opacity={!tokenSelect ? '0.5' : '1'}
                    set={setSubmitOption}
                    setting={submitOption}
                  /> */}
                  <Text
                    mt="2rem"
                    as="h4"
                    fontSize="1.1rem"
                    fontWeight="bolder"
                    mr="0.66rem"
                    opacity={!tokenSelect ? '0.5' : '1'}
                  >
                    Amount
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
                            <Flex
                              cursor="pointer"
                              zIndex="1"
                              onClick={() =>
                                window.open(
                                  `https://etherscan.io/address/${tokenSelect.vault}`,
                                )
                              }
                            >
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
                              {!submitOption && (
                                <>Approve {tokenSelect.symbol}</>
                              )}
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
              </>
            )}
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

  const options = ['Withdraw']

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
