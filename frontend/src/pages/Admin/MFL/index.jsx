import React from 'react'
import FacilityList from '../../../components/FacilityList'

const MasterFacilityList = () => {

    return (
        <div className='container mt-5'>
            <FacilityList url='admin/mfl' link='mfl' showUpload={true} />
        </div>
    )
}

export default MasterFacilityList