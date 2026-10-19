import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { ensureMembersSchemaReady } from '@/lib/members-server';
import { MemberEditForm, type MemberRecord } from './MemberEditForm';

export default async function EditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await ensureMembersSchemaReady();
  const { id } = await params;
  const memberId = Number(id);
  if (Number.isNaN(memberId)) notFound();

  const rows = await db('SELECT * FROM members WHERE id = $1 LIMIT 1', [memberId]);
  const member = rows[0] as unknown as MemberRecord | undefined;
  if (!member) notFound();

  return <MemberEditForm member={member} />;
}
