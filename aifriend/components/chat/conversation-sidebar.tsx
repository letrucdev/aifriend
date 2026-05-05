"use client"

import * as React from "react"
import {
  EllipsisIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  useConversations,
  type Conversation,
} from "@/hooks/use-conversations"
import { MonoLabel } from "@/components/chat/mono-label"

function groupByRecency(items: Conversation[]) {
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000
  const today: Conversation[] = []
  const week: Conversation[] = []
  const older: Conversation[] = []
  for (const c of items) {
    const age = now - c.updatedAt
    if (age < dayMs) today.push(c)
    else if (age < 7 * dayMs) week.push(c)
    else older.push(c)
  }
  return [
    { label: "Hôm nay", items: today },
    { label: "7 ngày qua", items: week },
    { label: "Cũ hơn", items: older },
  ].filter((g) => g.items.length > 0)
}

export function ConversationSidebar() {
  const {
    conversations,
    currentId,
    setCurrentId,
    createConversation,
    renameConversation,
    deleteConversation,
    clearAll,
  } = useConversations()
  const [search, setSearch] = React.useState("")

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return conversations
    return conversations.filter((c) => c.title.toLowerCase().includes(q))
  }, [conversations, search])

  const sorted = React.useMemo(
    () => [...filtered].sort((a, b) => b.updatedAt - a.updatedAt),
    [filtered]
  )
  const groups = React.useMemo(() => groupByRecency(sorted), [sorted])

  const handleNew = () => {
    createConversation()
  }

  const handleRename = (id: string, currentTitle: string) => {
    const next = window.prompt("Đổi tên cuộc trò chuyện", currentTitle)
    if (next && next.trim()) renameConversation(id, next.trim())
  }

  return (
    <Sidebar>
      <SidebarHeader className="gap-3 p-4">
        <div className="flex items-center gap-2">
          <div
            className="flex size-8 items-center justify-center rounded-md text-base"
            style={{
              background:
                "linear-gradient(135deg, #fbcfe8 0%, #c4b5fd 50%, #bae6fd 100%)",
            }}
            aria-hidden
          >
            🌸
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-[-0.02em]">
              Mây
            </div>
            <MonoLabel className="text-muted-foreground">
              AI Bạn Thân
            </MonoLabel>
          </div>
        </div>
        <Button
          onClick={handleNew}
          className="w-full justify-center gap-2"
          size="sm"
        >
          <PlusIcon className="size-4" />
          Cuộc trò chuyện mới
        </Button>
        <div className="relative">
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm cuộc trò chuyện…"
            className="h-8 pl-8 text-xs"
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {groups.length === 0 ? (
          <div className="text-muted-foreground px-4 py-8 text-center text-xs">
            Chưa có cuộc trò chuyện nào.
            <br />
            Bấm nút trên để bắt đầu nha 🌷
          </div>
        ) : (
          groups.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel asChild>
                <MonoLabel>{group.label}</MonoLabel>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((c) => (
                    <SidebarMenuItem key={c.id}>
                      <SidebarMenuButton
                        isActive={c.id === currentId}
                        onClick={() => setCurrentId(c.id)}
                        className={cn(
                          "truncate text-sm",
                          c.id === currentId && "font-medium"
                        )}
                      >
                        <span className="truncate">{c.title}</span>
                      </SidebarMenuButton>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction
                            showOnHover
                            aria-label="Tuỳ chọn cuộc trò chuyện"
                          >
                            <EllipsisIcon className="size-4" />
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" side="right">
                          <DropdownMenuItem
                            onClick={() => handleRename(c.id, c.title)}
                          >
                            <PencilIcon className="size-4" />
                            Đổi tên
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => deleteConversation(c.id)}
                          >
                            <Trash2Icon className="size-4" />
                            Xoá
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))
        )}
      </SidebarContent>

      <SidebarFooter className="gap-2 p-3">
        {conversations.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive w-full justify-start gap-2"
              >
                <Trash2Icon className="size-4" />
                <span className="text-xs">Xoá tất cả cuộc trò chuyện</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xoá tất cả cuộc trò chuyện?</AlertDialogTitle>
                <AlertDialogDescription>
                  Toàn bộ lịch sử ở thiết bị này sẽ biến mất luôn nha. Hành
                  động này không thể hoàn tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Huỷ</AlertDialogCancel>
                <AlertDialogAction onClick={clearAll}>
                  Xoá hết
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <p className="text-muted-foreground px-1 text-[10px] leading-relaxed">
          Lịch sử chỉ lưu ở trình duyệt của cậu nha 🤍
        </p>
      </SidebarFooter>
    </Sidebar>
  )
}
