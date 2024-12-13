<template>
  <div class="container_date_range">
    <div class="container_date_range_item mes">
      <el-icon style="font-size: 12px;">
        <ArrowLeft @click="prevYear" />
      </el-icon>
      <el-icon style="font-size: 20px;">
        <ArrowLeft @click="prevMonth" />
      </el-icon>
      <el-date-picker v-model="date" :clearable="false" type="month" @change="updateSelectedDate"
        :format="monthYearFormat" :locale="ptBr" :editable="false" class="custom-date-picker" />
      <el-icon style="font-size: 20px;">
        <ArrowRight @click="nextMonth" />
      </el-icon>
      <el-icon style="font-size: 12px;">
        <ArrowRight @click="nextYear" />
      </el-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { ptBr } from 'element-plus/es/locales.mjs';
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue';
import { dayjs } from 'element-plus';

const currentMonth = ref(dayjs().month() + 1);
const currentYear = ref(dayjs().year());

const date = ref(dayjs().toDate());

const updateSelectedDate = (newDate: Date) => {
  const mes = dayjs(newDate).month() + 1;
  const ano = dayjs(newDate).year();

  currentMonth.value = mes;
  currentYear.value = ano;

  emits('update:monthChange', mes, ano);
};

const emits = defineEmits<{
  (event: "update:monthChange", mes: number, ano: number): number;
}>();

const monthYearFormat = computed(() => {
  return 'MMMM YYYY';
});

const updateDate = (month: number) => {
  currentMonth.value = month;
  date.value = dayjs().year(currentYear.value).month(month - 1).toDate();
  emits('update:monthChange', month, currentYear.value);
}

const nextMonth = () => {
  let newMonth = currentMonth.value;
  if (newMonth == 12) {
    newMonth = 1;
    currentYear.value += 1;
    updateDate(newMonth)
  } else {
    newMonth = newMonth + 1
    updateDate(newMonth)
  }
};

const prevMonth = () => {
  let newMonth = currentMonth.value;
  if (newMonth == 1) {
    newMonth = 12;
    currentYear.value -= 1;
    updateDate(newMonth)
  } else {
    newMonth = newMonth - 1
    updateDate(newMonth)
  }
};


const nextYear = () => {
  const newYear = currentYear.value + 1;
  currentYear.value = newYear;
  date.value = dayjs(date.value).year(newYear).toDate();
  emits('update:monthChange', currentMonth.value, newYear);
};

const prevYear = () => {
  const newYear = currentYear.value - 1;
  currentYear.value = newYear;
  date.value = dayjs(date.value).year(newYear).toDate();
  emits('update:monthChange', currentMonth.value, newYear);
};
</script>

<style lang="scss">
.container_date_range {
  display: flex;

  .el-date-editor {
    --el-date-editor-width: 140px;
  }

  &_item {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;

    .el-icon {
      cursor: pointer;
      margin: 0 0.5rem;
    }

    .el-button {
      height: 30px;
      cursor: default;
    }

    .el-button:hover {
      background-color: #fff;
      color: #2e2e2e;
    }
  }

  .mes {
    .el-button {
      width: 120px;
    }
  }

  .el-icon {
    cursor: pointer;
  }

  .custom-date-picker .el-input {
    border: none !important;
    box-shadow: none !important;
    text-align: center !important;
  }

  .el-input__wrapper {
    border: none !important;
    box-shadow: none !important;
  }

  .custom-date-picker .el-input__inner {
    text-transform: capitalize;
    font-size: 1rem !important;
    text-align: center;
  }

  .custom-date-picker .el-input__icon {
    display: none !important;
  }
}
</style>
