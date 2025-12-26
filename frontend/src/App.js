import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import { useEffect, useState } from 'react';

function App() {
  const [listOfMembers, setListOfMembers] = useState([]);

  useEffect(() =>{
    axios.get("http://localhost:3001/member").then((resp)=>{
      setListOfMembers(resp.data)
    })
  }, [])

  return (
    <div className="App">
     {
      listOfMembers.map((value, key) => {
        return <div className="member">
          <div className="id">
            {value.MemberID}
          </div>
          <div className="id">
            {value.MemberName}
          </div>
        </div>
      })
     }
    </div>
  );
}

export default App;
