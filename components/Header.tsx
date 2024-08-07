import { HStack, Heading } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'

const Header = () => {
  const router = useRouter()

  const pageName = router.pathname.split('/')?.[1]

  return (
    <HStack
      as="header"
      px="10"
      py="5"
      position={{base: undefined, md: "fixed"}}
      w="full"
      h="70px"
      backdropFilter={{base:  "blur(0px)", md: "blur(10px)"}}
      zIndex="100"
      maxW="1200px"
    >
      <Heading size="md" textTransform="uppercase">
        {pageName}
      </Heading>
    </HStack>
  )
}

export default Header
