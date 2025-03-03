"use client"

import { motion } from "framer-motion"

interface UserCardDemoProps {
  variant: "modern" | "legacy"
}

export function UserCardDemo({ variant }: UserCardDemoProps) {
  const user = {
    name: "John Doe",
    role: "Senior Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
  }

  if (variant === "modern") {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="flex items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
      >
        <img
          src={user.avatar}
          className="w-12 h-12 rounded-full"
          alt={user.name}
        />
        <div className="ml-4">
          <h3 className="font-medium">{user.name}</h3>
          <p className="text-gray-500">{user.role}</p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="legacy-card">
      <img src={user.avatar} className="legacy-avatar" alt={user.name} />
      <div className="legacy-info">
        <h3 className="legacy-name">{user.name}</h3>
        <p className="legacy-role">{user.role}</p>
      </div>

      <style jsx>{`
        .legacy-card {
          display: flex;
          align-items: center;
          padding: 16px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .legacy-card:hover {
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .legacy-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
        }
        .legacy-info {
          margin-left: 16px;
        }
        .legacy-name {
          font-weight: 500;
        }
        .legacy-role {
          color: #6B7280;
        }
      `}</style>
    </div>
  )
}
