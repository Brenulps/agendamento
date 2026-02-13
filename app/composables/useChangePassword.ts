import { useSupabaseClient } from '#imports';
import { useToast } from './useToast';
import { ref } from 'vue';

export function useChangePassword() {
  const supabase = useSupabaseClient();
  const { success, error: showError } = useToast();
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  async function changePassword(newPassword: string) {
    isLoading.value = true;
    error.value = null;

    try {
      const { error: supaError } = await supabase.auth.updateUser({ password: newPassword });
      if (supaError) throw supaError;

      success('Senha atualizada com sucesso');
      return true;
    } catch (err: any) {
      error.value = err instanceof Error ? err : new Error(err?.message || 'Erro ao atualizar senha');
      showError(error.value.message || 'Erro ao atualizar senha');
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    changePassword,
    isLoading,
    error,
  } as const;
}
