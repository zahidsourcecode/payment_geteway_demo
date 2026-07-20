<script setup lang="ts">
withDefaults(
  defineProps<{
    heightClass?: string
  }>(),
  {
    heightClass: 'h-11 w-[9rem]',
  },
)
</script>

<template>
  <img
    src="/images/bkash-logo.png"
    alt="bKash"
    :class="heightClass"
    class="object-contain object-left"
  />
</template>
