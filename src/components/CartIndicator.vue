<template>
  <div>
    <div v-if="$store.state.productsLoadingFalied" class="custom-preloader__txt">Ошибка загрузки</div>
    <Preloader v-else-if="$store.state.productsLoading" class="custom-preloader" />
    <router-link  v-else class="header__cart" aria-label="Корзина с товарами" :to="{name: 'cart'}">
      <svg width="30" height="21" fill="currentColor">
        <use xlink:href="#icon-cart"></use>
      </svg>
      <span class="header__count" aria-label="Количество товаров">{{ $store.state.cartProducts.length }}</span>
    </router-link>
  </div>
</template>

<script>
import Preloader from '@/components/Preloader.vue';

export default {
  components: {Preloader,},
}
</script>

<style scoped>
  .custom-preloader {
    display: inline-block;
    position: relative;
    bottom: 43px;
    right: 20px;
}

  .custom-preloader__txt {
    color: #fff;
    font-size: 14px;
    min-width: 130px;
    font-weight: 500;
    letter-spacing: .02em;
  }
</style>
