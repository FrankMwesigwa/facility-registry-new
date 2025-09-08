
const generateFacilityIdentifier = (regionCode, localGovt, subCounty, uniqueNumber) => {
    const numberPart = (uniqueNumber != null ? uniqueNumber : Math.floor(Math.random() * 100000000))
        .toString()
        .padStart(8, '0');
    return `80080${numberPart}`;
};

export default generateFacilityIdentifier