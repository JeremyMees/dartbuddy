<script setup lang="ts"></script>

<template>
  <NuxtLayout>
    <ThrowKeyboard @throw="console.log($event)" />
  </NuxtLayout>
</template>
