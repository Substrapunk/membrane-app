// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { num } from '@/helpers/num';
import { getBasket, getCollateralInterest } from '@/services/cdp';
import { getBoundedTVL } from '@/services/earn';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  apr?: number,
  error?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
    const [basket, interest, vaultCDT] = await Promise.all([
      getBasket(),
      getCollateralInterest(),
      getBoundedTVL()
    ]);

    if (!basket || !interest || !vaultCDT) {
      return res.status(500).json({ error: 'Failed to fetch required data.' });
    }

    //Get the lowest rate
    const sortedRates = interest.rates
      .filter(rate => !isNaN(Number(rate)))  // Ensure all elements are numbers
      .sort((a, b) => Number(a) - Number(b));

    const estimatedRate = sortedRates.length > 0 ? sortedRates[0] : null;
    const estimatedRevenue = estimatedRate ? num(estimatedRate).times(basket.credit_asset.amount) : num(0);

    const apr = num(estimatedRevenue)
      .times(0.80)
      .dividedBy(vaultCDT)
      .toNumber()

    return res.status(200).json({
      apr
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
