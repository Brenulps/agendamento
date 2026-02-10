export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    name: string | null
                    email: string
                    role: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    name?: string | null
                    email: string
                    role?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string | null
                    email?: string
                    role?: string | null
                    created_at?: string
                }
            }
            especialidade: {
                Row: {
                    id: number
                    especialidade: string | null
                    created_at: string
                }
                Insert: {
                    id?: number
                    especialidade?: string | null
                    created_at?: string
                }
                Update: {
                    id?: number
                    especialidade?: string | null
                    created_at?: string
                }
            }
            profissionais: {
                Row: {
                    id: number
                    user_id: string | null
                    especialidade_id: number | null
                    created_at: string
                }
                Insert: {
                    id?: number
                    user_id?: string | null
                    especialidade_id?: number | null
                    created_at?: string
                }
                Update: {
                    id?: number
                    user_id?: string | null
                    especialidade_id?: number | null
                    created_at?: string
                }
            }
        }
        Views: {
            view_profissionais: {
                Row: {
                    profissional_id: number
                    profissional_created_at: string
                    user_id: string
                    user_name: string
                    user_email: string
                    user_role: string
                    especialidade_id: number
                    especialidade_nome: string
                }
            }
        }
        Functions: {
            add_especialidade: {
                Args: {
                    p_especialidade: string
                }
                Returns: {
                    success: boolean
                    message: string
                }
            }
            edit_especialidade: {
                Args: {
                    p_id: number
                    p_especialidade: string
                }
                Returns: {
                    success: boolean
                    message: string
                }
            }
            delete_especialidade: {
                Args: {
                    p_id: number
                }
                Returns: {
                    success: boolean
                    message: string
                }
            }
            get_view_profissionais: {
                Args: Record<PropertyKey, never>
                Returns: {
                    profissional_id: number
                    profissional_created_at: string
                    user_id: string
                    user_name: string
                    user_email: string
                    user_role: string
                    especialidade_id: number
                    especialidade_nome: string
                }[]
            }
        }
        Enums: {
            [_ in never]: never
        }
    }
}
