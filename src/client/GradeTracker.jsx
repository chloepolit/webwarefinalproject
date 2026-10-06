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
    
      const [entries, setEntries] = useState([])
      const [updatedGPA, setUpdatedGPA] = useState(0.0) 
    
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
           setEntries( json.entries )
           setUpdatedGPA(json.updatedGPA)

        })
        fetchInitialData()

      }
      
    
        const fetchInitialData = async () => {
          try {
            const response = await fetch('/read');
            if (!response.ok) throw new Error('Failed to fetch data');
            console.log(response)
            const data = await response.json();
            console.log(data)
            setEntries(data)

          } catch (error) {
            console.error('Error fetching initial entries:', error);
          }
        }
        useEffect(() => {
          fetchInitialData()

        }, [])
 

      return (
        <div className="App">
          <h2>Current GPA: {updatedGPA}</h2>
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
    
}

export default GradeTracker;