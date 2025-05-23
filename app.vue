<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <div class="bg-gray-100">
        <NuxtPage />
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'
import { ENDPOINTS } from '~/utils/constants/apiEndpoints'
import { type User } from '~/utils/types/user.type'

const { $api } = useNuxtApp()
const authStore = useAuthStore()
const errPrefix = 'App Setup:'

onBeforeMount(async () => {
  try {
    console.log('IsAuth and SetupCheck')
    // Call the API to fetch the user profile
    const { data } = await $api.get(ENDPOINTS.AUTH.GET_USER)

    if (!data) {
      console.error(errPrefix + ' Fetch User: empty user details got')
      throw new Error(errPrefix + ' Fetch User: empty user details got')
    }

    // Update the user in the auth store
    authStore.setUser((data as User) || null)
  } catch (error) {
    console.error('Failed to fetch user details:', error)
    authStore.logout(null, $api) // Log out the user if the request fails
    authStore.setupCheck = false // stop the setup checking the user data
    authStore.clearUserData()
  }
})

</script>