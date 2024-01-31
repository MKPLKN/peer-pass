<template>
  <div v-if="pageLoaded" class="max-w-lg w-full mx-auto pt-6 pb-12 px-8">
    Home page
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { usePasswordStore } from "../stores/passwords";

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  PlusIcon,
  EllipsisVerticalIcon,
  XCircleIcon,
  XMarkIcon,
  CheckCircleIcon,
} from "@heroicons/vue/20/solid";
import {
  CheckIcon,
  ExclamationTriangleIcon,
  CloudArrowUpIcon,
} from "@heroicons/vue/24/outline";

const pageLoaded = ref(true);
</script>
