import './App.css';
import io from 'socket.io-client';

const socket = io.connect("http://localhost:3001");

function App() {

  const sendMessage = () =>{
    socket.emit()
  }
  return (
    <div className="App">
      <input placeholder="Message">
      </input>
      <button>Send message</button>
    </div>
  );
}

export default App;
