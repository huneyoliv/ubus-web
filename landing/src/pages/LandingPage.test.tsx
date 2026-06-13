import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import LandingPage from './LandingPage'

describe('LandingPage Component', () => {
    it('deve renderizar os principais elementos da landing page institucional', () => {
        render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        )

        expect(screen.getAllByText(/Impulsione o crescimento/i)[0]).toBeInTheDocument()
        expect(screen.getByText(/Veja seus negócios claramente/i)).toBeInTheDocument()
        expect(screen.getAllByText(/Começar Agora/i)[0]).toBeInTheDocument()
    })

    it('deve renderizar as seções de recursos e planos', () => {
        render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        )

        expect(screen.getByText(/Acompanhe suas metas/i)).toBeInTheDocument()
        expect(screen.getByText(/Entenda seu saldo/i)).toBeInTheDocument()
        expect(screen.getByText(/Plano Iniciante/i)).toBeInTheDocument()
        expect(screen.getByText(/Plano Enterprise/i)).toBeInTheDocument()
    })
})
