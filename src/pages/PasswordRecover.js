import { useState } from "react"
import { getAuth, sendPasswordResetEmail } from "firebase/auth"

const PasswordRecover = () => {
    const auth = getAuth()
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const sendResetEmail = async (e, email) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            await sendPasswordResetEmail(auth, email)
            console.log("Password reset email sent!")
            setMessage("Password reset email sent!")
            setEmail('')
        } catch(error) {
            let customMessage
            if (error.code === 'auth/invalid-email') {
                customMessage = `WARNING: Enter a valid e-mail address.`
            } else if(error.code === 'auth/missing-email') {
              customMessage = `WARNING: Enter an e-mail address.`
            } else {
                customMessage = `Error signing up: ${error.message}`
            }
            console.error("Error sending password reset email:", error)
            setError(customMessage)
        } finally {
            setLoading(false)
        }
    }

    if(loading) {
        return (
            <div className="content-container">
              <p className="loader-and-error">Loading...</p>
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

    return (
        <div className="content-container">
          {
            message ? 
              <div>{message}</div> : (
                <div className="form-container">
                  <div className="form-container-div">
                    <h4>RESET PASSWORD</h4>
                    <p>We will send you an email with instructions on how to recover it.</p>
                    <form className="form">
                      <input
                        type="email"
                        id="email"
                        placeholder="E-MAIL" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                      />
                      <label htmlFor="email" className="input-message">&#9432; Enter your e-mail address</label>
                      <button onClick={e => sendResetEmail(e, email)}>CONTINUE</button>
                    </form>
                  </div>
                </div>
              )
          }
        </div>
    )
}

export default PasswordRecover