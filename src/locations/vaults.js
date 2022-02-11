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
} from '@chakra-ui/react'
import { TokenSelector } from '../components/TokenSelector'
import { ethers } from 'ethers'
import defaults from '../common/defaults'
import { ChevronDownIcon, CheckCircleIcon } from '@chakra-ui/icons'
import { BsPauseCircleFill } from 'react-icons/bs'
import {
  getERC20Allowance,
  convert,
  approveERC20ToSpend,
  getVester,
  claim,
  minterMint,
} from '../common/ethereum'
import { getMerkleProofForAccount, prettifyCurrency } from '../common/utils'
import { useWallet } from 'use-wallet'
import {
  insufficientBalance,
  rejected,
  failed,
  vethupgraded,
  walletNotConnected,
  noAmount,
  noToken0,
  approved,
  exception,
  vaderclaimed,
  notBurnEligible,
  nothingtoclaim,
  vaderconverted,
} from '../messages'
import { useERC20Balance } from '../hooks/useERC20Balance'
import prettyMilliseconds from 'pretty-ms'
import TimeAgo from 'react-timeago'

const Vaults = props => {
  const wallet = useWallet()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isSelect, setIsSelect] = useState(-1)
  const [tokenSelect, setTokenSelect] = useState(false)
  const [tokenApproved, setTokenApproved] = useState(false)
  const balance = useERC20Balance(tokenSelect?.address)
  const [inputAmount, setInputAmount] = useState('')
  const [value, setValue] = useState(0)
  const [conversionFactor, setConversionFactor] = useState(
    ethers.BigNumber.from('0'),
  )
  const [working, setWorking] = useState(false)

  const [slippageTolAmount, setSlippageTolAmount] = useSessionStorage(
    'acquireSlippageTolAmount042334310',
    '',
  )
  const [slippageTol, setSlippageTol] = useSessionStorage(
    'acquireSlippageTol042434310',
    3,
  )
  const [submitOption, setSubmitOption] = useLocalStorage(
    'acquireSubmitOption23049',
    false,
  )
  const uniswapTWAP = null
  const minter = null
  const fee = 0
  const usdcTWAP = ethers.utils.parseEther(
    String(
      1 /
        Number(
          ethers.utils.formatUnits(
            uniswapTWAP?.data ? uniswapTWAP.data : '1',
            18,
          ),
        ),
    ),
  )

  const [releaseTime, setReleaseTime] = useState(new Date())
  const [now, setNow] = useState(new Date())

  const [mintLimitRemains, mintLimitRemainsRefetch] = []
  const [burnLimitRemains, burnLimitRemainsRefetch] = []

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const submit = () => {
    if (!working) {
      if (!wallet.account) {
        toast(walletNotConnected)
      } else if (!tokenSelect) {
        toast(noToken0)
      } else if (!tokenApproved && !submitOption) {
        const provider = new ethers.providers.Web3Provider(wallet.ethereum)
        if (tokenSelect.symbol !== 'USDV' && !submitOption) {
          setWorking(true)
          approveERC20ToSpend(
            tokenSelect.address,
            defaults.vaults[tokenSelect.symbol].address,
            defaults.network.erc20.maxApproval,
            provider,
          )
            .then(tx => {
              tx.wait(defaults.network.tx.confirmations)
                .then(() => {
                  setWorking(false)
                  setTokenApproved(true)
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
              if (err.code === 4001) {
                console.log(
                  'Transaction rejected: Your have decided to reject the transaction..',
                )
                toast(rejected)
              } else {
                console.log(err)
                toast(failed)
              }
            })
        }
      } else if (!submitOption) {
        if (value > 0) {
          // if (balance?.data?.gte(value)) {
          //   const provider = new ethers.providers.Web3Provider(wallet.ethereum)
          //   if (tokenSelect.symbol === 'USDV') {
          //     // if (burnLimitRemains && burnLimitRemains.gt(0)) {
          //     //   setWorking(true)
          //     //   minterBurn(value, minValue, minter, provider)
          //     //     .then(tx => {
          //     //       tx.wait(defaults.network.tx.confirmations).then(r => {
          //     //         balance?.refetch()
          //     //         setWorking(false)
          //     //         toast({
          //     //           ...usdvredeemed,
          //     //           description: (
          //     //             <Link
          //     //               variant="underline"
          //     //               _focus={{
          //     //                 boxShadow: '0',
          //     //               }}
          //     //               href={`${defaults.api.etherscanUrl}/tx/${r.transactionHash}`}
          //     //               isExternal
          //     //             >
          //     //               <Box>
          //     //                 Click here to view transaction on{' '}
          //     //                 <i>
          //     //                   <b>Etherscan</b>
          //     //                 </i>
          //     //                 .
          //     //               </Box>
          //     //             </Link>
          //     //           ),
          //     //           duration: defaults.toast.txHashDuration,
          //     //         })
          //     //       })
          //     //     })
          //     //     .catch(err => {
          //     //       setWorking(false)
          //     //       if (err.code === 4001) {
          //     //         console.log(
          //     //           'Transaction rejected: You have decided to reject the transaction..',
          //     //         )
          //     //         toast(rejected)
          //     //       } else {
          //     //         console.log(err)
          //     //         toast(failed)
          //     //       }
          //     //     })
          //     // }
          //   }
          // } else {
          //   toast(insufficientBalance)
          // }
        } else {
          toast(noAmount)
        }
      }
    }
  }

  useEffect(() => {
    if (wallet.account && tokenSelect) {
      console.log(tokenSelect)
      setWorking(true)
      getERC20Allowance(
        tokenSelect.address,
        wallet.account,
        defaults.vaults[tokenSelect.symbol].address,
        defaults.network.provider,
      ).then(n => {
        setWorking(false)
        if (tokenSelect.symbol !== 'USDV') {
          if (n.gt(0)) setTokenApproved(true)
        }
        if (tokenSelect.symbol === 'USDV') {
          setTokenApproved(true)
        }
        setTokenApproved(false)
      })
    }
    return () => {
      setWorking(false)
      setTokenApproved(false)
    }
  }, [wallet.account, tokenSelect])

  return (
    <>
      <Box
        maxWidth={defaults.layout.container.sm.width}
        m="0 auto"
        p={{ base: '5rem .4rem 0', md: '5rem 0 0' }}
        {...props}
      >
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
            <GagueActiveTag />
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
                            ethers.utils.parseUnits(String(e.target.value), 18),
                          )
                        } else {
                          setValue(ethers.BigNumber.from('0'))
                        }
                      }
                    }}
                  />
                  {tokenSelect && !submitOption && (
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
                            textTransform="capitalize"
                          >
                            {tokenSelect.symbol}
                          </Box>
                        </Box>
                      </Flex>
                    </InputRightAddon>
                  )}
                </InputGroup>
              </Box>
            </Flex>

            <Flex
              mt=".6rem"
              justifyContent="flex-end"
              flexDir="row"
              opacity={!tokenSelect || submitOption ? '0.5' : '1'}
              pointerEvents={!tokenSelect || submitOption ? 'none' : ''}
            >
              <Button
                variant="outline"
                size="sm"
                mr="0.4rem"
                onClick={() => {
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
                    {!tokenApproved && (
                      <>
                        {submitOption && <>Withdraw</>}
                        {!submitOption && <>Approve {tokenSelect.symbol}</>}
                      </>
                    )}
                    {tokenApproved && (
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
    <Box as="h3" fontWeight="bold" textAlign="center" fontSize="1rem">
      <Badge
        as="div"
        fontSize={{ base: '0.6rem', md: '0.75rem' }}
        background="rgb(214, 188, 250)"
        color="rgb(128, 41, 251)"
      >
        Gague Active
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
