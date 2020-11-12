<template>
  <div>
    결제방법 선택 페이지
  </div>
</template>

<script>
export default {
  name: 'PayTypeSelect',
  methods: {
    nextStep(type = 'cash') {
      const routeName = type === 'cash' ? 'CashCharge' : 'CardCharge';
    },
  },
};
</script>
