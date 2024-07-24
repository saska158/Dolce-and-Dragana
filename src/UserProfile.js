import { useAuth } from "./authContext"
import { NavLink } from "react-router-dom"

const UserProfile = () => {
    const { user } = useAuth()

    return (
        <div className="content-container">
            <nav className="shopping-bag-nav">
              <NavLink to='/user' className={(isActive) => isActive ? 'selected' : ''}>PROFILE</NavLink>
              <NavLink to='/shopping-bag/user-favorites' className={(isActive) => isActive ? 'selected' : ''}>FAVORITES</NavLink>
            </nav>
            <div className="personal-details">
              <p>personal details:</p><br />
              <p>{user.email}</p>
              <p>{user.displayName}</p><br />
            </div>
        </div>
    )
}

export default UserProfile