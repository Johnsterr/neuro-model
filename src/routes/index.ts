import { createRouter, createWebHistory, type Router, RouteRecordRaw } from "vue-router";
import Main from "@/components/Main.vue";
import Signals from "@/components/Signals.vue";
import NotFound from "@/components/NotFound.vue";

export const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "Main",
        component: Main,
    },
    // {
    //     path: "/signals",
    //     name: "Signals",
    //     component: Signals,
    // },
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
