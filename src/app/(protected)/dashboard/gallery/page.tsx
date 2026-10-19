import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getGalleryItems } from '@/lib/gallery-server';
import { GalleryManagerClient } from './GalleryManagerClient';

export const dynamic = 'force-dynamic';

export default async function DashboardGalleryPage() {
  const session = await auth();
  if (!session?.user) redirect('/dashboard/login');

  const items = await getGalleryItems();

  return <GalleryManagerClient initialItems={items} />;
}
