import { useOutletContext } from "react-router-dom"

const Payment = () => {
  const {paymentMethod, setPaymentMethod} = useOutletContext()
  
  return (
    <div style={{padding: '2em'}}>
      <h4 style={{fontWeight: '300'}}>CHOOSE A PAYMENT METHOD</h4> 
      <div className="payment-methods">
        <div 
          style={ paymentMethod === 'visa' ? {opacity: '.3', gap: '0'} : {gap: '0'}}
          onClick={() => setPaymentMethod('visa')}
        >
          <img
            src={`${process.env.PUBLIC_URL}/assets/visa.png`}
            alt="visa-card"
          />
          <p>VISA</p>
        </div>
        <div 
          style={paymentMethod === 'mastercard' ? {opacity: '.3'} : null}
          onClick={() => setPaymentMethod('mastercard')}
        >
          <img
            src={`${process.env.PUBLIC_URL}/assets/card.png`}
            alt="mastercard"
          />
          <p>MASTERCARD</p>
        </div>
        <div 
          style={paymentMethod === 'pod' ? {opacity: '.3'} : null}
          onClick={() => setPaymentMethod('pod')}
        >
          <p style={{fontSize: '1rem', fontWeight: '700'}}>POD</p>
          <p>PAY ON DELIVERY +240 RSD</p>
        </div>
      </div>
    </div>
  )
}

export default Payment