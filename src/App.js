import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
} from 'react-router-dom'
import {
  ChakraProvider,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  Button,
  Flex,
} from '@chakra-ui/react'
import theme from './themes/aphra'
import { UseWalletProvider } from 'use-wallet'
import { Header } from './components/Header'
import Claim from './locations/claim'

import Stake from './locations/stake'
import Gauge from './locations/gauges'
// import Bonds from './locations/bonds'
// import Bond from './locations/bond'
import defaults from './common/defaults'
import { Footer } from './components/Footer'
import { Wave } from './assets/svg/effects/Wave'
import Vaults from './locations/vaults'
import { useLocalStorage } from 'react-use'
import { ActiveNFTProvider } from './hooks/useActiveNFT'

const App = () => {
  return (
    <Router>
      <ChakraProvider theme={theme}>
        <UseWalletProvider
          chainId={defaults.network.chainId}
          connectors={defaults.network.connectors}
          autoConnect={defaults.network.autoConnect}
        >
          <ActiveNFTProvider>
            <Header
              width={defaults.layout.header.width}
              p={defaults.layout.header.padding}
              justifyContent="center"
              position="relative"
              zIndex="2"
            />
            <Switch>
              <Route
                path="/"
                exact
                render={() => <Vaults position="relative" zIndex="1" />}
              />
              <Route
                path="/vaults"
                exact
                render={() => <Vaults position="relative" zIndex="1" />}
              />
              <Route
                path="/gauge/:address"
                exact
                render={() => <Gauge position="relative" zIndex="1" />}
              />
              <Route
                path="/gauges"
                exact
                render={() => <Gauge position="relative" zIndex="1" />}
              />
              <Route
                path="/claim"
                exact
                render={() => <Claim position="relative" zIndex="1" />}
              />
              <Route
                path="/airdrop"
                exact
                render={() => <Claim position="relative" zIndex="1" />}
              />
              <Route path="*" render={() => <Redirect to={'/'} />} />
            </Switch>
            <Footer
              width="auto"
              height="10vh"
              maxWidth={defaults.layout.container.sm.width}
              m="0 auto"
              opacity="0.8"
              position="relative"
              zIndex="1"
              alignContent="center"
              flexWrap="wrap"
              padding="8.53rem 2rem 6.53rem"
              style={{
                gap: '0 2rem',
              }}
            />
            <Wave
              width="100%"
              height="777.65665px"
              position="absolute"
              left="50%"
              top="65%"
              transform="translate(-50%, -65%)"
              m="0 auto"
              overflowX="hidden"
            >
              <Box
                id="radialMask"
                width="100%"
                height="100%"
                transform={maskTransform}
              />
              <AlphaModalAgreement />
            </Wave>
          </ActiveNFTProvider>
        </UseWalletProvider>
      </ChakraProvider>
    </Router>
  )
}

function AlphaModalAgreement() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [agreement, setAgreement] = useLocalStorage(
    'disclaimerAgreement',
    false,
  )
  useEffect(() => {
    if (!agreement) {
      onOpen()
    }
  }, [agreement])
  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Disclaimer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex p={'2rem'}>
              <Text>
                <h1>Aphra Finance is an experimental protocol.</h1>
                <ul>
                  <li>It has not been audited</li>
                  <li>It is not risk-free</li>
                  <li>You may lose 100% of deposits</li>
                </ul>
                <br />
                <p>Never deposit more than you can afford to lose.</p>
                <p>
                  Aphra Finance will not be responsible for compensation of any
                  losses under any circumstances.
                </p>
              </Text>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                setAgreement(true)
                onClose()
              }}
            >
              I accept these risks.
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

const maskTransform = () => {
  const location = useLocation()
  if (
    location.pathname.includes('bond') ||
    location.pathname.includes('pool') ||
    location.pathname === '/'
  ) {
    return {
      base: 'scaleX(1.5)',
      md: 'scaleX(1.4)',
      xl: 'scaleX(1.2)',
    }
  }
}

export default App
