import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "./api"
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth"

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      console.log('Signing up with:', email, password)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      await updateProfile(user, {
        displayName: `${name} ${surname}`
      })
      await sendEmailVerification(user)
      console.log('User signed up successfully:', user)
      setUser(user)
      setEmail('')
      setPassword('')
      setName('')
      setSurname('')
      navigate('/email-verification', {replace:true})
    } catch(error) {
      let customMessage
      if(error.code === 'auth/email-already-in-use') {
        customMessage = `WARNING: The email address entered is already being used. Please select another.`
      } else {
        customMessage = `Error signing up: ${error.message}`;
      }
      console.error('Error signing up:', error)
      setError(customMessage)
    } finally {
      setLoading(false)
    }
  }
  console.log(user, 'user')

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
        {
          <div>
            <h4>PERSONAL DETAILS</h4>
            <form className="form">
              <input
                type="email"
                placeholder="E-MAIL" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <input 
                type="password"
                placeholder="PASSWORD"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <input 
                type="text"
                placeholder="NAME"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <input 
                type="text"
                placeholder="SURNAME"
                value={surname}
                onChange={e => setSurname(e.target.value)}
                required
              />
              <label htmlFor="checkbox2">
                <input 
                  type="checkbox"
                  id="checkbox2"
                  required
                />
                  I have read and understand the Privacy and Cookies Policy
              </label>
              <button onClick={(e) => handleSignUp(e)}>CREATE ACCOUNT</button>
            </form>
          </div>
        }
      </div>
    </div>
  )
}