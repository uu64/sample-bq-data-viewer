const select: string = `
  WITH films AS (
    SELECT DISTINCT
        title,
        release_year,
        production_company,
        director,
        actor_1,
        actor_2,
        actor_3
    FROM \`bigquery-public-data.san_francisco.film_locations\`
    ORDER BY release_year
    LIMIT @limit
  )

  SELECT
    *,
    ARRAY(
        SELECT locations
        FROM \`bigquery-public-data.san_francisco.film_locations\` as film_locations
        WHERE films.title = film_locations.title AND films.release_year = film_locations.release_year
    ) AS locations
  FROM films
`;

export default select;
