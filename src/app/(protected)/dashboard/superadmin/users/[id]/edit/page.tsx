import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { UserEditForm, type AdminUserRecord } from './UserEditForm';

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'superadmin') redirect('/dashboard');

  const { id } = await params;
  const userId = Number(id);
  if (Number.isNaN(userId)) notFound();

  const rows = await db(
    'SELECT id, name, email, role, is_active FROM users WHERE id = $1 LIMIT 1',
    [userId],
  );
  const user = rows[0] as unknown as AdminUserRecord | undefined;
  if (!user) notFound();

  return <UserEditForm user={user} isSelf={user.id === Number(session.user.id)} />;
}
