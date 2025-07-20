import { Database } from '@/types/database.types';
import { SupabaseClient } from '@supabase/supabase-js';

export type DbClient = SupabaseClient<Database>;

/**
 * 获取日常KPI摘要数据
 * @param supabase Supabase客户端
 * @param startDate 开始日期
 * @param endDate 结束日期
 */
export async function getDailyKPISummary(
  supabase: DbClient,
  startDate?: string,
  endDate?: string
) {
  try {
    let query = supabase.from('daily_kpi_summary_view').select('*');
    
    if (startDate && endDate) {
      query = query.gte('date', startDate).lte('date', endDate);
    }
    
    query = query.order('date', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('获取KPI摘要数据失败:', error);
    return [];
  }
}

/**
 * 获取UTM渠道漏斗性能数据
 * @param supabase Supabase客户端
 * @param startDate 开始日期
 * @param endDate 结束日期
 */
export async function getUTMFunnelPerformance(
  supabase: DbClient,
  startDate?: string,
  endDate?: string
) {
  try {
    let query = supabase.from('utm_funnel_performance_view').select('*');
    
    if (startDate && endDate) {
      query = query.gte('date', startDate).lte('date', endDate);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('获取UTM渠道漏斗数据失败:', error);
    return [];
  }
}

/**
 * 获取页面优化分析数据
 * @param supabase Supabase客户端
 * @param startDate 开始日期
 * @param endDate 结束日期
 */
export async function getPageOptimizationData(
  supabase: DbClient,
  startDate?: string,
  endDate?: string
) {
  try {
    let query = supabase.from('page_optimization_view').select('*');
    
    if (startDate && endDate) {
      query = query.gte('date', startDate).lte('date', endDate);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('获取页面优化数据失败:', error);
    return [];
  }
}

/**
 * 获取保存的洞察列表
 * @param supabase Supabase客户端
 */
export async function getSavedInsights(supabase: DbClient) {
  try {
    const { data, error } = await supabase
      .from('insights')
      .select(`
        id,
        title,
        summary,
        created_at,
        recommendations (
          id,
          description,
          priority
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('获取洞察列表失败:', error);
    return [];
  }
} 