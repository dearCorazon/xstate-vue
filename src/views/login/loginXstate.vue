<template>
  <a-form
    :model="formState"
    name="basic"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    autocomplete="off"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
  >
    <a-form-item
      label="用户名"
      name="username"
      :rules="[{ required: true, message: 'Please input your username!' }]"
    >
      <a-input v-model:value="formState.username" />
    </a-form-item>

    <a-form-item
      label="密码"
      name="password"
      :rules="[{ required: true, message: 'Please input your password!' }]"
    >
      <a-input-password v-model:value="formState.password" />
    </a-form-item>
    <a-form-item
      v-if="showCode"
      label="验证码"
      name="code"
      :rules="[{ required: true, message: 'Please input your code!' }]"
    >
      <a-input-password v-model:value="formState.code" />
      <img :src="codeUrl" alt="SVG Image" @click="getCodeUrl" />
    </a-form-item>
    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-button type="primary" html-type="submit">登录</a-button>
    </a-form-item>
    {{ errorStr }}
  </a-form>
</template>

<script lang='ts'>
import { useMachine } from '@xstate/vue'
import authenticationMachine from './loginMachine'
import { reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
interface FormState {
  username: string
  password: string
  remember?: boolean
  code?: string
}
const formState = reactive<FormState>({
  username: '',
  password: ''
})
export default {
  setup() {
    const { state, send } = useMachine(authenticationMachine)
    const router = useRouter()

    watch(state, (newState) => {
      if (newState.value === 'loggedIn') {
        router.push({
          name: 'home'
        })
      }
    })
    return {
      state,
      send,
      formState
    }
  }
}
</script>