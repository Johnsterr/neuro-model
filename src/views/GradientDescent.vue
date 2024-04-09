<script setup lang="ts">
import { computed } from "vue";
import StartedData from "@/components/StartedData.vue";
import CurrentData from "@/components/CurrentData.vue";
import GradientsTable from "@/components/GradientsTable.vue";
import { useNeuroStore } from "@/stores/neuro";

const neuroStore = useNeuroStore();
const tableData = computed(() => neuroStore.initedData);

function gen() {
    neuroStore.learnModel(tableData.value);
}
</script>

<template>
    <main>
        <button @click="gen">click</button>
        <div class="data-wrapper">
            <StartedData />
            <CurrentData />
        </div>
        <GradientsTable />
    </main>
</template>

<style scoped>
.data-wrapper {
    display: flex;
    gap: 24px;
}
</style>
