import './App.css';
import SelectTheUser from './Pages/SelectTheUser';
import CoursesList from './Pages/CoursesList';
import AnalyticsReportStudent1 from './Pages/AnalyticReportStudent1'
import Start from './Pages/Start'

import { BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<SelectTheUser />} />
          <Route path="/Start" element={<Start />} />
          <Route path="/CoursesList" element={<CoursesList />} />
          <Route path="/AnalyticsReportStudent1" element={<AnalyticsReportStudent1 />} />
        </Routes>
    </BrowserRouter>  
  );
}

export default App;
