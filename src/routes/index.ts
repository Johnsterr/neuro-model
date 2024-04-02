import { createRouter, createWebHistory, type Router, RouteRecordRaw } from "vue-router";
import Main from "@/views/Main.vue";
import GradientDescent from "@/views/GradientDescent.vue";
import NotFound from "@/views/NotFound.vue";

export const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "Main",
        component: Main,
    },
    {
        path: "/gradients",
        name: "Gradients",
        component: GradientDescent,
    },
    {
        path: "/:path(.*)",
        name: "NotFound",
        component: NotFound,
    },
];

export const router: Router = createRouter({
    history: createWebHistory(),
    routes,
});
