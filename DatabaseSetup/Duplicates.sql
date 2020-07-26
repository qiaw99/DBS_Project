DELETE FROM record a USING (
	SELECT MIN(ID) as rid, countryID, recorddate
	FROM record
	GROUP BY countryID, recorddate HAVING COUNT(*) > 1
) b
WHERE 
a.recorddate = b.recorddate
AND
a.id <> b.rid
AND
a.countryID = b.countryID;
