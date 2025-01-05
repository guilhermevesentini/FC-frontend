<template>
  <LoginBase>
    <template #body>
      <el-row class="login_form" v-loading="loading">
        <el-col :xs="22" :sm="12" :md="8" :xl="6" class="login_form__form">
          <div class="header">
            <img :src="logo">
            <h1>Finance Control</h1>
          </div>
          <div style="margin: 10px 0 20px;">
            <el-alert title="Enviamos uma nova senha no seu email cadastrado." type="warning" :closable="false" />
          </div>
          <el-form ref="ruleFormRef" :model="formulario" :rules="rules" label-width="auto" style="max-width: 600px"
            label-position="top" class="login_form-form" status-icon>
            <el-form-item label="E-mail" prop="email">
              <el-input v-model="formulario.email" />
            </el-form-item>
            <br>
            <el-form-item>
              <el-button :loading="loading" class="login_form__form-button" type="primary"
                @keyup.enter="onSubmit(ruleFormRef)" @click="onSubmit(ruleFormRef)">Enviar</el-button>
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
import type { IRecuperarSenha } from '../types';
import { ElNotification, type FormInstance, type FormRules } from 'element-plus';
import { container } from '@/inversify.config';
import { useRouter } from 'vue-router';
import { LoginPageGatewayDi, type ILoginPageGateway } from '../services/ports/LoginPageGateway';
import LoginBase from '../LoginBase.vue';

const loading = ref(false);
const ruleFormRef = ref<FormInstance>()
const router = useRouter()

const LoginPageGateway = container.get<ILoginPageGateway>(LoginPageGatewayDi);

const formulario = reactive<IRecuperarSenha>({
  email: '',
})

const rules = reactive<FormRules<IRecuperarSenha>>({
  email: [
    { required: true, type: "email", message: 'Por favor, digite o seu email', trigger: 'blur' },
  ]
});

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      recuperar(formulario);
    }
  });
};

const recuperar = async (formulario: IRecuperarSenha) => {
  try {
    loading.value = true;

    const result = await LoginPageGateway.recuperarSenha({ email: formulario.email });

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
      message: 'Recuperação de senha bem sucedida',
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