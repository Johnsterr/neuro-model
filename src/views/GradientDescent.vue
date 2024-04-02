<script setup lang="ts">
import StartedData from "@/components/StartedData.vue";
import CurrentData from "@/components/CurrentData.vue";
</script>

<template>
    <main>
        <div class="data-wrapper">
            <StartedData />
            <CurrentData />
        </div>
        Gradients
    </main>
</template>

<style scoped>
.data-wrapper {
    display: flex;
    gap: 24px;
}
</style>
