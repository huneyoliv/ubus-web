import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import { useAuthStore } from '@/store/useAuthStore'

describe('Restrição de Autenticação e Acesso', () => {
    beforeEach(() => {
        useAuthStore.setState({
            token: null,
            user: null,
            isAuthenticated: false
        })
        vi.restoreAllMocks()
        vi.unstubAllGlobals()
    })

    afterEach(() => {
        vi.restoreAllMocks()
        vi.unstubAllGlobals()
    })

    it('deve impedir login de estudante e exibir mensagem de erro', async () => {
        const mockFetch = vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            text: () => Promise.resolve(JSON.stringify({
                accessToken: 'token-fake',
                user: { role: 'STUDENT', name: 'Estudante Teste' }
            }))
        })
        vi.stubGlobal('fetch', mockFetch)

        const { container } = render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        )

        const form = container.querySelector('form')
        fireEvent.submit(form!)

        await waitFor(() => {
            expect(screen.getByText(/Acesso restrito apenas para administradores e gestores/i)).toBeInTheDocument()
        })

        expect(mockFetch).toHaveBeenCalled()
        expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })

    it('deve permitir login de gestor e redirecionar', async () => {
        const mockFetch = vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            text: () => Promise.resolve(JSON.stringify({
                accessToken: 'token-fake',
                user: { role: 'MANAGER', name: 'Gestor Teste' }
            }))
        })
        vi.stubGlobal('fetch', mockFetch)

        const { container } = render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        )

        const form = container.querySelector('form')
        fireEvent.submit(form!)

        await waitFor(() => {
            expect(useAuthStore.getState().token).toBe('token-fake')
            expect(useAuthStore.getState().user?.role).toBe('MANAGER')
        })

        expect(mockFetch).toHaveBeenCalled()
    })

    it('deve redirecionar role STUDENT para login ao tentar acessar Dashboard', () => {
        useAuthStore.setState({
            isAuthenticated: true,
            user: { role: 'STUDENT', name: 'Estudante Teste' } as any
        })

        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/login" element={<div>Página de Login</div>} />
                </Routes>
            </MemoryRouter>
        )

        expect(screen.getByText(/Página de Login/i)).toBeInTheDocument()
    })
})
