import axios from 'axios'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MemberConvertor } from '../Logic/membersConvertor'
import '../PagesCSS/SelectTheUser.css'

function SelectTheUser() {
  const [isOn, setIsOn] = useState(false);
  const toggleSwitch = () => setIsOn(!isOn);
  const navigate = useNavigate();
  
  return ( 
    <div className="switch-container">
      <h6 className="name-switch-container">NoSQL mode</h6>
      <span>{isOn ? "ON" : "OFF"}</span>
      <label className="switch">
        <input type="checkbox" checked={isOn} onChange={toggleSwitch} />
        <span className="slider round"></span>
      </label>
    </div>
  );
}

export default SelectTheUser;