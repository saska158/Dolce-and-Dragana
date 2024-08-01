import { useState, useEffect, useCallback } from "react"
import { useAuth } from "./authContext"
import { getBillingAddress } from "./api"
import { NavLink } from "react-router-dom"

const UserProfile = () => {
    const { user } = useAuth()
    const [billingAddress, setBillingAddress] = useState(null)

    const navLinkStyle = {
      fontWeight: '400',
      display: 'flex',
      alignItems: 'center',
      gap: '.5em'
    }

    const navLinkActiveStyle = {
      fontWeight: '700',
      color: '#000'
    }

    const fetchBillingAddress = useCallback(async () => {
      const data = await getBillingAddress(user.uid)
      console.log(data)
      setBillingAddress(data)
    }, [user])     


    useEffect(() => {
      fetchBillingAddress()
    }, [user, fetchBillingAddress])

    return (
        <div className="content-container">
            <nav className="shopping-bag-nav">
              <NavLink 
                to='/user' 
                style={({isActive}) => isActive ? {...navLinkStyle, ...navLinkActiveStyle} : navLinkStyle}
              >PROFILE</NavLink>
              <NavLink 
                to='/shopping-bag/user-favorites' 
                style={({isActive}) => isActive ? {...navLinkStyle, ...navLinkActiveStyle} : navLinkStyle}
              >
                <span>FAVORITES</span>
                <svg style={{width: '10px'}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                </svg>
              </NavLink>
            </nav>
            <div className="personal-details">
              <p>{user.displayName}</p><br />
              <p>email:</p>
              <p style={{textTransform: 'lowercase'}}>{user.email}</p><br />
              {
                billingAddress && (
                  <div style={{textTransform: 'none'}}>
                    <p style={{textTransform: 'uppercase'}}>address:</p>
                    <p>{billingAddress.address}</p> 
                    <p>{billingAddress.city}, {billingAddress.zipCode}</p>
                    <p>{billingAddress.region}</p>
                    <p>
                      <span>{billingAddress.prefix}</span>
                      <span>{billingAddress.telephone}</span>
                    </p>
                  </div>
                )
              }
            </div>
        </div>
    )
}

export default UserProfile