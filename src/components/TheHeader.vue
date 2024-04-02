<template>
    <header class="header">
        <RouterLink class="header__link" :to="{ name: 'Main' }">Main</RouterLink>
        <RouterLink class="header__link" :to="{ name: 'Gradients' }">Gradients</RouterLink>
    </header>
</template>

<script setup lang="ts"></script>

<style scoped>
.header {
    padding: 12px 24px;
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 12px;
}
.header__link {
    padding: 8px 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
    color: rgb(0, 109, 199);
    text-decoration: none;
    transition: all 0.3s ease-in-out;
    border: 1px solid rgb(0, 109, 199);
    border-radius: 8px;
}
.header__link:hover {
    color: rgb(30, 137, 224);
    border: 1px solid rgb(30, 137, 224);
}
</style>
