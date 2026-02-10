import { ref, computed } from 'vue'
import { useEspecialidades } from '~/composables/useEspecialidades'
import { useProfissionais } from '~/composables/useProfissionais'

export const useStats = () => {
    const { especialidades, fetchEspecialidades } = useEspecialidades()
    const { profissionais, fetchProfissionais } = useProfissionais()
    const isLoading = ref(false)

    const fetchAllData = async () => {
        isLoading.value = true
        try {
            await Promise.all([
                fetchEspecialidades(),
                fetchProfissionais()
            ])
        } finally {
            isLoading.value = false
        }
    }

    // Estatísticas agregadas
    const statsOverview = computed(() => [
        { label: 'Total Especialidades', value: especialidades.value.length, color: 'primary' },
        { label: 'Total Profissionais', value: profissionais.value.length, color: 'success' },
        { label: 'Cidades Atendidas', value: 12, color: 'warning' }, // Mockado
        { label: 'Novos este mês', value: 4, color: 'info' } // Mockado
    ])

    // Dados para gráfico de rosca: Profissionais por especialidade
    const professionalsBySpecialty = computed(() => {
        const counts: Record<string, number> = {}
        profissionais.value.forEach(p => {
            counts[p.especialidade_nome] = (counts[p.especialidade_nome] || 0) + 1
        })

        return {
            series: Object.values(counts),
            labels: Object.keys(counts)
        }
    })

    // Dados para gráfico de barras: Distribuição de Cargos
    const roleDistribution = computed(() => {
        const counts: Record<string, number> = {}
        profissionais.value.forEach(p => {
            counts[p.user_role] = (counts[p.user_role] || 0) + 1
        })

        return {
            series: [{
                name: 'Quantidade',
                data: Object.values(counts)
            }],
            categories: Object.keys(counts)
        }
    })

    return {
        isLoading,
        fetchAllData,
        statsOverview,
        professionalsBySpecialty,
        roleDistribution
    }
}
