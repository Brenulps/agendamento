<script setup lang="ts">
import { PhLightning, PhChecks, PhUsers, PhChatCircleText } from '@phosphor-icons/vue';

interface Props {
  title: string;
  time: string;
  color?: 'blue' | 'purple' | 'green' | 'orange' | 'pink';
  avatars?: string[];
  type?: 'meeting' | 'design' | 'dev' | 'sprint';
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue',
  avatars: () => [],
  type: 'meeting'
});

const colorClasses = {
  blue: 'bg-blue-50 border-blue-100 text-blue-700',
  purple: 'bg-purple-50 border-purple-100 text-purple-700',
  green: 'bg-emerald-50 border-emerald-100 text-emerald-700',
  orange: 'bg-orange-50 border-orange-100 text-orange-700',
  pink: 'bg-pink-50 border-pink-100 text-pink-700'
};

const icon = computed(() => {
  switch (props.type) {
    case 'meeting': return PhChatCircleText;
    case 'design': return PhLightning;
    case 'dev': return PhChecks;
    case 'sprint': return PhUsers;
    default: return PhLightning;
  }
});
</script>

<template>
  <div 
    class="event-card absolute inset-x-1.5 inset-y-1.5 p-3 rounded-2xl border flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 z-10 cursor-pointer group"
    :class="colorClasses[color]"
  >
    <div>
      <div class="flex items-center gap-1.5 mb-1">
        <component :is="icon" :size="14" weight="bold" class="opacity-70" />
        <h4 class="text-[11px] font-bold leading-tight">{{ title }}</h4>
      </div>
      <p class="text-[9px] font-medium opacity-60">{{ time }}</p>
    </div>
    
    <div class="flex items-center justify-between mt-2">
      <div class="flex -space-x-1.5">
        <template v-for="(avatar, i) in avatars.slice(0, 3)" :key="i">
          <img :src="avatar" class="w-5 h-5 rounded-full border border-white" alt="Avatar" />
        </template>
        <div v-if="avatars.length > 3" class="w-5 h-5 rounded-full bg-white/50 border border-white flex items-center justify-center text-[8px] font-bold">
          +{{ avatars.length - 3 }}
        </div>
      </div>
      
      <div class="opacity-0 group-hover:opacity-100 transition-opacity">
        <PhChecks :size="14" weight="bold" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.event-card {
  height: calc(100% - 12px);
}
</style>
