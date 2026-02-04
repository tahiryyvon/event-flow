'use client'

import { useState } from 'react'

interface CopyLinkButtonProps {
  url: string
  className?: string
}

export default function CopyLinkButton({ url, className = '' }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`transition-colors ${className} ${
        copied 
          ? 'bg-green-600 hover:bg-green-700' 
          : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {copied ? 'Copied!' : 'Copy Link'}
    </button>
  )
}