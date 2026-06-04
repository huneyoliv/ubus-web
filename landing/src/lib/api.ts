const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.ubus.me/v1'

function getToken(): string | null {
    try {
        const stored = localStorage.getItem('ubus-auth')
        if (!stored) return null
        const parsed = JSON.parse(stored)
        return parsed?.state?.token ?? null
    } catch {
        return null
    }
}

function clearAuth() {
    try {
        const stored = localStorage.getItem('ubus-auth')
        if (stored) {
            const parsed = JSON.parse(stored)
            parsed.state = { token: null, user: null, isAuthenticated: false }
            localStorage.setItem('ubus-auth', JSON.stringify(parsed))
        }
    } catch { /* noop */ }
}

export class ApiError extends Error {
    constructor(
        public status: number,
        public statusText: string,
        public body: unknown,
    ) {
        super(`API Error ${status}: ${statusText}`)
        this.name = 'ApiError'
    }
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = getToken()
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> ?? {}),
    }
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
    })

    if (res.status === 401) {
        clearAuth()
        window.location.href = '/login'
        throw new ApiError(401, 'Unauthorized', null)
    }

    let body: unknown = null
    const text = await res.text()
    try {
        body = JSON.parse(text)
    } catch {
        body = text
    }

    if (!res.ok) {
        throw new ApiError(res.status, res.statusText, body)
    }

    return body as T
}

export const api = {
    get: <T>(path: string) => apiFetch<T>(path, { method: 'GET' }),
    post: <T>(path: string, data?: unknown) =>
        apiFetch<T>(path, { method: 'POST', body: data ? JSON.stringify(data) : undefined }),
    patch: <T>(path: string, data?: unknown) =>
        apiFetch<T>(path, { method: 'PATCH', body: data ? JSON.stringify(data) : undefined }),
    delete: <T>(path: string) => apiFetch<T>(path, { method: 'DELETE' }),
}
