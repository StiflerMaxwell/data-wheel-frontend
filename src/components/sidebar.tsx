'use client';

import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button, Text } from '@tremor/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface SidebarProps {
  user?: User | null;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const navItems = [
    { label: '仪表盘总览', href: '/dashboard' },
    { label: '页面优化分析', href: '/dashboard/page-optimization' },
    { label: '渠道漏斗性能', href: '/dashboard/utm-funnel' },
    { label: '保存的洞察', href: '/dashboard/insights' },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/sign-in');
  };

  return (
    <aside className="flex w-64 flex-col bg-white shadow dark:bg-gray-900">
      <div className="flex h-16 items-center px-4">
        <Text className="text-lg font-bold">数据分析平台</Text>
      </div>

      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center rounded-md px-4 py-2 text-sm ${
                  pathname === item.href || 
                  (item.href !== '/dashboard' && pathname.startsWith(item.href))
                    ? 'bg-gray-100 font-medium dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t p-4 dark:border-gray-800">
        <div className="mb-2 flex items-center">
          <div className="ml-2">
            <Text className="text-sm font-medium">{user?.email}</Text>
          </div>
        </div>
        <Button onClick={handleSignOut} variant="light" className="w-full text-sm">
          退出登录
        </Button>
      </div>
    </aside>
  );
} 