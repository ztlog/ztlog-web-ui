'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faFolder } from '@fortawesome/free-solid-svg-icons';
import { faCalendarDays } from '@fortawesome/free-regular-svg-icons';
import dynamic from 'next/dynamic';
const Pagination = dynamic(() => import('react-js-pagination'), { ssr: false });
import axios from 'axios';
import dayjs from 'dayjs';

export default function CategoriesList() {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [ctnt, setCtnt] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BE_API_URL}/categories`)
      .then((response) => {
        const data: any[] = response.data.data || [];
        const unique = data.filter((c, i, arr) => arr.findIndex((x) => x.cateNo === c.cateNo) === i);
        setCategories(unique);

        const cateNo = searchParams?.get('cateNo');
        const cateName = searchParams?.get('cateName');
        if (cateNo && cateName) {
          setSelectedCategory({ cateNo: Number(cateNo), cateNm: cateName });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [searchParams]);

  useEffect(() => {
    if (!selectedCategory) return;
    setLoading(true);

    axios
      .get(`${process.env.NEXT_PUBLIC_BE_API_URL}/categories/${selectedCategory.cateNo}?page=${page}`)
      .then((response) => {
        const dataObj = response.data?.data || {};
        setCtnt(dataObj?.list || []);
        setTotal(dataObj?.totalCount || 0);
        setLoading(false);
      })
      .catch(() => {
        setCtnt([]);
        setTotal(0);
        setLoading(false);
      });
  }, [selectedCategory, page]);

  const handleCategoryClick = (category: any) => {
    router.push(`/categories?cateNo=${category.cateNo}&cateName=${encodeURIComponent(category.cateNm)}`);
  };

  const handleBack = () => {
    router.push('/');
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  if (selectedCategory) {
    return (
      <div className="col-md-10 col-lg-8 col-xl-7 list-section list-section-padded">
        <div className="tag-breadcrumb">
          <button className="breadcrumb-link" onClick={handleBack}>
            HOME
          </button>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{selectedCategory.cateNm}</span>
          <span className="breadcrumb-count">{total}</span>
        </div>
        <hr className="my-4" />
        <div className="list-content">
          {loading ? (
            <div className="spinner-wrap">
              <div className="spinner" />
            </div>
          ) : ctnt.length > 0 ? (
            ctnt.map((e) => (
              <div key={e.ctntNo} className="post-preview">
                <Link href={`/contents/${e.ctntNo}`}>
                  <h2 className="post-title">{e.title}</h2>
                  <h3 className="post-subtitle">{e.subTitle} . . .</h3>
                </Link>
                <div className="post-meta">
                  <p>
                    {e.category?.cateNm && (
                      <>
                        <FontAwesomeIcon icon={faFolder} />{' '}
                        <Link
                          href={`/categories?cateNo=${e.category.cateNo}&cateName=${encodeURIComponent(e.category.cateNm)}`}
                          className="tag-link"
                        >
                          {e.category.cateNm}
                        </Link>
                        <span style={{ marginRight: '0.75rem' }} />
                      </>
                    )}
                    {e.tags && e.tags.length > 0 && (
                      <>
                        <FontAwesomeIcon icon={faTags} />{' '}
                        {e.tags.map(function (tag: any, idx: number) {
                          return (
                            <span key={tag.tagNo}>
                              <Link
                                href={`/tags?tagNo=${tag.tagNo}&tagName=${tag.tagName}`}
                                className="tag-link"
                              >
                                {tag.tagName}
                              </Link>
                              {idx < e.tags.length - 1 && ', '}
                            </span>
                          );
                        })}
                      </>
                    )}
                  </p>
                  <p>
                    <FontAwesomeIcon icon={faCalendarDays} />{' '}
                    {dayjs(e.updDttm).format('YYYY년 M월 D일 h시 m분')}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>게시물이 없습니다.</p>
          )}
        </div>
        <div className="d-flex justify-content-center mb-4 pagnation">
          {!loading && total > 0 && (
            <Pagination
              activePage={page}
              itemsCountPerPage={5}
              totalItemsCount={Math.max(0, total)}
              pageRangeDisplayed={5}
              prevPageText={'‹'}
              nextPageText={'›'}
              onChange={handlePageChange}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="col-md-10 col-lg-8 col-xl-7 list-section list-section-padded">
      <div className="tag-breadcrumb">
        <button className="breadcrumb-link" onClick={handleBack}>
          Categories
        </button>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">All</span>
      </div>
      <hr className="my-4" />
      <div className="cate-tree">
        {categories.map((e) => (
          <div key={e.cateNo}>
            <div className="cate-tree-row" onClick={() => handleCategoryClick(e)}>
              <span className="cate-tree-left">
                <FontAwesomeIcon icon={faFolder} className="cate-tree-icon" />
                <span className="cate-tree-name">{e.cateNm}</span>
                {e.ctntCount !== undefined && (
                  <span className="cate-tree-count">({e.ctntCount})</span>
                )}
              </span>
              <span className="cate-tree-right">
                {e.updDttm && (
                  <span className="cate-tree-date">
                    {dayjs(e.updDttm).format('YYYY. M. D.')}
                  </span>
                )}
              </span>
            </div>
            {e.categories && e.categories.length > 0 &&
              e.categories.map((sub: any, subIdx: number) => (
                <div
                  key={sub.cateNo}
                  className="cate-tree-row cate-tree-row--sub"
                  onClick={() => handleCategoryClick(sub)}
                >
                  <span className="cate-tree-left">
                    <span className="cate-tree-connector">
                      {subIdx === e.categories.length - 1 ? '└' : '├'}
                    </span>
                    <FontAwesomeIcon icon={faFolder} className="cate-tree-icon cate-tree-icon--sub" />
                    <span className="cate-tree-name">{sub.cateNm}</span>
                    {sub.ctntCount !== undefined && (
                      <span className="cate-tree-count">({sub.ctntCount})</span>
                    )}
                  </span>
                  <span className="cate-tree-right">
                    {sub.updDttm && (
                      <span className="cate-tree-date">
                        {dayjs(sub.updDttm).format('YYYY. M. D.')}
                      </span>
                    )}
                  </span>
                </div>
              ))
            }
          </div>
        ))}
      </div>
    </div>
  );
}
