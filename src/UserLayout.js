import { Outlet, NavLink } from "react-router-dom";

export default function UserLayout() {
    return (
        <div className="content-container">
          <nav className="user-nav">
            <NavLink to='/user' className={(isActive) => isActive ? 'selected' : ''}>PROFILE</NavLink>
            <NavLink to='/user/user-favorites' className={(isActive) => isActive ? 'selected' : ''}>FAVORITES</NavLink>
          </nav>
          <Outlet />
        </div>
    )
}