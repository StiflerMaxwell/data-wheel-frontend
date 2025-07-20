'use client';

import { Card, Text } from '@tremor/react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeText?: string;
  color?: 'blue' | 'emerald' | 'amber' | 'red' | 'violet';
}

export function KPICard({
  title,
  value,
  change,
  changeText = '',
  color = 'blue',
}: KPICardProps) {
  // 判断变化趋势是正向还是负向
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  
  // 根据趋势选择颜色
  const trendColor = isPositive ? 'text-emerald-500' : isNegative ? 'text-red-500' : 'text-gray-500';
  
  // 格式化变化值为百分比
  const formattedChange = change ? `${isPositive ? '↑' : '↓'} ${Math.abs(change).toFixed(1)}%` : '';

  return (
    <Card decoration="top" decorationColor={color}>
      <Text>{title}</Text>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      {change !== undefined && (
        <Text className="mt-1 text-xs">
          <span className={trendColor}>{formattedChange}</span> {changeText}
        </Text>
      )}
    </Card>
  );
} 