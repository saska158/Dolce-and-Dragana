import { useState, useEffect, useContext, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { ShoppingBagContext } from "./shoppingBagContext"
import { addFavoriteItem, removeFavoriteItem, getFavoriteItems } from "./api"
import { useAuth } from "./authContext"
import { LazyLoadImage } from "react-lazy-load-image-component"
import gsap from "gsap"

const ItemCard = ({
                    category, 
                    item, 
                    setShowSelectedItem, 
                    setSelectedItem, 
                    setIsItemFavourited,
                    setShowFavouritedBox,
                 }) => {
  const { user } = useAuth()
  const { 
    addToShoppingBag, 
    removeFromShoppingBag, 
    setShoppingBagItems 
  } = useContext(ShoppingBagContext)
  const [showSizeTable, setShowSizeTable] = useState(null)
  const [favorites, setFavorites] = useState([])
  const location = useLocation()
  const navigate = useNavigate()
  const sizeTableRef = useRef(null) 

  useEffect(() => {
    if(user) {
    const unsubscribe = getFavoriteItems(user.uid, setFavorites)
    return () => unsubscribe && unsubscribe()
    }
  }, [user])

  const isFavourite = (item) => {
    if(favorites?.length > 0) {
      return favorites.some((favItem) => favItem.name === item.name)
    }
  }  

  const handleFavouriteClick = async (userId=null, item, itemId) => {
    const stateData = {
      message : "YOU MUST LOG IN TO VIEW AND SAVE ITEMS TO YOUR FAVOURITES LISTS.",
      from: location.pathname
    }
    if(!userId) {
      navigate('/log-in', {state: stateData})
    } else {
        if (isFavourite(item)) {
          setIsItemFavourited(false)
          const favoriteId = favorites.filter(favItem => favItem.name === itemId)[0].uniqueId
          await removeFavoriteItem(userId, favoriteId)
        } else {
          setIsItemFavourited(true)
          await addFavoriteItem(userId, item, category)
        }
      }
  }

  const toggleSelectedItem = () => {
    setShowSelectedItem(true)
    setTimeout(() => {setShowSelectedItem(false)}, 3000)
  }

  const toggleSizeTable = (itemId) => {
    setShowSizeTable(prevItemId => (prevItemId === itemId ? null : itemId))
  }

  const toggleFavouritedBox = () => {
    setShowFavouritedBox(true)
    setTimeout(() => {setShowFavouritedBox(false)}, 1000)
  }

  const increaseAmount = (shoppingBagId) => {
    setShoppingBagItems(prevItems => {
      const itemExists = prevItems.some(prevItem => prevItem.shoppingBagId === shoppingBagId)
      if (itemExists) {
        return prevItems.map(prevItem => {
          if(prevItem.shoppingBagId === shoppingBagId) {
            return {...prevItem, amount: prevItem.amount + 1}
          }
          return prevItem
        })
      }
    })
  }

  const decreaseAmount = (shoppingBagId) => {
    setShoppingBagItems(prevItems => {
      const itemExists = prevItems.some(prevItem => prevItem.shoppingBagId === shoppingBagId)
      if (itemExists) {
        return prevItems.map(prevItem => {
          if(prevItem.shoppingBagId === shoppingBagId) {
            return {...prevItem, amount: prevItem.amount > 0 ? prevItem.amount - 1 : 0}
          }
          return prevItem
        })
      }
    })
  }

  useEffect(() => {
    if(showSizeTable) {
      gsap.to(sizeTableRef.current, {duration: 0.7, y: 0, ease: "power4.out"})
    } else {
      gsap.to(sizeTableRef.current, {duration: 0.7, y: '100%', ease: "power4.in"})
    }
  }, [showSizeTable])

  return ( 
    <div className="item-container">  
      <Link to={`/${category}/${item.id}`} key={item.id} className='item-link'>
        <div className='item'>
          <LazyLoadImage className='item-img' src={item.mainImageUrl} alt="item-image" />
            {
              location.pathname !== '/shopping-bag' && location.pathname !== '/user-favorites' ? (
                <>
                  <div onClick={(e) => e.preventDefault()}>
                    <button className="add-button-circle" onClick={() => toggleSizeTable(item.id)}>+</button>
                  </div>
                  {
                    showSizeTable === item.id && (
                      <div onClick={(e) => e.preventDefault()}>
                        <div className="size-table" ref={sizeTableRef}>
                          {item.sizes.map(size => <div 
                                                    key={size} 
                                                    onClick={() => {
                                                              addToShoppingBag(item, size, category); 
                                                              setShowSizeTable(null);
                                                              setSelectedItem({...item, size});
                                                              toggleSelectedItem()}}
                                                  >{size}</div>
                          )}
                        </div>
                      </div>
                    )
                  }
                </> 
              ) : null
            }
        </div>
      </Link>
      <div 
        className='item-description' 
        onClick={() => (showSizeTable ? setShowSizeTable(null) : null)}
      >
        <button 
          className="add-to-favorites-btn"
          onClick={() => {
            handleFavouriteClick(user && user.uid, item, item.name)
            toggleFavouritedBox()
          }} 
        >
          {
            isFavourite(item) ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="item-icon">
                <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="item-icon">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
              </svg>
            )
          }
        </button>
        {
          location.pathname === '/shopping-bag' && (
            <div onClick={e => e.preventDefault()}>
              <button 
                onClick={() => removeFromShoppingBag(item.shoppingBagId)}
                className="remove-from-favorites-btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="item-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )          
        }
        <div className="item-description-details">
          <p>{item.name}</p>
          <p>{item.amount ? (item.price * item.amount).toLocaleString() : item.price.toLocaleString()} RSD</p>
          {location.pathname === '/shopping-bag' &&  (
            <div>
              <p>{item.size}</p>
              <div 
              className="item-amount"
              style={{
                border: '.3px solid #000', 
                width: 'fit-content', 
                display: 'flex', 
                justifyContent: 'center',
                fontSize: '.8rem',
              }}>
                {
                  item.amount !== 1 && (
                    <button 
                      style={{
                      textAlign: 'center', 
                      borderRight: '.3px solid #000',
                      padding: '.3em .8em',
                    }}
                      onClick={() => decreaseAmount(item.shoppingBagId)}
                    >-</button>
                  ) 
                }
                <span 
                  style={{
                    textAlign: 'center', 
                    borderRight: '.3px solid #000',
                    padding: '.3em .8em',
                  }}
                >{item.amount}</span>
                <button 
                  style={{
                    textAlign: 'center',
                    padding: '.3em .8em',
                  }}
                  onClick={() => increaseAmount(item.shoppingBagId)}
                >+</button>
              </div>
            </div>
          )}
        </div>
      </div>
      {
        location.pathname === '/user-favorites' && (
          <div>
            <div onClick={(e) => e.preventDefault()}>
              <button className="add-button" onClick={() => toggleSizeTable(item.id)}>ADD</button>
            </div>
            {
              showSizeTable === item.id && (
                <div onClick={(e) => e.preventDefault()}>
                  <div className="size-table">
                    {item.sizes.map(size => <div 
                                              key={size} 
                                              onClick={() => {
                                                addToShoppingBag(item, size, category)
                                                setShowSizeTable(null)
                                                setSelectedItem({...item, size})
                                                toggleSelectedItem()}}>{size}</div>
                    )}
                  </div>
                </div>
              )
            }
          </div>
        )
      }
    </div>
  )
}

export default ItemCard