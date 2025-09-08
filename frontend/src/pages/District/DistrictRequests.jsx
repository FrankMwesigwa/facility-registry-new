import React from 'react'
import FacilityRequests from '../../components/Requests/FacilityRequests'

const DistrictRequests = () => {
    return (
        <div className='container'>
            <FacilityRequests url ='private' title='Pending Request Reviews' detail= 'district/request' show={true} />
        </div>
    )
}

export default DistrictRequests