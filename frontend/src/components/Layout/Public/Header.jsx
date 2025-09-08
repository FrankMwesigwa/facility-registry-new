import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useHistory } from 'react-router-dom';
import logo from './logo.jpeg'

const Header = () => {

    const location = useLocation();
    const history = useHistory();
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const user = JSON.parse(localStorage.getItem('user')) || {};
    const userRole = user.role;

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        history.push('/login');
    };

    const getUserInitials = () => {
        if (user.firstname && user.lastname) {
            return `${user.firstname.charAt(0)}${user.lastname.charAt(0)}`.toUpperCase();
        } else if (user.firstname) {
            return user.firstname.charAt(0).toUpperCase();
        } else if (user.username) {
            return user.username.charAt(0).toUpperCase();
        }
        return 'U'; // Default fallback
    };

    const toggleUserDropdown = () => {
        setShowUserDropdown(!showUserDropdown);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowUserDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (

        <nav className="navbar navbar-expand-lg">
            <div className="container">
                <a className="navbar-brand" href="#">
                    <img src={logo} alt="Uganda Health Registry Logo" className="me-1"/>
                    <div className="brand-text">
                        <div className="ministry">Ministry of Health</div>
                        <div className="registry">National Health Facility Registry</div>
                    </div>
                </a>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/facilities">Master Facility List</Link>
                        </li>
                        {/* <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                Downloads
                            </a>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#">Facility List</a></li>
                                <li><a className="dropdown-item" href="#">Reports</a></li>
                            </ul>
                        </li> */}
                        <li className="nav-item">
                            <Link className="nav-link" to="/manuals">SOPs & Manuals</Link>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">API Docs</a>
                        </li>
                    </ul>

                    {!userRole && (
                        <div className="d-flex gap-2">
                            <Link className="btn btn-outline-light btn-sm" to='/register'>Create Account</Link>
                            <Link className="btn btn-outline-light btn-sm" to='/login'>Login</Link>
                        </div>
                    )}

                    {userRole && (
                        <div className="user-profile-dropdown" ref={dropdownRef}>
                            <div className="user-profile-info" onClick={toggleUserDropdown}>
                                <div className="user-profile-icon">
                                    {getUserInitials()}
                                </div>
                                <span className="navbar-text text-white">{user?.firstname} {user?.lastname}</span>
                                <i className="fas fa-chevron-down text-white" style={{ fontSize: '12px' }}></i>
                            </div>

                            {showUserDropdown && (
                                <div className="dropdown-menu show">
                                    <div className="dropdown-item">
                                        <strong>{user?.firstname} {user?.lastname}</strong>
                                    </div>
                                    <div className="dropdown-item">
                                        {user ? (
                                            <Link
                                                to={
                                                    user.role === "admin"
                                                        ? "/admin/dashboard"
                                                        : user.role === "planning"
                                                        ? "/planning/requests"
                                                        : user.role === "district"
                                                            ? "/district/pending/requests"
                                                            : user.role === "public"
                                                                ? "/requests"
                                                                : "/"
                                                } className="btn auth-btn-login">Facility Requests</Link>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    <a className="dropdown-item logout" href="#" onClick={handleLogout}>
                                        <i className="fas fa-sign-out-alt me-2"></i>Logout
                                    </a>
                                </div>
                            )}


                        </div>
                    )}

                </div>
            </div>
        </nav>
    )
}

export default Header