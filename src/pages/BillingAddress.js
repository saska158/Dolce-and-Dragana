import { useOutletContext } from "react-router-dom"

const BillingAddress = () => {
    const {billingAddressData, setBillingAddressData} = useOutletContext()

    const handleChange = (e) => {
        const { name, value } = e.target
        setBillingAddressData(prevData => {
            return {
                ...prevData,
                [name]: value
            }
        })
    }

    return (
      <div className="form-container">
        <div className="form-container-div form-container-billing">
          <h4>edit your billing address</h4>
            <p style={{fontSize: '.7rem', textTransform: "none"}}>
              To place your order, you must first fill in your account details. 
              You can change them in your account at any time.
            </p>
            <form className="form form-billing">
              <div className="form-section">
              <input
                type="text"
                id="address"
                placeholder="ADDRESS" 
                name="address"
                value={billingAddressData.address}
                onChange={handleChange}
                required
              />
              <label htmlFor="address" className="input-message">&#9432; Enter your address</label>
              <input
                type="text"
                id="zip-code"
                placeholder="ZIP CODE" 
                name="zipCode"
                value={billingAddressData.zipCode}
                pattern="\d{5}(-\d{4})?"
                maxLength="10"
                onChange={handleChange}
                required
              />
              <label htmlFor="zip-code" className="input-message">&#9432; Enter your zip code</label>
              <input
                type="text"
                id="city"
                placeholder="CITY" 
                name="city"
                value={billingAddressData.city}
                onChange={handleChange}
                required
              />
              <label htmlFor="city" className="input-message">&#9432; Enter your city</label>
              </div>
              <div className="form-section">
              <input
                type="text"
                id="region"
                placeholder="REGION"
                name="region" 
                value={billingAddressData.region}
                onChange={handleChange}
                required
              />
              <label htmlFor="region" className="input-message">&#9432; Enter your region</label>
              <div style={{ 
                           display: 'flex', 
                           justifyContent: 'space-between', 
                           alignItems: 'flex-end', 
                           gap: '1em', 
                           padding: '0',
                           width: '100%',
                           position: 'relative'
                          }}>
                <input
                  type="tel"
                  placeholder="PREFIX"
                  name="prefix"
                  value={billingAddressData.prefix}
                  onChange={handleChange}
                  pattern="\+\d{1,3}"
                  required
                  style={{ width: '20%'}}
                />
                <input
                  type="tel"
                  id="telephone"
                  placeholder="TELEPHONE"
                  name="telephone"
                  value={billingAddressData.telephone}
                  onChange={handleChange}
                  pattern="\d{7,10}"
                  required
                  style={{ width: '80%'}}
                />
                <label 
                  htmlFor="telephone" 
                  className="input-message"
                  style={{position: 'absolute', bottom: '-20px', left: '23%'}}
                >
                  &#9432; Enter your phone
                </label>
              </div>
              </div>
            </form>
          </div>
    </div>
  )
}

export default BillingAddress