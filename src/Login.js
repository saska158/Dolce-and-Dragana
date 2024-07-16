import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { auth } from "./api"
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    //const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      console.log(userCredential, userCredential.user)
      setEmail('')
      setPassword('')
      //navigate(location.state?.from || '/user')
      navigate('/shopping-bag/user-favorites', {replace: true})
    } catch (error) {
      let customMessage
      if(error.code === 'auth/invalid-credential') {
        customMessage = `WARNING: The user name and password provided do not correspond to any account at D&D.`
      }  else if (error.code === 'auth/invalid-email') {
        customMessage = `WARNING: Enter a valid e-mail address.`
      } else {
        customMessage = `Error signing up: ${error.message}`;
      }
      console.error('Error signing up:', error)
      setError(customMessage)
    } finally {
      setLoading(false)
    }
  }

  /*const handleSignOut = async (e) => {
    e.preventDefault()
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }*/

  console.log(user)

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
        location.state?.message ? 
          <p className="log-in-message">
            {location.state.message}
          </p> : null
      }  
      <div className="form-container">
        <div>
          <h4>LOG IN TO YOUR ACCOUNT</h4>
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
            <button 
              onClick={e => handleSignIn(e)}
              disabled={loading}
            >
              {
                loading ? "LOGGING IN..."
                : "LOG IN"
              }
            </button>
          </form>
          <Link 
            to="/password-recover" 
            className="password-recover-link"
          >
            Have you forgotten your password?
          </Link>
        </div>
        <div>
          <h4>NEED AN ACCOUNT?</h4>
          <Link  
            to="/sign-up"
            className="register-link"
          >
            REGISTER
          </Link>
        </div>
      </div>  
    </div>
  )
}