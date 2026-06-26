import { useContext } from 'react'
import { CartDrawerContext } from '../context/CartDrawerContext'

function useCartDrawer() {
  const context = useContext(CartDrawerContext)

  if (!context) {
    throw new Error('useCartDrawer must be used within CartDrawerProvider')
  }

  return context
}

export default useCartDrawer
