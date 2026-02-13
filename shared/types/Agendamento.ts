export interface Agendamento {
    id: number;
    cliente_id: number;
    profissional_id: number;
    data_hora: string;
    status: 'pendente' | 'confirmado' | 'cancelado' | 'concluido';
    observacoes?: string;
    created_at: string;
    cliente?: {
        nome: string;
        email: string;
    };
    profissional?: {
        id: number;
        users: {
            nome: string;
        };
    };
}
