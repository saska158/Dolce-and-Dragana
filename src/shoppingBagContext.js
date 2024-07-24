import { useState, useEffect, createContext } from "react"
import { v4 as uuidv4 } from 'uuid'

const ShoppingBagContext = createContext()

const ShoppingBagContextProvider = ({children}) => {
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

  const addToShoppingBag = (item, size, category) => {
    setShoppingBagItems(prevItems => {
      const itemExists = prevItems.some(prevItem => prevItem.id === item.id && prevItem.size === size)
      if (itemExists) {
        return prevItems.map(prevItem => {
          if (prevItem.id === item.id && prevItem.size === size) {
            return { ...prevItem, amount: prevItem.amount + 1 }
          }
          return prevItem
        })
      } else {
          return [
            ...prevItems,
            { ...item, shoppingBagId: uuidv4(), size, category, amount: 1 }
          ]
      }
    })
  }

  const removeFromShoppingBag = (shoppingBagId) => {
    setShoppingBagItems(prevItems => prevItems.filter(item => item.shoppingBagId !== shoppingBagId))    
  }

  return (
      <ShoppingBagContext.Provider value={{
                                       shoppingBagItems, 
                                       setShoppingBagItems,
                                       addToShoppingBag, 
                                       removeFromShoppingBag
                                   }}
      >
        {children}
      </ShoppingBagContext.Provider>
  )
}

export { ShoppingBagContext, ShoppingBagContextProvider }
