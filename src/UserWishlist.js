import { useState, useContext } from "react"
import { Link, NavLink } from "react-router-dom"
import { ClothesContext } from "./clothesContext"
import ItemCard from "./ItemCard"

export default function UserWishlist() {
    const { wishlistItems, removeFromWishlist, addToShoppingBag, shoppingBagItems } = useContext(ClothesContext)
    const [selectedItem, setSelectedItem] = useState(null)
    const [showSelectedItem, setShowSelectedItem] = useState(false)
    const [isItemFavourited, setIsItemFavourited] = useState(false)
    const [showFavouritedBox, setShowFavouritedBox] = useState(false)
    console.log(wishlistItems)

    const navLinkActiveStyle = {
      fontWeight: '700',
      color: '#000'
    }

    return (
        <div className="content-container" style={{marginTop: '15em'}}>
          <div className="shopping-bag-nav">
                <NavLink 
                  to='/shopping-bag' 
                  //className={({isActive}) => isActive ? 'selected' : ''}
                  style={({isActive}) => isActive ? navLinkActiveStyle : null}
                >{`SHOPPING BAG (${shoppingBagItems.length})`}</NavLink>
                <NavLink 
                  to='/user-wishlist' 
                  style={({isActive}) => isActive ? 
                                        {display: 'flex', alignItems: 'center', gap: '.5em', 
                                        ...navLinkActiveStyle} 
                                        : {display: 'flex', alignItems: 'center', gap: '.5em'}}
                >
                  <span>FAVOURITES</span> 
                  <svg style={{width: '10px'}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                  </svg>
                </NavLink>
             </div> 
          <div className="clothes-grid">
            {
                wishlistItems.map(item => <ItemCard 
                                            category={item.category}
                                            item={item}
                                            setShowSelectedItem={setShowSelectedItem}
                                            setSelectedItem={setSelectedItem}
                                            setIsItemFavourited={setIsItemFavourited}
                                            setShowFavouritedBox={setShowFavouritedBox}
                                          />)
            }
          </div>
          {showSelectedItem ? (
            <div className="selected-item-show">
              <button onClick={() => setShowSelectedItem(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
              <p>SIZE {selectedItem.size} ADDED TO YOUR SHOPPING BAG</p>
              <div>
                <img src={selectedItem.images[0]} />
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

// <>YOU MUST LOG IN TO VIEW AND SAVE ITEMS TO YOUR FAVOURITES LISTS.</>