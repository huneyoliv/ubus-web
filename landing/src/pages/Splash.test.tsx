import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Splash from './Splash'

describe('Splash Component', () => {
    it('deve renderizar os principais elementos da landing page institucional', () => {
        render(
            <MemoryRouter>
                <Splash />
            </MemoryRouter>
        )

        expect(screen.getByText(/Revolucione a Gestão/i)).toBeInTheDocument()
        expect(screen.getByText(/Mobilidade Inteligente & Sustentável/i)).toBeInTheDocument()
        expect(screen.getByText(/Solicitar Demonstração/i)).toBeInTheDocument()
    })

    it('deve renderizar as seções de público-alvo', () => {
        render(
            <MemoryRouter>
                <Splash />
            </MemoryRouter>
        )

        expect(screen.getByText(/Para Passageiros/i)).toBeInTheDocument()
        expect(screen.getByText(/Para Motoristas/i)).toBeInTheDocument()
        expect(screen.getByText(/Para Gestores/i)).toBeInTheDocument()
    })
})
