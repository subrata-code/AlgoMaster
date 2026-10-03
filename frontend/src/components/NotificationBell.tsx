import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Check, Flame, Target, Trophy, Info } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { notificationService } from '@/services'
import { formatRelativeTime } from '@/lib/utils'
import type { AppNotification } from '@/types'

export function NotificationBell() {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const notifs = await notificationService.getRecent()
        setNotifications(notifs)
      } catch (err) {
        // silently ignore error
      }
    }
    void load()
    // Could set up polling or webhooks here, but for now just load on mount
  }, [open]) // Reload when opened to get freshest data

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    } catch (err) {
      // ignore
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Trophy className="h-4 w-4 text-amber-500" />
      case 'streak':
        return <Flame className="h-4 w-4 text-orange-500" />
      case 'weakness':
        return <Target className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-2.5 top-2 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 sm:w-96">
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="font-semibold text-sm">Notifications</h2>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground">
              <Check className="mr-1 h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-6 text-center">
              <Bell className="mb-2 h-8 w-8 text-muted-foreground/30" />
              <p className="text-sm font-medium">No notifications yet</p>
              <p className="text-xs text-muted-foreground">We'll let you know when there's an update.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1 p-1">
              {notifications.map((notif) => {
                const content = (
                  <div className={`flex gap-3 rounded-md p-3 text-left transition-colors hover:bg-muted ${notif.read ? 'opacity-75' : ''}`}>
                    <div className="mt-0.5 shrink-0">{getIcon(notif.type)}</div>
                    <div className="flex-1 space-y-1">
                      <p className={`text-sm font-medium leading-none ${notif.read ? 'text-muted-foreground' : ''}`}>{notif.title}</p>
                      {notif.message && <p className="text-xs text-muted-foreground">{notif.message}</p>}
                      <p className="text-[10px] text-muted-foreground/70">{formatRelativeTime(notif.createdAt)}</p>
                    </div>
                    {!notif.read && <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />}
                  </div>
                )

                return notif.link ? (
                  <DropdownMenuItem key={notif.id} asChild className="p-0 cursor-pointer">
                    <Link to={notif.link} onClick={() => setOpen(false)}>
                      {content}
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem key={notif.id} className="p-0 cursor-default">
                    {content}
                  </DropdownMenuItem>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
