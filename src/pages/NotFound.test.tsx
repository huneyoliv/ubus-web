import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import NotFound from './NotFound'

// Mocking the useNavigate hook
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: vi.fn(),
    }
})

describe('NotFound Component', () => {
    it('deve renderizar a página 404 corretamente', () => {
        render(
            <MemoryRouter>
                <NotFound />
            </MemoryRouter>
        )

        expect(screen.getByText('404')).toBeInTheDocument()
        expect(screen.getByText('Página não encontrada')).toBeInTheDocument()
        expect(screen.getByText('O caminho que você está procurando não existe ou foi movido.')).toBeInTheDocument()
        expect(screen.getByText('Voltar')).toBeInTheDocument()
    })

    it('deve chamar navigate(-1) ao clicar no botão "Voltar"', () => {
        const mockNavigate = vi.fn()
        vi.mocked(useNavigate).mockReturnValue(mockNavigate)

        render(
            <MemoryRouter>
                <NotFound />
            </MemoryRouter>
        )

        const backButton = screen.getByText('Voltar')
        fireEvent.click(backButton)

        expect(mockNavigate).toHaveBeenCalledWith(-1)
    })
})
