<template>
  <el-dialog v-bind="$attrs" title="Alterar senha" width="400">
    <el-row class="dialog-alterar-senha" v-loading="loading">
      <el-col :span="24">
        <el-form ref="ruleFormRef" :model="formulario" :rules="rules" label-width="auto" style="max-width: 600px"
          label-position="top" class="login_registration-form" status-icon>
          <el-form-item label="Senha Atual" prop="senhaAtual">
            <el-input v-model="formulario.senhaAtual" show-password />
          </el-form-item>
          <el-form-item label="Nova Senha" prop="novaSenha">
            <el-input v-model="formulario.novaSenha" show-password />
          </el-form-item>
          <el-form-item label="Confirmar senha" prop="confirmarSenha">
            <el-input v-model="formulario.confirmarSenha" show-password />
          </el-form-item>
          <br>
          <el-form-item>
            <el-button :loading="loading" class="login_registration__form-button" type="primary" style="width: 100%;"
              @keyup.enter="onSubmit(ruleFormRef)" @click="onSubmit(ruleFormRef)">Enviar</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script setup lang="ts">
import { LoginPageGatewayDi, type ILoginPageGateway } from '@/domains/login/services/ports/LoginPageGateway';
import type { IAlterarForm } from '@/domains/login/types';
import { container } from '@/inversify.config';
import { ElNotification, type FormInstance, type FormRules } from 'element-plus';
import { reactive, ref } from 'vue';

const loading = ref(false);
const ruleFormRef = ref<FormInstance>()

const LoginPageGateway = container.get<ILoginPageGateway>(LoginPageGatewayDi);

const formulario = reactive<IAlterarForm>({
  senhaAtual: '',
  novaSenha: '',
  confirmarSenha: '',
})

const rules = reactive<FormRules<IAlterarForm>>({
  senhaAtual: [
    { required: true, message: 'Digite sua senha atual', trigger: 'blur' },
  ],
  novaSenha: [
    { required: true, message: 'Digite sua nova senha', trigger: 'blur' },
  ],
  confirmarSenha: [
    {
      required: true,
      message: 'Digite sua senha de confirmação',
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (value === formulario.novaSenha) {
          callback();
        } else {
          callback(new Error('A senha de confirmação não coincide com a nova senha'));
        }
      }
    }
  ]
});

const emits = defineEmits<{
  (event: "handleFechar"): void;
}>();

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      alterarSenha(formulario);
    }
  });
};

const alterarSenha = async (formulario: IAlterarForm) => {
  try {
    loading.value = true;

    const storage = localStorage.getItem('user');
    const userEmail = storage ? JSON.parse(storage).email : {};

    if (!userEmail) return ElNotification({
      title: 'Error',
      message: 'Houve ao obter informações do usuário',
      type: 'error',
      duration: 4000
    })

    const result = await LoginPageGateway.alterarSenha({ email: userEmail, senha: formulario.senhaAtual, novaSenha: formulario.novaSenha });

    if (result && result.statusCode != 200) {
      ElNotification({
        title: 'Error',
        message: result.message || 'Houve um erro ao alterar a senha',
        type: 'error',
        duration: 4000
      })

      loading.value = false;

      return
    }

    ElNotification({
      title: 'Success',
      message: 'Senha alterada com sucesso',
      type: 'success',
      duration: 5000
    })

    emits('handleFechar')

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

</script>

<style lang="scss" scoped></style>