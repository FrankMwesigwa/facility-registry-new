
const generateFacilityIdentifier = (uniqueNumber) => {
	const PREFIX = '800802';
	const MAX_SUFFIX = 9999999; // 7-digit upper bound

	const rawCandidate = uniqueNumber != null ? Number(uniqueNumber) : Math.floor(Math.random() * (MAX_SUFFIX + 1));
	const safeCandidate = Number.isFinite(rawCandidate) ? rawCandidate : 0;
	const clamped = Math.max(0, Math.min(MAX_SUFFIX, safeCandidate));
	const suffix = clamped.toString().padStart(7, '0');

	return `${PREFIX}${suffix}`;
};

export default generateFacilityIdentifier