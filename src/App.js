import './App.css';
import ChatBot from './Component/ChatBot';
import ChatHistory from './Component/ChatHistory';
import { BrowserRouter, Route, Routes} from "react-router-dom";
import UploadFiles from './Component/UploadFiles';
function App() {
  
  return (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<UploadFiles/>}/>
      <Route path="/chatbot/:id" element={<ChatBot/>} />
      <Route path='/chat-history' element={<ChatHistory/>} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
