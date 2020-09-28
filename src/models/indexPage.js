// import products from '../assets/products'

export default {
  namespace: 'indexPage',
  state: {
    products: [],  //页面渲染的数据
    originProducts: [],
    sort: 'ds',
    sizeProducts: [],
    // --------------------------
    cartData: [],  //购物车渲染的数据
    count: 0,
    sizeData: [],  //尺寸筛选出的数据(还未去重)
    newSizeData: [],   //去重的筛选数据
    subTotal: 0,   //总价
  },
  effects: {
    *fetch({ payload }, { put }) {
      const products = payload
      
      if (products) {
        yield put({
          type: 'save',
          data: products
        })

        yield put({
          type: 'saveOrigin',
          data: products
        })
      }
    },
    *selectSize({ payload }, { put }) {
      yield put({
        type: 'save',
        data: payload
      })

      yield put({
        type: 'saveSize',
        data: payload
      })
    },
    // -----------------------------------
    *handleClose({ payload }, {put}) {
      const { quantity, id, size } = payload
      yield put({
        type: 'closeBtn',
        payload: {
          quantity,
          id,
          size
        }
      })

      yield put({
        type: 'subTotal',
      })
    },
    *minusOne({ payload: { quantity, id, size } }, { put }) {
      yield put({
        type: 'countMinusOne',
        payload: {
          quantity,
          id,
          size,
        }
      })

      yield put({
        type: 'subTotal',
      })
    },
    *plusOne({ payload: { quantity, id, size } }, { put }) {
      yield put({
        type: 'countPlusOne',
        payload: {
          quantity,
          id,
          size,
        }
      })

      yield put({
        type: 'subTotal',
      })
    },
    *addToCart({ payload }, { put }) {
      yield put({
        type: 'cartData',
        payload: payload
      })

      
    },
    *saveLocalStorage({ payload }, { put }) {
      const { cartData, count, subTotal } = payload
      const storage = window.localStorage

      // 设置 localStorage
      let data = JSON.stringify(cartData)
      let _count = count
      let _subTotal = JSON.stringify(subTotal)
      storage.setItem("data", data)
      storage.setItem("count", _count)
      storage.setItem("subTotal", _subTotal)
    },
    *setStorage({}, {put}) {
      yield put ({
        type: 'storageData',
        obj: {
          data: JSON.parse(window.localStorage.data),
          _count: window.localStorage.count,
          _subTotal: JSON.parse(window.localStorage.subTotal)
        }
      })
    }
  },
  
  reducers: {
    save(state, payload) {
      let newProducts = [...payload.data]

      switch(state.sort) {
        case 'lth':
          newProducts.sort((a, b) => (a['price'] - b['price']))
          break
        case 'htl':
          newProducts.sort((a, b) => (b['price'] - a['price']))
          break
        default: 
          break
      }

      return {
        ...state,
        products: newProducts,
      }
    },
    saveOrigin(state, payload) {
      return {
        ...state,
        originProducts: payload.data,
        sizeProducts: payload.data
      }
    },
    saveSize(state, payload) {
      return {
        ...state,
        sizeProducts: payload.data,
      }
    },
    sortProducts(state, payload) {
      return {
        ...state,
        products: payload.data,
        sort: payload.sort
      }
    },
    // -------------------------------------------
    cartData(state, { payload }) {
      const { cartData } = state
      const { msg } = payload

      let num = 0;
      let count = 0
      let subTotal = 0
      cartData.forEach(item => {
        if (item.id === msg.id && item.size === msg.size) {
          item.quantity += 1;
        }
        else {
          num ++
        }
        count += item.quantity
      })

      if (cartData.length === num) {
        cartData.push({
          ...msg,
          quantity: 1
        })
        count += 1
      }

      cartData.forEach(item => {
        subTotal  = subTotal + item.price * item.quantity
      })
      
      return {
        ...state,
        cartData,
        count,
        subTotal
      }
      
    },
    countPlusOne(state, { payload: { quantity, id, size } }) {
      const { cartData } = state

      let count = 0
      cartData.forEach( item => {
        if (item.id === id && item.size === size) {
          item.quantity = quantity
        }

        count += item.quantity
      })

      return {
        ...state,
        cartData,
        count
      }
    },
    countMinusOne(state, {payload: { quantity, id, size }}) {
      const { cartData } = state

      let count = 0
      cartData.forEach( item => {
        if (item.id === id && item.size === size) {
          item.quantity = quantity
        }
        count += item.quantity
      })
      return {
        ...state,
        cartData,
        count
      }
    },
    closeBtn(state, { payload: { id, quantity, size }}) {
      const { cartData } = state
      let count = 0

      cartData.forEach(item => {
        if(item.id === id && item.size === size) {
          item.quantity = quantity
          cartData.splice(cartData.findIndex(item => item.id === id && item.size === size), 1)
        }
      })
      cartData.forEach(item => {
        count += item.quantity
      })

      return {
        ...state,
        cartData,
        count
      }
    },
    subTotal(state, payload) {
      let subTotal = 0
      state.cartData.forEach(item => {
        subTotal = subTotal + item.price * item.quantity
      })
      return {
        ...state,
        subTotal
      }

    },
    storageData(state, {obj}) {
      return {
        ...state,
        cartData: obj.data,
        count: obj._count,
        subTotal: obj._subTotal
      }
    },
    
  },
  
}