
const generateFacilityIdentifier = (regionCode, localGovt, subCounty, uniqueNumber) => {
    return `80080${regionCode}${localGovt}${subCounty}${uniqueNumber.toString().padStart(4, '0')}`;
};

export default generateFacilityIdentifier