<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img :src="item.product.image" width="120" height="120" alt="item.product.title">
    </div>
    <h3 class="product__title">
      {{ item.product.title }}
    </h3>
    <span class="product__code">
      Артикул: {{ item.product.id }}
    </span>

    <Counter v-model="amount" />

    <b class="product__price">
      {{ (item.amount * item.product.price) | numberFormat }} ₽
    </b>

      <div v-show="productDelete">Товар удалён из корзины</div>
      <div v-show="productDeleteSending">Удаляем товар из корзины...</div>
      <button class="product__del button-del" type="button" aria-label="Удалить товар из корзины"
      :disabled="productDeleteSending"
      @click.prevent="deleteProductToCart({productId: item.productId})">

        <svg width="20" height="20" fill="currentColor">
          <use xlink:href="#icon-close"></use>
        </svg>
      </button>
  </li>
</template>

<script>
  import numberFormat from "@/helpers/numberFormat";
  import { mapActions } from "vuex";
  import Counter from "@/components/Counter.vue";

  export default {
    components: {Counter},
    data() {
      return {
        productDelete: false,
        productDeleteSending: false,
      };
    },
    filters: {numberFormat},
    props: ['item'],
    computed: {
      amount: {
        get() {
          return this.item.amount;
        },
        set(value) {
          this.$store.dispatch('updateCartProductAmount', {productId: this.item.productId, amount: value});
        },
      },
    },
    methods: {
      ...mapActions(['deleteProductToCart']),
      deleteToCart() {
        this.productDelete = false,
        this.productDeleteSending = true,
        this.deleteProductToCart({productId: this.productId})
        .then(() => {
            this.productDelete = true;
            this.productDeleteSending = false;
        });
      },
    },
  }
</script>
