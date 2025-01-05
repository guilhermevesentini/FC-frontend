<template>
  <div class="login_page-frame">
    <img class="background-img" :src="background" alt="finance background">
    <slot name="body"></slot>
  </div>
</template>

<script setup lang="ts">
import background from '@/shared/assets/images/finance-background.jpg';
</script>

<style lang="scss">
.login_page-frame {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  padding: 0;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;

  .background-img {
    position: absolute;
    z-index: 0;
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;
    height: 100%;
    opacity: 0.12;
    filter: invert(0) sepia(1);
  }

  .login_form {
    width: 100%;
    height: 100vh;
    margin: 0 auto;
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;

    .return {
      margin-bottom: 0;
    }

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

    .return {
      margin-bottom: 0;
    }

    @media screen and (max-width: 600px) {
      width: 100%;
      margin: 0;

      .login_form__form {
        width: 100%;
      }
    }
  }
}
</style>