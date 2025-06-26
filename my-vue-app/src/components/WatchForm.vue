<template>
  <form @submit.prevent="submitForm">
    <input v-model="watch.name" placeholder="Watch Name" required />
    <input v-model="watch.brand" placeholder="Brand" required />
    <input v-model="watch.price" placeholder="Price" type="number" required />
    <button type="submit">{{ isEditing ? "Update" : "Add" }} Watch</button>
  </form>
</template>

<script setup>
import { ref, watchEffect } from 'vue'

const props = defineProps(['watchData', 'onSave'])
const emit = defineEmits(['onSave'])

const watch = ref({ name: '', brand: '', price: '' })
const isEditing = ref(false)

watchEffect(() => {
  if (props.watchData) {
    watch.value = { ...props.watchData }
    isEditing.value = true
  }
})

function submitForm() {
  emit('onSave', { ...watch.value })
  watch.value = { name: '', brand: '', price: '' }
  isEditing.value = false
}
</script>
