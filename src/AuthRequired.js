import { Outlet, Navigate, useLocation } from "react-router-dom"
import { useAuth } from "./authContext"

const AuthRequired = () => {
    const { user } = useAuth()
    const location = useLocation()

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

export default AuthRequired