# 카운터 앱 만들기
## 애플리케이션 상태를 모델링
### store.js
```js
import {action,computed,makeObservable,observable} from 'mobx'

export default class counterStore {
    count = 0
    constructor() {
        makeObservable(this,{
            count: observable,
            isNegative: computed,
            increase: action,
            decrease: action
        })
    }
    get isNegative() {
        return this.count < 0 ? 'Yes' : 'No'
    }
    increase() {
        this.count += 1
    }
    decrease() {
        this.count -= 1
    }
}
```
```
makeObservable

속성은 모든 객체, 배열, map과 set은 observable로 설정될 수 있습니다.
객체를 observable로 만드는 가장 기본적인 방법은 makeObservable를 사용하여 속성마다 주석을 지정하는 것입니다.
```

주석 | 설명
-- | --
observable | state를 저장하는 추적 가능한 필드를 정의
action | state를 수정하는 메서드를 표시
computed | state로부터 새로운 사실을 도출하고 그 결괏값을 캐시하는 getter를 나타냄

## 사용자 인터페이스 구축
### 인스턴스 생성
```js
// 인스턴스 생성
const store = new counterStore()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App myCounter={store} />
  </React.StrictMode>
);
```

**App.js**
```js
function App({myCounter}) {

  return (
    <div style={{textAlign: 'center', padding: 16}}>
      카운터: {myCounter.count}
      <br /> 
      <br />
      마이너스?: {myCounter.isNegative}
      <br /> 
      <br />
      <button>+</button>
      <button>-</button>
    </div>
  );
}
```
혹은
```js
function App(props) {
  const {myCounter} = props
  return (
    <div style={{textAlign: 'center', padding: 16}}>
      카운터: {myCounter.count}
      <br /> 
      <br />
      마이너스?: {myCounter.isNegative}
      <br /> 
      <br />
      <button>+</button>
      <button>-</button>
    </div>
  );
}
```

### 이벤트 발생으로 인한 Action호출
```html
<button onClick={() => myCounter.increase()}>+</button>
<button onClick={() => myCounter.decrease()}>-</button>
```

```
여기까지 하고 +버튼 혹은 -버튼을 누르면 값이 변하나?
변하지 않습니다

이유는 App 컴포넌트가 count값이 바뀌더라도 구독을 하고 있지 않기 때문입니다.

구독을하게 해주려면 observer로 감싸줘야 합니다.

observer
Observer Higher Order Component는 렌더링 중에 사용되는 모든 Observable에 React 구성요소를 자동으로 구독합니다.
결과적으로 관련 observable 항목이 변경되면 Component가 자동으로 다시 렌더링됩니다.
또한 관련 변경사항이 없을 때 Component가 다시 렌더링되지 않도록 합니다.
따라서 Component에서 엑세스할 수 있지만 실제로 읽지 않는 Observable은 다시 렌더링되지 않습니다.

이것을 사용하려면 mobx뿐 아니라 mobx-react or mobx-react-lite 라이브러리를 설치해야합니다.
```
**변경된 App.js**
```js
import { observer } from 'mobx-react';
import './App.css';

function App (props) {
  const {myCounter} = props
  console.log('myCounter', myCounter)
  return (
    <div style={{textAlign: 'center', padding: 16}}>
      카운터: {myCounter.count}
      <br /> 
      <br />
      마이너스?: {myCounter.isNegative}
      <br /> 
      <br />
      <button onClick={() => myCounter.increase()}>+</button>
      <button onClick={() => myCounter.decrease()}>-</button>
    </div>
  );
}

export default observer(App);
```

## decorator를 사용해서 counter app 만들기
### package.json파일 생성 후 아래 코드 추가
```terminal
npm init -y
```
```json
"scripts": {
    "start": "webpack-dev-server --hot --open",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "devDependencies": {
    "@babel/core": "^7.18.6",
    "@babel/plugin-proposal-class-properties": "^7.18.6",
    "@babel/plugin-proposal-decorators": "^7.18.6",
    "@babel/preset-env": "^7.18.6",
    "@babel/preset-react": "^7.18.6",
    "babel-loader": "^8.2.5",
    "babel-plugin-transform-decorators-legacy": "^1.3.5",
    "html-webpack-plugin": "^5.5.0",
    "webpack": "^5.73.0",
    "webpack-cli": "^4.10.0",
    "webpack-dev-server": "^4.9.3"
  },
  "dependencies": {
    "mobx": "^6.6.1",
    "mobx-react": "^7.5.2",
    "mobx-react-devtools": "^6.0.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
```

### 이후 npm install -f를 해주고 .babelrc파일 추가
**.babelrc**
```
{
    "presets": [
        "@babel/preset-env",
        "@babel/preset-react"
    ],
    "plugins": [
        ["@babel/plugin-proposal-decorators", {"legacy": true}],
        ["@babel/plugin-proposal-class-properties", {"loose": false}]
    ]
}
```
**webpack.config.js**
```js

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: 'development',
    // 시작점
    entry: {
        main: path.resolve(__dirname, 'src/index.js'),
    },
    // 웹팩 작업을 통해 생성된 결과물
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name][contenthash].js',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 3000,
        open: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
        })
    ]
}
```

### src/counterStore.js
```js
import {action,computed,makeObservable,observable} from "mobx"

export default class counterStore {
    @observable count = 0

    constructor() {
        makeObservable(this)
    }

    @computed  get isNegative(){
        return this.count < 0 ? 'Yes' : 'No'
    }

    @action increase() {
        this.count++
    }

    @action decrease() {
        this.count--
    }
}
```
### App.js
```js
import {observer} from "mobx-react"
import React, { Component } from 'react'

@observer
export class App extends Component {
    render() {
        const myCounter = this.props.counter;
        return (
            <div style={{ textAlign: 'center', padding: 16 }}>
                카운트: {myCounter.count}
                <br />
                <br />
                마이너스: {myCounter.isNegative}
                <br />
                <br />
                <button onClick={() => myCounter.increase()}>+</button>
                <button onClick={() => myCounter.decrease()}>-</button>
            </div>
        )
    }
}

export default App
```
### index.js
```js
import React from "react"
import {render} from "react-dom"
import App from "./App"
import counterStore from "./counterStore"

const store = new counterStore()

render (
    <div>
        <App counter={store} />
    </div>,
    document.getElementById("root")
)
```

## React Context를 이용한 Observable 공유하기
React Context는 전체하위트리와 observable를 공유하는 메커니즘입니다.

### Context & Provider
```js
import { createContext } from "react";

// Context 생성
export const CounterContext = createContext()
// Provider 생성
export const CounterProvider = CounterContext.Provider
```

### Provider
```js
<CounterContext.Provider>
    <App myCounter={store} />
</CounterContext.Provider>
```
```
이런식으로 바로 감싸줘도 됩니다. 하지만 위의 코드에 생성했듯이
생성하고 아래처럼 해주는게 좋습니다.
```
```js
<CounterProvider value={store}>
    <App />
</CounterProvider>
```

### store 사용하기
```js
function App () {
  // 이렇게 바로 가져와서 사용할 수 있음
  const myCounter = useContext(CounterContext)
}
```
**counterStore.js**
```js
import { createContext, useContext } from "react";

// Context 생성
export const CounterContext = createContext()

// Provider 생성
export const CounterProvider = CounterContext.Provider

// Store value를 사용하기 위한 Hooks
export const useCounterStore = () => useContext(CounterContext)
```

```js
import { useCounterStore } from './context/counterContext';

function App () {
  // const myCounter = useContext(CounterContext)
  const myCounter = useCounterStore()
}
```