'use client';

import { Card, LineChart, Tab, TabGroup, TabList, Title } from '@tremor/react';
import { useState } from 'react';

interface PerformanceChartProps {
  data: any[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const [selectedTab, setSelectedTab] = useState('traffic');

  // 处理数据格式，倒序数据使得图表从左到右是时间的先后顺序
  const chartData = [...data]
    .reverse()
    .map((item) => ({
      date: new Date(item.date).toLocaleDateString('zh-CN'),
      访问量: item.total_sessions,
      页面浏览: item.total_pageviews,
      用户数: item.total_users,
      转化率: parseFloat((item.conversion_rate * 100).toFixed(2)),
      跳出率: parseFloat((item.bounce_rate * 100).toFixed(2)),
      收入: item.total_revenue,
      '平均订单价值': item.avg_order_value,
    }));

  // 根据选择的指标定义不同的图表配置
  const chartConfig = {
    traffic: {
      categories: ['访问量', '页面浏览', '用户数'],
      colors: ['blue', 'emerald', 'amber'],
      title: '流量指标趋势',
      valueFormatter: (value: number) => value.toLocaleString('zh-CN'),
    },
    conversion: {
      categories: ['转化率', '跳出率'],
      colors: ['emerald', 'red'],
      title: '转化指标趋势',
      valueFormatter: (value: number) => `${value}%`,
    },
    revenue: {
      categories: ['收入', '平均订单价值'],
      colors: ['violet', 'amber'],
      title: '收入指标趋势',
      valueFormatter: (value: number) => `¥${value.toLocaleString('zh-CN')}`,
    },
  };

  const selectedConfig = chartConfig[selectedTab as keyof typeof chartConfig];

  return (
    <Card>
      <div className="mb-4">
        <TabGroup>
          <TabList>
            <Tab onClick={() => setSelectedTab('traffic')}>流量</Tab>
            <Tab onClick={() => setSelectedTab('conversion')}>转化</Tab>
            <Tab onClick={() => setSelectedTab('revenue')}>收入</Tab>
          </TabList>
        </TabGroup>
      </div>

      <Title>{selectedConfig.title}</Title>
      <LineChart
        className="mt-4 h-80"
        data={chartData}
        index="date"
        categories={selectedConfig.categories}
        colors={selectedConfig.colors}
        valueFormatter={selectedConfig.valueFormatter}
        showLegend
        yAxisWidth={60}
        connectNulls={true}
      />
    </Card>
  );
} 