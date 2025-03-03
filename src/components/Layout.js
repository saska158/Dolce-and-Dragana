import { useState, useContext, useEffect, useRef } from "react"
import { Link, NavLink, Outlet, useLocation } from "react-router-dom"
import { ShoppingBagContext } from "../contexts/shoppingBagContext"
import { useAuth } from "../contexts/authContext"
import useScreenWidth from "../utils/useScreenWidth"
import gsap from "gsap"

const Layout = () => {
  const { user, logOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuCategory, setMenuCategory] = useState('women')
  const { shoppingBagItems } = useContext(ShoppingBagContext)
  const location = useLocation()
  const { isSmallScreen } = useScreenWidth()
  const menuRef = useRef(null)

  let shoppingBagItemsNumber = 0
  
  shoppingBagItems.forEach(item => shoppingBagItemsNumber += item.amount)

  const linkActiveStyle = {
    fontWeight: '700',
    color: '#000'
  }

  const toggleMenu = () => {
    setMenuOpen(prev => !prev) 
  }

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if(isSmallScreen) {
      if(menuOpen) {
        gsap.to(menuRef.current, {duration: 0.5, x: 0, ease: "power1.in"})
      } else {
        gsap.to(menuRef.current, {duration: 0.5, x: '-100%', ease: "power4.in"})
      }
    }
  }, [menuOpen, isSmallScreen])

    return (
      <div className="container">
        <header>
           <button onClick={toggleMenu} className={`menu-button ${location.pathname === '/' ? 'white' : 'black'}`}>
            {
              !isSmallScreen ? (
                !menuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="menu-toggle">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="menu-toggle">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                )
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="menu-toggle">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                </svg>
              )
            }
           </button>
           <div className={`menu-container ${!isSmallScreen && menuOpen ? 'menu-container-on' : ''}`}>
             <Link to="/" className='logo'>
              {
                menuOpen ? <img src={`${process.env.PUBLIC_URL}/assets/logo/logo-black.svg`} alt="logo" /> :
                <img src={`${process.env.PUBLIC_URL}/assets/logo/logo-green.svg`} alt="logo" /> 
              } 
             </Link>
             <div className={`menu ${menuOpen ? 'menu-visible' : ''}`} ref={menuRef}>
                {
                  isSmallScreen && (
                    <button onClick={toggleMenu} className="menu-button" style={{position: 'fixed', top: '2%', left: '2%', zIndex: '9999'}}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="menu-toggle">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )
                }
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
                       to='/women-jackets'
                       onClick={() => setMenuOpen(false)}
                       style={({isActive}) => isActive ? linkActiveStyle : null}>Jackets</NavLink>
                      <NavLink 
                       className="menu-link" 
                       to='/women-coats'
                       onClick={() => setMenuOpen(false)}
                       style={({isActive}) => isActive ? linkActiveStyle : null}>Coats</NavLink>
                       <NavLink 
                       className="menu-link" 
                       to='/women-sweaters'
                       onClick={() => setMenuOpen(false)}
                       style={({isActive}) => isActive ? linkActiveStyle : null}>Sweaters</NavLink>
                      <NavLink 
                       className="menu-link" 
                       to='/women-blouses'
                       onClick={() => setMenuOpen(false)}
                       style={({isActive}) => isActive ? linkActiveStyle : null}>Blouses</NavLink>
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
            { 
              location.pathname !== '/shopping-bag' && 
              <Link className="shopping-bag-link" to="/shopping-bag">
                { `shopping bag (${shoppingBagItemsNumber})` }
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

