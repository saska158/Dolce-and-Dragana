import { useState, useEffect, createContext, useContext } from "react"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      const auth = getAuth()
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user)
        setLoading(false)
      })
    
      return () => unsubscribe()
    }, [])

    const logOut = async () => {
      const auth = getAuth()
      await signOut(auth)
      setUser(null)
    }  

    return (
        <AuthContext.Provider value={{user, logOut, setUser}}>
          {!loading && children}
        </AuthContext.Provider>
    )
}