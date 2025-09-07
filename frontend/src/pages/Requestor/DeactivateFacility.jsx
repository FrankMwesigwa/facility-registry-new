import React from 'react'
import FacilityDeactivation from '../../components/Requests/FacilityDeactivation'

const DeactivateFacility = () => {
    return (
        <div className='container mt-5'>
            <FacilityDeactivation link='mfl/owner' role='private' path='requests' />
        </div>
    )
}

export default DeactivateFacility