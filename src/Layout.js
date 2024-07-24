import { useState, useContext } from "react"
import { Link, NavLink, Outlet, useLocation } from "react-router-dom"
import { ShoppingBagContext } from "./shoppingBagContext"
import { useAuth } from "./authContext"

const Layout = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuCategory, setMenuCategory] = useState('women')
  const location = useLocation()
  const { shoppingBagItems } = useContext(ShoppingBagContext)
  const { user, logOut } = useAuth()

  function toggleMenu() {
    setMenuOpen(prev => !prev) 
  }

  /*useEffect(() => {
    if(!menuOpen) {
      setMenuCategory('women')
    }
  }, [menuOpen])*/

  const linkActiveStyle = {
    fontWeight: '700',
    color: '#000'
  }

    return (
      <div className="container">
        <header>
           <button onClick={toggleMenu} className={`menu-button ${location.pathname === '/' ? 'white' : 'black'}`}>
            {
              !menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="menu-toggle">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="menu-toggle">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              )
            }
           </button>
           <div className={`menu-container ${menuOpen ? 'menu-container-on' : ''}`}>
             <Link to="/" className="logo">
               {/*<img src={`${process.env.PUBLIC_URL}/assets/d&d_logo_black.png`} />*/}
               DOLCE&DRAGANA
             </Link>
             <div className={`menu ${menuOpen ? 'menu-visible' : ''}`}>
                <ul className="menu-nav">
                  <li 
                    onClick={() => {setMenuCategory('women')}}
                    style={menuCategory === 'women' ? linkActiveStyle : null}>women</li>
                  <li 
                    onClick={() => setMenuCategory('men')}
                    style={menuCategory === 'men' ? linkActiveStyle : null}>men</li>
                </ul>
                {
                  menuCategory === 'women' && (
                    <div className="menu-list">
                      <NavLink 
                       className="menu-link" 
                       to='/women-blouses'
                       onClick={() => setMenuOpen(false)}
                       style={({isActive}) => isActive ? linkActiveStyle : null}>Blouses</NavLink>
                      <NavLink 
                       className="menu-link" 
                       to='/women-jackets'
                       onClick={() => setMenuOpen(false)}
                       style={({isActive}) => isActive ? linkActiveStyle : null}>Jackets</NavLink>
                      <NavLink 
                       className="menu-link" 
                       to='/women-sweaters'
                       onClick={() => setMenuOpen(false)}
                       style={({isActive}) => isActive ? linkActiveStyle : null}>Sweaters</NavLink>
                      <NavLink 
                       className="menu-link" 
                       to='/women-coats'
                       onClick={() => setMenuOpen(false)}
                       style={({isActive}) => isActive ? linkActiveStyle : null}>Coats</NavLink>
                    </div>
                  )
                }
                {
                  menuCategory === 'men' && (
                    <div className="menu-list">
                      <NavLink
                       className="menu-link" 
                       to='/men-jackets'
                       onClick={() => setMenuOpen(false)}
                       style={({isActive}) => isActive ? linkActiveStyle : null}>Jackets</NavLink>
                      <NavLink 
                       className="menu-link"
                       to='/men-shirts'
                       onClick={() => setMenuOpen(false)}
                       style={({isActive}) => isActive ? linkActiveStyle : null}>Shirts</NavLink>
                    </div>
                  )
                }
             </div>
           </div>
           <div className={`header-links ${location.pathname === '/' ? 'white' : 'black'}`}>
            { 
              user && user.emailVerified ? 
                <Link to="/user">{user.displayName}</Link> : 
                <Link to="/log-in">log in</Link> 
            }
                <Link to="/help">help</Link>
            { 
              location.pathname !== '/shopping-bag' && 
              <Link className="shopping-bag-link" to="/shopping-bag">
                { `shopping bag (${shoppingBagItems.length})` }
              </Link> 
            }
            { 
                  user && user.emailVerified ? <button onClick={logOut}>log out</button> : null 
                }
           </div>
        </header>
        <Outlet />
      </div>
    )
}

export default Layout
