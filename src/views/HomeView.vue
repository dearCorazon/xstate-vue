

<template>
  <main>
    登陆成功
    <a-button @click="logout">登出</a-button>
  </main>
</template>
<script lang="ts">
import { useRouter } from 'vue-router';

export default {
   setup() {
      const router = useRouter()

      const logout = () => {
        console.log('loggout');
        localStorage.removeItem('token')
        router.push({name:'login'})
      }
      return {
        logout
      }
   }
 
}

</script>