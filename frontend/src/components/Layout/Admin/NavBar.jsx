import React from 'react'
import './styles.css'
import AdminLinks from './AdminLinks'
import DistrictLinks from './DistrictLinks'
import PlanningLinks from './PlanningLinks'
import RequestorLinks from './RequestorLinks'

const NavBar = () => {

    const user = JSON.parse(localStorage.getItem("user"))

    return (
        <div className="navbar-wrapper">
            <nav className="sub-navbar">
                <div className="container">
                    {user && user.role === 'admin' && <AdminLinks />}
                    {user && user.role === 'district' && <DistrictLinks />}
                    {user && user.role === 'planning' && <PlanningLinks />}
                    {user && user.role === 'public' && <RequestorLinks />}
                </div>
            </nav>
        </div>
    )
}

export default NavBar