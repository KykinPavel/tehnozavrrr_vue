<template>
  <main class="content container" v-if="!loadingOrderInfo">
    <Preloader />
  </main>
  <!-- <main v-else-if="loadingFaliedOrderInfo" class="content container">Не удалось загрузить...</main> -->
  <main class="content container" v-else>
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="index.html">
            Каталог
          </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="cart.html">
            Корзина
          </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <h1 class="content__title" v-if="loadingOrderInfo">
        Заказ оформлен <span>№ {{ infoOrderDate.id }}</span>
      </h1>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field" >
          <p class="cart__message">
            Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту придет письмо с&nbsp;деталями заказа.
            Наши менеджеры свяжутся с&nbsp;Вами в&nbsp;течение часа для уточнения деталей доставки.
          </p>

          <ul class="dictionary">
            <li class="dictionary__item">
              <span class="dictionary__key">
                Получатель
              </span>
              <span class="dictionary__value">
                {{ infoOrderDate.name }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Адрес доставки
              </span>
              <span class="dictionary__value">
                {{ infoOrderDate.address }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Телефон
              </span>
              <span class="dictionary__value">
                {{ infoOrderDate.phone }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Email
              </span>
              <span class="dictionary__value">
                {{ infoOrderDate.email }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Способ оплаты
              </span>
              <span class="dictionary__value">
                картой при получении
              </span>
            </li>
          </ul>
        </div>
        <div class="cart__block">
          <ul class="cart__orders">
            <li class="cart__order" v-for="product in productsOrderDate" :key="product.id">
              <h3>{{ product.product.title }}</h3>
              <b>{{ product.price | numberFormat }} ₽</b>
              <span>{{ product.id }}</span>
            </li>

          </ul>

          <div class="cart__total">
            <p>Доставка: <b>500 ₽</b></p>
            <p>Итого:
              <b>
                {{ productsOrderDate.length }}
                {{ pluralize([ 'товар', 'товара', 'товаров'], infoOrderDate.basket.items.length) }}
              </b> на сумму
              <b>
                {{ infoOrderDate.totalPrice | numberFormat }} ₽
              </b>
            </p>
          </div>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import pluralize from "@/helpers/pluralize";
import {mapMutations} from 'vuex';
import numberFormat from '@/helpers/numberFormat';
import Preloader from '@/components/Preloader.vue';

export default {
    components: {Preloader},
    data() {
      return {}
    },
    methods: {
      pluralize,
      ...mapMutations({listOrder: 'updateOrderInfo'}),
    },
    filters: {numberFormat},
    computed: {
      productsOrderDate() {
        return this.$store.state.orderInfo.basket.items;
      },
      infoOrderDate() {
        return this.$store.state.orderInfo;
      },
      loadingOrderInfo() {
        return this.$store.state.loadingOrderInfo;
      },
      loadingFaliedOrderInfo() {
        return this.$store.state.loadingFaliedOrderInfo;
      },
    },
    created() {
      if(this.$store.state.orderInfo && this.$store.state.orderInfo.id === this.$route.params.id) {
        return;
      }
      this.$store.dispatch('loadOrderInfo', this.$route.params.id);
    },
  }
</script>
