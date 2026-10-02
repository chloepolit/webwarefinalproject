import GradeForm from './GradeForm.jsx';
import GradeList from './GradeList.jsx';
import React, { useState, useEffect } from 'react'

function GradeTracker(){
    const [formData, setFormData] = useState({
        yourname: '',
        assignmenttype: '',
        gradeletter: '',
        GPA: '',
        cmts: ''
      })
    
      const [entries, setEntries] = useState([ ]) 
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    
      function add() {
        fetch( '/add', {
          method:'POST',
          body: JSON.stringify(formData),
          headers: { 'Content-Type': 'application/json' }
        })
        .then( response => response.json() )
        .then( json => {
           setEntries( json )
        })
      }
    
      return (
        <div className="App">
          <GradeForm 
            formData={formData} 
            onChange={handleChange} 
            onAdd={add} 
          />
          
          <ul>
            {entries.map((entry, i) => (
              <GradeList key={i} entry={entry} />
            ))}
          </ul> 
        </div>
      )
    
    // return (
    //     <div>
    //         <GradeForm/>
    //         <GradeList/>
    //     </div>
    // )
}

export default GradeTracker;