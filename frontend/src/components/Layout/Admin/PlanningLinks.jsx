import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import './styles.css'

const VeriferLinks = () => {
    const location = useLocation();
    
    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <ul className="nav">
            <li className="nav-item">
                <Link 
                    className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`} 
                    to=""
                >
                    <i className="fas fa-tachometer-alt"></i> Dashboard
                </Link>
            </li>
            <li className="nav-item">
                <Link 
                    className={`nav-link ${isActive('/planning/requests') ? 'active' : ''}`} 
                    to="/planning/requests"
                >
                    <i className="fas fa-clipboard-check"></i> Review Requests
                </Link>
            </li>
            <li className="nav-item">
                <Link 
                    className={`nav-link ${isActive('/planning/mfl') ? 'active' : ''}`} 
                    to="/planning/mfl"
                >
                    <i className="fas fa-building"></i> Master Facility List
                </Link>
            </li>
            <li className="nav-item">
                <Link 
                    className={`nav-link ${isActive('/admin/units') ? 'active' : ''}`} 
                    to=""
                >
                    <i className="fas fa-sitemap"></i> Admin Units
                </Link>
            </li>
            <li className="nav-item">
                <Link 
                    className={`nav-link ${isActive('/admin/services') ? 'active' : ''}`} 
                    to="/admin/services"
                >
                    <i className="fas fa-stethoscope"></i> Services
                </Link>
            </li>
        </ul>
    )
}

export default VeriferLinks