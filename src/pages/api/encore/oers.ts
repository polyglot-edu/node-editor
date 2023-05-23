import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const resp = await axios.get('https://encore-db.grial.eu/api/oers/?page=10');
  res.status(200).json(resp.data);
}
