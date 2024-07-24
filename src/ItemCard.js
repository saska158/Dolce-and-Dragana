import { useState, useEffect, useContext } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { ShoppingBagContext } from "./shoppingBagContext"
import { addFavoriteItem, removeFavoriteItem, getFavoriteItems } from "./api"
import { useAuth } from "./authContext"


export default function ItemCard({
                          category, 
                          item, 
                          setShowSelectedItem, 
                          setSelectedItem, 
                          setIsItemFavourited,
                          setShowFavouritedBox,
                        }) {
  const { user } = useAuth()
  const { addToShoppingBag, removeFromShoppingBag } = useContext(ShoppingBagContext)
  const [showSizeTable, setShowSizeTable] = useState(null)
  const [favorites, setFavorites] = useState([])
  const location = useLocation()
  const navigate = useNavigate()

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

  function toggleSizeTable(itemId) {
    setShowSizeTable(prevItemId => (prevItemId === itemId ? null : itemId))
  } 

  const handleFavouriteClick = async (userId=null, item, itemId) => {
    const stateData = {
      message : "YOU MUST LOG IN TO VIEW AND SAVE ITEMS TO YOUR FAVOURITES LISTS.",
      from: location.pathname
    }
    if(!userId) {
      navigate('/log-in', {state: stateData})
    } else {
        console.log('favorited item')
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

  function toggleSelectedItem() {
    setShowSelectedItem(true)
    setTimeout(() => {setShowSelectedItem(false)}, 3000)
  }

  function toggleFavouritedBox() {
    setShowFavouritedBox(true)
    setTimeout(() => {setShowFavouritedBox(false)}, 1000)
  }

  return ( 
    <div className="item-container">  
      <Link to={`/${category}/${item.id}`} key={item.id} className='item-link'>
        <div className='item'>
          <img className='item-img' src={item.images[0]} alt="item-image" />
            {
              location.pathname !== '/shopping-bag' && location.pathname !== '/user-favorites' ? (
                <>
                  <div onClick={(e) => e.preventDefault()}>
                    <button className="add-button-circle" onClick={() => toggleSizeTable(item.id)}>+</button>
                  </div>
                  {
                    showSizeTable === item.id && (
                      <div onClick={(e) => e.preventDefault()}>
                        <div className="size-table">
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
              <button onClick={() => removeFromShoppingBag(item.uniqueId)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="item-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )          
        }
        <p>{item.name}</p>
        <p>{item.price.toLocaleString()} RSD</p>
        {location.pathname === '/shopping-bag' &&  <p>{item.size}</p>}
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