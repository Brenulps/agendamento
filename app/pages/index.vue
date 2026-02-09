<script setup lang="ts">
const id = 'page-index';
</script>

<template>
  <div :id="id" class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-8">
    <div class="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-12 max-w-2xl text-center transform hover:scale-105 transition-all duration-300">
      <h1 class="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-6">
        🎨 Tailwind CSS Ativo!
      </h1>
      
      <p class="text-gray-600 text-lg mb-8">
        Se você está vendo cores, gradientes e estilos aplicados, significa que o Tailwind está funcionando perfeitamente.
      </p>
      
      <div class="flex flex-wrap gap-4 justify-center mb-8">
        <span class="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full font-medium">Nuxt 4</span>
        <span class="px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-medium">Tailwind CSS</span>
        <span class="px-4 py-2 bg-pink-100 text-pink-700 rounded-full font-medium">TypeScript</span>
      </div>
      
      <button class="bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-pink-700 transition-all duration-300 cursor-pointer">
        Começar Projeto 🚀
      </button>
    </div>
  </div>
</template>
