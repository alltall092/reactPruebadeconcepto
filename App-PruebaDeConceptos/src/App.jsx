import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
//import './App.css';
import Form from './Form';
import TangleRed from './TangleRed';

function App() {


  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="red" element={<Form/>}/>
        <Route path="/" element={<TangleRed/>}/>
        
      </Routes>
    </BrowserRouter>
       
    </>
  )
}

export default App
