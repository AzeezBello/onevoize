import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { CampaignEditForm, type CampaignRecord } from './CampaignEditForm';

export default async function EditCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaignId = Number(id);
  if (Number.isNaN(campaignId)) notFound();

  const rows = await db('SELECT * FROM campaigns WHERE id = $1 LIMIT 1', [campaignId]);
  const campaign = rows[0] as unknown as CampaignRecord | undefined;
  if (!campaign) notFound();

  return <CampaignEditForm campaign={campaign} />;
}
