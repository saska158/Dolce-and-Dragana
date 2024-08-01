import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../utils/api"
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
  const [showPassword, setShowPassword] = useState(false)
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

  const handleShowingPassword = () => {
    setShowPassword(!showPassword)
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
        alert ? (
          <div className="pop-up-box">
            <p>{alert}</p>
            <button onClick={() => setAlert("")}>CLOSE</button>
          </div>
        ) : (
          <div className="form-container">
        {
          <div className="form-container-div">
            <h4>PERSONAL DETAILS</h4>
            <form className="form">
              <input
                type="email"
                id="email"
                placeholder="E-MAIL" 
                value={formData.email}
                name="email"
                onChange={handleChange}
                required
              />
              <label htmlFor="email" className="input-message">&#9432; Enter your e-mail address</label>
              <div className="password-container">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="PASSWORD"
                  value={formData.password}
                  name="password"
                  onChange={handleChange}
                  required
                />
                <label htmlFor="password" className="input-message">&#9432; Enter your password</label>
                <span onClick={handleShowingPassword}>
                  {
                    showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    )
                  }
                </span>
              </div>
              <input 
                type="text"
                id="name"
                placeholder="NAME"
                value={formData.name}
                name="name"
                onChange={handleChange}
                required
              />
              <label htmlFor="name" className="input-message">&#9432; Enter your name</label>
              <input 
                type="text"
                id="surname"
                placeholder="SURNAME"
                value={formData.surname}
                name="surname"
                onChange={handleChange}
                required
              />
              <label htmlFor="surname" className="input-message">&#9432; Enter your surname</label>
              <label htmlFor="checkbox2" className="checkbox-label">
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