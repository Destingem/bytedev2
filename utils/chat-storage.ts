export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

const STORAGE_KEY = 'bytedev_chat_history'

export function saveMessages(messages: ChatMessage[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
}

export function loadMessages(): ChatMessage[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function clearMessages() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
