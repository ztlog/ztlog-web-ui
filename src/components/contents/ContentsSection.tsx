'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faFolder, faLink, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faCalendarDays } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MarkdownPreview from '@uiw/react-markdown-preview';
import Comments from './Comments';
import dayjs from 'dayjs';
import { useTheme } from 'contexts';

export default function ContentsSection() {
  const { theme } = useTheme();
  const params = useParams();
  const id = params?.id as string;

  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      alert('링크 복사에 실패했습니다.');
    });
  };

  const [post, setPost] = useState({
    ctntNo: 0,
    title: '',
    body: '',
    inpDttm: '',
    tags: [] as any[],
    category: null as any,
  });

  useEffect(() => {
    if (!id) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_BE_API_URL}/contents/${id}`)
      .then((response) => {
        setPost(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [id]);

  return (
    <div className="col-md-10 col-lg-8 col-xl-7">
      <div className="article">
        <div className="post-header">
          <h1>{post.title}</h1>
          <hr className="my-4" />
        </div>

        <div className="content-box">
          <br />
          <MarkdownPreview source={post.body} wrapperElement={{ 'data-color-mode': theme }} />
          <br />
        </div>
        <div className="post-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            {post.category?.cateNm && (
              <p className="meta">
                <FontAwesomeIcon icon={faFolder} />{' '}
                <Link
                  href={`/categories?cateNo=${post.category.cateNo}&cateName=${encodeURIComponent(post.category.cateNm)}`}
                  className="tag-link"
                >
                  {post.category.cateNm}
                </Link>
              </p>
            )}
            {post.tags && post.tags.length > 0 && (
              <p className="meta">
                <FontAwesomeIcon icon={faTags} />{' '}
                {post.tags.map(function (el: any, idx: number) {
                  return (
                    <span key={el.tagNo}>
                      <Link
                        href={`/tags?tagNo=${el.tagNo}&tagName=${el.tagName}`}
                        className="tag-link"
                      >
                        {el.tagName}
                      </Link>
                      {idx < post.tags.length - 1 && ', '}
                    </span>
                  );
                })}
              </p>
            )}
            <p className="meta">
              <FontAwesomeIcon icon={faCalendarDays} />{' '}
              {dayjs(post.inpDttm).format('YYYY년 M월 D일 h시 m분')}
            </p>
          </div>
          <button
            onClick={handleCopyLink}
            className={`share-btn${copied ? ' share-btn--copied' : ''}`}
            title={copied ? '복사됨!' : '링크 공유'}
          >
            <FontAwesomeIcon icon={copied ? faCheck : faLink} />
          </button>
        </div>
        <hr className="my-4" />
        <div className="giscus">
          <Comments />
        </div>
      </div>
    </div>
  );
}
