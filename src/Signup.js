import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "./api"
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth"

const Signup = () => {
  const initialState = {
    email: '',
    password: '',
    name: '',
    surname: '',
    terms: false
  }
  const [formData, setFormData] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [alert, setAlert] = useState('')

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value 
    }))
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    const { email, password, name, surname, terms } = formData
    if (!name || !surname || !email || !password || !terms) {
      setAlert("Please fill in all fields and agree to the terms and conditions.")
      return
    }
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
      setFormData(initialState)
      navigate('/email-verification', {replace:true})
    } catch(error) {
      let customMessage
      if(error.code === 'auth/email-already-in-use') {
        customMessage = `WARNING: The email address entered is already being used. Please select another.`
      } else if (error.code === 'auth/invalid-email') {
        customMessage = `WARNING: Enter a valid e-mail address.`
      } else if (error.code === 'auth/missing-password') {
        customMessage = `WARNING: Enter a password.`
      } else {
        customMessage = `Error signing up: ${error.message}`;
      }
      console.error('Error signing up:', error)
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
      {
        alert ? (
          <div className="pop-up-box">
            <p>{alert}</p>
            <button onClick={() => setAlert("")}>CLOSE</button>
          </div>
        ) : (
          <div className="form-container">
        {
          <div>
            <h4>PERSONAL DETAILS</h4>
            <form className="form">
              <input
                type="email"
                placeholder="E-MAIL" 
                value={formData.email}
                name="email"
                onChange={handleChange}
                required
              />
              <input 
                type="password"
                placeholder="PASSWORD"
                value={formData.password}
                name="password"
                onChange={handleChange}
                required
              />
              <input 
                type="text"
                placeholder="NAME"
                value={formData.name}
                name="name"
                onChange={handleChange}
                required
              />
              <input 
                type="text"
                placeholder="SURNAME"
                value={formData.surname}
                name="surname"
                onChange={handleChange}
                required
              />
              <label htmlFor="checkbox2">
                <input 
                  type="checkbox"
                  id="checkbox2"
                  checked={formData.terms}
                  name="terms"
                  onChange={handleChange}
                  required
                />
                  I have read and understand the Privacy and Cookies Policy
              </label>
              <button onClick={(e) => handleSignUp(e)}>CREATE ACCOUNT</button>
            </form>
          </div>
        }
      </div>
        )
      }
    </div>
  )
}

export default Signup