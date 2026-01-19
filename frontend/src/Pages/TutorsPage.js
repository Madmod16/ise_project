import axios from "axios";
import {useEffect, useState} from "react";
import {ProgramConvertor} from "../Logic/programsConvertor";
import {useLocation, useNavigate} from "react-router-dom";


const [listOfPrograms, setlistOfProgram] = useState([]);
const [selectedOption, setSelectedOption] = useState(null);
const [selectedTutor, setSelectedTutor] = useState(null);
const [successMessage, setSuccessMessage] = useState("");
const [noSQLMode, setNoSQLMode] = useState(null);
const location = useLocation();
const navigate = useNavigate();
const selectedMember = location.state?.selectedMember;

useEffect(() =>{
    axios.get("http://localhost:3001/mongodb/check").then((resp)=>{
        setNoSQLMode(resp.data)

    })
}, [])

useEffect(() =>{
    if (noSQLMode === null) return;
    if(noSQLMode){
        axios.get("http://localhost:3001/mongodb/mongoPrograms").then((resp)=>{
            const convertedData = TutorConvertor(resp.data);
            setlistOfProgram(convertedData)
            console.log("The NoSQL mode is used")
        })
    }else{
        axios.get("http://localhost:3001/program").then((resp)=>{
            setlistOfProgram(resp.data)})
    }
}, [noSQLMode])

const handleButton = async (member, course) =>{
    try {
        if(noSQLMode){
            await axios.post("http://localhost:3001/mongodb/mongoAddEnrollment",
                {
                    MemberID : member.Id,
                    CourseID : course.CourseID,
                    ProgramID : course.Id,
                    Type : member.type,
                    Price : course.Price
                }
            )
        }
        else{
            const responseEnrollment = await axios.post("http://localhost:3001/enrollment",
                {
                    MemberID : member.Id,
                    CourseID : course.Id
                }
            )
            const enrollmentId = await responseEnrollment.data.enrollment.Id;
            const responsePayment = await axios.post("http://localhost:3001/payment",
                {
                    EnrollmentID : enrollmentId,
                    Type : member.type,
                    Price : course.Price
                }
            )
        }

        setSuccessMessage(`${member.type === "student" ? "Student" : "Member"} has successfully begun attending the Course`);
        setTimeout(() => setSuccessMessage(""), 2500);

    } catch (error) {
        console.error("Enrollment failed:", error)
    }
}