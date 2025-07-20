'use client';

import { ContextualAiAnalyzer } from '@/components/ai/ContextualAiAnalyzer';

interface ContextualAiInsightProps {
  analysisType: 'dashboard' | 'page_optimization' | 'utm_funnel';
  currentFilters: {
    startDate?: string;
    endDate?: string;
    [key: string]: any;
  };
}

export function ContextualAiInsight({ analysisType, currentFilters }: ContextualAiInsightProps) {
  return (
    <ContextualAiAnalyzer 
      analysisType={analysisType}
      currentFilters={currentFilters}
    />
  );
} 