/* ── Enums alinhados ao backend ── */

export type RoleUsuario = 'SUPER_ADMIN' | 'GESTOR' | 'MOTORISTA' | 'LIDER' | 'ALUNO' | 'CARONISTA'
export type StatusCadastro = 'PENDENTE' | 'APROVADO' | 'REJEITADO'
export type DirecaoViagem = 'IDA' | 'VOLTA'
export type StatusViagem = 'AGENDADA' | 'ABERTA_PARA_RESERVA' | 'EM_ANDAMENTO' | 'FINALIZADA' | 'CANCELADA'
export type StatusReserva = 'CONFIRMADA' | 'PRESENTE' | 'FALTOU' | 'CANCELADA_SISTEMA' | 'EXCESSO'

/* ── User (como armazenado no store, baseado na resposta do login) ── */

export interface User {
    id: string
    name: string
    email: string
    cpf: string
    role: RoleUsuario
    municipalityId: string
    phone?: string
    defaultRouteId?: string
}

/* ── Prefeitura / Município ── */

export interface Prefeitura {
    id: string
    nome: string
    ativo: boolean
}

/* ── Linha (Rota) ── */

export interface Linha {
    id: string
    nome: string
    descricao?: string
}

/* ── Ônibus ── */

export interface Onibus {
    id: string
    numero: string
    placa?: string
    capacidade: number
    idMotorista?: string
}

/* ── Viagem ── */

export interface Trip {
    idViagem: string
    dataViagem: string
    turno: string
    direcao: DirecaoViagem
    status: StatusViagem
    idLinha: string
    idOnibus: string
    idMotorista?: string
    capacidadeReal: number
    aberturaVotacao: string
    fechamentoVotacao: string
    lideresIds?: string[]
    linha?: Linha
    onibus?: Onibus
}

/* ── Reserva ── */

export interface Reservation {
    id: string
    idViagem: string
    idUsuario: string
    numeroAssento?: number | null
    status: StatusReserva
    isCarona: boolean
    createdAt?: string
    usuario?: { id: string; nome: string; cpf: string }
    viagem?: Trip
}

/* ── Seat (para o mapa de assentos) ── */

export interface Seat {
    number: number
    status: 'available' | 'occupied' | 'selected'
}

/* ── Login / Register DTOs ── */

export interface LoginPayload {
    email: string
    password: string
}

export interface LoginResponse {
    accessToken: string
    user: User
}

export interface RegisterPayload {
    municipalityId: string
    cpf: string
    name: string
    email: string
    password: string
    phone?: string
    role?: RoleUsuario
    priorityLevel?: number
    defaultRouteId?: string
    needsWheelchair?: boolean
    photoUrl?: string
    gradeFileUrl?: string
    residenciaFileUrl?: string
}

/* ── Reservation DTOs ── */

export interface CreateReservationPayload {
    tripId: string
    seatNumber?: number | null
    rideShare?: boolean
}

/* ── Backend Response Types ── */

/** Estrutura retornada pelo backend em GET /reservations/minhas */
export interface BackendReservationResponse {
    reserva: {
        id: string
        idViagem: string
        idUsuario: string
        numeroAssento: number | null
        isCarona: boolean
        status: StatusReserva
        criadoEm: string
    }
    viagem: Trip
}

/** Mapeia a resposta do backend para o formato esperado pelo frontend */
export function mapBackendReservation(item: BackendReservationResponse): Reservation {
    return {
        id: item.reserva.id,
        idViagem: item.reserva.idViagem,
        idUsuario: item.reserva.idUsuario,
        numeroAssento: item.reserva.numeroAssento,
        isCarona: item.reserva.isCarona,
        status: item.reserva.status,
        createdAt: item.reserva.criadoEm,
        viagem: item.viagem,
    }
}
