'use client';

import { ContextualAiAnalyzer } from '@/components/ai/ContextualAiAnalyzer';
import {
    Badge,
    BarChart,
    Card,
    DateRangePicker,
    DateRangePickerValue,
    DonutChart,
    Grid,
    LineChart,
    Metric,
    Tab,
    TabGroup,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
    TabList,
    TabPanel,
    TabPanels,
    Text,
    Title
} from '@tremor/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface DashboardContentProps {
  kpiSummary: any[];
  pageOptimization: any[];
  utmFunnelPerformance: any[];
  dateRange: {
    startDate: string;
    endDate: string;
  }
}

export default function DashboardContent({
  kpiSummary,
  pageOptimization,
  utmFunnelPerformance,
  dateRange
}: DashboardContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangePickerValue>({
    from: new Date(dateRange.startDate),
    to: new Date(dateRange.endDate)
  });
  
  // 处理日期范围变化
  const handleDateRangeChange = (value: DateRangePickerValue) => {
    if (!value.from || !value.to) return;
    
    setSelectedDateRange(value);
    
    const params = new URLSearchParams(searchParams.toString());
    params.set('startDate', value.from.toISOString().split('T')[0]);
    params.set('endDate', value.to.toISOString().split('T')[0]);
    
    router.push(`${pathname}?${params.toString()}`);
  };
  
  // 计算关键指标
  const totalSessions = kpiSummary.reduce((sum, day) => sum + day.total_sessions, 0);
  const totalRevenue = kpiSummary.reduce((sum, day) => sum + day.total_revenue, 0);
  const totalOrders = kpiSummary.reduce((sum, day) => sum + day.total_orders, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const conversionRate = totalSessions > 0 ? (totalOrders / totalSessions) * 100 : 0;
  
  // 准备图表数据
  const chartData = kpiSummary.map(day => ({
    date: new Date(day.date).toLocaleDateString('zh-CN'),
    '总访问量': day.total_sessions,
    '总订单数': day.total_orders,
    '总收入': day.total_revenue
  }));
  
  // UTM渠道数据
  const channelData = {};
  utmFunnelPerformance.forEach(item => {
    if (!channelData[item.utm_source]) {
      channelData[item.utm_source] = {
        name: item.utm_source,
        sessions: 0,
        orders: 0,
        revenue: 0
      };
    }
    channelData[item.utm_source].sessions += item.sessions;
    channelData[item.utm_source].orders += item.orders;
    channelData[item.utm_source].revenue += item.revenue;
  });
  
  const channelChartData = Object.values(channelData);
  
  return (
    <div className="space-y-8">
      {/* 日期筛选器 */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <Title>日期范围</Title>
          <ContextualAiAnalyzer 
            analysisType="kpi_summary"
            title="整体业务健康度分析"
            description="基于所选时间段的KPI数据，分析业务整体健康状况和趋势"
            currentFilters={{ startDate: dateRange.startDate, endDate: dateRange.endDate }}
          />
        </div>
        <DateRangePicker
          className="max-w-md mt-2"
          value={selectedDateRange}
          onValueChange={handleDateRangeChange}
          locale="zh-CN"
          selectPlaceholder="选择"
          startPlaceholder="开始日期"
          endPlaceholder="结束日期"
        />
      </Card>
      
      {/* KPI 卡片 */}
      <Grid numItemsMd={2} numItemsLg={3} className="gap-6">
        <Card decoration="top" decorationColor="blue">
          <Text>总访问量</Text>
          <Metric>{totalSessions.toLocaleString()}</Metric>
        </Card>
        <Card decoration="top" decorationColor="green">
          <Text>总收入</Text>
          <Metric>¥{totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Metric>
        </Card>
        <Card decoration="top" decorationColor="amber">
          <Text>总订单数</Text>
          <Metric>{totalOrders.toLocaleString()}</Metric>
        </Card>
        <Card decoration="top" decorationColor="indigo">
          <Text>平均订单价值</Text>
          <Metric>¥{averageOrderValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Metric>
        </Card>
        <Card decoration="top" decorationColor="rose">
          <Text>转化率</Text>
          <Metric>{conversionRate.toFixed(2)}%</Metric>
        </Card>
        <Card decoration="top" decorationColor="cyan">
          <Text>跳出率</Text>
          <Metric>{kpiSummary.length > 0 ? (kpiSummary.reduce((sum, day) => sum + day.bounce_rate, 0) / kpiSummary.length).toFixed(2) : 0}%</Metric>
        </Card>
      </Grid>
      
      {/* 趋势图表 */}
      <Card>
        <div className="flex items-center justify-between">
          <Title>业务趋势</Title>
          <ContextualAiAnalyzer 
            analysisType="kpi_summary"
            title="业务趋势分析"
            description="深入分析所选时间段的业务趋势，揭示核心指标变化和相关性"
            currentFilters={{ startDate: dateRange.startDate, endDate: dateRange.endDate }}
          />
        </div>
        <TabGroup>
          <TabList>
            <Tab>访问量趋势</Tab>
            <Tab>订单趋势</Tab>
            <Tab>收入趋势</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <LineChart
                className="mt-6"
                data={chartData}
                index="date"
                categories={['总访问量']}
                colors={["blue"]}
                valueFormatter={(value) => value.toLocaleString()}
                yAxisWidth={60}
              />
            </TabPanel>
            <TabPanel>
              <LineChart
                className="mt-6"
                data={chartData}
                index="date"
                categories={['总订单数']}
                colors={["amber"]}
                valueFormatter={(value) => value.toLocaleString()}
                yAxisWidth={60}
              />
            </TabPanel>
            <TabPanel>
              <LineChart
                className="mt-6"
                data={chartData}
                index="date"
                categories={['总收入']}
                colors={["green"]}
                valueFormatter={(value) => `¥${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                yAxisWidth={80}
              />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Card>
      
      {/* 页面优化分析 */}
      <Card>
        <div className="flex items-center justify-between">
          <Title>页面优化分析</Title>
          <ContextualAiAnalyzer 
            analysisType="page_optimization"
            title="页面性能分析"
            description="分析页面访问数据，找出性能瓶颈和优化机会"
            currentFilters={{ startDate: dateRange.startDate, endDate: dateRange.endDate }}
          />
        </div>
        <Table className="mt-5">
          <TableHead>
            <TableRow>
              <TableHeaderCell>页面路径</TableHeaderCell>
              <TableHeaderCell>访问量</TableHeaderCell>
              <TableHeaderCell>跳出率</TableHeaderCell>
              <TableHeaderCell>平均停留时间</TableHeaderCell>
              <TableHeaderCell>转化率</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pageOptimization.map((page) => (
              <TableRow key={page.page_path}>
                <TableCell>{page.page_path}</TableCell>
                <TableCell>{page.total_sessions.toLocaleString()}</TableCell>
                <TableCell>{page.bounce_rate.toFixed(2)}%</TableCell>
                <TableCell>{page.avg_time_on_page.toFixed(0)}秒</TableCell>
                <TableCell>
                  <Badge color={page.conversion_rate > 2 ? 'green' : page.conversion_rate > 1 ? 'yellow' : 'red'}>
                    {page.conversion_rate.toFixed(2)}%
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      
      {/* UTM 渠道分析 */}
      <Card>
        <div className="flex items-center justify-between">
          <Title>UTM 渠道分析</Title>
          <ContextualAiAnalyzer 
            analysisType="utm_funnel_performance"
            title="UTM渠道漏斗性能分析"
            description="分析不同UTM渠道的性能，找出高价值渠道并优化投放策略"
            currentFilters={{ startDate: dateRange.startDate, endDate: dateRange.endDate }}
          />
        </div>
        <TabGroup className="mt-5">
          <TabList>
            <Tab>渠道转化</Tab>
            <Tab>渠道收入</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <DonutChart
                className="mt-6"
                data={utmFunnelPerformance}
                category="conversion_rate"
                index="utm_source"
                valueFormatter={(number) => `${number.toFixed(2)}%`}
                colors={["slate", "violet", "indigo", "rose", "cyan", "amber", "emerald", "red", "blue", "green"]}
              />
              <Table className="mt-5">
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>UTM 来源</TableHeaderCell>
                    <TableHeaderCell>会话数</TableHeaderCell>
                    <TableHeaderCell>订单数</TableHeaderCell>
                    <TableHeaderCell>收入</TableHeaderCell>
                    <TableHeaderCell>转化率</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {utmFunnelPerformance.map((item) => (
                    <TableRow key={item.utm_source}>
                      <TableCell>{item.utm_source}</TableCell>
                      <TableCell>{item.sessions.toLocaleString()}</TableCell>
                      <TableCell>{item.orders.toLocaleString()}</TableCell>
                      <TableCell>¥{item.revenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                      <TableCell>
                        <Badge color={item.conversion_rate > 2 ? 'green' : item.conversion_rate > 1 ? 'yellow' : 'red'}>
                          {item.conversion_rate.toFixed(2)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabPanel>
            <TabPanel>
              <BarChart
                className="mt-6"
                data={channelChartData}
                index="name"
                categories={['revenue']}
                colors={["teal"]}
                valueFormatter={(value) => `¥${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                yAxisWidth={80}
              />
              <Table className="mt-5">
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>UTM 来源</TableHeaderCell>
                    <TableHeaderCell>会话数</TableHeaderCell>
                    <TableHeaderCell>订单数</TableHeaderCell>
                    <TableHeaderCell>收入</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {channelChartData.map((item: any) => (
                    <TableRow key={item.name}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.sessions.toLocaleString()}</TableCell>
                      <TableCell>{item.orders.toLocaleString()}</TableCell>
                      <TableCell>¥{item.revenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Card>
    </div>
  );
} 