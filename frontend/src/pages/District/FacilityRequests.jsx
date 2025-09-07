import React from 'react'
import FacilityRequests from '../../components/Requests/FacilityRequests'

const FacilityRequest = () => {
    return (
        <div className='container'>
            <FacilityRequests url ='district' title='District Facility Requests' show={false} />
        </div>
    )
}

export default FacilityRequest