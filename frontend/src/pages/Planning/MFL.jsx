import React from 'react'
import FacilityList from '../../components/FacilityList'

const MasterFacilityList = () => {
    return (
        <div className='container mt-5'>
            <FacilityList url='planning/mfl' link='mfl' />
        </div>
    )
}

export default MasterFacilityList