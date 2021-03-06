import React from 'react'
import styles from './FloatCart.css'
import { Drawer, Icon, Button } from 'antd';
import FloatCartList from '../components/FloatCardList'
import { connect } from 'dva'

@connect(({ shoppingCart }) => ({
  cartData: shoppingCart.cartData,
  count: shoppingCart.count,
  subTotal: shoppingCart.subTotal
}))
class FloatCart extends React.Component {

  state = {
    visible: false,
  };

  componentWillMount() {
    const {dispatch} = this.props
    dispatch({
      type: 'shoppingCart/setStorage'
    })
  }

  componentDidUpdate(prevProps) {
    const { cartData, count, subTotal, dispatch } = this.props
    const storage = window.localStorage

    // 设置 localStorage
    let data = JSON.stringify(cartData)
    let _count = count
    let _subTotal = JSON.stringify(subTotal)
    storage.setItem("data", data)
    storage.setItem("count", _count)
    storage.setItem("subTotal", _subTotal)

    dispatch({
      type: 'shoppingCart/saveLocalStorage',
      payload: {
        cartData,
        count,
        subTotal
      }
    })
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  handleCheckout = () => {
    alert(`Checkout - Subtotal: $ ${this.props.subTotal.toFixed(2)}`)
  }

  render() {
    const { cartData, count, subTotal } = this.props
    
    const icon = (
      <div style={{ display: 'flex', width: '110px', margin: '0 auto' }}>
        <div style={{ width: '60px', height: '60px', textAlign: 'center', position: 'relative' }}>
          <Icon type="shopping-cart" style={{ color: 'white', fontSize: '40px', lineHeight: '60px' }} />
          <div style={{ position: 'absolute', top: 32, left: 33, color: 'black', fontSize: '5px', height: '18px', width: '18px', borderRadius: '9px', background: 'darkgoldenrod', lineHeight: '18px' }}>
            {count}
          </div>
        </div>
        <span style={{ color: 'white', fontSize: '24px', lineHeight: '55px' }}>
          Cart
        </span>
      </div>
    )
    const bottom = (
      <div style={{ borderTop: '1px solid white', height: '160px', width: '450px', bottom: 0, position: 'fixed', background: '#333', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
          <p style={{ margin: 0 }}>SUBTOTAL</p>
          <div style={{}}>
            <p style={{ margin: 0, color: 'darkgoldenrod', fontSize: '24px' }}>${subTotal.toFixed(2)}</p>
            <p style={{ margin: 0 }}>OR UP TO 3 x $ {(subTotal / 3).toFixed(2)}</p>
          </div>
        </div>
        <Button
          block
          style={{ borderRadius: 0, background: '#222', color: 'white', fontSize: '20px', border: 'none', height: '40px', lineHeight: '40px', marginTop: '20px' }}
          onClick={this.handleCheckout}
        >
          CHECKOUT
        </Button>
      </div>
    )
    const empty = (
      <div style={{ height: '160px' }}>

      </div>
    )

    return (
      <div>
        <div type="primary" onClick={this.showDrawer} className={styles.open}>
          <Icon type="shopping-cart" className={styles.open_icon} />
          <div className={styles.open_count}>{count || 0}</div>
        </div>
        <Drawer
          title={icon}
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          width={'450px'}
          drawerStyle={{ position: 'relative', background: '#333', }}
          headerStyle={{ background: '#333', padding: '20px' }}
          bodyStyle={{ background: '#333', padding: 0 }}
        >
          {cartData.map((item, key) => (<FloatCartList data={item} key={key} />))}
          {empty}
          {bottom}
        </Drawer>
      </div>
    );
  }
}

export default FloatCart