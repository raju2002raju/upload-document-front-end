import './App.css';
import ChatBot from './Component/ChatBot';
import ChatHistory from './Component/ChatHistory';
import { BrowserRouter, Route, Routes} from "react-router-dom";
import Home from './Component/Home';




function App() {
  const fileName = 'Lorem_ipsum.pdf';
  return (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path="/chatbot/:id" element={<ChatBot/>} />
      <Route path='/chat-history' element={<ChatHistory fileName={fileName} />} />
  
    </Routes>
  </BrowserRouter>
  );
}

export default App;
