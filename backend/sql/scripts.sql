SELECT 
    district,
    COUNT(CASE WHEN level = 'HC II' THEN 1 END) AS "HC II",
    COUNT(CASE WHEN level = 'HC III' THEN 1 END) AS "HC III",
    COUNT(CASE WHEN level = 'HC IV' THEN 1 END) AS "HC IV",
    COUNT(CASE WHEN level = 'General Hospital' THEN 1 END) AS "GH",
    COUNT(CASE WHEN level = 'RRH' THEN 1 END) AS "RRH",
    COUNT(CASE WHEN level = 'NRH' THEN 1 END) AS "NRH"
FROM nhfr.mfl
WHERE uid IS NOT null
and district <> ''
GROUP BY district
ORDER BY district;