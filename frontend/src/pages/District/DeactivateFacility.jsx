import React from 'react'
import FacilityDeactivation from '../../components/Requests/FacilityDeactivation'

const DeactivateFacility = () => {
    return (
        <div className='container mt-5'>
            <FacilityDeactivation link='mfl/owner' role='district' path='district/requests' />
        </div>
    )
}

export default DeactivateFacility