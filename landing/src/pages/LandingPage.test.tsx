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

        expect(screen.getByText(/Gerencie sua frota/i)).toBeInTheDocument()
        expect(screen.getByText(/Otimize rotas, reduza custos/i)).toBeInTheDocument()
        expect(screen.getAllByText(/Solicitar Demonstração/i).length).toBeGreaterThan(0)
    })

    it('deve renderizar as seções de recursos principais', () => {
        render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        )

        expect(screen.getByText(/Acompanhe sua frota/i)).toBeInTheDocument()
        expect(screen.getByText(/Otimize seus custos/i)).toBeInTheDocument()
        expect(screen.getByText(/Alertas em tempo real/i)).toBeInTheDocument()
    })
})
