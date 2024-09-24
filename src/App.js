import './App.css';
import ChatBot from './Component/ChatBot';
import ChatHistory from './Component/ChatHistory';
import { BrowserRouter, Route, Routes} from "react-router-dom";
import Home from './Component/Home';
import Login from './Component/Login/Login';
import Signup from './Component/SignUp/Signup';
import ForgotPassword from './Component/Login/ForgotPassword';
import OTPVerification from './Component/Login/OTPVerification';
import CreateNewPassword from './Component/Login/CreateNewPassword ';
import PasswordChanged from './Component/Login/PasswordChanged';
import UploadFiles from './Component/UploadFiles';
import PdfImages from './Component/PdfImages';
import Profile from './Component/Profile';
function App() {
  
  return (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/chat' element={<UploadFiles/>}/>
      <Route path="/chatbot/:id" element={<ChatBot/>} />
      <Route path='/chat-history' element={<ChatHistory/>} />
      <Route  path='/login' element={<Login/>} />
      <Route path='/signup' element={<Signup/>} />
      <Route path='/reset_password' element={<ForgotPassword/>} />
      <Route path='/verify-otp' element={<OTPVerification/>} />
      <Route path='/create-new-password' element={<CreateNewPassword/>} />
      <Route path='password-changed-successfully' element={<PasswordChanged/>} />
      <Route path='/images' element={<PdfImages/>} />
      <Route path='/profile-update' element={<Profile/>} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
