<template>
  <main class="content container">
    <div class="content__top content__top--catalog">
      <h1 class="content__title" >
        Каталог
      </h1>
      <span class="content__info">
        152 товара
      </span>
    </div>
    <div class="content__catalog">
      <ProductFilter :price-from.sync="filterPriceFrom"
      :price-to.sync="filterPriceTo"
      :category-id.sync="filterCategoryId"
      :color-id.sync="filterColorId"/>
      <section class="catalog">
      <div v-if="productsLoadingFalied">Произошла ошибка при загрузке товаров
        <button @click.prevent="loadProducts">Попробовать ещё раз</button>
      </div>
      <Preloader v-if="productsLoading" class="custom-preloader"/>
    <ProductList :products="products"/>
    <BasePagination v-model="page" :count="countProducts" :per-page="productsPerPage"/>
  </section>
    </div>
  </main>
</template>

<script>
  import ProductList from "@/components/ProductList.vue"
  import BasePagination from "@/components/BasePagination.vue"
  import ProductFilter from "@/components/ProductFilter.vue"
  import axios from 'axios'
  import {API_BASE_URL} from "@/config";
  import Preloader from '@/components/Preloader.vue';

  export default {
    components: {ProductList, BasePagination, ProductFilter, Preloader},
    data() {
      return {
        filterPriceFrom: 0,//цена от
        filterPriceTo: 0,//цена до
        filterCategoryId: 0,// id категории
        filterColorId: 0,// id цвета
        page: 1,
        productsPerPage: 3,
        productsData: null,
        productsLoading: false,
        productsLoadingFalied: false,
      }
    },
    computed: {
      products() {
        return this.productsData
        ? this.productsData.items
        .map(product => {
          return {
            ...product,
            image: product.image.file.url
          }
        })
        : [];
      },
      countProducts() {
        return this.productsData ? this.productsData.pagination.total : 0;
      },
    },
    methods: {
      loadProducts() {
        this.productsLoading = true;
        this.productsLoadingFalied = false;
        clearTimeout(this.loadProductsTimer);
        this.loadProductsTimer = setTimeout(() => {
          return axios
            .get(API_BASE_URL + `/api/products`, {
              params: {
                page: this.page,
                limit: this.productsPerPage,
                categoryId: this.filterCategoryId,
                minPrice: this.filterPriceFrom,
                maxPrice: this.filterPriceTo,
                colorId: this.filterColorId,
              }
            })
        .then(response => this.productsData = response.data)// загружаем товары
        .catch(() => this.productsLoadingFalied = true)// если не загрузились
        .then(() => this.productsLoading = false)// ждём результат загрузки
        }, 0);
      }
    },
    watch: {
      page() {
        this.loadProducts();
      },
      filterPriceFrom() {
        this.loadProducts();
      },
      filterPriceTo() {
        this.loadProducts();
      },
      filterCategoryId() {
        this.loadProducts();
      },
      filterColorId() {
        this.loadProducts();
      },
    },
    created() {
      this.loadProducts();
    }
  }
</script>

<style scoped>
  .custom-preloader {
    position: relative;
    top: 26px;
    left: 393px;
  }
</style>
