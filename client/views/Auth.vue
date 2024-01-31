<template>
  <div class="mx-auto max-w-md">
    <div>
      <div class="block">
        <nav
          class="isolate flex divide-x divide-gray-200 rounded-lg shadow"
          aria-label="Tabs"
        >
          <a
            v-for="(tab, tabIdx) in tabs"
            href="#"
            :key="tab.name"
            @click.prevent="tabOnClick(tab)"
            :class="[
              isActiveTab(tab)
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-700',
              tabIdx === 0 ? 'rounded-l-lg' : '',
              tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '',
              'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10',
            ]"
            :aria-current="isActiveTab(tab) ? 'page' : undefined"
          >
            <span>{{ tab.name }}</span>
            <span
              aria-hidden="true"
              :class="[
                isActiveTab(tab) ? 'bg-indigo-500' : 'bg-transparent',
                'absolute inset-x-0 bottom-0 h-0.5',
              ]"
            />
          </a>
        </nav>
      </div>
    </div>

    <!-- LOGIN START -->
    <div
      v-if="activeTab.name === 'Login'"
      class="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
    >
      <div class="w-full max-w-sm space-y-10">
        <div>
          <h2
            class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
          >
            Login
          </h2>
        </div>
        <form
          class="space-y-6"
          action="#"
          method="POST"
          @submit.prevent="submitAuthUser"
        >
          <div class="relative -space-y-px rounded-md shadow-sm">
            <div
              class="pointer-events-none absolute inset-0 z-10 rounded-md ring-1 ring-inset ring-gray-300"
            />
            <div>
              <label for="username" class="sr-only">Username</label>
              <input
                v-model="login.username"
                id="username"
                name="username"
                required=""
                class="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Username"
              />
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input
                v-model="login.password"
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required=""
                class="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Password"
              />
            </div>
          </div>

          <!-- invalidLogin -->
          <div v-if="invalidLogin" class="border border-red-400 p-2 rounded-md">
            <p class="text-red-400 text-center text-sm">
              Incorrect username/password. If you have not yet created a user,
              you can do so in the "Create User" tab.
            </p>
          </div>

          <div>
            <button
              type="submit"
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- LOGIN END -->

    <!-- CREATE USER START -->
    <div
      v-if="activeTab.name === 'Create'"
      class="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
    >
      <div class="w-full max-w-sm space-y-10">
        <div>
          <h2
            class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
          >
            Create User
          </h2>
        </div>
        <form
          class="space-y-6"
          action="#"
          method="POST"
          @submit.prevent="submitCreateUser"
        >
          <div class="relative -space-y-px rounded-md shadow-sm">
            <div
              class="pointer-events-none absolute inset-0 z-10 rounded-md ring-1 ring-inset ring-gray-300"
            />
            <div>
              <label for="username" class="sr-only">Username</label>
              <input
                v-model="createUser.username"
                id="username"
                name="username"
                type="text"
                required=""
                class="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Username"
              />
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input
                v-model="createUser.password"
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required=""
                class="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Password"
              />
            </div>
            <div>
              <label for="password" class="sr-only">Confirm Password</label>
              <input
                v-model="createUser.confirmPassword"
                id="confirm-password"
                name="confirm-password"
                type="password"
                required=""
                class="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Confirm Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- CREATE USER END -->

    <!-- RESTORE USER START -->
    <div
      v-if="activeTab.name === 'Restore'"
      class="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
    >
      <div class="w-full max-w-sm space-y-10">
        <div>
          <h2
            class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
          >
            Restore User
          </h2>
          <p class="text-center text-sm text-gray-500">
            Username and password are used to encrypt the seed phrase on your
            <i><u>local filesystem.</u></i> After restoring, you can then login
            using the same username and password.
          </p>
        </div>
        <form
          class="space-y-6"
          action="#"
          method="POST"
          @submit.prevent="submitRestoreUser"
        >
          <div class="relative -space-y-px rounded-md shadow-sm">
            <div
              class="pointer-events-none absolute inset-0 z-10 rounded-md ring-1 ring-inset ring-gray-300"
            />
            <div>
              <label for="username" class="sr-only">Username</label>
              <input
                v-model="restoreUser.username"
                id="username"
                name="username"
                type="text"
                required=""
                class="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Username"
              />
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input
                v-model="restoreUser.password"
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required=""
                class="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Password"
              />
            </div>
            <div>
              <label for="password" class="sr-only">Confirm Password</label>
              <input
                v-model="restoreUser.confirmPassword"
                id="confirm-password"
                name="confirm-password"
                type="password"
                required=""
                class="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Confirm Password"
              />
            </div>
            <div>
              <label for="seed" class="sr-only">Seed phrase</label>
              <input
                v-model="restoreUser.seed"
                id="seed-phrase"
                name="seed-phrase"
                type="password"
                required="true"
                class="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Seed phrase"
              />
            </div>
          </div>

          <div v-if="errorMsg" class="border border-red-400 p-2 rounded-md">
            <p class="text-red-400 text-center text-sm">
              {{ errorMsg }}
            </p>
          </div>

          <div>
            <button
              type="submit"
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Restore User
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- RESTORE USER END -->
  </div>

  <!-- SHOW SEED MODAL START -->
  <TransitionRoot as="template" :show="openSeedModal">
    <Dialog as="div" class="relative z-10">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full max-w-sm sm:p-6"
            >
              <div>
                <div class="text-left">
                  <DialogTitle
                    as="h3"
                    class="text-base font-semibold leading-6 text-gray-900 mb-2"
                  >
                    Backup Your Seed Phrase
                  </DialogTitle>
                  <div
                    class="text-left text-indigo-700 text-sm font-semibold rounded-xl shadow-md p-4 bg-indigo-100"
                  >
                    {{ seed }}
                  </div>
                  <p class="text-left text-red-700 text-sm my-4">
                    Note, after this modal is closed, your seed phrase will
                    never be shown again. If you delete the encrypted file
                    created with the username and password you provided, your
                    data will be lost forever. Additionally, you risk losing
                    your data if you or someone else on the same device creates
                    a new user with the same username. Backing up your seed
                    phrase is extremely important.
                  </p>
                </div>
              </div>

              <div class="flex items-end justify-end">
                <button
                  v-if="canCloseSeedModal"
                  type="button"
                  class="mt-3 inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mt-0 w-auto"
                  @click="attemptToCloseSeedModal()"
                  ref="cancelButtonRef"
                >
                  Close
                </button>

                <p
                  v-if="!canCloseSeedModal && countdown > 0"
                  class="text-gray-700 text-sm"
                >
                  You can close this modal after {{ countdown }} seconds...
                </p>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
  <!-- SHOW SEED MODAL END -->
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.js";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { CheckIcon, ExclamationTriangleIcon } from "@heroicons/vue/24/outline";

const router = useRouter();
const authStore = useAuthStore();
const { ipcRenderer } = window;

const tabs = ref([
  { name: "Login", href: "#", current: false },
  { name: "Create", href: "#", current: false },
  { name: "Restore", href: "#", current: false },
]);

const activeTab = ref();
const login = ref({ username: "", password: "" });
const createUser = ref({ username: "", password: "", confirmPassword: "" });

setActiveTab("Login");
function setActiveTab(name = "Login") {
  activeTab.value = tabs.value.find((t) => t.name === name);
}
function isActiveTab(tab) {
  return tab.name === activeTab.value.name;
}
function tabOnClick(tab) {
  setActiveTab(tab.name);
}

const invalidLogin = ref(false);
const submitAuthUser = async () => {
  const response = await ipcRenderer.invoke("auth/login", {
    ...login.value,
  });

  if (response.success) {
    invalidLogin.value = false;
    authStore.setAuthStatus(true);
    router.push({ name: "Home" });
  } else {
    invalidLogin.value = true;
    authStore.setAuthStatus(false);
  }
};

const seed = ref(null);
const canCloseSeedModal = ref(false);
const countdown = ref(10);
const openSeedModal = ref(false);
function attemptToOpenSeedModal() {
  openSeedModal.value = true;

  const counter = setInterval(() => {
    if (countdown.value <= 0) {
      canCloseSeedModal.value = true;
      clearInterval(counter);
    } else {
      countdown.value -= 1;
    }
  }, 1000);
}
function attemptToCloseSeedModal() {
  // When the modal is closed -> clear seed, set auth status and redirect
  openSeedModal.value = false;
  seed.value = null;
  authStore.setAuthStatus(true);
  router.push({ name: "Home" });
}
const submitCreateUser = async () => {
  const response = await ipcRenderer.invoke("user/create", {
    ...createUser.value,
  });

  if (response.success) {
    // Open modal, and show the seed inside the modal
    seed.value = response.seed;
    attemptToOpenSeedModal();
  } else {
    authStore.setAuthStatus(false);
  }
};

const restoreUser = ref({});
const errorMsg = ref(null);
const submitRestoreUser = async () => {
  const response = await ipcRenderer.invoke("auth/restore", {
    ...restoreUser.value,
  });

  if (response.success) {
    authStore.setAuthStatus(true);
    router.push({ name: "Home" });
  } else {
    errorMsg.value = response?.error?.message || null;
    authStore.setAuthStatus(false);
  }
};
</script>
