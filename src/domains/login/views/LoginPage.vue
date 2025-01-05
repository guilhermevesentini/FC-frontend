<template>
  <LoginBase>
    <template #body>
      <el-row class="login_form" v-loading="loading">
        <el-col :xs="22" :sm="12" :md="8" :xl="6" class="login_form__form">
          <div class="header">
            <img :src="logo">
            <h1>Finance Control</h1>
          </div>
          <el-form ref="ruleFormRef" :model="formulario" :rules="rules" label-width="auto" style="max-width: 600px"
            label-position="top" class="login_form-form" status-icon>
            <el-form-item label="E-mail" prop="email">
              <el-input v-model="formulario.email" />
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
  </LoginBase>
</template>

<script setup lang="ts">
import { ElNotification, type FormInstance, type FormRules } from 'element-plus';
import { useRouter } from 'vue-router';
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import logo from "@/shared/assets/images/logo-sem-fundo.png";
import { container } from '@/inversify.config';
import type { ILoginUser, IRuleLoginForm } from '@/domains/login/types';
import { LoginPageGatewayDi, type ILoginPageGateway } from '../services/ports/LoginPageGateway';
import LoginBase from '../LoginBase.vue';

const ruleFormRef = ref<FormInstance>()
const router = useRouter()

const LoginPageGateway = container.get<ILoginPageGateway>(LoginPageGatewayDi);

const loading = ref(false);
const lembrar = ref(true);

const formulario = reactive<IRuleLoginForm>({
  email: '',
  password: ''
})

const rules = reactive<FormRules<IRuleLoginForm>>({
  email: [
    { required: true, type: "email", message: 'Por favor, digite o seu email', trigger: 'blur' },
  ],
  password: [
    {
      required: true,
      message: 'Por favor, digite a sua senha',
      trigger: 'change',
    },
    { min: 3, message: 'Deve conter de 3 a 10 caracaters', trigger: 'blur' },
  ]
});

const handleCriar = () => {
  router.push({ path: `/NovoUsuario` });
}

const handleEsqueciSenha = async () => {
  router.push({ path: `/recuperarSenha` });
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

    if (result?.statusCode != 200) {
      ElNotification({
        title: 'Error',
        message: result?.message || 'Usuário não encontrado.',
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

    const responseUsuario = await LoginPageGateway.obterUsuario(formulario.email);

    if (responseUsuario) {
      const usuario: ILoginUser = {
        id: responseUsuario.result?.id || undefined,
        email: responseUsuario.result?.email || 'email@email.com',
        username: responseUsuario.result?.username || 'Usuário',
      }

      localStorage.setItem('user', JSON.stringify(usuario));
      if (usuario.id) localStorage.setItem('customerId', usuario.id.toString());
    }

    if (lembrar.value) {
      localStorage.setItem('lembrarEmail', JSON.stringify(formulario?.email));
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

    formulario.email = info || '';

    lembrar.value = true;
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyPress);
});
</script>

<style lang="scss"></style>