import { createContext, useCallback, useMemo, useState } from 'react'

export const CartDrawerContext = createContext(null)

function CartDrawerProvider({ children }) {
  const [open, setOpen] = useState(false)

  const openCart = useCallback(() => setOpen(true), [])
  const closeCart = useCallback(() => setOpen(false), [])
  const toggleCart = useCallback(() => setOpen((current) => !current), [])

  const value = useMemo(
    () => ({ open, openCart, closeCart, toggleCart }),
    [open, openCart, closeCart, toggleCart],
  )

  return <CartDrawerContext.Provider value={value}>{children}</CartDrawerContext.Provider>
}

export { CartDrawerProvider }
