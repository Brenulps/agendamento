<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useStats } from '~/composables/useStats';
import { 
  PhChartLineUp, 
  PhUsers, 
  PhBriefcase, 
  PhBuildings,
  PhTrendUp
} from '@phosphor-icons/vue';

const { 
  isLoading, 
  fetchAllData, 
  statsOverview, 
  professionalsBySpecialty, 
  roleDistribution 
} = useStats();

onMounted(() => {
  fetchAllData();
});

// Opções do Gráfico de Rosca
const donutOptions = ref({
  chart: {
    type: 'donut',
    fontFamily: 'Inter, sans-serif'
  },
  colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
  stroke: { show: false },
  legend: { position: 'bottom' },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total',
            formatter: (w: any) => w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0)
          }
        }
      }
    }
  }
});

// Opções do Gráfico de Barras
const barOptions = ref({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    fontFamily: 'Inter, sans-serif'
  },
  colors: ['#3b82f6'],
  plotOptions: {
    bar: {
      borderRadius: 10,
      columnWidth: '50%',
      distributed: false,
    }
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: [],
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  grid: {
    borderColor: '#f1f1f1',
    strokeDashArray: 4,
    yaxis: { lines: { show: true } }
  }
});

// Gráfico de Área (Monitoramento - Mockado)
const areaSeries = ref([{
  name: 'Acessos',
  data: [31, 40, 28, 51, 42, 109, 100]
}]);

const areaOptions = ref({
  chart: {
    type: 'area',
    toolbar: { show: false },
    fontFamily: 'Inter, sans-serif'
  },
  colors: ['#3b82f6'],
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 2 },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.45,
      opacityTo: 0.05,
      stops: [20, 100, 100, 100]
    }
  },
  xaxis: {
    categories: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"],
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  grid: {
    borderColor: '#f1f1f1',
    strokeDashArray: 4
  }
});
</script>

<template>
  <div class="p-8 min-h-screen bg-neutral-50/50">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-neutral-900 font-sans">Estatísticas Operacionais</h1>
      <p class="mt-1 text-neutral-500 font-sans">Métricas e indicadores de desempenho do seu sistema.</p>
    </div>

    <!-- Overview Cards -->
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <div 
        v-for="stat in statsOverview" 
        :key="stat.label"
        class="p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm hover:shadow-md transition-all group"
      >
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm font-semibold text-neutral-500 font-sans uppercase tracking-wider">{{ stat.label }}</p>
          <div :class="`p-2 rounded-xl bg-primary-50 text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-colors`">
            <PhTrendUp :size="18" weight="bold" />
          </div>
        </div>
        <div class="flex items-baseline gap-2">
          <p class="text-3xl font-bold text-neutral-900 font-sans">{{ stat.value }}</p>
          <span class="text-xs text-success-600 font-bold font-sans">+12%</span>
        </div>
      </div>
    </div>

    <!-- Charts Row 1 -->
    <div class="grid gap-8 lg:grid-cols-2 mb-8">
      <!-- Donut Chart Card -->
      <div class="p-8 bg-white border border-neutral-200 rounded-3xl shadow-sm">
        <div class="flex items-center gap-3 mb-8">
          <div class="p-3 bg-primary-50 text-primary-600 rounded-2xl">
            <PhBriefcase :size="24" weight="fill" />
          </div>
          <div>
            <h3 class="font-bold text-neutral-900">Distribuição por Especialidade</h3>
            <p class="text-xs text-neutral-400">Total de profissionais em cada área</p>
          </div>
        </div>
        
        <div class="h-[300px] flex items-center justify-center">
          <ClientOnly>
            <apexchart 
              v-if="!isLoading && professionalsBySpecialty.series.length > 0"
              width="100%" 
              height="300"
              :options="donutOptions" 
              :series="professionalsBySpecialty.series"
              :labels="professionalsBySpecialty.labels"
            />
            <div v-else-if="isLoading" class="flex flex-col items-center gap-2">
              <div class="w-12 h-12 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin"></div>
              <span class="text-xs text-neutral-400">Carregando dados...</span>
            </div>
            <div v-else class="text-neutral-300 flex flex-col items-center">
              <PhBriefcase :size="48" weight="thin" />
              <span class="text-sm mt-2">Sem dados disponíveis</span>
            </div>
          </ClientOnly>
        </div>
      </div>

      <!-- Bar Chart Card -->
      <div class="p-8 bg-white border border-neutral-200 rounded-3xl shadow-sm">
        <div class="flex items-center gap-3 mb-8">
          <div class="p-3 bg-success-50 text-success-600 rounded-2xl">
            <PhUsers :size="24" weight="fill" />
          </div>
          <div>
            <h3 class="font-bold text-neutral-900">Nível dos Usuários</h3>
            <p class="text-xs text-neutral-400">Distribuição de cargos cadastrados</p>
          </div>
        </div>

        <div class="h-[300px]">
          <ClientOnly>
            <apexchart 
              v-if="!isLoading && roleDistribution.series[0].data.length > 0"
              width="100%" 
              height="300"
              :options="{ ...barOptions, xaxis: { ...barOptions.xaxis, categories: roleDistribution.categories } }" 
              :series="roleDistribution.series"
            />
            <div v-else-if="isLoading" class="flex flex-col items-center gap-2 justify-center h-full">
              <div class="w-10 h-10 bg-neutral-100 rounded-lg animate-pulse"></div>
            </div>
          </ClientOnly>
        </div>
      </div>
    </div>

    <!-- Charts Row 2 -->
    <div class="grid gap-8 mb-8">
      <div class="p-8 bg-white border border-neutral-200 rounded-3xl shadow-sm">
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-3">
            <div class="p-3 bg-info-50 text-info-600 rounded-2xl">
              <PhChartLineUp :size="24" weight="fill" />
            </div>
            <div>
              <h3 class="font-bold text-neutral-900">Atividade do Sistema</h3>
              <p class="text-xs text-neutral-400">Volume de acessos nos últimos 7 dias</p>
            </div>
          </div>
          <div class="flex gap-2">
            <span class="px-3 py-1 bg-neutral-100 text-neutral-600 text-[10px] font-bold rounded-lg tracking-wider uppercase">Relatório Semanal</span>
          </div>
        </div>

        <div class="h-[300px]">
          <ClientOnly>
            <apexchart 
              width="100%" 
              height="300"
              :options="areaOptions" 
              :series="areaSeries"
            />
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.apexcharts-canvas) {
  margin: 0 auto;
}
:deep(.apexcharts-tooltip) {
  border-radius: 12px !important;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1) !important;
  border: 1px solid #f1f1f1 !important;
}
</style>
