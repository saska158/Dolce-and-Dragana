import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "./authContext"
import { getFavoriteItems } from "./api"
import ItemCard from "./ItemCard"

const UserFavorites = () => {
    const { user } = useAuth()
    const [favorites, setFavorites] = useState([])
    const [isItemFavourited, setIsItemFavourited] = useState(false)
    const [showFavouritedBox, setShowFavouritedBox] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [showSelectedItem, setShowSelectedItem] = useState(false)

    useEffect(() => {
      const unsubscribe = getFavoriteItems(user.uid, setFavorites)
      return () => unsubscribe && unsubscribe()
    }, [user.uid])

    return (
        <div style={{marginLeft: '1em'}}>
            <p style={{fontWeight: '700'}}>{user.displayName}'s...</p><br />
            {
                favorites?.length > 0 ? (
                    <div className="clothes-grid">
              {favorites.map(fav => <ItemCard 
                                      key={fav.name} 
                                      item={fav} 
                                      category={fav.category}
                                      setIsItemFavourited={setIsItemFavourited}
                                      setShowFavouritedBox={setShowFavouritedBox}
                                      setShowSelectedItem={setShowSelectedItem}
                                      setSelectedItem={setSelectedItem}
                                    />)}
            </div>
                ) : 'YOU DO NOT HAVE ANY SAVED ITEMS'
            }

{showSelectedItem ? (
          <div className="selected-item-show">
            <button onClick={() => setShowSelectedItem(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            <p>SIZE {selectedItem.size} ADDED TO YOUR SHOPPING BAG</p>
            <div>
              <img src={selectedItem.images[0]} alt="favorited-image" />
              <p>{selectedItem.name}</p>
            </div>
            <Link to='/shopping-bag'>SEE SHOPPING BAG</Link>
          </div>
        ) : null} 

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
        </div>
    )
}

export default UserFavorites