import { type ComponentStyleConfig } from '@chakra-ui/react'

export const Button: ComponentStyleConfig = {
  baseStyle: {
    borderRadius: '8px',
    fontWeight: 'bold',
    border: '1px solid',
    boxShadow: '0px 0px 16px 0px rgba(0, 163, 249, 0.32)',
    py: 2,
    px: 3,
    w: 'full',
  },
  variants: {
    solid: {
      color: 'white',
      borderColor: 'primary.200',
      border: '1px solid',
      boxShadow: '0px 0px 16px 0px rgba(0, 163, 249, 0.32)',
      fontSize: 'md',
    },
    link: {
      bg: 'transparent',
      w: 'auto',
      color: 'primary.200',
      border: 'none',
      boxShadow: 'none',
      _hover: {
        textDecoration: 'underline',
        bg: 'transparent',
        color: 'primary.300',
      },
    },
  },
}
