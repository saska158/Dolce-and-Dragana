import { Outlet, Navigate, useLocation } from "react-router-dom"
import { useAuth } from "./authContext"

export default function AuthRequired() {
    const { user } = useAuth()
    //const isSignedIn = localStorage.getItem("loggedin")
    const location = useLocation()
    console.log(location)

    if(!user) {
        return <Navigate 
                  to="/log-in" 
                  state={{
                    message: "YOU MUST LOG IN TO VIEW AND SAVE ITEMS TO YOUR FAVOURITES LISTS.",
                    from: location.pathname
                  }}
                  replace
               />
    }

    return <Outlet />
}