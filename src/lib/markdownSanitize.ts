import type { ComponentProps } from 'react';
import type MarkdownPreview from '@uiw/react-markdown-preview';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import type { Options as SanitizeSchema } from 'rehype-sanitize';

type PluginsFilter = NonNullable<ComponentProps<typeof MarkdownPreview>['pluginsFilter']>;

const CLOBBER_PREFIX = defaultSchema.clobberPrefix ?? 'user-content-';

/*
 * 게시물 본문은 저장 시 sanitize되지 않으므로(콘솔·백엔드 모두 원문 저장) 렌더 단계가 유일한 XSS 방어선이다.
 *
 * 기본 스키마에 다음만 추가한다.
 * - u: tiptap-markdown이 밑줄을 <u>로 저장한다.
 * - className(*): rehype-prism-plus의 하이라이트 토큰 클래스.
 * - 코드 블록 복사 버튼과 헤딩 앵커 아이콘: MarkdownPreview가 직접 만드는 노드라서
 *   `data-code`(복사할 코드)와 svg/path가 필요하다.
 *   rehype-raw가 트리를 parse5로 왕복시키면서 속성 키를 정규화하므로(`data-code` → `dataCode`) 정규화된 키로 적는다.
 *   svg에는 href·style·이벤트 속성을 허용하지 않으므로 사용자가 같은 태그를 넣어도 스크립트를 실행할 수 없다.
 */
const sanitizeSchema: SanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), 'u', 'svg', 'path'],
  attributes: {
    ...defaultSchema.attributes,
    '*': [...(defaultSchema.attributes?.['*'] ?? []), 'className'],
    div: [...(defaultSchema.attributes?.div ?? []), 'dataCode'],
    svg: ['viewBox', 'fill', 'version'],
    path: ['d', 'fillRule'],
  },
};

/*
 * sanitize는 id 앞에 `user-content-`를 붙여 DOM clobbering을 막는다(clobberPrefix).
 * 그러면 헤딩 앵커(rehype-autolink-headings)나 각주의 `#slug` 링크가 어긋나므로,
 * sanitize 뒤에서 같은 문서 내 링크(#…)에도 같은 접두사를 붙여 맞춘다.
 */
type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const prefixHashLinksIn = (node: HastNode) => {
  const href = node.properties?.href;
  if (node.tagName === 'a' && typeof href === 'string' && href.length > 1 && href.startsWith('#')) {
    node.properties!.href = `#${CLOBBER_PREFIX}${href.slice(1)}`;
  }
  node.children?.forEach(prefixHashLinksIn);
};

const prefixHashLinks = () => (tree: HastNode) => {
  prefixHashLinksIn(tree);
};

/*
 * MarkdownPreview는 rehype-raw를 플러그인 목록 맨 뒤에 붙인다.
 * 그래서 rehypePlugins prop으로 넘기면 raw HTML이 파싱되기 전에 sanitize가 실행되어 효과가 없다.
 * pluginsFilter로 최종 목록의 끝에 붙여야 한다.
 */
export const appendSanitize: PluginsFilter = (type, plugins) =>
  type === 'rehype' ? [...plugins, [rehypeSanitize, sanitizeSchema], prefixHashLinks] : plugins;
