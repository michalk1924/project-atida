import React, { useState } from 'react'
import '../css/Customer.css'
import UpdateCustomer from './UpdateCustomer'
import AllDataCustomer from './AllDataCustomer'


function Customer({customer, fetchAllData}) {

    const [updateCustomer, setUpdateCustomer] = useState(false)
    const [allDataCustomer, setAllDataCustomer] = useState(false)
    
    const deleteCustomer = async ()=>{
        const postResponse = await fetch(`http://localhost:8080/customers/${customer.id}`, {
            method: 'DELETE'
        })
        if (postResponse.ok) {
            alert("customer deleted succesfully!")
            fetchAllData()
        }
        else alert("error fetching!")
    }

    return (
        <div key={customer.id} className='customer' onClick={()=>setAllDataCustomer(true)}>
            <p>id: {customer.id} </p>
            <p>{customer.firstName} </p>
            <p>{customer.lastName} </p>
            <button id='updateButton' onClick={(e)=>{setUpdateCustomer(true); e.stopPropagation();}}>✏️</button>
            <button id='deleteButton' onClick={(e)=>{deleteCustomer(); e.stopPropagation();}}>🗑️</button>
            {updateCustomer && <UpdateCustomer setUpdateCustomer={setUpdateCustomer}
            fetchAllData={fetchAllData} customerInformation={customer} />}
            {allDataCustomer && <AllDataCustomer customerData={customer} setAllDataCustomer={setAllDataCustomer}/>}
        </div>
        )
}

export default Customer
