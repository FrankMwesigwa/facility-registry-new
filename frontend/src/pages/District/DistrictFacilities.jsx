import React from 'react'
import FacilityList from '../../components/FacilityList'

const MyFacilities = () => {
  return (
    <div className='container mt-5'>
      <FacilityList url='requests/mfl' link='mfl/owner' />
    </div>
  )
}

export default MyFacilities