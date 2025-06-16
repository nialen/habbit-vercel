"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { LogOut, AlertTriangle } from "lucide-react"

interface LogoutConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function LogoutConfirmDialog({ 
  open, 
  onOpenChange, 
  onConfirm
}: LogoutConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <AlertDialogTitle className="text-lg">
              确认退出登录
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-600">
            确定要退出登录吗？您需要重新登录才能继续使用。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="text-gray-600 hover:text-gray-800">
            取消
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            确认退出
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 