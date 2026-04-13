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
    it('deve renderizar os principais elementos da landing page', () => {
        console.log("[DEBUG] Iniciando teste de renderizacao da Splash");
        render(
            <MemoryRouter>
                <Splash />
            </MemoryRouter>
        )

        expect(screen.getByText(/Seu aplicativo/i)).toBeInTheDocument()
        expect(screen.getByText(/de mobilidade/i)).toBeInTheDocument()
    })

    it('deve chamar navigate para /cadastro ao clicar no botao comecar', () => {
        console.log("[DEBUG] Iniciando teste de navegacao para /cadastro");
        const mockNavigate = vi.fn()
        vi.mocked(useNavigate).mockReturnValue(mockNavigate)

        render(
            <MemoryRouter>
                <Splash />
            </MemoryRouter>
        )

        const startButton = screen.getByText(/Começar agora/i)
        fireEvent.click(startButton)

        expect(mockNavigate).toHaveBeenCalledWith('/cadastro')
    })
    
    it('deve chamar navigate para /login ao clicar no botao Entrar', () => {
        console.log("[DEBUG] Iniciando teste de navegacao para /login");
        const mockNavigate = vi.fn()
        vi.mocked(useNavigate).mockReturnValue(mockNavigate)

        render(
            <MemoryRouter>
                <Splash />
            </MemoryRouter>
        )

        const loginButtons = screen.getAllByText(/Entrar/i)
        fireEvent.click(loginButtons[0])

        expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
})
