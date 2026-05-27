'use client';

import dynamic from 'next/dynamic';

const ContentsSection = dynamic(() => import('@/components/contents/ContentsSection'), { ssr: false });

export default function ContentsPage() {
  return <ContentsSection />;
}
