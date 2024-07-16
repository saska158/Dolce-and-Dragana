import { useContext } from "react"
import { NavLink, Outlet } from "react-router-dom"
import { ClothesContext } from "./clothesContext"

export default function ShoppingBagLayout() {
  const { shoppingBagItems } = useContext(ClothesContext)

  const navLinkActiveStyle = {
    fontWeight: '700',
    color: '#000'
  }

  return (
    <div className="content-container">
      <div className="shopping-bag-nav">
        <NavLink 
          to='/shopping-bag' 
          style={({isActive}) => isActive ? navLinkActiveStyle : null}
        >
          {`SHOPPING BAG (${shoppingBagItems.length})`}
        </NavLink>
        <NavLink 
          to='/shopping-bag/user-favorites' 
          style={({isActive}) => isActive ? 
                                  {display: 'flex', alignItems: 'center', gap: '.5em', ...navLinkActiveStyle} 
                                  : {display: 'flex', alignItems: 'center', gap: '.5em'}}
        >
          <span>FAVOURITES</span> 
          <svg style={{width: '5px'}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
          </svg>
        </NavLink>
      </div> 
      <Outlet />
    </div>
  )
}