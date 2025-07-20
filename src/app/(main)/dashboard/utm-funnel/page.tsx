import { ContextualAiInsight } from '@/components/dashboard/contextual-ai-insight';
import { FunnelChart } from '@/components/dashboard/funnel-chart';
import { DateRangePickerFilter } from '@/components/date-range-picker-filter';
import { getUTMFunnelPerformance } from '@/lib/supabase/queries';
import { createClient } from '@/lib/supabase/server';
import { formatCurrency, formatPercent } from '@/lib/utils/format';
import { Card, Grid, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Title } from '@tremor/react';

interface UTMFunnelPageProps {
  searchParams: { start_date?: string; end_date?: string };
}

export default async function UTMFunnelPage({ searchParams }: UTMFunnelPageProps) {
  const supabase = createClient();
  const startDate = searchParams.start_date || getDefaultStartDate();
  const endDate = searchParams.end_date || getDefaultEndDate();

  // 获取UTM渠道漏斗性能数据
  const utmData = await getUTMFunnelPerformance(supabase, startDate, endDate);

  // 按渠道类型聚合数据
  const sourceData = aggregateBySource(utmData);
  const mediumData = aggregateByMedium(utmData);
  const campaignData = aggregateByCampaign(utmData);

  // 计算总体漏斗步骤
  const overallFunnel = calculateOverallFunnel(utmData);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Title>UTM 渠道漏斗性能</Title>
          <ContextualAiInsight 
            analysisType="utm_funnel"
            currentFilters={{ startDate, endDate }}
          />
        </div>
        <DateRangePickerFilter
          defaultStartDate={startDate}
          defaultEndDate={endDate}
        />
      </div>

      <div className="mb-8">
        <Card>
          <Title>整体漏斗性能</Title>
          <FunnelChart data={overallFunnel} />
        </Card>
      </div>

      <Grid numItemsMd={2} className="gap-6">
        <Card>
          <Title>流量来源表现</Title>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>来源</TableHeaderCell>
                <TableHeaderCell>会话数</TableHeaderCell>
                <TableHeaderCell>转化率</TableHeaderCell>
                <TableHeaderCell>收入</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sourceData.slice(0, 5).map((source) => (
                <TableRow key={source.name}>
                  <TableCell>{source.name}</TableCell>
                  <TableCell>{source.sessions.toLocaleString()}</TableCell>
                  <TableCell>{formatPercent(source.conversion_rate)}</TableCell>
                  <TableCell>{formatCurrency(source.revenue)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Card>
          <Title>媒介表现</Title>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>媒介</TableHeaderCell>
                <TableHeaderCell>会话数</TableHeaderCell>
                <TableHeaderCell>转化率</TableHeaderCell>
                <TableHeaderCell>收入</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mediumData.slice(0, 5).map((medium) => (
                <TableRow key={medium.name}>
                  <TableCell>{medium.name}</TableCell>
                  <TableCell>{medium.sessions.toLocaleString()}</TableCell>
                  <TableCell>{formatPercent(medium.conversion_rate)}</TableCell>
                  <TableCell>{formatCurrency(medium.revenue)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Grid>

      <div className="mt-8">
        <Card>
          <Title>广告系列表现</Title>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>广告系列</TableHeaderCell>
                <TableHeaderCell>来源</TableHeaderCell>
                <TableHeaderCell>媒介</TableHeaderCell>
                <TableHeaderCell>会话数</TableHeaderCell>
                <TableHeaderCell>转化率</TableHeaderCell>
                <TableHeaderCell>收入</TableHeaderCell>
                <TableHeaderCell>ROI</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campaignData.slice(0, 10).map((campaign) => (
                <TableRow key={campaign.name}>
                  <TableCell>{campaign.name}</TableCell>
                  <TableCell>{campaign.source}</TableCell>
                  <TableCell>{campaign.medium}</TableCell>
                  <TableCell>{campaign.sessions.toLocaleString()}</TableCell>
                  <TableCell>{formatPercent(campaign.conversion_rate)}</TableCell>
                  <TableCell>{formatCurrency(campaign.revenue)}</TableCell>
                  <TableCell>
                    {campaign.roi !== undefined ? `${campaign.roi.toFixed(2)}x` : '未知'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}

// 聚合函数
function aggregateBySource(utmData: any[]) {
  const sourceMap = new Map();
  
  utmData.forEach((item) => {
    const source = item.utm_source || '(not set)';
    if (!sourceMap.has(source)) {
      sourceMap.set(source, {
        name: source,
        sessions: 0,
        purchases: 0,
        revenue: 0,
      });
    }
    
    const sourceData = sourceMap.get(source);
    sourceData.sessions += item.sessions;
    sourceData.purchases += item.purchases;
    sourceData.revenue += item.revenue;
  });
  
  return Array.from(sourceMap.values())
    .map((source: any) => ({
      ...source,
      conversion_rate: source.sessions > 0 ? source.purchases / source.sessions : 0
    }))
    .sort((a, b) => b.sessions - a.sessions);
}

function aggregateByMedium(utmData: any[]) {
  const mediumMap = new Map();
  
  utmData.forEach((item) => {
    const medium = item.utm_medium || '(not set)';
    if (!mediumMap.has(medium)) {
      mediumMap.set(medium, {
        name: medium,
        sessions: 0,
        purchases: 0,
        revenue: 0,
      });
    }
    
    const mediumData = mediumMap.get(medium);
    mediumData.sessions += item.sessions;
    mediumData.purchases += item.purchases;
    mediumData.revenue += item.revenue;
  });
  
  return Array.from(mediumMap.values())
    .map((medium: any) => ({
      ...medium,
      conversion_rate: medium.sessions > 0 ? medium.purchases / medium.sessions : 0
    }))
    .sort((a, b) => b.sessions - a.sessions);
}

function aggregateByCampaign(utmData: any[]) {
  return utmData
    .map((item) => ({
      name: item.utm_campaign || '(not set)',
      source: item.utm_source || '(not set)',
      medium: item.utm_medium || '(not set)',
      sessions: item.sessions,
      purchases: item.purchases,
      revenue: item.revenue,
      conversion_rate: item.sessions > 0 ? item.purchases / item.sessions : 0,
      roi: 2.5, // 示例ROI值，实际应用中需要从数据中计算
    }))
    .sort((a, b) => b.sessions - a.sessions);
}

function calculateOverallFunnel(utmData: any[]) {
  // 汇总所有渠道数据
  let sessions = 0;
  let productViews = 0;
  let addToCart = 0;
  let checkouts = 0;
  let purchases = 0;
  
  utmData.forEach((item) => {
    sessions += item.sessions;
    productViews += item.product_views;
    addToCart += item.add_to_cart;
    checkouts += item.checkouts;
    purchases += item.purchases;
  });
  
  return [
    { name: '会话', value: sessions },
    { name: '产品浏览', value: productViews },
    { name: '加入购物车', value: addToCart },
    { name: '结账', value: checkouts },
    { name: '购买', value: purchases },
  ];
}

function getDefaultStartDate() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().split('T')[0];
}

function getDefaultEndDate() {
  return new Date().toISOString().split('T')[0];
} 