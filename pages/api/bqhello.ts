import type { NextApiRequest, NextApiResponse } from "next";
import { BigQuery } from "@google-cloud/bigquery";

type Data = {
  name: string;
};

type SuccessResponse = {
  data: Data[];
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
    const query = `
      SELECT name
      FROM \`bigquery-public-data.usa_names.usa_1910_2013\`
      WHERE state = 'TX'
      LIMIT 10
    `;
    const options = {
      query: query,
      location: "US",
    };

    const [job] = await bigquery.createQueryJob(options);
    console.log(`Job ${job.id} started.`);

    const [rows] = await job.getQueryResults();

    console.log("Rows:");
    rows.forEach((row) => console.log(row));
    return rows
  }
  await query()
    .then(rows => {
      console.log(rows)
      res.status(200).json({data: rows});
    })
    .catch(e => {
      console.log(e)
      res.status(500).json({ message: "Internal Error" });
    })
}
