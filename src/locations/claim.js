import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Badge,
  Flex,
  Text,
  Button,
  Input,
  InputGroup,
  InputRightAddon,
  Image,
  Heading,
  Link,
  Kbd,
  Spinner,
  useToast,
  Container,
  useDisclosure,
  Checkbox,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useBreakpointValue,
} from '@chakra-ui/react'

import { TokenSelector } from '../components/TokenSelector'
import { ethers } from 'ethers'
import defaults from '../common/defaults'
import AphraLogo from '../assets/png/aphra-token.png'
import {
  // ChevronDownIcon,
  ExternalLinkIcon,
} from '@chakra-ui/icons'
import {
  getERC20Allowance,
  convert,
  approveERC20ToSpend,
  getERC20BalanceOf,
  getClaimed,
  getVester,
  formattedAirDrop,
  claim,
} from '../common/ethereum'
import {
  getMerkleProofForAccount,
  generateLeaf,
  prettifyCurrency,
} from '../common/utils'
import { useWallet } from 'use-wallet'
import {
  insufficientBalance,
  rejected,
  failed,
  vethupgraded,
  walletNotConnected,
  noAmount,
  tokenValueTooSmall,
  noToken0,
  approved,
  exception,
  vaderclaimed,
  notBurnEligible,
  nothingtoclaim,
  nomorethaneligible,
} from '../messages'
import { useClaimableAphra } from '../hooks/useClaimableAphra'
const Claim = props => {
  const wallet = useWallet()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isSelect] = useState(-1)
  const [tokenSelect, setTokenSelect] = useState(false)
  const [tokenApproved, setTokenApproved] = useState(false)
  const [tokenBalance, setTokenBalance] = useState(ethers.BigNumber.from('0'))
  const [inputAmount, setInputAmount] = useState('')
  const [value, setValue] = useState(0)
  const [conversionFactor, setConversionFactor] = useState(
    ethers.BigNumber.from(String(defaults.vader.conversionRate)),
  )
  const [working, setWorking] = useState(false)

  const [hasClaimed, setHasClaimed] = useState(false)
  const claimableAphra = useClaimableAphra()
  // const claimableAphra = ethers.BigNumber.from('99042421345123412300')
  const [proof, setProof] = useState([])

  const submit = () => {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum)
    setWorking(true)
    claim(wallet.account, claimableAphra, proof, provider)
      .then(tx => {
        tx.wait(defaults.network.tx.confirmations).then(r => {
          setWorking(false)
          setHasClaimed(true)
          toast({
            ...vaderclaimed,
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
        } else {
          console.log(err)
          toast(failed)
        }
      })
  }

  useEffect(() => {
    if (wallet.account) {
      const formattedAddress = ethers.utils.getAddress(wallet.account)
      console.log(formattedAddress)
      console.log(defaults)
      const airDrop = formattedAirDrop()

      if (airDrop[formattedAddress]) {
        const merkleProof = getMerkleProofForAccount(formattedAddress, airDrop)
        console.log(merkleProof)
        setProof(merkleProof)
        console.log(merkleProof)
        getClaimed(formattedAddress, defaults.network.provider).then(r => {
          if (r) setHasClaimed(true)
        })
      }
    }
  }, [wallet.account, defaults])

  useEffect(() => {
    return () => {
      setWorking(false)
    }
  }, [wallet.account, value])

  return (
    <>
      <Box
        maxWidth={defaults.layout.container.lg.width}
        m="0 auto"
        p={{ base: '5rem 1.1rem 0', md: '5rem 0 0' }}
        {...props}
      >
        <Flex
          flexDir={{ base: 'column', md: 'row' }}
          w="100%"
          paddingRight={{ base: '0', md: '2rem' }}
          paddingTop={{ base: '0', md: '2.33rem' }}
          justifyContent="flex-start"
        >
          <Flex
            marginBottom={{ base: '1.2rem', md: '1rem' }}
            maxW="49ch"
            m="0 auto"
          >
            <Container mr="23px" p="1rem">
              <>
                <Heading
                  as="h1"
                  size="md"
                  fontSize={{ base: '1.10rem', md: '1.25rem' }}
                >
                  CLAIM APHRA.
                </Heading>
                <Box
                  as="p"
                  mb="0.65rem"
                  fontSize={{ base: '0.9rem', md: '1rem' }}
                >
                  Claim your airdropped <b>APHRA</b> tokens!
                </Box>

                <Box
                  as="p"
                  fontSize={{ base: '0.8rem', md: '1rem' }}
                  mb="0.65rem"
                >
                  Airdrop eligibility is determined by a snapshot of{' '}
                  <b>xVADER</b> stakers taken at block{' '}
                  <Kbd color="pink.200">13925000</Kbd>. You can use our{' '}
                  <Link
                    isExternal
                    href="https://dune.xyz/androolloyd/AphraFinance"
                    color="bluish.300"
                  >
                    Dune dashboard <ExternalLinkIcon mx="2px" />
                  </Link>
                  to confirm eligibilty by searching for your wallet address.
                </Box>
              </>
            </Container>
          </Flex>

          <Flex
            w="100%"
            maxW="49ch"
            m="0 auto"
            // minH={{ base: 'auto', md: '478.65px' }}
            // marginTop={{ base: '2rem' }}
            p={{ base: '2rem 0.9rem', md: '2rem 2.6rem' }}
            layerStyle="colorful"
            flexDir="column"
          >
            <Text
              align="center"
              fontSize={{ base: '1.25rem', md: '1.55rem' }}
              fontWeight="bolder"
            >
              Claim
            </Text>

            {!working && claimableAphra <= 0 && (
              <Alert
                status="info"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                size="small"
                mt={3}
              >
                {/* <AlertIcon boxSize="40px" mr={0} /> */}
                <AlertTitle mt={3} mb={1} fontSize="lg">
                  Nothing to Claim
                </AlertTitle>
                <AlertDescription maxWidth="sm" mb={3}>
                  Your address was not found as part of the airdrop snapshot.
                  Please confirm you are connected with the correct wallet.
                </AlertDescription>
              </Alert>
            )}

            <Flex
              layerStyle="inputLike"
              cursor={'not-allowed'}
              m="2rem 1rem 0rem 1rem"
            >
              <InputGroup>
                <Input
                  variant="transparent"
                  flex="1"
                  disabled={true}
                  _disabled={{
                    opacity: '0.5',
                    cursor: 'not-allowed',
                  }}
                  fontSize="1.3rem"
                  fontWeight="bold"
                  placeholder="0.0"
                  value={prettifyCurrency(
                    ethers.utils.formatUnits(claimableAphra, 18),
                    0,
                    0,
                    'APHRA',
                  )}
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
                        // mr="5px"
                        src={AphraLogo}
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
              </InputGroup>
            </Flex>

            <Button
              variant="solidRadial"
              m="1rem auto 2rem"
              size="lg"
              minWidth="230px"
              textTransform="uppercase"
              disabled={working || claimableAphra <= 0 || hasClaimed}
              onClick={() => submit()}
            >
              {wallet.account ? (
                <>
                  {!working && (
                    <>{!hasClaimed && claimableAphra > 0 && <>Claim</>}</>
                  )}
                  {!working && (
                    <>{claimableAphra <= 0 && <>Nothing to Claim</>}</>
                  )}
                  {working && (
                    <>
                      <Spinner />
                    </>
                  )}
                </>
              ) : (
                <>Claim</>
              )}
            </Button>
          </Flex>
        </Flex>
      </Box>
      <TokenSelector
        isSelect={isSelect}
        setToken0={setTokenSelect}
        tokenList={
          !defaults.redeemables[0].snapshot[wallet.account] ||
          !Number(defaults.redeemables[0].snapshot[wallet.account]) > 0
            ? defaults.redeemables.slice(1)
            : defaults.redeemables
        }
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      />
    </>
  )
}

export default Claim
