'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faBars, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const [isFixed, setFixed] = useState(false);
  const [isAriaExpanded, setAriaExpanded] = useState(false);
  const [isShow, setShow] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchType, setSearchType] = useState('TITLE_CONTENT');

  const handleSearch = () => {
    const q = searchInput.trim();
    if (!q) return;
    router.push(`/search?type=${searchType}&param=${encodeURIComponent(q)}`);
    setSearchInput('');
  };

  const menuCollapsed = () => {
    setAriaExpanded(!isAriaExpanded);
    setShow(!isShow);
  };

  useEffect(() => {
    const headerFixed = () => {
      setFixed(window.pageYOffset > 0);
    };
    window.addEventListener('scroll', headerFixed);
    return () => {
      window.removeEventListener('scroll', headerFixed);
    };
  }, []);

  return (
    <header>
      <nav
        id="mainNav"
        className={
          isFixed
            ? 'is-fixed is-visible navbar-light navbar navbar-expand-lg'
            : 'navbar-light navbar navbar-expand-lg'
        }
      >
        <div className="container px-4 px-lg-5">
          <Link href="/" className="navbar-brand">
            <Image src="/images/logo.png" alt="logo" width={40} height={40} />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarResponsive"
            aria-controls="navbarResponsive"
            aria-expanded={isAriaExpanded ? true : false}
            aria-label="Toggle navigation"
            onClick={menuCollapsed}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <div
            className={
              isShow
                ? 'collapse navbar-collapse show'
                : 'collapse navbar-collapse'
            }
            id="navbarResponsive"
          >
            <ul className="navbar-nav ms-auto py-4 py-lg-0">
              <li className="nav-item">
                <Link href="/about" className="nav-link px-lg-3 py-3 py-lg-4">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/categories" className="nav-link px-lg-3 py-3 py-lg-4">
                  Categories
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/tags" className="nav-link px-lg-3 py-3 py-lg-4">
                  Tags
                </Link>
              </li>
              <li className="nav-item">
                <div className="search px-lg-3 py-3 py-lg-3">
                  <div className="search-box">
                    <select
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                    >
                      <option value="TITLE_CONTENT">제목+내용</option>
                      <option value="TITLE">제목</option>
                      <option value="CONTENT">내용</option>
                      <option value="TAG">태그</option>
                    </select>
                    <input
                      type="text"
                      placeholder="검색어 입력..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <FontAwesomeIcon icon={faMagnifyingGlass} onClick={handleSearch} />
                  </div>
                </div>
              </li>
              <li className="nav-item">
                <button
                  onClick={toggleTheme}
                  className="nav-link px-lg-3 py-3 py-lg-4 theme-toggle"
                  aria-label="Toggle dark mode"
                >
                  <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
