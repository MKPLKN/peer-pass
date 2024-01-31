<template>
  <div v-if="pageLoaded">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useAuthStore } from "./stores/auth";
import router from "./router";

const authStore = useAuthStore();
const pageLoaded = ref(false);
const { ipcRenderer } = window;

onMounted(async () => {
  const { isAuthenticated } = await ipcRenderer.invoke("user/get");

  authStore.setAuthStatus(isAuthenticated);
  if (authStore.isAuthenticated) {
    router.push({ name: "Home" });
  } else {
    router.push({ name: "Auth" });
  }

  pageLoaded.value = true;
});
</script>
