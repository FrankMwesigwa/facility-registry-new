import React from 'react'
import FacilityList from '../../../components/FacilityList'

const MasterFacilityList = () => {
    return (
        <div className='container'>
            <FacilityList url='admin/mfl' link='mfl' />
        </div>
    )
}

export default MasterFacilityList