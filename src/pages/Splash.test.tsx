import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import Splash from './Splash'

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: vi.fn(),
    }
})

describe('Splash Component', () => {
    it('deve renderizar os principais elementos da landing page de gestão', () => {
        console.log("[DEBUG] Teste: renderizacao da Splash Gestao");
        render(
            <MemoryRouter>
                <Splash />
            </MemoryRouter>
        )

        expect(screen.getByText(/Plataforma de/i)).toBeInTheDocument()
        expect(screen.getByText(/Gestão Ubus/i)).toBeInTheDocument()
    })

    it('deve chamar navigate para /login ao clicar no botao acessar painel', () => {
        console.log("[DEBUG] Teste: navegacao para /login via botao principal");
        const mockNavigate = vi.fn()
        vi.mocked(useNavigate).mockReturnValue(mockNavigate)

        render(
            <MemoryRouter>
                <Splash />
            </MemoryRouter>
        )

        const startButton = screen.getByText(/Acessar Painel/i)
        fireEvent.click(startButton)

        expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
    
    it('deve chamar navigate para /login ao clicar no link Entrar', () => {
        console.log("[DEBUG] Teste: navegacao para /login via nav");
        const mockNavigate = vi.fn()
        vi.mocked(useNavigate).mockReturnValue(mockNavigate)

        render(
            <MemoryRouter>
                <Splash />
            </MemoryRouter>
        )

        const loginButton = screen.getByRole('button', { name: /Entrar/i })
        fireEvent.click(loginButton)

        expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
})

