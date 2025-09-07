import React from 'react'
import FacilityRequests from '../../../components/Requests/FacilityRequests'

const FacilityRequest = () => {
    return (
        <div className='container'>
            <FacilityRequests url='admin' title='Pending Facility Requests' detail='admin/request' show={true} />
        </div>
    )
}

export default FacilityRequest