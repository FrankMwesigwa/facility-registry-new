import React from 'react'
import Header from './Header'
import Footer from './Footer'

const PublicLayout = ({children}) => {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  )
}

export default PublicLayout