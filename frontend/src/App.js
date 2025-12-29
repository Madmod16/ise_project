import logo from './logo.svg';
import './App.css';
import Select from 'react-select';
import axios from 'axios'
import { useEffect, useState } from 'react';
import SelectTheUser from './SelectTheUser';
import CoursesList from './CoursesList';
import { BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/SelectTheUser" element={<SelectTheUser />} />
          <Route path="/CoursesList" element={<CoursesList />} />
        </Routes>
    </BrowserRouter>  
  );
}

export default App;
