import { Suspense } from 'react';
import CategoriesList from '@/components/categories/CategoriesList';

export default function CategoriesPage() {
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
      <CategoriesList />
    </Suspense>
  );
}
