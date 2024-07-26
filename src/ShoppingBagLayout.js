import { useState, useContext, useEffect, useCallback } from "react"
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"
import { ShoppingBagContext } from "./shoppingBagContext"
import { useAuth } from "./authContext"
import { addBillingAddress, checkBillingAddress } from "./api"

const ShoppingBagLayout = () => {
  const { user } = useAuth()
  const initialState = {
    address: '',
    zipCode: '',
    region: '',
    city: '',
    prefix: '+381',
    telephone: ''
  }
  const [billingAddressData, setBillingAddressData] = useState(initialState)
  const [hasBillingAddressData, setHasBillingAddressData] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [alert, setAlert] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const { shoppingBagItems, setShoppingBagItems } = useContext(ShoppingBagContext)
  
  let shoppingBagItemsNumber = 0
  shoppingBagItems.forEach(item => shoppingBagItemsNumber += item.amount)

  let totalAmount = 0
  shoppingBagItems.forEach(item => totalAmount += item.price * item.amount)

  const navLinkActiveStyle = {
    fontWeight: '700',
    color: '#000'
  }

  console.log(user)

  const updateBillingAddress = async () => {
    setLoading(true)
    setError(null)
    try {
      await addBillingAddress(user.uid, billingAddressData)
      setBillingAddressData(initialState)
    } catch(error) {
      console.error('Error updating billing address:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const hasBillingAddress = useCallback(async () => {
    if(user) {
      const hasAddress = await checkBillingAddress(user?.uid)
      console.log('has it',hasAddress)
      setHasBillingAddressData(hasAddress)
    }
  }, [user])

  useEffect(() => {
    hasBillingAddress()
  }, [user, hasBillingAddress])

  const handleContinue = async () => {
    const stateData = {
      message : "YOU MUST LOG IN TO CONTINUE WITH YOUR ORDER.",
      from: location.pathname
    }
    if(location.pathname === '/shopping-bag') {
      await hasBillingAddress()
      if(hasBillingAddressData) {
        navigate('/shopping-bag/payment')
      } else if(user) {
        navigate('/shopping-bag/billing-address')
      } else {
        navigate('/log-in', {state: stateData})
      }
    } else if(location.pathname === '/shopping-bag/billing-address') {
      const { address, zipCode, region, city, telephone } = billingAddressData
      if (!address || !zipCode || !region || !city || !telephone) {
        setAlert("Please fill in all fields.")
        return
      }
      await updateBillingAddress()
      navigate('/shopping-bag/payment')
    } else if(location.pathname === '/shopping-bag/payment') {
      if(paymentMethod) {
        navigate('/order-completed')
        setShoppingBagItems([])
      } else {
        setAlert("Please select a payment method.")
      }
    }
  }

  console.log('payment', paymentMethod)

  if(loading) {
    return (
      <div className="content-container">
        <h1>Loading...</h1>
      </div>
    )
  }

  if(error) {
    return (
      <div className="content-container">
        <div className="pop-up-box">
          <p>{error}</p>
          <button onClick={() => setError(null)}>CLOSE</button>
        </div>
      </div>
    )
  }

  if(alert) {
    return (
      <div className="pop-up-box">
        <p>{alert}</p>
        <button onClick={() => setAlert("")}>CLOSE</button>
      </div>
    )
  }

  return (
    <div className="content-container">
      {
        location.pathname === "/shopping-bag" || location.pathname === "/shopping-bag/user-favorites" ? (
          <div className="shopping-bag-nav">
            <NavLink 
              to='/shopping-bag' 
              style={({isActive}) => isActive ? navLinkActiveStyle : null}
            >
              {`SHOPPING BAG (${shoppingBagItemsNumber})`}
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
        ) : null
      }
      <Outlet context={{billingAddressData, setBillingAddressData, paymentMethod, setPaymentMethod}}/>
      {
        shoppingBagItems.length && location.pathname !== '/shopping-bag/user-favorites' ? (
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
            <button 
              className="shopping-bag-footer-button"
              onClick={handleContinue}
            >
              CONTINUE
            </button>
          </footer>
        ) : null
      }
    </div>
  )
}

export default ShoppingBagLayout