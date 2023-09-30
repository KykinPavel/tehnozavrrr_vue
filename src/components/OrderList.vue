<template>
  <div class="cart__block">
  <ul class="cart__orders">
    <li class="cart__order" v-for="item in products" :key="item.productId" :item="item">
      <h3>{{ item.product.title }}</h3>
      <b>{{ item.product.price | numberFormat }} ₽</b>
      <span>Артикул: {{ item.product.id }}</span>
    </li>
  </ul>
  <div class="cart__total">
    <p>Доставка: <b>500 ₽</b></p>
    <p>Итого:
      <b>
        {{ $store.state.cartProducts.length }}
        {{ pluralize([ 'товар', 'товара', 'товаров'], $store.state.cartProducts.length) }} на сумму
      </b>
      <b>
        {{ totalPrice | numberFormat }} ₽
      </b>
    </p>
    <button class="cart__button button button--primery" type="submit">
      Оформить заказ
    </button>
  </div>
  </div>
</template>

<script>

import pluralize from "@/helpers/pluralize";
import numberFormat from "@/helpers/numberFormat";

  export default {
    props: ['products', 'totalPrice'],
    data() {
      return {
      }
    },
    methods: {
      pluralize,
    },
    filters: {numberFormat},
  }
</script>
