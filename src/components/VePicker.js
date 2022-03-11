import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
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
import { getVeBalanceOfNFT, getVeNFTsOfAddress } from '../common/ethereum'
import { prettifyNumber } from '../common/utils'
import { useLocalStorage } from 'react-use'
import { useActiveNFT } from '../hooks/useActiveNFT'

const Item = props => {
  Item.propTypes = {
    name: PropTypes.string.isRequired,
    token: PropTypes.object.isRequired,
    value: PropTypes.any.isRequired,
    onClick: PropTypes.func.isRequired,
  }

  return (
    <Box style={{ cursor: 'pointer' }} onClick={props.onClick}>
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
              {props.name}
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

export const VePicker = (effect, deps) => {
  const { activeNFT, activeNFTBalance, setActiveNFT, userNFTs } = useActiveNFT()

  const placement = useBreakpointValue({ base: 'bottom-end', md: 'auto' })

  return (
    <>
      {Object.entries(userNFTs).length > 0 && (
        <>
          <Popover
            closeOnEsc={true}
            closeOnBlur={true}
            matchWidth={true}
            placement={placement}
          >
            <PopoverTrigger>
              <Fade
                unmountOnExit={true}
                in={Object.entries(userNFTs).length > 0}
              >
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
                        Badge #{activeNFT.toString()}:{' '}
                        {prettifyNumber(activeNFTBalance, 2, 4)}
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
                  {Object.entries(userNFTs).length > 0 &&
                    Object.entries(userNFTs).map(([nft, balance]) => (
                      <Item
                        onClick={() => {
                          setActiveNFT(nft)
                        }}
                        key={`badge-${nft}`}
                        name={`Badge ${nft}`}
                        token={defaults.veAphra}
                        value={prettifyNumber(balance, 0, 5)}
                      />
                    ))}
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        </>
      )}
    </>
  )
}
