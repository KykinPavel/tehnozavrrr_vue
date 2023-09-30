import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import { API_BASE_URL } from '@/config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cartProducts: [],
    userAccessKey: null,
    cartProductsData: [],
    productsLoading: false,// спинер выключен
    productsLoadingFalied: false,// ошибка загрузки выключена
    orderInfo: null,
    loadingOrderInfo: false,// спинер OrderInfo выключен
    loadingFaliedOrderInfo: false,// ошибка загрузки OrderInfo выключена
  },
  mutations: {
    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },
    resetCart(state){
      state.cartProducts = [];
      state.cartProductsData = [];
    },
    updateCartProductAmount(state, {productId, amount}) {
      const item = state.cartProducts.find(item => item.productId === productId);
      if(item) {
        item.amount = amount;
      }
    },
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },
    updateCartProductsData(state, items) {
      state.cartProductsData = items;
    },
    syncCartProducts(state) {
      state.cartProducts = state.cartProductsData.map(item => {
        return {
          productId: item.product.id,
          amount: item.quantity
        }
      });
    },
    productsLoadingOff(state) {//вызывается в action и отключает спинер
      state.productsLoading = false;
    },
    productsLoadingOn(state) {//вызывается в action и включает спинер
      state.productsLoading = true;
    },
    productsLoadingFaliedOff(state) {//вызывается в action и отключает ошибку загрузки товаров
      state.productsLoadingFalied = false;
    },
    productsLoadingFaliedOn(state) {//вызывается в action и включает ошибку загрузки товаров
      state.productsLoadingFalied = true;
    },

    loadingOrderInfoOff(state) {
      state.loadingOrderInfo = false;
    },
    loadingOrderInfoOn(state) {
      state.loadingOrderInfo = true;
    },
    loadingFaliedOrderInfoOff(state) {
      state.loadingFaliedOrderInfo = false;
    },
    loadingFaliedOrderInfoOn(state) {
      state.loadingFaliedOrderInfo = true;
    },
  },
  getters: {
    cartDetailProducts(state) {
      return state.cartProducts.map(item => {
        const product = state.cartProductsData.find(p => p.product.id === item.productId).product;
        return {
          ...item,
          product: {
            ...product,
            image: product.image.file.url
          }
        }
      });
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailProducts.reduce((acc, item) => (item.product.price * item.amount) + acc, 0);
    }
  },
  actions: {
    loadOrderInfo(context, orderId) {
      context.commit('loadingOrderInfoOn');// включаем мутацию, которая включает спинер
      context.commit('loadingFaliedOrderInfoOff');// включаем мутацию, которая включает ошибку
      return axios
      .get(API_BASE_URL + '/api/orders/' + orderId, {
        params: {userAccessKey: context.state.userAccessKey}
      })
      .then(response => {
        context.commit('updateOrderInfo', response.data);
        this.loadingOrderInfo = false;
      })
      .catch(() => {
        context.commit('loadingOrderInfoOff');// включаем мутацию, которая выключает спинер
        context.commit('loadingFaliedOrderInfoOn');// включаем мутацию, которая включает ошибку
      })
    },
    loadCart(context) {
      context.commit('productsLoadingOn');// включаем мутацию, которая включает спинер
      context.commit('productsLoadingFaliedOff');// включаем мутацию, которая включает ошибку
      return axios
        .get(API_BASE_URL + '/api/baskets', {
          params: {
            userAccessKey: context.state.userAccessKey
          }
        })
        .then(response => {
          if(!context.state.userAccessKey) {
            localStorage.setItem('userAccessKey', response.data.user.accessKey);
            context.commit('updateUserAccessKey', response.data.user.accessKey);
            this.productsLoading = false;
          }
          context.commit('updateCartProductsData', response.data.items);
          context.commit('syncCartProducts');
          context.commit('productsLoadingOff');// включаем мутацию, которая выключает спинер
        })
        .catch(() => {
          context.commit('productsLoadingOff');// включаем мутацию, которая выключает спинер
          context.commit('productsLoadingFaliedOn');// включаем мутацию, которая включает ошибку
        })
    },
    addProductToCart(context, {productId, amount}) {// добавление
      return (new Promise(resolve => setTimeout(resolve, 2000)))
      .then(() => {
        return axios
        .post(API_BASE_URL + '/api/baskets/products', {
          productId: productId,
          quantity: amount,
        }, {
          params: {
            userAccessKey: context.state.userAccessKey
          }
        })
        .then(response => {
          context.commit('updateCartProductsData', response.data.items);
          context.commit('syncCartProducts');
        })
      })
    },
    deleteProductToCart(context, {productId}) {// удаление
      return (new Promise(resolve => setTimeout(resolve, 2000)))
        .then(() => {
          return axios
            .delete(API_BASE_URL + '/api/baskets/products', {
              params: {userAccessKey: context.state.userAccessKey},
              data: {productId}
            })
            .then(response => {
              context.commit('updateCartProductsData', response.data.items);
              context.commit('syncCartProducts');
            })
        })
    },
    updateCartProductAmount(context, {productId, amount}) {
      context.commit('updateCartProductAmount', {productId, amount});
      if (amount < 1) {
        return;
      }
      return axios
          .put(API_BASE_URL + '/api/baskets/products', {
            productId: productId,
            quantity: amount,
          }, {
            params: {
              userAccessKey: context.state.userAccessKey
            }
          })
          .then(response => {
            context.commit('updateCartProductsData', response.data.items);
          })
          .catch(() => {
            context.commit('syncCartProducts');
          })
    }
  },
  computed: {
    amount: {
        get() {
            return this.item.amount;
        },
        set(value) {
            this.$store.commit('updateCartProductAmount', {
                productId: this.item.productId,
                amount: value,
            });
        },
    },
},
});
