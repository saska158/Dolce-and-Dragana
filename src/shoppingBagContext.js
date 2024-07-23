import { useState, useEffect, createContext } from "react"
import { v4 as uuidv4 } from 'uuid'

const ShoppingBagContext = createContext()

function ShoppingBagContextProvider({children}) {
  const [shoppingBagItems, setShoppingBagItems] = useState(JSON.parse(localStorage.getItem('shoppingBagItems')) || [])

  useEffect(() => {
    const savedBag = localStorage.getItem('shoppingBagItems')
    if (savedBag) {
      setShoppingBagItems(JSON.parse(savedBag))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('shoppingBagItems', JSON.stringify(shoppingBagItems))
  }, [shoppingBagItems])

  function addToShoppingBag(item, size, category) {
    setShoppingBagItems(prevItems => [...prevItems, {...item, uniqueId: uuidv4(), size, category}])
  }

  function removeFromShoppingBag(uniqueId) {
    setShoppingBagItems(prevItems => prevItems.filter(item => item.uniqueId !== uniqueId))    
  }

  return (
      <ShoppingBagContext.Provider value={{shoppingBagItems, 
                                       addToShoppingBag, 
                                       removeFromShoppingBag}}
      >
        {children}
      </ShoppingBagContext.Provider>
  )
}

export { ShoppingBagContext, ShoppingBagContextProvider }
