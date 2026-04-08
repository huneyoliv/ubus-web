import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SuperAdminDashboard from './SuperAdminDashboard'
import { api } from '@/lib/api'

// Mocking da API
vi.mock('@/lib/api', () => ({
    api: {
        get: vi.fn()
    }
}))

describe('SuperAdminDashboard', () => {
    it('deve renderizar a tela sem quebrar ("Cannot read properties of undefined") quando a prefeitura não possuir um nome válido', async () => {
        
        // Simulando resposta da API com falha na propriedade 'nome'
        vi.mocked(api.get).mockResolvedValueOnce([
            { id: '1', nome: 'Prefeitura A', ativo: true, idGestor: null, criadoEm: '2023-01-01' },
            { id: '2', nome: null, ativo: false, idGestor: 'g1', criadoEm: '2023-01-02' }, // Nome nulo
            { id: '3', ativo: true, idGestor: null, criadoEm: '2023-01-03' } as any // Nome undefined
        ])

        render(<SuperAdminDashboard />)

        // Espera-se que o componente resolva a promise e renderize sem quebrar
        await waitFor(() => {
            expect(screen.getByText('Prefeitura A')).toBeInTheDocument()
        })
    })
})
