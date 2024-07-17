import { useState } from "react"
import { getAuth, sendPasswordResetEmail } from "firebase/auth"

export default function PasswordRecover() {
    const auth = getAuth()
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('We will send you an email with instructions on how to recover it.')
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

    return (
        <div className="content-container">
            <div className="form-container">
                <div>
                    <h4>RESET PASSWORD</h4>
                    <p>{message}</p>
                    <form className="form">
                        <input
                          type="email"
                          placeholder="E-MAIL" 
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required
                        />
                        <button onClick={e => sendResetEmail(e, email)}>CONTINUE</button>
                    </form>
                </div>
            </div>
        </div>
    )
}