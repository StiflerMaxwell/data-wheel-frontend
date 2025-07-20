import { Card, Grid } from '@tremor/react';

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* 日期筛选器骨架 */}
      <Card className="p-4">
        <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2"></div>
        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
      </Card>
      
      {/* KPI 卡片骨架 */}
      <Grid numItemsMd={2} numItemsLg={3} className="gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2"></div>
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          </Card>
        ))}
      </Grid>
      
      {/* 趋势图表骨架 */}
      <Card className="p-4">
        <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-4"></div>
        <div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-6"></div>
        <div className="h-60 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
      </Card>
      
      {/* 表格骨架 */}
      <Card className="p-4">
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-4"></div>
        <div className="space-y-3">
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 dark:bg-gray-900 rounded animate-pulse"></div>
          ))}
        </div>
      </Card>
      
      {/* 图表骨架 */}
      <Card className="p-4">
        <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-4"></div>
        <Grid numItemsMd={2} className="gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-4"></div>
              <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            </Card>
          ))}
        </Grid>
      </Card>
    </div>
  );
} 