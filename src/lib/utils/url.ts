/**
 * 添加搜索参数到 URL
 * @param path 路径
 * @param params 要添加的参数
 * @returns 完整的 URL 字符串
 */
export function addSearchParams(
  path: string,
  params: Record<string, string>
): string {
  const url = new URL(path, window.location.origin);
  
  // 添加新参数
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
  });
  
  return `${url.pathname}${url.search}`;
}

/**
 * 解析搜索参数
 * @param search 搜索字符串
 * @returns 参数对象
 */
export function parseSearchParams(search: string): Record<string, string> {
  const searchParams = new URLSearchParams(search);
  const params: Record<string, string> = {};
  
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
} 