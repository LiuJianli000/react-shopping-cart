import dva from 'dva';
import './index.css';
// import {createBrowserHistory as createHistory} from 'history';   // 修改下官方的写法
import indexPage from './models/indexPage'
import shoppingCart from './models/shoppingCart';

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
app.model(indexPage);
app.model(shoppingCart)

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
