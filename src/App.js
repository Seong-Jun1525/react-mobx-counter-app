import { observer } from 'mobx-react';
import './App.css';
import { useCounterStore } from './context/counterContext';

function App () {
  // const myCounter = useContext(CounterContext)
  const myCounter = useCounterStore()
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