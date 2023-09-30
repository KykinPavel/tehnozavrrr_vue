<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="index.html">
            Каталог
          </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Корзина
          </a>
        </li>
      </ul>

      <h1 class="content__title">
        Корзина
      </h1>
      <span class="content__info">
        {{ $store.state.cartProducts.length }}
        {{ pluralize([ 'товар', 'товара', 'товаров'], $store.state.cartProducts.length) }}
      </span>
    </div>

    <section class="cart">
      <div v-if="$store.state.productsLoadingFalied">Произошла ошибка при загрузке товаров</div>
      <Preloader v-if="$store.state.productsLoading"/>
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <ul class="cart__list">
            <CartItem v-for="item in products" :key="item.productId" :item="item"/>
          </ul>
        </div>

        <div class="cart__block">
          <p class="cart__desc">
            Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
          </p>
          <p class="cart__price">
            Итого: <span>{{ totalPrice | numberFormat}} ₽</span>
          </p>

          <router-link v-if="existProduct" tag="button" :to="{name: 'order'}"
          class="cart__button button button--primery" type="submit">
            Оформить заказ
          </router-link>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import numberFormat from "@/helpers/numberFormat";
import pluralize from "@/helpers/pluralize";
import {mapGetters} from 'vuex';
import CartItem from "@/components/CartItem.vue";
import Counter from "@/components/Counter.vue";
import Preloader from '@/components/Preloader.vue';

export default {
  data() {
    return {
      // productsLoad: false,
    };
  },
  filters: {numberFormat},
  methods: {pluralize,},
  components: {CartItem, Counter, Preloader},
  computed: {
    ...mapGetters({products: 'cartDetailProducts', totalPrice: 'cartTotalPrice'}),
    existProduct() {return this.products.length},//если длинна продуктового массива есть, то включаем кнопку
  },
}
</script>

<style>
  .lds-ring {
    display: inline-block;
    position: relative;
    top: 14%;
    left: 40%;
    width: 18%;
    height: 17%;
}
</style>
