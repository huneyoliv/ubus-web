import { useState, useRef, useEffect } from 'react'
import { Bell, Check, CheckCheck, Trash2, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { useNotificationStore, type Notification } from '@/store/useNotificationStore'

const iconMap: Record<Notification['type'], { icon: typeof Info; color: string; bg: string }> = {
    info: { icon: Info, color: 'var(--color-primary)', bg: 'rgba(37,99,235,0.08)' },
    success: { icon: CheckCircle, color: 'var(--color-success)', bg: 'rgba(16,185,129,0.08)' },
    warning: { icon: AlertTriangle, color: '#D97706', bg: 'rgba(245,158,11,0.08)' },
    error: { icon: XCircle, color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
}

export default function NotificationPopover() {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const { notifications, markAsRead, markAllAsRead, clearAll, unreadCount } = useNotificationStore()
    const count = unreadCount()

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    console.debug('[NotificationPopover] render', { open, count, total: notifications.length })

    const formatTime = (iso: string) => {
        const diff = Date.now() - new Date(iso).getTime()
        const mins = Math.floor(diff / 60000)
        if (mins < 1) return 'agora'
        if (mins < 60) return `${mins}min`
        const hrs = Math.floor(mins / 60)
        if (hrs < 24) return `${hrs}h`
        return `${Math.floor(hrs / 24)}d`
    }

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:bg-white/10"
                style={{ border: '1.5px solid var(--color-border)' }}
            >
                <Bell size={18} style={{ color: 'var(--color-text-2)' }} />
                {count > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1"
                        style={{ background: '#EF4444' }}>
                        {count > 9 ? '9+' : count}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-12 w-80 md:w-96 rounded-2xl overflow-hidden z-50 shadow-2xl"
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                    <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                            Notificações
                            {count > 0 && (
                                <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                                    style={{ background: '#EF4444' }}>{count}</span>
                            )}
                        </h3>
                        <div className="flex items-center gap-1">
                            {count > 0 && (
                                <button onClick={markAllAsRead} className="p-1.5 rounded-lg transition-colors hover:bg-slate-100" title="Marcar todas como lidas">
                                    <CheckCheck size={14} style={{ color: 'var(--color-text-3)' }} />
                                </button>
                            )}
                            {notifications.length > 0 && (
                                <button onClick={clearAll} className="p-1.5 rounded-lg transition-colors hover:bg-slate-100" title="Limpar todas">
                                    <Trash2 size={14} style={{ color: 'var(--color-text-3)' }} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center px-6">
                                <Bell size={28} className="mb-3" style={{ color: 'var(--color-text-3)' }} />
                                <p className="text-sm font-semibold" style={{ color: 'var(--color-text-2)' }}>Nenhuma notificação</p>
                            </div>
                        ) : (
                            notifications.map((n) => {
                                const { icon: Icon, color, bg } = iconMap[n.type]
                                return (
                                    <button
                                        key={n.id}
                                        onClick={() => markAsRead(n.id)}
                                        className="w-full flex items-start gap-3 p-4 text-left transition-colors hover:bg-slate-50"
                                        style={{
                                            borderBottom: '1px solid var(--color-border)',
                                            background: n.read ? undefined : 'rgba(37,99,235,0.02)',
                                        }}
                                    >
                                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg, color }}>
                                            <Icon size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text)' }}>{n.title}</p>
                                                {!n.read && <div className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--color-primary)' }} />}
                                            </div>
                                            <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--color-text-3)' }}>{n.message}</p>
                                            <p className="text-[10px] mt-1 font-medium" style={{ color: 'var(--color-text-3)' }}>{formatTime(n.createdAt)}</p>
                                        </div>
                                        {!n.read && (
                                            <Check size={14} className="shrink-0 mt-1" style={{ color: 'var(--color-text-3)' }} />
                                        )}
                                    </button>
                                )
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
