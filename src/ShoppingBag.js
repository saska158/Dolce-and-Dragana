import { useState, useContext } from "react"
import { Link } from "react-router-dom"
import { ShoppingBagContext } from "./shoppingBagContext"
import ItemCard from "./ItemCard"

const ShoppingBag = () => {
  const { shoppingBagItems } = useContext(ShoppingBagContext)
  const [isItemFavourited, setIsItemFavourited] = useState(false)
  const [showFavouritedBox, setShowFavouritedBox] = useState(false)
  
  let totalAmount = 0
  shoppingBagItems.forEach(item => totalAmount += item.price)
    
  return (
    <>
      {!shoppingBagItems.length ? 
        <div className="empty-shopping-bag">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '20px'}}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          <p>YOUR SHOPPING BAG IS EMPTY</p>
        </div> :
        <>
          <div className="clothes-grid">
            {
              shoppingBagItems.map(item => <ItemCard
                                            key={item.id}
                                            category={item.category}
                                            item={item}
                                            setIsItemFavourited={setIsItemFavourited}
                                            setShowFavouritedBox={setShowFavouritedBox}  
                                           />)
            }  
          </div>  
          <footer className="shopping-bag-footer">
            <div className="terms-privacy">
              <p style={{padding: '1em'}}>
                * By continuing, I declare that I have read and accept the Purchase Conditions 
                and understand D&D's Privacy and Cookie Policy.
              </p>
            </div>
            <div className="total-amount">
              {totalAmount && `TOTAL ${totalAmount.toLocaleString()} RSD`}
            </div>
            <button className="shopping-bag-footer-button">CONTINUE</button>
          </footer>
        </>  
      }
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
    </>
     
  )
}

export default ShoppingBag