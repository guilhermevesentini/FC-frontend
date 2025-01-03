<template>
  <LoginFrame>
    <template #body>
      <el-row class="login_form" v-loading="loading">
        <el-col :xs="22" :sm="12" :md="8" :xl="6" class="login_form__form">
          <div class="header">
            <img :src="logo">
            <h1>Finance Control</h1>
          </div>
          <el-form ref="ruleFormRef" :model="formulario" :rules="rules" label-width="auto" style="max-width: 600px"
            label-position="top" class="login_form-form" status-icon>
            <el-form-item label="Usuario" prop="username">
              <el-input v-model="formulario.username" />
            </el-form-item>
            <el-form-item label="Senha" prop="password">
              <el-input v-model="formulario.password" show-password />
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="lembrar" label="Lembrar email" size="small" />
            </el-form-item>
            <el-form-item class="login_form__form-esqueci">
              <el-link @click="handleCriar">Criar novo usuário</el-link>
              <el-link @click="handleEsqueciSenha">Esqueci minha senha</el-link>
            </el-form-item>
            <el-form-item>
              <el-button :loading="loading" class="login_form__form-button" type="primary"
                @keyup.enter="onSubmit(ruleFormRef)" @click="onSubmit(ruleFormRef)">Entrar</el-button>
            </el-form-item>
          </el-form>
          <h5>&copy; 2024 - Guilherme Vesentini</h5>
        </el-col>
      </el-row>
    </template>
  </LoginFrame>
</template>

<script setup lang="ts">
import { ElNotification, type FormInstance, type FormRules } from 'element-plus';
import { useRouter } from 'vue-router';
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import logo from "@/shared/assets/images/logo-sem-fundo.png";
import { container } from '@/inversify.config';
import type { ILoginUser, IRuleLoginForm } from '@/domains/login/types';
import { LoginPageGatewayDi, type ILoginPageGateway } from '../../services/login/LoginPageHttpRequest';
import LoginFrame from '../LoginFrame.vue';

const ruleFormRef = ref<FormInstance>()
const router = useRouter()

const LoginPageGateway = container.get<ILoginPageGateway>(LoginPageGatewayDi);

const loading = ref(false);
const lembrar = ref(true);

const formulario = reactive<IRuleLoginForm>({
  username: '',
  password: ''
})

const rules = reactive<FormRules<IRuleLoginForm>>({
  username: [
    { required: true, message: 'Por favor, digite o seu usuário', trigger: 'blur' },
  ],
  password: [
    {
      required: true,
      message: 'Por favor, digite a sua senha',
      trigger: 'change',
    },
    { min: 3, max: 10, message: 'Deve conter de 3 a 10 caracaters', trigger: 'blur' },
  ]
});

const handleCriar = () => {
  router.push({ path: `/NovoUsuario` });
}

const handleEsqueciSenha = async () => {
  //const result = await LoginPageGateway.obterSenha(formulario.username);

  // if (!result) {
  //   ElNotification({
  //     title: 'error',
  //     message: 'Usuário não encontrado',
  //     type: 'error',
  //     duration: 5000
  //   })
  // } else {
  //   ElNotification({
  //     title: 'Info',
  //     message: result,
  //     type: 'success',
  //     duration: 5000
  //   })
  // }
}

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      validarUsuario(formulario);
    }
  });
};

const validarUsuario = async (formulario: IRuleLoginForm) => {
  try {
    loading.value = true;

    const result = await LoginPageGateway.validarUsuario(formulario);

    if (result && result.statusCode != 200) {
      ElNotification({
        title: 'Error',
        message: result.error || 'Usuário não encontrado.',
        type: 'error',
        duration: 4000
      })

      loading.value = false;

      return
    }

    const token = result?.result || undefined;

    if (token) {
      localStorage.setItem('fctoken', token);
    }

    const responseUsuario = await LoginPageGateway.obterUsuario(formulario.username);


    if (responseUsuario) {
      const usuario: ILoginUser = {
        id: responseUsuario.result?.id || undefined,
        username: responseUsuario.result?.username || 'Usuário',
      }

      localStorage.setItem('user', JSON.stringify(usuario));
      if (usuario.id) localStorage.setItem('customerId', usuario.id.toString());
    }

    if (lembrar.value) {
      localStorage.setItem('lembrarEmail', JSON.stringify(formulario?.username));
    }

    router.push({ path: `/overview` });

    loading.value = false;
  } catch (err) {
    console.log(err)
    ElNotification({
      title: 'Erro',
      message: 'Ocorreu um erro inesperado, entre em contato com o suporte.',
      type: 'error',
      duration: 5000
    })
    loading.value = false;
  }
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    onSubmit(ruleFormRef.value);
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress);

  const hasEmail = localStorage.getItem('lembrarEmail');

  if (hasEmail) {
    const info = JSON.parse(hasEmail);

    formulario.username = info || '';

    lembrar.value = true;
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyPress);
});
</script>

<style lang="scss">
.login_form {
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;

  .login_form__form {
    padding: 2em;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    background-color: #383838;
    color: #eeeeee;
    border-radius: 10px;
    box-shadow: 7px 7px 15px 5px #818181;

    .header {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 60px;
      margin: 1rem 0;

      img {
        width: 80px;
      }

      h1 {
        text-align: left;
      }
    }


    h5 {
      text-align: center;
      color: #eeeeee;
    }

    .el-form-item--label-top .el-form-item__label {
      color: #eeeeee;
    }

    .el-link:hover {
      background: none;
    }

    .el-link__inner {
      color: #eeeeee;
    }

    .el-form-item__content {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }

    .login_form__form-button {
      width: 100%;
      height: 40px;
    }


  }

  @media screen and (max-width: 600px) {
    width: 100%;
    margin: 0;

    .login_form__form {
      width: 100%;
    }
  }
}
</style>