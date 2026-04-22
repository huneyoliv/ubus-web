import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import { useAuthStore } from '../store/useAuthStore'
import { api } from '../lib/api'

vi.mock('../store/useAuthStore', () => ({
    useAuthStore: vi.fn((selector) => {
        const state = {
            token: null,
            user: null,
            isAuthenticated: false,
            setAuth: vi.fn(),
            logout: vi.fn(),
        }
        return selector ? selector(state) : state
    }),
}))

vi.mock('../lib/api', () => ({
    api: {
        post: vi.fn(),
    },
}))

describe('Restrição de Autenticação e Acesso', () => {
    let mockSetAuth: any

    beforeEach(() => {
        vi.clearAllMocks()
        mockSetAuth = vi.fn()
        vi.mocked(useAuthStore).mockImplementation((selector: any) => {
            const state = {
                isAuthenticated: true,
                user: { role: 'MANAGER' },
                setAuth: mockSetAuth,
                logout: vi.fn()
            }
            return selector ? selector(state) : state
        })
    })

    it('deve impedir login de estudante e exibir mensagem de erro', async () => {
        console.log('[DEBUG] Teste: impedindo login de role STUDENT')
        
        vi.mocked(useAuthStore).mockImplementation((selector: any) => {
            const state = {
                setAuth: mockSetAuth
            }
            return selector ? selector(state) : state
        })

        vi.mocked(api.post).mockResolvedValue({
            accessToken: 'token-fake',
            user: { role: 'STUDENT', name: 'Estudante Teste' }
        })

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        )

        const submitButton = screen.getByRole('button', { name: /Acessar plataforma/i })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText(/Acesso restrito apenas para administradores e gestores/i)).toBeInTheDocument()
        })
        expect(mockSetAuth).not.toHaveBeenCalled()
    })

    it('deve permitir login de gestor e redirecionar', async () => {
        console.log('[DEBUG] Teste: permitindo login de role MANAGER')
        
        vi.mocked(api.post).mockResolvedValue({
            accessToken: 'token-fake',
            user: { role: 'MANAGER', name: 'Gestor Teste' }
        })

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        )

        const submitButton = screen.getByRole('button', { name: /Acessar plataforma/i })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(mockSetAuth).toHaveBeenCalledWith('token-fake', expect.objectContaining({ role: 'MANAGER' }))
        })
    })

    it('deve redirecionar role STUDENT para login ao tentar acessar Dashboard', () => {
        console.log('[DEBUG] Teste: redirecionando STUDENT do Dashboard')
        
        vi.mocked(useAuthStore).mockImplementation((selector: any) => {
            const state = {
                isAuthenticated: true,
                user: { role: 'STUDENT' }
            }
            return selector ? selector(state) : state
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


