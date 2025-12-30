import './App.css';
import SelectTheUser from './SelectTheUser';
import CoursesList from './CoursesList';
import AnalyticsReportStudent1 from './AnalyticReportStudent1'

import { BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/SelectTheUser" element={<SelectTheUser />} />
          <Route path="/CoursesList" element={<CoursesList />} />
          <Route path="/AnalyticsReportStudent1" element={<AnalyticsReportStudent1 />} />
        </Routes>
    </BrowserRouter>  
  );
}

export default App;
