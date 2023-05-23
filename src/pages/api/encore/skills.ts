import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  /* restiuisce solo la prima pagina di API. Forse per accedere alle altre pagine si deve usare api/skills/?page='num_pagina'? */

  const resp = await axios.get(
    'https://encore-db.grial.eu/api/skills/?page=10'
  );
  res.status(200).json(resp.data);
}
