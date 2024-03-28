import React, { useEffect, useState } from 'react'

function UpdateCustomer({ setUpdateCustomer, fetchAllData, customerInformation}) {

    const [customerData, setCustomerData] = useState(customerInformation)

    const handleChangeVaccine = (e, index) => {
        const { name, value } = e.target;  
        setCustomerData(prevState => {
          const updatedVaccinations = [...prevState.vaccinations];
          updatedVaccinations[index] = { ...updatedVaccinations[index], [name]: value };
          return { ...prevState, vaccinations: updatedVaccinations };
        });
      };
      
    const handleChange = (e) => {
        console.log(customerData);
        const { name, value } = e.target;
        console.log(name, value);
        if (name === 'dateOfReceivingAPositiveResult' || name === 'dateOfRecovery') {
            const dateOfReceivingAPositiveResult = new Date(customerData.dateOfReceivingAPositiveResult).toDateString();
            const dateOfRecovery = new Date(customerData.dateOfRecovery).toDateString();
            if (dateOfReceivingAPositiveResult > dateOfRecovery) {
                alert('The test date must be before the recovery date')
                return
            }
        } 
        const splitName = name.split('.')
        console.log(splitName);
        if (splitName.length > 1) {
            setCustomerData((prevCustomerData) => ({
                ...prevCustomerData,
                [splitName[0]]: {
                    ...prevCustomerData[splitName[0]],
                    [splitName[1]]: value
                }
            }));
        }
        else {
            setCustomerData((prevCustomerData) => ({ ...prevCustomerData, [splitName]: value }))
        }

    };

    const saveDetailsUpdate = async (e) => {
        e.stopPropagation();
        console.log("submit");
        e.preventDefault()
        console.log(customerData);
        customerData.birthday = new Date(customerData.birthday).toISOString().split('T')[0]
        customerData.dateOfRecovery = new Date(customerData.dateOfRecovery).toISOString().split('T')[0]
        customerData.dateOfReceivingAPositiveResult = new Date(customerData.dateOfReceivingAPositiveResult).toISOString().split('T')[0]
        const postResponse = await fetch(`http://localhost:8080/customers/${customerData.id}`, {
            method: 'PUT',
            body: JSON.stringify(await customerData),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        console.log(postResponse);
        if (postResponse.ok) {
            alert("customer updated succesfully!")
            setUpdateCustomer(false)
            fetchAllData()
        }
        else alert("error fetching!")
        e.stopPropagation();
    }

    return (
        <div id='updateCustomer'>
            <button onClick={(e) => { setUpdateCustomer(false); e.stopPropagation(); }}>❌</button><br />
            <form className="continar" onSubmit={saveDetailsUpdate}> 
                <div className="personalInformation">
                    <div className="form-row">
                        <label htmlFor="firstName">First Name:</label>
                        <input type="text" id="firstName" name="firstName" value={customerData.firstName} onChange={handleChange} />
                    </div>
                    <div className="form-row">
                        <label htmlFor="lastName">Last Name:</label>
                        <input type="text" id="lastName" name="lastName" value={customerData.lastName} onChange={handleChange} />
                    </div>
                    <div className="form-row">
                        <label htmlFor="id">ID:</label>
                        <input type="text" id="id" name="id" value={customerData.id}
                            readOnly required max={9} min={7} onChange={handleChange} />
                    </div>
                    <div className="form-row">
                        <label htmlFor="city">City:</label>
                        <input type="text" id="city" name="address.city" value={customerData.address.city} onChange={handleChange} />
                    </div>
                    <div className="form-row">
                        <label htmlFor="street">Street:</label>
                        <input type="text" id="street" name="address.street" value={customerData.address.street} onChange={handleChange} />
                    </div>
                    <div className="form-row">
                        <label htmlFor="houseNumber">House Number:</label>
                        <input type="text" id="houseNumber" name="address.houseNumber" value={customerData.address.houseNumber} onChange={handleChange} />
                    </div>
                    <div className="form-row">
                        <label htmlFor="birthday">Birthday:</label>
                        <input type="date" id="birthday" name="birthday"
                         value={customerData.birthday ? new Date(customerData.birthday).toISOString().split('T')[0]: null}
                          onChange={handleChange} required/>
                    </div>
                    <div className="form-row">
                        <label htmlFor="phone">Phone:</label>
                        <input type="text" id="phone" name="phone" value={customerData.phone} onChange={handleChange} />
                    </div>
                    <div className="form-row">
                        <label htmlFor="mobilePhone">Mobile Phone:</label>
                        <input type="text" id="mobilePhone" name="mobilePhone" value={customerData.mobilePhone} onChange={handleChange} />
                    </div>
                </div>
                <div className="detailsOnTheCoronaVirus">
                    <div className="form-row">
                        <label htmlFor="dateOfRecovery">Date of Recovery:</label>
                        <input type="date" id="dateOfRecovery" name="dateOfRecovery"
                         value={customerData.dateOfRecovery ? new Date(customerData.dateOfRecovery).toISOString().split('T')[0] : null}
                          onChange={handleChange} />
                    </div>
                    <div className="form-row">
                        <label htmlFor="dateOfReceivingAPositiveResult">Date of Receiving a Positive Result:</label>
                        <input type="date" id="dateOfReceivingAPositiveResult" name="dateOfReceivingAPositiveResult"
                         value={customerData.dateOfReceivingAPositiveResult ? new Date(customerData.dateOfReceivingAPositiveResult).toISOString().split('T')[0]: null}
                          onChange={handleChange} />
                    </div>
                    <div>
                        {[0,1,2,3].map(index => (
                            <div key={index} className="form-row">
                                <label htmlFor={`date`}>{`Date of Vaccine ${index + 1}:`}</label>
                                <input
                                    type="date"
                                    id={`date`}
                                    name={`date`}
                                    value={customerData.vaccinations && customerData.vaccinations[index] ? (customerData.vaccinations[index].date ? new Date(customerData.vaccinations[index].date).toISOString().split('T')[0] : null) : null}
                                    onChange={(e) => handleChangeVaccine(e, index)}
                                />
                                <label htmlFor={`manufacturer`}>{`Manufacturer of Vaccine ${index + 1}:`}</label>
                                <select
                                    id={`manufacturer`}
                                    name={`manufacturer`}
                                    value={customerData.vaccinations && customerData.vaccinations[index] && customerData.vaccinations[index].manufacturer ? customerData.vaccinations[index].manufacturer : ''}
                                    onChange={(e) => handleChangeVaccine(e, index)}
                                >
                                    <option value="Pfizer">Pfizer</option>
                                    <option value="Moderna">Moderna</option>
                                    <option value="Johnson & Johnson">Johnson & Johnson</option>
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
                <button type="submit">Update</button>
            </form>
        </div >
    );
}

export default UpdateCustomer