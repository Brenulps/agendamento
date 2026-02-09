import { useSupabaseClient, useSupabaseUser, navigateTo } from '#imports';
import { useToast } from './useToast';

export function useAuth() {
    const supabase = useSupabaseClient();
    const user = useSupabaseUser();
    const { success, error } = useToast();
    const isLoading = ref(false);

    async function login(email: string, password: string) {
        isLoading.value = true;
        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            success('Login realizado com sucesso!', 'Bem-vindo');
            await navigateTo('/');
        } catch (e: any) {
            error(e.message || 'Ocorreu um erro ao fazer login', 'Erro');
        } finally {
            isLoading.value = false;
        }
    }

    async function logout() {
        isLoading.value = true;
        try {
            const { error: authError } = await supabase.auth.signOut();

            if (authError) throw authError;

            success('Sessão encerrada com sucesso', 'Até logo');
            await navigateTo('/login');
        } catch (e: any) {
            error(e.message || 'Ocorreu um erro ao sair', 'Erro');
        } finally {
            isLoading.value = false;
        }
    }

    return {
        user,
        isLoading,
        login,
        logout,
    };
}
