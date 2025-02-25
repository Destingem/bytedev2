"use client"

import { Send } from "lucide-react"
import { Button } from "./button"
import { FormEvent, useState } from "react"

interface ChatInputProps {
  onSubmit: (message: string) => void
}

export function ChatInput({ onSubmit }: ChatInputProps) {
  const [input, setInput] = useState("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSubmit(input)
      setInput("")
    }
  }

  return (
    <div className="p-4 border-t border-gray-200">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center w-full bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Zeptejte se nás na cokoliv..."
          className="flex-1 p-4 bg-transparent outline-none rounded-xl"
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-2 h-8 w-8 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
        >
          <Send className="h-4 w-4 text-white" />
        </Button>
      </form>
    </div>
  )
}
