import React from 'react'
import FacilityRequests from '../../components/Requests/FacilityRequests'

const FacilityRequest = () => {
    return (
        <div className='container'>
            <FacilityRequests url ='planning' title='Pending Facility Requests' detail= 'planning/request' show={true} />
        </div>
    )
}

export default FacilityRequest