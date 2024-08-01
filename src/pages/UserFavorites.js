import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/authContext"
import { getFavoriteItems } from "../utils/api"
import ItemCard from "../components/ItemCard"
import gsap from "gsap"

const UserFavorites = () => {
    const { user } = useAuth()
    const [favorites, setFavorites] = useState([])
    const [isItemFavourited, setIsItemFavourited] = useState(false)
    const [showFavouritedBox, setShowFavouritedBox] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [showSelectedItem, setShowSelectedItem] = useState(false)
    const selectedItemRef = useRef(null)
    const itemsGridRef = useRef(null)

    useEffect(() => {
      const unsubscribe = getFavoriteItems(user.uid, setFavorites)
      return () => unsubscribe && unsubscribe()
    }, [user.uid])

    useEffect(() => {
      if(showSelectedItem) {
        gsap.to(selectedItemRef.current, {duration: 0.7, x: 0, ease: "power4.out"})
      } else {
        gsap.to(selectedItemRef.current, {duration: 0.7, x: '100%', ease: "power4.in"})
      }
    }, [showSelectedItem])

    useEffect(() => {
      gsap.to(itemsGridRef.current, {duration: 0.9, delay: 0.3, y: 0, opacity: 1, ease: "power4.out" })
    }, [favorites])
    

    return (
      <>
        <div style={showSelectedItem ? {opacity: '.3'} : null}>
          <p style={{fontSize: '.7rem', padding: '1em'}}>{user.displayName}'s...</p>
            {
              favorites?.length > 0 ? (
                <div className="clothes-grid" ref={itemsGridRef}>
                  {favorites.map(fav => <ItemCard 
                                          key={fav.name} 
                                          item={fav} 
                                          category={fav.category}
                                          setIsItemFavourited={setIsItemFavourited}
                                          setShowFavouritedBox={setShowFavouritedBox}
                                          setShowSelectedItem={setShowSelectedItem}
                                          setSelectedItem={setSelectedItem}
                                        />
                  )}
                </div>
              ) : (
                <div className="empty">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="item-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                  </svg>
                  <p>YOU DO NOT HAVE ANY SAVED ITEMS</p>
                </div>
              )
            }
        </div>
        {
          showFavouritedBox ? 
            <div className="favourited-item-show">
              {
                isItemFavourited ? (
                  <>
                    <p>Saved</p>
                      <Link to='/user-wishlist'>SEE LIST</Link>
                  </>
                ) : (
                  <p>The item has been removed from favourites.</p>
                )
              }
            </div> 
          : null
        }
        {
          selectedItem && (
            <div className="selected-item-show" ref={selectedItemRef}> 
              <button 
                onClick={() => setShowSelectedItem(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
              <p>SIZE {selectedItem.size} ADDED TO YOUR SHOPPING BAG</p>
              <div>
                <img src={selectedItem.images[0]} alt="selected-image" />
                <p>{selectedItem.name}</p>
              </div>
              <Link to='/shopping-bag'>SEE SHOPPING BAG</Link>
            </div>
          )
        }
      </>
    )
}

export default UserFavorites

