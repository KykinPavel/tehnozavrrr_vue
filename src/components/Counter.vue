<template>
  <div class="product__counter form__counter">
      <button type="button" href="#" :disabled="amount === 1" @click="counterDecrease">
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-minus"></use>
        </svg>
      </button>

      <input type="text" :value="amount" @input="$emit('update-amount' + $event.target.value)">

      <button type="button" href="#" :disabled="amount === NaN" @click="counterIncrease">
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-plus"></use>
        </svg>
      </button>
    </div>
</template>

<script>
  export default {
    model: {prop: 'amount', event: 'update-amount'},
    props: ['amount'],
    methods: {
      counterDecrease() {
        if (this.amount > 1) {
          this.$emit("update-amount", this.amount - 1)
        }
      },
      counterIncrease() {
        if (this.amount > -1) {
          this.$emit("update-amount", this.amount + 1)
        }
      },
    },
  }
</script>
