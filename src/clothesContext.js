import { useState, useEffect, createContext } from "react"
import { v4 as uuidv4 } from 'uuid'

const ClothesContext = createContext()

function ClothesContextProvider({children}) {
    const [shoppingBagItems, setShoppingBagItems] = useState(JSON.parse(localStorage.getItem('shoppingBagItems')) || [])
    //const [wishlistItems, setWishlistItems] = useState(JSON.parse(localStorage.getItem('wishlistItems')) || [])


  useEffect(() => {
    const savedBag = localStorage.getItem('shoppingBagItems')
    if (savedBag) {
      setShoppingBagItems(JSON.parse(savedBag))
    }
  }, [])

  /*useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlistItems')
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist))
    }
  }, [])*/

  useEffect(() => {
    localStorage.setItem('shoppingBagItems', JSON.stringify(shoppingBagItems))
  }, [shoppingBagItems])
/*
  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems))
  }, [wishlistItems])*/

  function addToShoppingBag(item, size, category) {
    setShoppingBagItems(prevItems => [...prevItems, {...item, uniqueId: uuidv4(), size, category}])
  }

  /*function addToWishlist(item, category) {
    setWishlistItems(prevItems => [...prevItems, {...item, category, isSaved: true}])
  }*/

  function removeFromShoppingBag(uniqueId) {
    setShoppingBagItems(prevItems => prevItems.filter(item => item.uniqueId !== uniqueId))    
  }

  /*function removeFromWishlist(item) {
    setWishlistItems(prevItems => prevItems.filter(wish => wish.name !== item.name))  
  }*/

  /*const isFavourite = (item) => {
    return wishlistItems.some((favItem) => favItem.name === item.name);
  }*/



  return (
      <ClothesContext.Provider value={{shoppingBagItems, 
                                       addToShoppingBag, 
                                       removeFromShoppingBag}}
      >
        {children}
      </ClothesContext.Provider>
  )
}

export { ClothesContext, ClothesContextProvider }
