import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import SuperAdminDashboard from './SuperAdminDashboard'
import { api } from '@/lib/api'

vi.mock('@/lib/api', () => ({
    api: {
        get: vi.fn()
    }
}))

describe('SuperAdminDashboard', () => {
    it('deve renderizar a tela sem quebrar quando a prefeitura não possuir um nome válido', async () => {
        vi.mocked(api.get).mockResolvedValueOnce([
            { id: '1', name: 'Prefeitura A', active: true, managerId: null, createdAt: '2023-01-01' },
            { id: '2', name: null, active: false, managerId: 'g1', createdAt: '2023-01-02' },
            { id: '3', active: true, managerId: null, createdAt: '2023-01-03' } as any
        ])

        render(
            <MemoryRouter>
                <SuperAdminDashboard />
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(screen.getByText('Prefeitura A')).toBeInTheDocument()
        })
    })
})
