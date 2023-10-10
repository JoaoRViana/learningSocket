import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Room from './components/Room'

function App() {
  return (
    <div>
          <Routes>
            <Route exact path='/' element= {<Home/>}/>
            <Route path='/:id' element={<Room />}></Route>
        </Routes>
    </div>
  );
}

export default App;