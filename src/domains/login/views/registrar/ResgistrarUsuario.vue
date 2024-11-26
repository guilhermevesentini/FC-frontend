<template>
  <LoginFrame>
    <template #body>
      <el-row class="login_registration" v-loading="loading">
        <el-col :xs="22" :sm="12" :md="8" :xl="6" class="login_registration__form">
          <div class="header">
            <img :src="logo">
            <h1>Finance Control</h1>
          </div>
          <el-form ref="ruleFormRef" :model="formulario" :rules="rules" label-width="auto" style="max-width: 600px"
            label-position="top" class="login_registration-form" status-icon>
            <el-form-item label="Usuario" prop="username">
              <el-input v-model="formulario.username" />
            </el-form-item>
            <el-form-item label="Senha" prop="password">
              <el-input v-model="formulario.password" show-password />
            </el-form-item>
            <br>
            <el-form-item>
              <el-button :loading="loading" class="login_registration__form-button" type="primary"
                @keyup.enter="onSubmit(ruleFormRef)" @click="onSubmit(ruleFormRef)">Criar</el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="login_registration__form-button return" link @click="handleVoltar">Voltar</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </template>
  </LoginFrame>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import logo from "@/shared/assets/images/logo-sem-fundo.png";
import type { IRuleLoginForm } from '../../types';
import { ElNotification, type FormInstance, type FormRules } from 'element-plus';
import LoginFrame from '../LoginFrame.vue';
import { container } from '@/inversify.config';
import { LoginPageGatewayDi, type ILoginPageGateway } from '../../services/login/LoginPageHttpRequest';
import { useRouter } from 'vue-router';

const loading = ref(false);
const ruleFormRef = ref<FormInstance>()
const router = useRouter()

const LoginPageGateway = container.get<ILoginPageGateway>(LoginPageGatewayDi);

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
        message: result.error || 'Usuário não encontrado.',
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

<style lang="scss">
.login_registration {
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;

  .login_registration__form {
    padding: 2em;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    background-color: #474747;
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

    .login_registration__form-button {
      width: 100%;
      height: 40px;
    }

    .return {
      color: #fff;
    }
  }

  @media screen and (max-width: 600px) {
    width: 100%;
    margin: 0;

    .login_registration__form {
      width: 100%;
    }
  }
}
</style>