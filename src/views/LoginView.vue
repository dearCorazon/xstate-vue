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
      :rules="[{required: true, message: 'Please input your username!' }]"
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
      <img :src="codeUrl" alt="SVG Image" @click="getCodeUrl">

    </a-form-item>
    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-button type="primary" html-type="submit">登录</a-button>
    </a-form-item>
    {{errorStr}}
  </a-form>                                

</template>

<script lang='ts'>
import { useMachine } from '@xstate/vue';
import { createMachine } from 'xstate';
import { onMounted, reactive, Ref, ref, watch } from 'vue';

import { login, getCode, checkIsLogin, verify} from './api'
import { useRouter } from 'vue-router';

interface FormState {
  username: string;
  password: string;
  remember?: boolean;
  code?:string
}


const toggleMachine = createMachine({
  id: 'toggle',
  initial: 'inactive',
  states: {
    inactive: {
      on: { TOGGLE: 'active' }
    },
    active: {
      on: { TOGGLE: 'inactive' }
    }
  }
});
const formState = reactive<FormState>({
      username: '',
      password: '',
      
});
export default {
 
  setup() {
    const times = ref(0);
    const countdown = ref(times.value);
    const timerStarted = ref(false);

    const errorM = reactive({
      type:'',
      num:0
    })
    const errorStr = ref('')
   
    watch([errorM,countdown], ([newV,newCount]) => {
      if(newV.type=== '用户名或密码错误') {
        errorStr.value = `用户名或密码错误,还剩${newV.num}次机会`
      }
      if(newV.type=== '账户已锁定') {
        times.value = newV.num
        errorStr.value = `账户已锁定,还剩${newCount}秒`
      }
    })
    watch(times, (newValue) => {
      console.log(`times：${newValue}`);
      countdown.value = newValue;
      if (newValue !== 0 && !timerStarted.value) {
        startCountdown();
        timerStarted.value = true
      }
    });
    const startCountdown = () => {
      console.log('定时器启动');
      const timer = setInterval(() => {
        countdown.value--
        if (countdown.value === 0) {
          clearInterval(timer);
          timerStarted.value = false
        }
      }, 1000);
    };
    const router = useRouter()
    const showCode =  ref(false)
    const codeUrl:Ref<string> = ref('')
  
    const getCodeUrl = () => {
      getCode().then(res => {
        codeUrl.value  = `data:image/svg+xml,${encodeURIComponent(res.data)}`;
      })
      
    }
    const test = async () => {
      await checkIsLogin(localStorage['token']).then(res => {
          router.push({
            name: 'home'
          })
      }).catch(err => {
        console.log('无token');
      })
      
    }
    onMounted(async () =>  {
      await test()
      await getCodeUrl()
    })
    const onFinish = (values: any) => {
      const {username,password, code } = values
      login(username,password,code).then( res => {
        localStorage.setItem('token',res.data?.access_token)
        console.log('登录成功',localStorage['token'])
        router.push({name:'home'})
      })
      .catch(err => {
        console.log('登录失败');
        errorM.type = err.response.data.error.type
        errorM.num = err.response.data.error.times
        console.log(errorM);
        showCode.value = true
      })
    };
    
    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    };
    const verifyCode = () => {
      console.log(formState.code)
      verify(formState.code)
    }
    const { state, send } = useMachine(toggleMachine);
    return {
      state,
      send,
      formState,
      onFinish,
      onFinishFailed,
      showCode,
      codeUrl,
      verifyCode,
      getCodeUrl,
      countdown,
      startCountdown,
      errorStr
    };
  }
};
</script>