import type { NextApiRequest, NextApiResponse } from "next";
import { BigQuery } from "@google-cloud/bigquery";
import sql from "../../sql/film";

type Film = {
  title: string;
  release_year: number;
  production_company: string;
  director: string;
  actor_1: string;
  actor_2: string;
  actor_3: string;
  locations: string[];
};;

type SuccessResponse = {
  data: Film[];
};

type ErrorResponse = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse|ErrorResponse>
) {
  const bigquery = new BigQuery();
  async function query() {
    const options = {
      query: sql,
      location: "US",
      params: {limit: 10}
    };

    const [job] = await bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();

    return rows
  }
  await query()
    .then(rows => {
      res.status(200).json({data: rows});
    })
    .catch(e => {
      console.error(e)
      res.status(500).json({ message: "Internal Error" });
    })
}
