/**
 * 格式化数字为货币格式
 * @param value 要格式化的数值
 * @param currency 货币符号，默认为人民币
 */
export function formatCurrency(value: number, currency = '¥'): string {
  return `${currency}${value.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

/**
 * 格式化数字为百分比格式
 * @param value 要格式化的数值（小数形式，如0.125）
 * @param digits 小数位数，默认为2
 */
export function formatPercent(value: number, digits = 2): string {
  return `${(value * 100).toFixed(digits)}%`;
}

/**
 * 格式化大数，使用K、M、B等单位
 * @param value 要格式化的数值
 */
export function formatLargeNumber(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
}

/**
 * 格式化时间（秒）为可读形式
 * @param seconds 秒数
 */
export function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds.toFixed(1)}秒`;
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}分${Math.round(seconds % 60)}秒`;
  }
  const hours = Math.floor(minutes / 60);
  return `${hours}时${minutes % 60}分`;
} 