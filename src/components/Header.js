import React from 'react'
import { useLocation } from 'react-router-dom'
import { Tooltip, Flex, Text, useBreakpointValue } from '@chakra-ui/react'
import defaults from '../common/defaults'
import { Link } from 'react-router-dom'
import { Logotype } from './Logotype'
import { WalletConnectionToggle } from './WalletConnectionToggle'
import { BalanceIndicator } from '../components/BalanceIndicator'
import { BurgerMenu } from './BurgerMenu'

export const Header = props => {
  const location = useLocation()
  const pages = [
    {
      name: 'Vaults',
      text: 'Vaults',
      link: '/vaults',
    },
    {
      name: 'Stake',
      text: 'Stake',
      link: '/stake',
    },
    {
      name: 'Airdrop',
      text: 'Airdrop',
      link: '/claim',
    },
    {
      name: 'Vote',
      text: 'Vote',
      link: '/vote',
      disabled: true,
    },
  ]

  const current = {
    background: '#835a81',
    borderRadius: '10px',
    fontWeight: '1000',
    color: '#fff',
  }

  return (
    <Flex
      style={{ justifyContent: 'space-between', alignItems: 'center' }}
      minH={defaults.layout.header.minHeight}
      {...props}
    >
      <Flex w={{ md: '30%', sm: '30%' }}>
        <Logotype margin="0 8px 0" />
      </Flex>
      <Flex
        w="auto"
        minW="216px"
        alignItems="center"
        justifyContent="space-around"
        textTransform="capitalize"
        layerStyle="colorful"
        borderRadius="12px"
        p="0.3rem 0.2rem"
        display={{ base: 'none', md: 'flex' }}
      >
        {pages.map(p =>
          p.disabled === true ? (
            <Tooltip key={p.name} label="Coming Soon" fontSize="sm">
              <Text
                to={p.link}
                style={{
                  cursor: 'not-allowed',
                  opacity: '0.5',
                  color: 'rgb(213, 213, 213)',
                  padding: '0.4rem 0.8rem',
                }}
              >
                {p.text}
              </Text>
            </Tooltip>
          ) : (
            <Link
              key={p.name}
              to={p.link}
              style={{
                color: 'rgb(213, 213, 213)',
                padding: '0.4rem 0.8rem',
                // ...(location.pathname === '/' && p.name === 'Claim' && current),
                // ...(p.link === location.pathname && current),
                // ...(p.link === '/bond' &&
                //   location.pathname.includes('bond') &&
                //   current),
                // ...(p.link === '/pool' &&
                //   location.pathname.includes('pool') &&
                //   current),
              }}
            >
              {p.text}
            </Link>
          ),
        )}
      </Flex>
      <Flex
        w={{ md: '30%', sm: '70%' }}
        justifyContent="flex-end"
        gridGap={{ base: '7.3px', sm: '17.3px' }}
      >
        {useBreakpointValue({
          base: <BalanceIndicator />,
          md: '',
          lg: <BalanceIndicator />,
        })}
        {useBreakpointValue({
          base: <BurgerMenu pages={pages} />,
          md: <WalletConnectionToggle />,
        })}
      </Flex>
    </Flex>
  )
}
