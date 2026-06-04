import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Notification {
    id: string
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    read: boolean
    createdAt: string
}

interface NotificationState {
    notifications: Notification[]
    addNotification: (n: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void
    markAsRead: (id: string) => void
    markAllAsRead: () => void
    clearAll: () => void
    unreadCount: () => number
}

export const useNotificationStore = create<NotificationState>()(
    persist(
        (set, get) => ({
            notifications: [
                {
                    id: 'welcome-1',
                    title: 'Bem-vindo ao Ubus!',
                    message: 'Seu cadastro foi realizado com sucesso. Acompanhe suas viagens por aqui.',
                    type: 'info' as const,
                    read: false,
                    createdAt: new Date().toISOString(),
                },
            ],
            addNotification: (n) => {
                console.debug('[NotificationStore] addNotification', n)
                set((state) => ({
                    notifications: [
                        {
                            id: crypto.randomUUID(),
                            read: false,
                            createdAt: new Date().toISOString(),
                            ...n,
                        },
                        ...state.notifications,
                    ].slice(0, 50),
                }))
            },
            markAsRead: (id) => {
                console.debug('[NotificationStore] markAsRead', id)
                set((state) => ({
                    notifications: state.notifications.map((n) =>
                        n.id === id ? { ...n, read: true } : n
                    ),
                }))
            },
            markAllAsRead: () => {
                console.debug('[NotificationStore] markAllAsRead')
                set((state) => ({
                    notifications: state.notifications.map((n) => ({ ...n, read: true })),
                }))
            },
            clearAll: () => {
                console.debug('[NotificationStore] clearAll')
                set({ notifications: [] })
            },
            unreadCount: () => get().notifications.filter((n) => !n.read).length,
        }),
        { name: 'ubus-notifications' }
    )
)
