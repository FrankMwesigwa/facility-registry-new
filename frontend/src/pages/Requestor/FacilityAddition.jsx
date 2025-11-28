import React from 'react'
import FacilityAddition from '../../components/Requests/FacilityAddition'

const Addition = () => {
    return (
    <div className='container mt-5 pt-5'>
            <FacilityAddition url ='facilityRequests' link='requests' role='private' />
        </div>
    )
}

export default Addition