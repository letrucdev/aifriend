import { ChatPanel } from "@/components/chat/chat-panel"
import { ConversationSidebar } from "@/components/chat/conversation-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function Page() {
  return (
    <SidebarProvider>
      <ConversationSidebar />
      <SidebarInset className="flex h-svh min-h-0 flex-col">
        <ChatPanel />
      </SidebarInset>
    </SidebarProvider>
  )
}
