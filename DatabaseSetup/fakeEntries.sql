SELECT countryName.name, c.recorddate, c.cases, c.deaths, c.ID AS ReiheID
FROM
(
	SELECT a.*
	FROM record a
	JOIN 
	(
		SELECT * 
		FROM record
	) b
	ON
	a.countryID = b.countryID
	AND
	a.recordDate = b.recordDate
	AND
	(
		a.deaths != b.deaths
		OR
		a.cases != b.cases
	)
)
AS c
JOIN
country
AS countryName
ON
countryName.ID = c.countryID;
