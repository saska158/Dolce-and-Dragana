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
      <div className="form-container" style={{width: '100%'}}>
        <div style={{width: '70%'}}>
          <h4>edit your billing address</h4>
            <p style={{fontSize: '.7rem', textTransform: "none"}}>
              To place your order, you must first fill in your account details. 
              You can change them in your account at any time.
            </p>
            <form 
              className="form" 
              style={{
              height: '200px', 
              flexWrap: 'wrap',
              alignItems: 'flex-start'
              }}
            >
              <input
                type="text"
                placeholder="ADDRESS" 
                name="address"
                value={billingAddressData.address}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                placeholder="ZIP CODE" 
                name="zipCode"
                value={billingAddressData.zipCode}
                pattern="\d{5}(-\d{4})?"
                maxLength="10"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                placeholder="REGION"
                name="region" 
                value={billingAddressData.region}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                placeholder="CITY" 
                name="city"
                value={billingAddressData.city}
                onChange={handleChange}
                required
              />
              <div style={{ display: 'flex', padding: '0' }}>
                <input
                  type="tel"
                  placeholder="PREFIX"
                  name="prefix"
                  value={billingAddressData.prefix}
                  onChange={handleChange}
                  pattern="\+\d{1,3}"
                  required
                  style={{ width: '80px', marginRight: '10px' }}
                />
                <input
                  type="tel"
                  placeholder="TELEPHONE"
                  name="telephone"
                  value={billingAddressData.telephone}
                  onChange={handleChange}
                  pattern="\d{7,10}"
                  required
                />
              </div>
            </form>
          </div>
    </div>
  )
}

export default BillingAddress