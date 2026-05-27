'use client';

import dynamic from 'next/dynamic';

const ContentsList = dynamic(() => import('@/components/home/ContentsList'), { ssr: false });

export default function HomePage() {
  return <ContentsList />;
}
