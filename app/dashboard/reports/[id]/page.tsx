import React from 'react';
import { redirect } from 'next/navigation';

export default async function SingleReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Redirect cleanly to reports page with id query param
  redirect(`/dashboard/reports?id=${encodeURIComponent(id)}`);
}
