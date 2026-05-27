import { Suspense } from 'react';
import TagsList from '@/components/tags/TagsList';

export default function TagsPage() {
  return (
    <Suspense
      fallback={
        <div className="col-md-10 col-lg-8 col-xl-7">
          <div className="spinner-wrap">
            <div className="spinner" />
          </div>
        </div>
      }
    >
      <TagsList />
    </Suspense>
  );
}
