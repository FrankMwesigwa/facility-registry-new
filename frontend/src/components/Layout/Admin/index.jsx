import React from 'react'
import Header from '../Public/Header'
import NavBar from './NavBar'

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <Header />
      <NavBar />
      {children}
    </div>
  )
}

export default AdminLayout