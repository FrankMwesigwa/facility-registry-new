import React from 'react'
import FacilityAddition from '../../components/Requests/FacilityAddition'

const Addition = () => {
    return (
    <div className='container mt-5 pt-5'>
            <FacilityAddition url ='facilityRequests' link='district' role='district' />
        </div>
    )
}

export default Addition