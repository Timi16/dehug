"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2, CheckCircle, AlertTriangle } from 'lucide-react'
import { DeHugAPI } from "@/lib/api"

interface DownloadButtonProps {
  itemName: string
  ipfsHash: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "secondary"
  className?: string
  onDownloadStart?: () => void
  onDownloadComplete?: () => void
  onDownloadError?: (error: Error) => void
}

export function DownloadButton({
  itemName,
  ipfsHash,
  size = "default",
  variant = "default",
  className = "",
  onDownloadStart,
  onDownloadComplete,
  onDownloadError
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'success' | 'error'>('idle')

  const handleDownload = async () => {
    try {
      setIsDownloading(true)
      setDownloadStatus('downloading')
      onDownloadStart?.()

      // Get the download URL and track the download
      const downloadUrl = await DeHugAPI.downloadFromFilecoin(itemName, ipfsHash, 'ui')

      // Create a temporary anchor for download
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `${itemName}.zip` // Adjust extension as needed
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setDownloadStatus('success')
      onDownloadComplete?.()
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setDownloadStatus('idle')
      }, 3000)
      
    } catch (error) {
      console.error('Download failed:', error)
      setDownloadStatus('error')
      onDownloadError?.(error as Error)
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setDownloadStatus('idle')
      }, 3000)
    } finally {
      setIsDownloading(false)
    }
  }

  const getButtonContent = () => {
    switch (downloadStatus) {
      case 'downloading':
        return (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Downloading...
          </>
        )
      case 'success':
        return (
          <>
            <CheckCircle className="h-4 w-4 mr-2" />
            Downloaded
          </>
        )
      case 'error':
        return (
          <>
            <AlertTriangle className="h-4 w-4 mr-2" />
            Failed
          </>
        )
      default:
        return (
          <>
            <Download className="h-4 w-4 mr-2" />
            Download
          </>
        )
    }
  }

  const getButtonVariant = () => {
    if (downloadStatus === 'success') return 'default'
    if (downloadStatus === 'error') return 'destructive'
    return variant
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      size={size}
      variant={getButtonVariant()}
      className={`transition-all duration-300 ${className}`}
    >
      {getButtonContent()}
    </Button>
  )
}