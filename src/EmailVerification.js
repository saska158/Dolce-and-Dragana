import { useState, useEffect } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "./authContext"
import { getAuth, reload } from "firebase/auth"

export default function EmailVerification() {
    const {user, setUser} = useAuth()
    const [isEmailVerified, setIsEmailVerified] = useState(user?.emailVerified)
    const [verificationMessage, setVerificationMessage] = useState('')
    console.log(user, 'from emailVerification')

   useEffect(() => {
    if(user) {
      setIsEmailVerified(user?.emailVerified)
    }
   }, [user])

   const checkEmailVerified = async () => {
    const auth = getAuth()
    await reload(auth.currentUser) // reload user data from Firebase
    const updatedUser = auth.currentUser
    setUser(updatedUser) // update context with the new user data
    setIsEmailVerified(updatedUser?.emailVerified) // update local state
    if(!updatedUser.emailVerified) {
      setVerificationMessage("Your email is not verified yet. Please check your email and verify your account.")
    }
}

    return (
        <>
          {
            !isEmailVerified ? (
                <div className="content-container">
                  <h2>Two More Steps to Creating Your Account</h2>
                  <p>
                    1. A verification email has been sent to your email address. Please check your inbox and follow the instructions to verify your account.
                  </p>
                  <p>
                    2. Once you have verified your email, click the button below to confirm your verification status.
                  </p>
                  <button onClick={checkEmailVerified}>I've Verified My Email</button>
                  { verificationMessage && <p>{verificationMessage}</p> }
                </div>
            ) : <Navigate to="/shopping-bag/user-favorites" />
          }
        </>
    )
}