import { useState, useEffect, useCallback } from "react"
import { useAuth } from "./authContext"
import { getBillingAddress } from "./api"
import { NavLink } from "react-router-dom"

const UserProfile = () => {
    const { user } = useAuth()
    const [billingAddress, setBillingAddress] = useState(null)

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
              <NavLink to='/user' className={(isActive) => isActive ? 'selected' : ''}>PROFILE</NavLink>
              <NavLink to='/shopping-bag/user-favorites' className={(isActive) => isActive ? 'selected' : ''}>FAVORITES</NavLink>
            </nav>
            <div className="personal-details">
              <p>personal details:</p><br />
              <p>{user.email}</p>
              <p>{user.displayName}</p><br />
              {
                billingAddress && (
                  <div>
                    <p>{billingAddress.address}</p><br />
                    <p>{billingAddress.city}</p><br />
                    <p>{billingAddress.zipCode}</p><br />
                    <p>{billingAddress.region}</p><br />
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