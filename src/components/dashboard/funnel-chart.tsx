'use client';

import { Text } from '@tremor/react';

interface FunnelStep {
  name: string;
  value: number;
}

interface FunnelChartProps {
  data: FunnelStep[];
}

export function FunnelChart({ data }: FunnelChartProps) {
  const maxValue = Math.max(...data.map(item => item.value));
  
  // 计算各步骤转化率
  const stepsWithConversion = data.map((step, index) => {
    const nextStep = data[index + 1];
    const conversionRate = nextStep 
      ? `${((nextStep.value / step.value) * 100).toFixed(1)}%` 
      : null;
    
    return {
      ...step,
      conversionRate,
      percent: (step.value / maxValue) * 100
    };
  });

  return (
    <div className="mt-4">
      {stepsWithConversion.map((step, index) => (
        <div key={step.name} className="mb-4">
          <div className="flex items-center justify-between">
            <Text>{step.name}</Text>
            <div className="flex items-center">
              <Text className="font-medium">{step.value.toLocaleString()}</Text>
              {step.conversionRate && (
                <Text className="ml-2 text-sm text-gray-500">
                  → {step.conversionRate}
                </Text>
              )}
            </div>
          </div>
          <div className="mt-2 h-3 w-full rounded-full bg-gray-100">
            <div
              className={`h-3 rounded-full ${getBarColor(index)}`}
              style={{ width: `${step.percent}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function getBarColor(index: number) {
  const colors = [
    'bg-blue-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-violet-500',
    'bg-pink-500',
  ];
  return colors[index % colors.length];
} 