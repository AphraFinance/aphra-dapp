import React from 'react'
import { useBreakpointValue, Image } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

import AphraLogoText from '../assets/png/aphra-logo-type.png'

export const Logotype = props => {
  const width = useBreakpointValue({
    base: '126.31px',
    md: '156.31px',
  })

  return (
    <Link style={{ alignSelf: 'center' }} to="https://aphra.finance">
      <Image
        style={{ maxWidth: width }}
        src={AphraLogoText}
        alt="Aphra Finance Logo"
        {...props}
      />
    </Link>
  )
}
