"use client"

import * as React from "react"

export type ChatRole = "user" | "assistant"

export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
  timestamp: number
}

export type Conversation = {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  messages: ChatMessage[]
}

const STORAGE_KEY = "aifriend:conversations:v1"
const CURRENT_KEY = "aifriend:conversations:current"

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

const EMPTY: Conversation[] = []
let cachedRaw: string | null = null
let cachedValue: Conversation[] = EMPTY

function readAll(): Conversation[] {
  if (typeof window === "undefined") return EMPTY
  const raw = window.localStorage.getItem(STORAGE_KEY) ?? ""
  if (raw === cachedRaw) return cachedValue
  cachedRaw = raw
  if (!raw) {
    cachedValue = EMPTY
    return cachedValue
  }
  try {
    const parsed = JSON.parse(raw)
    cachedValue = Array.isArray(parsed) ? (parsed as Conversation[]) : EMPTY
  } catch {
    cachedValue = EMPTY
  }
  return cachedValue
}

function getServerAll(): Conversation[] {
  return EMPTY
}

function getServerCurrent(): string | null {
  return null
}

function writeAll(items: Conversation[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  // Trigger same-tab listeners
  window.dispatchEvent(new Event("aifriend:conversations-changed"))
}

function readCurrent(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(CURRENT_KEY)
}

function writeCurrent(id: string | null) {
  if (typeof window === "undefined") return
  if (id) window.localStorage.setItem(CURRENT_KEY, id)
  else window.localStorage.removeItem(CURRENT_KEY)
  window.dispatchEvent(new Event("aifriend:conversations-changed"))
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {}
  const handler = (e: StorageEvent | Event) => {
    if (e instanceof StorageEvent) {
      if (e.key && e.key !== STORAGE_KEY && e.key !== CURRENT_KEY) return
    }
    callback()
  }
  window.addEventListener("storage", handler)
  window.addEventListener("aifriend:conversations-changed", handler)
  return () => {
    window.removeEventListener("storage", handler)
    window.removeEventListener("aifriend:conversations-changed", handler)
  }
}

function deriveTitle(content: string): string {
  const trimmed = content.trim().replace(/\s+/g, " ")
  if (!trimmed) return "Cuộc trò chuyện mới"
  return trimmed.length > 40 ? trimmed.slice(0, 40) + "…" : trimmed
}

export function useConversations() {
  const conversations = React.useSyncExternalStore(
    subscribe,
    readAll,
    getServerAll
  )
  const currentId = React.useSyncExternalStore(
    subscribe,
    readCurrent,
    getServerCurrent
  )

  const setCurrentId = React.useCallback((id: string | null) => {
    writeCurrent(id)
  }, [])

  const createConversation = React.useCallback((): string => {
    const now = Date.now()
    const conv: Conversation = {
      id: makeId(),
      title: "Cuộc trò chuyện mới",
      createdAt: now,
      updatedAt: now,
      messages: [],
    }
    const all = readAll()
    writeAll([conv, ...all])
    writeCurrent(conv.id)
    return conv.id
  }, [])

  const appendMessage = React.useCallback(
    (id: string, message: Omit<ChatMessage, "id" | "timestamp"> & {
      id?: string
      timestamp?: number
    }): string => {
      const messageId = message.id ?? makeId()
      const all = readAll()
      const idx = all.findIndex((c) => c.id === id)
      if (idx === -1) return messageId
      const conv = all[idx]!
      const fullMessage: ChatMessage = {
        id: messageId,
        role: message.role,
        content: message.content,
        timestamp: message.timestamp ?? Date.now(),
      }
      const updatedMessages = [...conv.messages, fullMessage]
      const isFirstUserMsg =
        conv.messages.length === 0 && message.role === "user"
      all[idx] = {
        ...conv,
        title: isFirstUserMsg ? deriveTitle(message.content) : conv.title,
        updatedAt: Date.now(),
        messages: updatedMessages,
      }
      writeAll(all)
      return messageId
    },
    []
  )

  const updateMessage = React.useCallback(
    (conversationId: string, messageId: string, content: string) => {
      const all = readAll()
      const idx = all.findIndex((c) => c.id === conversationId)
      if (idx === -1) return
      const conv = all[idx]!
      const updated = conv.messages.map((m) =>
        m.id === messageId ? { ...m, content } : m
      )
      all[idx] = { ...conv, messages: updated, updatedAt: Date.now() }
      writeAll(all)
    },
    []
  )

  const renameConversation = React.useCallback(
    (id: string, title: string) => {
      const all = readAll()
      const idx = all.findIndex((c) => c.id === id)
      if (idx === -1) return
      all[idx] = { ...all[idx]!, title, updatedAt: Date.now() }
      writeAll(all)
    },
    []
  )

  const deleteConversation = React.useCallback(
    (id: string) => {
      const all = readAll().filter((c) => c.id !== id)
      writeAll(all)
      if (readCurrent() === id) writeCurrent(all[0]?.id ?? null)
    },
    []
  )

  const clearAll = React.useCallback(() => {
    writeAll([])
    writeCurrent(null)
  }, [])

  const currentConversation = React.useMemo(
    () => conversations.find((c) => c.id === currentId) ?? null,
    [conversations, currentId]
  )

  return {
    conversations,
    currentId,
    currentConversation,
    setCurrentId,
    createConversation,
    appendMessage,
    updateMessage,
    renameConversation,
    deleteConversation,
    clearAll,
  }
}
