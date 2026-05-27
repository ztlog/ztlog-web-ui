import { Suspense } from 'react';
import SearchResults from '@/components/search/SearchResults';

export default function SearchPage() {
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
      <SearchResults />
    </Suspense>
  );
}
