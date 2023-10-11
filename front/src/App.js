import { Route, Routes,BrowserRouter } from 'react-router-dom';
import Home from './components/Home';
import Room from './components/Room'


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
              <Route exact path='/' element= {<Home/>}/>
              <Route path='/:id' element={<Room />}></Route>
          </Routes>
      </BrowserRouter>
          
    </div>
  );
}

export default App;