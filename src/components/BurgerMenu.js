import React from 'react'
import PropTypes from 'prop-types'
import {
  Menu,
  MenuItem,
  MenuButton,
  IconButton,
  MenuList,
  Text,
  Badge,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { HamburgerIcon } from '@chakra-ui/icons'
import { WalletConnectionToggle } from './WalletConnectionToggle'

export const BurgerMenu = props => {
  BurgerMenu.propTypes = {
    pages: PropTypes.array.isRequired,
  }
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<HamburgerIcon />}
        variant="solid"
      />
      <MenuList>
        {props.pages.map(p =>
          p.disabled === true ? (
            <Text key={p.name}>
              <MenuItem
                key={p.name}
                style={{
                  cursor: 'not-allowed',
                  opacity: '0.5',
                }}
              >
                {p.text}{' '}
                <Badge ml={'.5rem'} variant="outline" size={'sm'}>
                  Coming Soon
                </Badge>
              </MenuItem>
            </Text>
          ) : (
            <Link key={p.name} to={p.link}>
              <MenuItem key={p.name}>
                {p.text}{' '}
                <Badge
                  ml={'.5rem'}
                  colorScheme="green"
                  variant="outline"
                  size={'sm'}
                >
                  Active
                </Badge>
              </MenuItem>
            </Link>
          ),
        )}
        <WalletConnectionToggle w="90%" m="0.6rem auto" />
      </MenuList>
    </Menu>
  )
}
