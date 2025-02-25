"use client"

import { MessageCircle, X } from "lucide-react"
import { Button } from "./button"

interface ChatButtonProps {
  isOpen: boolean
  onClick: () => void
}

export function ChatButton({ isOpen, onClick }: ChatButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={`
        fixed bottom-6 right-6 
        ${isOpen 
          ? 'h-12 w-12 rounded-full'
          : 'h-14 px-6 rounded-full shadow-lg hover:shadow-xl'
        }
        transition-all duration-200
      `}
    >
      {isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <div className="flex items-center gap-2 p-1">
          <MessageCircle className="h-6 w-6" />
          <span className="text-sm font-medium">Vyzkoušejte našeho asistenta</span>
        </div>
      )}
    </Button>
  )
}
