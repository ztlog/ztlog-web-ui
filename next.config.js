const path = require('path');

const isDev = process.env.NODE_ENV !== 'production';

// API를 다른 출처로 직접 호출하는 경우(로컬 .env에서 http://localhost:8086/... 등)에만 그 출처를 connect-src에 추가한다.
// 운영(Docker) 빌드는 /front/api/v1 프록시를 쓰므로 'self'로 충분하다.
const apiOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_BE_API_URL || '').origin;
  } catch {
    return '';
  }
})();

// Google Analytics(gtag) 수집 요청 출처. Google Signals가 켜져 있으면 doubleclick·google.com으로도 전송한다.
const GA = [
  'https://*.google-analytics.com',
  'https://analytics.google.com',
  'https://*.analytics.google.com',
  'https://*.googletagmanager.com',
  'https://*.g.doubleclick.net',
  'https://www.google.com',
].join(' ');

const csp = [
  "default-src 'self'",
  // 'unsafe-inline': Next.js 인라인 부트스트랩 스크립트, layout.tsx의 테마 초기화·GA 초기화 스크립트
  // 'unsafe-eval': 개발 서버(HMR/React Refresh)에서만 필요
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com`,
  // Bootstrap CDN, Google Fonts CSS, NanumSquareNeo CSS
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
  "font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net",
  // 현재 본문(contents_dtl)에는 외부 이미지 URL이 없다(2026-11-10 로컬 DB 확인). GA 픽셀만 허용한다.
  // 본문에 외부 이미지를 쓰게 되면 그 도메인을 여기에 추가할 것(추가하지 않으면 해당 이미지만 차단된다).
  // GA(Google Signals)는 방문자 국가의 google.<TLD>로 픽셀을 보낸다. 한국 도메인만 허용하고, 다른 국가는 이 픽셀만 차단된다(수집 자체는 정상).
  `img-src 'self' data: blob: ${GA} https://www.google.co.kr`,
  `connect-src 'self'${apiOrigin ? ` ${apiOrigin}` : ''} ${GA}`,
  // Giscus 댓글 위젯
  'frame-src https://giscus.app',
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname),
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

module.exports = nextConfig;
