"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSubMenu,
  DropdownMenuSubMenuContent,
  DropdownMenuSubMenuTrigger,
  DropdownMenuTrigger,
} from "@/components/Dropdown"
import { createClient } from '@/lib/supabase/client'
import {
  RiArrowRightUpLine,
  RiComputerLine,
  RiMoonLine,
  RiSunLine,
  RiLogoutBoxRLine,
} from "@remixicon/react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import * as React from "react"

export type DropdownUserProfileProps = {
  children: React.ReactNode
  align?: "center" | "start" | "end"
  userEmail?: string
}

export function DropdownUserProfile({
  children,
  align = "start",
  userEmail = "用户",
}: DropdownUserProfileProps) {
  const router = useRouter()
  const supabase = createClient()
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme } = useTheme()
  
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/sign-in')
  }

  if (!mounted) {
    return null
  }
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align={align}>
          <DropdownMenuLabel>{userEmail}</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuSubMenu>
              <DropdownMenuSubMenuTrigger>主题</DropdownMenuSubMenuTrigger>
              <DropdownMenuSubMenuContent>
                <DropdownMenuRadioGroup
                  value={theme}
                  onValueChange={(value) => {
                    setTheme(value)
                  }}
                >
                  <DropdownMenuRadioItem
                    aria-label="切换到浅色模式"
                    value="light"
                    iconType="check"
                  >
                    <RiSunLine className="size-4 shrink-0" aria-hidden="true" />
                    浅色
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    aria-label="切换到深色模式"
                    value="dark"
                    iconType="check"
                  >
                    <RiMoonLine
                      className="size-4 shrink-0"
                      aria-hidden="true"
                    />
                    深色
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    aria-label="切换到系统模式"
                    value="system"
                    iconType="check"
                  >
                    <RiComputerLine
                      className="size-4 shrink-0"
                      aria-hidden="true"
                    />
                    系统
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubMenuContent>
            </DropdownMenuSubMenu>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleSignOut}>
              <RiLogoutBoxRLine className="mr-2 size-4 shrink-0" aria-hidden="true" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
