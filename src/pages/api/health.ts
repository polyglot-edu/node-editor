import type { NextApiRequest, NextApiResponse } from 'next';

// Liveness probe for the container orchestrator. A static route wins over the
// `[...proxy]` catch-all, so this answers locally and never reaches the
// backend — the check stays green even if the backend is down.
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ status: 'ok' });
}
