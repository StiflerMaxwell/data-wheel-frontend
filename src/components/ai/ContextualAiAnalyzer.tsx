'use client';

import { useState, useRef } from 'react';
import { Button, Dialog, DialogPanel, Title, Text, Divider } from '@tremor/react';
import { Spinner } from '@/components/ui/Spinner';
import { RiSparklingFill, RiDownloadLine } from '@remixicon/react';
import { createClient } from '@/lib/supabase/client';
import { marked } from 'marked';

interface ContextualAiAnalyzerProps {
  analysisType: 'kpi_summary' | 'page_optimization' | 'utm_funnel';
  title: string;
  description: string;
  currentFilters: {
    startDate: string;
    endDate: string;
    [key: string]: any;
  };
}

export function ContextualAiAnalyzer({
  analysisType,
  title,
  description,
  currentFilters
}: ContextualAiAnalyzerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [streamedContent, setStreamedContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const supabase = useRef(createClient()).current;
  
  // 根据分析类型返回相应的视图名称
  const getViewName = () => {
    switch(analysisType) {
      case 'kpi_summary': return 'daily_kpi_summary_view';
      case 'page_optimization': return 'page_optimization_view';
      case 'utm_funnel': return 'utm_funnel_performance_view';
      default: return '';
    }
  };
  
  // 处理生成AI分析
  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setStreamedContent('');
    setSavedMessage(null);
    
    try {
      const response = await fetch(
        'https://rrfurkgzyliqudkjmckk.supabase.co/functions/v1/generate-insight',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          },
          body: JSON.stringify({ 
            viewName: getViewName(),
            filters: currentFilters
          })
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI 分析失败 (${response.status}): ${errorText}`);
      }
      
      // 处理流式响应
      const reader = response.body?.getReader();
      if (!reader) throw new Error('无法获取响应流');
      
      const decoder = new TextDecoder();
      let result = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        result += chunk;
        setStreamedContent(result);
      }
    } catch (error) {
      console.error('生成洞察失败:', error);
      setError(error instanceof Error ? error.message : '生成分析时发生未知错误');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 保存洞察
  const handleSaveInsight = async () => {
    if (!streamedContent || isSaving) return;
    
    setIsSaving(true);
    setSavedMessage(null);
    
    try {
      // 从流式内容中提取标题和摘要
      const lines = streamedContent.split('\n');
      let insightTitle = title;
      let insightSummary = '';
      
      // 尝试从Markdown内容中提取标题和摘要
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('# ')) {
          insightTitle = line.substring(2).trim();
          break;
        }
      }
      
      // 提取前两段作为摘要
      let paragraphCount = 0;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line && !line.startsWith('#') && !line.startsWith('- ')) {
          insightSummary += line + ' ';
          paragraphCount++;
          if (paragraphCount >= 2) break;
        }
      }
      
      // 从内容中提取建议
      const recommendationRegex = /(?:推荐|建议)(?:\s+\d+)?[:：]\s*(.*?)(?=\n\n|\n推荐|\n建议|$)/gs;
      const matches = [...streamedContent.matchAll(recommendationRegex)];
      
      const recommendations = matches.map((match, index) => ({
        description: match[1].trim(),
        priority: index === 0 ? 'High' : index === 1 ? 'Medium' : 'Low'
      }));
      
      // 如果没有检测到建议，尝试提取列表项
      if (recommendations.length === 0) {
        const listItemRegex = /- (.*?)(?=\n-|\n\n|$)/gs;
        const listMatches = [...streamedContent.matchAll(listItemRegex)];
        
        listMatches.slice(0, 3).forEach((match, index) => {
          recommendations.push({
            description: match[1].trim(),
            priority: index === 0 ? 'High' : index === 1 ? 'Medium' : 'Low'
          });
        });
      }
      
      const insightData = {
        insight_title: insightTitle,
        insight_summary: insightSummary.trim(),
        recommendations: recommendations.length > 0 ? recommendations : [
          { description: '根据数据进行更深入的分析', priority: 'Medium' }
        ],
        raw_content: streamedContent
      };
      
      const response = await fetch(
        'https://rrfurkgzyliqudkjmckk.supabase.co/functions/v1/save-insight',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          },
          body: JSON.stringify(insightData)
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`保存洞察失败 (${response.status}): ${errorText}`);
      }
      
      const result = await response.json();
      setSavedMessage(`洞察已成功保存（ID: ${result.insight_id}）`);
    } catch (error) {
      console.error('保存洞察失败:', error);
      setError(error instanceof Error ? error.message : '保存洞察时发生未知错误');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <>
      <Button
        icon={RiSparklingFill}
        color="indigo"
        variant="secondary"
        onClick={() => setIsOpen(true)}
      >
        AI 分析
      </Button>
      
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} static={true}>
        <DialogPanel className="max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <Title>{title}</Title>
            <Button variant="light" onClick={() => setIsOpen(false)}>关闭</Button>
          </div>
          
          <Text className="mb-4 text-gray-500">{description}</Text>
          <Text className="mb-2">分析日期范围: {currentFilters.startDate} 至 {currentFilters.endDate}</Text>
          
          <Divider />
          
          {!streamedContent && !isLoading && (
            <div className="py-8 text-center">
              <Button onClick={handleGenerate}>
                生成 AI 分析
              </Button>
            </div>
          )}
          
          {isLoading && (
            <div className="py-8 flex flex-col items-center justify-center space-y-4">
              <Spinner />
              <Text>AI 正在分析数据...</Text>
            </div>
          )}
          
          {streamedContent && !isLoading && (
            <div className="py-4">
              <div 
                className="prose dark:prose-invert max-w-none mb-6"
                dangerouslySetInnerHTML={{ __html: marked(streamedContent) }}
              />
              
              <div className="flex justify-end items-center space-x-3 mt-4">
                {savedMessage && (
                  <Text className="text-green-500">{savedMessage}</Text>
                )}
                
                <Button 
                  icon={RiDownloadLine}
                  onClick={handleSaveInsight} 
                  loading={isSaving}
                  disabled={isSaving}
                >
                  保存洞察
                </Button>
              </div>
            </div>
          )}
          
          {error && (
            <div className="py-4 text-center">
              <Text className="text-red-500">{error}</Text>
              <Button onClick={handleGenerate} className="mt-4">重试</Button>
            </div>
          )}
        </DialogPanel>
      </Dialog>
    </>
  );
} 