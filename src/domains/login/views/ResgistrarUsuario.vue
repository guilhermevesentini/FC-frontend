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
            <el-form-item label="Nome do usuário" prop="username">
              <el-input v-model="formulario.username" />
            </el-form-item>
            <el-form-item label="E-mail" prop="email">
              <el-input v-model="formulario.email" />
            </el-form-item>
            <el-form-item label="Senha" prop="password">
              <el-input v-model="formulario.password" show-password />
            </el-form-item>
            <br>
            <el-form-item>
              <el-button :loading="loading" class="login_form__form-button" type="primary"
                @keyup.enter="onSubmit(ruleFormRef)" @click="onSubmit(ruleFormRef)">Criar</el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="login_form__form-button" type="secondary" plain @click="handleVoltar">Voltar</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </template>
  </LoginBase>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import logo from "@/shared/assets/images/logo-sem-fundo.png";
import type { IRuleLoginForm } from '../types';
import { ElNotification, type FormInstance, type FormRules } from 'element-plus';
import { container } from '@/inversify.config';
import { useRouter } from 'vue-router';
import { LoginPageGatewayDi, type ILoginPageGateway } from '../services/ports/LoginPageGateway';
import LoginBase from '../LoginBase.vue';

const loading = ref(false);
const ruleFormRef = ref<FormInstance>()
const router = useRouter()

const LoginPageGateway = container.get<ILoginPageGateway>(LoginPageGatewayDi);

const formulario = reactive<IRuleLoginForm>({
  username: '',
  email: '',
  password: ''
})

const rules = reactive<FormRules<IRuleLoginForm>>({
  username: [
    { required: true, message: 'Por favor, digite o seu usuário', trigger: 'blur' },
  ],
  email: [
    { required: true, type: "email", message: 'Por favor, digite o seu email', trigger: 'blur' },
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

    const result = await LoginPageGateway.cadastrarNovoUsuario(formulario);


    if (result && result.statusCode != 200) {
      ElNotification({
        title: 'Error',
        message: result.message || 'Usuário não encontrado.',
        type: 'error',
        duration: 4000
      })

      loading.value = false;

      return
    }


    ElNotification({
      title: 'Success',
      message: 'Usuário criado com sucesso.',
      type: 'success',
      duration: 5000
    })

    router.push({ path: `/login` });

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

const handleVoltar = () => {
  router.push({ path: `/login` });
}
</script>
