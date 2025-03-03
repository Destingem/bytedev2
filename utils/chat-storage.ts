export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

const STORAGE_KEY = 'bytedev-chat-messages';

export function loadMessages(): ChatMessage[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const storedMessages = localStorage.getItem(STORAGE_KEY);
    return storedMessages ? JSON.parse(storedMessages) : [];
  } catch (error) {
    console.error('Error loading chat messages from storage:', error);
    return [];
  }
}

export function saveMessages(messages: ChatMessage[]) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving chat messages to storage:', error);
  }
}

export function clearMessages() {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing chat messages from storage:', error);
  }
}
