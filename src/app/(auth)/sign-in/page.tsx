'use client'

import { createClient } from '@/lib/supabase/client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SignInPage() {
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.push('/dashboard')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-full max-w-md p-8">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          providers={[]}
          localization={{
            variables: {
              sign_in: {
                email_label: '邮箱地址',
                password_label: '密码',
                email_input_placeholder: '请输入您的邮箱地址',
                password_input_placeholder: '请输入您的密码',
                button_label: '登录',
                social_provider_text: '通过 {{provider}} 登录',
                link_text: '已有账户？登录',
              },
              sign_up: {
                email_label: '邮箱地址',
                password_label: '创建密码',
                button_label: '注册',
                link_text: '还没有账户？注册',
              },
              forgotten_password: {
                email_label: '邮箱地址',
                email_input_placeholder: '您的邮箱地址',
                button_label: '发送重置密码邮件',
                link_text: '忘记密码？',
              },
            },
          }}
        />
      </div>
    </div>
  )
} 