import { ContextualAiInsight } from '@/components/dashboard/contextual-ai-insight';
import { DateRangePickerFilter } from '@/components/date-range-picker-filter';
import { getPageOptimizationData } from '@/lib/supabase/queries';
import { createClient } from '@/lib/supabase/server';
import { formatCurrency, formatPercent, formatTime } from '@/lib/utils/format';
import { Badge, Card, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Title } from '@tremor/react';

interface PageOptimizationPageProps {
  searchParams: { start_date?: string; end_date?: string };
}

export default async function PageOptimizationPage({ searchParams }: PageOptimizationPageProps) {
  const supabase = createClient();
  const startDate = searchParams.start_date || getDefaultStartDate();
  const endDate = searchParams.end_date || getDefaultEndDate();

  // 获取页面优化数据
  const pageData = await getPageOptimizationData(supabase, startDate, endDate);

  // 对数据进行排序，按会话数降序
  const sortedPages = [...pageData].sort((a, b) => b.sessions - a.sessions);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Title>页面优化分析</Title>
          <ContextualAiInsight 
            analysisType="page_optimization"
            currentFilters={{ startDate, endDate }}
          />
        </div>
        <DateRangePickerFilter
          defaultStartDate={startDate}
          defaultEndDate={endDate}
        />
      </div>

      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>页面路径</TableHeaderCell>
              <TableHeaderCell>页面标题</TableHeaderCell>
              <TableHeaderCell>会话数</TableHeaderCell>
              <TableHeaderCell>页面浏览</TableHeaderCell>
              <TableHeaderCell>平均停留时间</TableHeaderCell>
              <TableHeaderCell>跳出率</TableHeaderCell>
              <TableHeaderCell>转化率</TableHeaderCell>
              <TableHeaderCell>收入贡献</TableHeaderCell>
              <TableHeaderCell>健康状态</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedPages.map((page) => (
              <TableRow key={page.page_path}>
                <TableCell>{page.page_path}</TableCell>
                <TableCell>{page.page_title}</TableCell>
                <TableCell>{page.sessions.toLocaleString()}</TableCell>
                <TableCell>{page.pageviews.toLocaleString()}</TableCell>
                <TableCell>{formatTime(page.avg_time_on_page)}</TableCell>
                <TableCell>{formatPercent(page.bounce_rate)}</TableCell>
                <TableCell>{formatPercent(page.conversion_rate)}</TableCell>
                <TableCell>{formatCurrency(page.revenue_contribution)}</TableCell>
                <TableCell>
                  <PageHealthBadge 
                    bounceRate={page.bounce_rate} 
                    conversionRate={page.conversion_rate} 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// 页面健康状态徽章组件
function PageHealthBadge({ 
  bounceRate, 
  conversionRate 
}: { 
  bounceRate: number; 
  conversionRate: number; 
}) {
  // 简单评估页面健康状态的逻辑
  let status: 'success' | 'warning' | 'danger' = 'success';
  let label = '健康';

  if (bounceRate > 0.7) {
    status = 'danger';
    label = '需优化';
  } else if (bounceRate > 0.5 || conversionRate < 0.01) {
    status = 'warning';
    label = '待改进';
  }

  const badgeColors = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
  };

  return <Badge color={status}>{label}</Badge>;
}

function getDefaultStartDate() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().split('T')[0];
}

function getDefaultEndDate() {
  return new Date().toISOString().split('T')[0];
} 