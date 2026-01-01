import axios from 'axios'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MemberConvertor } from '../Logic/membersConvertor'
import '../PagesCSS/SelectTheUser.css'

function SelectTheUser() {
  const [listOfMembers, setListOfMembers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [noSQLMode, setNoSQLMode] = useState(null);
  const navigate = useNavigate();

  const handleProceed = () => {
    navigate('/CoursesList', { 
      state: { selectedMember: selectedMember } 
    });
  };

  useEffect(() =>{
    axios.get("http://localhost:3001/mongodb/check").then((resp)=>{
      setNoSQLMode(resp.data)
    })
  }, [])

  useEffect(() =>{
    console.log("The NoSQL mode is not used")
    if(noSQLMode){
      axios.get("http://localhost:3001/mongodb/mongoMember").then((resp)=>{
      const convertedData = MemberConvertor(resp.data);
      setListOfMembers(convertedData)
      console.log("The NoSQL mode is used")
    })}
    else{
      axios.get("http://localhost:3001/member/members").then((resp)=>
      {
      setListOfMembers(resp.data)
        console.log("The NoSQL mode is not used")
    })}

  }, [noSQLMode])

  const handleSelectMember = (memberId) => {
    setSelectedOption(memberId);
  };
  
  return ( 
  <div className="member-selection-container">
  <h2 className="selection-title">Select a Member</h2>
  
  <div className="members-grid">
    {listOfMembers.map((member) => (
      <div
        key={member.MemberID}
        className={`member-card ${selectedOption === member.MemberID ? 'selected' : ''}`}
        onClick={() => {
          handleSelectMember(member.MemberID);
          setSelectedMember(member);
        }}
      >
        <div className="member-avatar">
          <span className="avatar-initials">
            {member.MemberName.charAt(0)}{member.MemberSurname.charAt(0)}
          </span>
        </div>
        
        <div className="member-info">
          <h3 className="member-name">
            {member.MemberName} {member.MemberSurname}
          </h3>
          <div className="member-details">
            <span className="detail-item">
              <svg className="icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" />
              </svg>
              Age {member.MemberAge}
            </span>
            <span className="detail-item">
              <svg className="icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" />
              </svg>
              ID: {member.MemberID}
            </span>
          </div>
          {member.type && (
            <span className={`member-type-badge ${member.type.toLowerCase()}`}>
              {member.type}
            </span>
          )}
        </div>
        
        <div className="selection-indicator">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    ))}
  </div>
  
  {selectedOption && (
    <div className="selection-info">
      <div className="selection-content">
        <div className="selection-icon">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" />
          </svg>
        </div>
        <div className="selection-text">
          <p className="selection-label">Selected Member</p>
          <p className="selection-id">ID: {selectedOption}</p>
        </div>
        <button className="continue-btn" onClick={handleProceed}>
          Continue
          <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )}
</div>
  );
}

export default SelectTheUser;