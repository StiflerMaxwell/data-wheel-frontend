'use client';

import { addSearchParams } from '@/lib/utils/url';
import { DateRangePicker, DateRangePickerValue } from '@tremor/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface DateRangePickerFilterProps {
  defaultStartDate?: string;
  defaultEndDate?: string;
}

export function DateRangePickerFilter({
  defaultStartDate,
  defaultEndDate,
}: DateRangePickerFilterProps) {
  const router = useRouter();
  
  // 初始化日期范围值
  const initialDates: DateRangePickerValue = {
    from: defaultStartDate ? new Date(defaultStartDate) : undefined,
    to: defaultEndDate ? new Date(defaultEndDate) : undefined,
  };
  
  const [dates, setDates] = useState<DateRangePickerValue>(initialDates);

  // 处理日期范围变化
  const handleDateChange = (value: DateRangePickerValue) => {
    setDates(value);
    
    if (value.from && value.to) {
      const startDate = value.from.toISOString().split('T')[0];
      const endDate = value.to.toISOString().split('T')[0];
      
      // 更新URL参数
      const url = addSearchParams(
        window.location.pathname,
        {
          start_date: startDate,
          end_date: endDate,
        }
      );
      
      router.replace(url);
    }
  };

  return (
    <DateRangePicker
      className="max-w-md"
      value={dates}
      onValueChange={handleDateChange}
      selectPlaceholder="选择时间范围"
      enableYearNavigation={true}
    />
  );
} 