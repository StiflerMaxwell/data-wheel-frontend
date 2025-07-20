import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { DashboardSkeleton } from '@/components/ui/dashboard/DashboardSkeleton';
import { createClient } from '@/lib/supabase/server';
import DashboardContent from './content';

interface DashboardPageProps {
  searchParams?: {
    startDate?: string;
    endDate?: string;
  };
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const supabase = createClient();
  
  // 获取用户信息确认身份验证
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return notFound();
  
  // 默认日期范围（最近30天）
  const endDate = searchParams?.endDate || new Date().toISOString().split('T')[0];
  const startDate = searchParams?.startDate || new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];
  
  // 并行获取所有视图数据
  const [kpiSummary, pageOptimization, utmFunnelPerformance] = await Promise.all([
    fetchKpiSummaryData(supabase, startDate, endDate),
    fetchPageOptimizationData(supabase, startDate, endDate),
    fetchUtmFunnelPerformanceData(supabase, startDate, endDate)
  ]);
  
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">奢侈品电商数据分析平台</h1>
      
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent 
          kpiSummary={kpiSummary} 
          pageOptimization={pageOptimization} 
          utmFunnelPerformance={utmFunnelPerformance}
          dateRange={{ startDate, endDate }}
        />
      </Suspense>
    </div>
  );
}

// 获取宏观健康度监控数据
async function fetchKpiSummaryData(supabase: any, startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from('daily_kpi_summary_view')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });
    
  if (error) {
    console.error('获取KPI数据失败:', error);
    return [];
  }
  
  return data || [];
}

// 获取页面优化分析数据
async function fetchPageOptimizationData(supabase: any, startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from('page_optimization_view')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('total_sessions', { ascending: false })
    .limit(20);
    
  if (error) {
    console.error('获取页面优化数据失败:', error);
    return [];
  }
  
  return data || [];
}

// 获取UTM渠道漏斗性能数据
async function fetchUtmFunnelPerformanceData(supabase: any, startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from('utm_funnel_performance_view')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('conversion_rate', { ascending: false })
    .limit(15);
    
  if (error) {
    console.error('获取UTM渠道数据失败:', error);
    return [];
  }
  
  return data || [];
} 