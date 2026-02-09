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
            // Adicione suas tabelas aqui conforme seu schema do Supabase
            // Exemplo:
            // users: {
            //   Row: {
            //     id: string
            //     email: string
            //     created_at: string
            //   }
            //   Insert: {
            //     id?: string
            //     email: string
            //     created_at?: string
            //   }
            //   Update: {
            //     id?: string
            //     email?: string
            //     created_at?: string
            //   }
            // }
        }
        Views: {
            // Adicione suas views aqui
        }
        Functions: {
            // Adicione suas functions aqui
        }
        Enums: {
            // Adicione seus enums aqui
        }
    }
}
