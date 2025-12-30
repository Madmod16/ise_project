import axios from 'axios'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SelectTheUser.css'

function SelectTheUser() {
  const [listOfMembers, setListOfMembers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const navigate = useNavigate();

  const handleProceed = () => {
    navigate('/CoursesList', { 
      state: { selectedMember: selectedMember } 
    });
  };

  useEffect(() =>{
    axios.get("http://localhost:3001/member/members").then((resp)=>{
      setListOfMembers(resp.data)
    })
  }, [])

  const handleSelectMember = (memberId) => {
    setSelectedOption(memberId);
  };
  
  return ( 
  <div>
      <h2>Select a Member</h2>
      <div className="members-grid">
        {listOfMembers.map((member) => (
          <div
            key={member.MemberID}
            className={`member-card ${selectedOption === member.MemberID ? 'selected' : ''}`}
            onClick={() => {handleSelectMember(member.MemberID); setSelectedMember(member);}}
          >
            <h3>{member.MemberName} {member.MemberSurname}</h3>
            <p>Age: {member.MemberAge}</p>
            <p>ID: {member.MemberID}</p>
            {member.type && <span className="member-type">{member.type}</span>}
          </div>
        ))}
      </div>
      
      {selectedOption && (
        <div className="selection-info">
          <p>Selected Member ID: {selectedOption}</p>
          <button onClick={handleProceed}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
}

export default SelectTheUser;