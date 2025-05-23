<template>
    <div
        class="min-h-screen flex items-center justify-center bg-[url(/images/staff-login.jpg)] bg-no-repeat bg-cover relative">
        <div class="w-full h-full backdrop-blur-sm bg-black/30 absolute z-0"></div>
        <div class="bg-black/40 p-8 rounded-lg shadow-lg w-full max-w-md z-10">
            <h1 class="text-2xl font-bold mb-6 text-center text-white">Restaurant Staff Login</h1>
            <form @submit.prevent="login">
                <!-- Username Input -->
                <CommonInput id="username" label="Username" type="text" v-model="form.username"
                    placeholder="Enter your username" :required="true" helperText="Your username must be unique." />

                <!-- Password Input -->
                <CommonInput id="password" label="Password" type="password" v-model="form.password"
                    placeholder="Enter your password" :required="true" helperText="Use a strong password." />
                <button type="submit"
                    class="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                    :disabled="isLoading">
                    <span v-if="!isLoading">Login</span>
                    <span v-else>
                        Logging in...
                    </span>
                </button>
                <div v-if="error && typeof error === 'object'" class="w-full h-max flex flex-col">
                    <div v-for="(msg, index) in Object.values(error)" :key="index"
                        class="mt-4 text-red-700 font-semibold text-sm text-center">
                        {{ msg }}
                    </div>
                </div>
                <div v-else class="mt-4 text-red-700 font-semibold text-sm text-center">
                    {{ error }}
                </div>
            </form>
        </div>
        <CommonLoader v-if="isLoading" prevent-interaction is-full-screen size="25px" animation-type="fade" />
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'
import { useRouter } from 'vue-router'
import { useAxios } from '@vueuse/integrations/useAxios.mjs'
import { ENDPOINTS } from '~/utils/constants/apiEndpoints'
import type { ErrorResponse, LoginResponse } from '~/utils/types/auth.type'

const { $api } = useNuxtApp()
const authStore = useAuthStore()
const router = useRouter()

definePageMeta({
    layout: false,
})

const form = reactive({
    username: '',
    password: '',
})

const error = ref<ErrorResponse>(null)


const { execute: executeLogin, isLoading } = useAxios<LoginResponse>(
    ENDPOINTS.AUTH.LOGIN,
    {
        method: 'POST',
        data: form,
    },
    $api,
    {
        immediate: false,
        initialData: { accessToken: '', user: null },
        async onSuccess(data) {
            console.log('Data Success: ', data)
            // Set token and user in the auth store
            authStore.setToken(data.accessToken)
            authStore.setUser(data.user)

            // Redirect based on role
            switch (data.user.role) {
                case 'chef':
                    await router.push('/staff/chef')
                    break
                case 'cashier':
                    await router.push('/staff/cashier')
                    break
                default:
                    console.error('Access denied. You are not from restaurant staff.')
                    await authStore.logout('dashboard')
            }
        },
        onError(err) {
            error.value = err || 'Login failed. Please try again.'
        },
    }
)

async function login() {
    try {
        await executeLogin()
    } catch (err: any) {
        error.value = err.response?.data?.message || 'Login failed. Please try again.'
        console.log(typeof error.value)
    }
}
</script>