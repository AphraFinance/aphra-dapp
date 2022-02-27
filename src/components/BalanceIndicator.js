import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from 'react-query'
import { BigNumber, ethers, utils } from 'ethers'
import {
  Button,
  Box,
  Image,
  Fade,
  Popover,
  PopoverTrigger,
  Portal,
  PopoverContent,
  PopoverBody,
  Flex,
  Container,
  useBreakpointValue,
} from '@chakra-ui/react'
import defaults from '../common/defaults'
import { useWallet } from 'use-wallet'
import { useXvaderPrice } from '../hooks/useXvaderPrice'
import {
  getERC20BalanceOf,
  getVeBalanceOfNFT,
  getVeNFTsOfAddress,
} from '../common/ethereum'
import { prettifyNumber } from '../common/utils'

const Item = props => {
  Item.propTypes = {
    name: PropTypes.string.isRequired,
    token: PropTypes.object.isRequired,
    value: PropTypes.any.isRequired,
  }

  return (
    <Box>
      <Box>{props.name}</Box>
      <Flex>
        <Container p="0">
          <Box>
            <Flex justifyContent="flex-start" fontWeight="bolder">
              <Image
                width="24px"
                height="24px"
                mr="5px"
                src={props.token.logoURI}
                alt={`${props.token.name} token`}
              />
              {props.token.symbol}
            </Flex>
          </Box>
        </Container>
        <Container p="0">
          <Box
            fontSize={{ base: '1rem', md: '1.2rem' }}
            fontWeight="bold"
            textAlign="right"
          >
            {props.value}
          </Box>
        </Container>
      </Flex>
    </Box>
  )
}

export const BalanceIndicator = () => {
  const wallet = useWallet()

  const veBalanceOfNFT = useQuery(
    `${defaults.veAphra.address}_erc20Balanceof_${wallet?.account}`,
    async () => {
      if (wallet.account) {
        const nfts = await getVeNFTsOfAddress(wallet.account)
        return await getVeBalanceOfNFT(nfts[0])
      }
    },
    {
      staleTime: defaults.api.staleTime,
    },
  )

  const totalBalance = () => {
    if (veBalanceOfNFT.data) {
      return utils.formatEther(veBalanceOfNFT.data)
    }
  }

  const placement = useBreakpointValue({ base: 'bottom-end', md: 'auto' })

  return (
    <>
      {Number(totalBalance()) > 0 && (
        <>
          <Popover
            closeOnEsc={true}
            closeOnBlur={true}
            matchWidth={true}
            placement={placement}
          >
            <PopoverTrigger>
              <Fade unmountOnExit={true} in={Number(totalBalance()) > 0}>
                <Button
                  size="md"
                  pl={0}
                  pr={0}
                  fontSize={{ base: '0.65rem', sm: 'sm' }}
                  variant="outline"
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  transform={{
                    base: 'scale(0.86)',
                    sm: 'scale(1)',
                  }}
                >
                  <Box
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="12px"
                    background="#000"
                    p="7px 11px"
                  >
                    <Box d="flex" alignItems="center">
                      <Image
                        width="24px"
                        height="24px"
                        mr="5px"
                        src={defaults.veAphra.logoURI}
                        alt={`${defaults.veAphra.name} token`}
                      />
                      <Box
                        as="h3"
                        m="0"
                        fontSize="1.02rem"
                        fontWeight="bold"
                        textTransform="capitalize"
                      >
                        {prettifyNumber(totalBalance(true), 0, 2)}
                      </Box>
                    </Box>
                  </Box>
                </Button>
              </Fade>
            </PopoverTrigger>
            <Portal>
              <PopoverContent maxW="304px">
                <PopoverBody
                  display="flex"
                  flexDir="column"
                  gridGap="0.9rem"
                  padding="1.6rem 1.6rem"
                >
                  {veBalanceOfNFT.data.gt(0) && (
                    <Item
                      name={'Balance'}
                      token={defaults.veAphra}
                      value={prettifyNumber(
                        utils.formatEther(veBalanceOfNFT.data),
                        0,
                        2,
                      )}
                    />
                  )}
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        </>
      )}
    </>
  )
}
