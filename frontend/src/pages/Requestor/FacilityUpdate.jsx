import React from 'react'
import UpdateFacility from '../../components/Requests/FacilityUpdate'

const FacilityUpdate = () => {
   
    return (
        <div className='container mt-5'>
            <UpdateFacility link='mfl/owner' role='private' path='requests' />
        </div>
    )
}

export default FacilityUpdate