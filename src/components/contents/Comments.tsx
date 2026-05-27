'use client';

import Giscus from '@giscus/react';
import { useTheme } from '@/contexts';

export default function Comments() {
  const { theme } = useTheme();

  return (
    <Giscus
      id="comments"
      repo="ztlog/ztlog-comment"
      repoId="R_kgDOLNvWbw"
      category="General"
      categoryId="DIC_kwDOLNvWb84C3pDU"
      mapping="title"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme={theme === 'dark' ? 'dark' : 'light'}
      lang="ko"
      loading="lazy"
    />
  );
}
