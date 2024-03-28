import React, { useState } from 'react'

function AddCustomer({ setAddCustomer, fetchAllData }) {
    const customers = [
        {
            firstName: 'דניאל',
            lastName: 'לוי',
            id: '123456789',
            address: {
                city: 'תל אביב',
                street: 'הרצל',
                houseNumber: 10
            },
            phone: '03-1234567',
            mobilePhone: '050-1234567',
            birthday: '1980-01-01',
            dateOfReceivingAPositiveResult: '2022-03-20',
            dateOfRecovery: '2022-04-01',
            vaccinations: [
                { date: '2022-03-25', manufacturer: 'Pfizer' },
                { date: '2022-04-15', manufacturer: 'Pfizer' },
                { date: '2022-05-05', manufacturer: 'Pfizer' }
            ]
        },
        {
            firstName: 'שירה',
            lastName: 'כהן',
            id: '987654321',
            address: {
                city: 'ירושלים',
                street: 'הרצל',
                houseNumber: 5
            },
            phone: '02-9876543',
            mobilePhone: '054-9876543',
            birthday: '1975-05-15',
            dateOfReceivingAPositiveResult: '2022-03-22',
            dateOfRecovery: '2022-04-02',
            vaccinations: [
                { date: '2022-03-27', manufacturer: 'Moderna' },
                { date: '2022-04-17', manufacturer: 'Moderna' },
                { date: '2022-05-07', manufacturer: 'Moderna' }
            ]
        },
        // ניתן להוסיף עוד 18 ערכים באותו הפורמט כאן
    ];

    const save = async () => {
        const postResponse = await fetch('http://localhost:8080/customers', {
            method: 'POST',
            body: JSON.stringify(customers[0]),
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }

    save()

    const customerInformation = {
        firstName: '',
        lastName: '',
        id: '',
        address: {
            city: '',
            street: '',
            houseNumber: 0
        },
        phone: 0,
        mobilePhone: 0,
        birthday: new Date(2024, 1, 1).toISOString().split('T')[0],
        dateOfReceivingAPositiveResult: new Date(2024, 1, 1).toISOString().split('T')[0],
        dateOfRecovery: new Date(2024, 1, 1).toISOString().split('T')[0],
        vaccinations: [{ date: null, manufacturer: '' },
        { date: null, manufacturer: '' },
        { date: null, manufacturer: '' },
        { date: null, manufacturer: '' }]
    }
    const [customerData, setCustomerData] = useState(customerInformation)

    const handleChangeVaccine = (e, index) => {
        const { name, value } = e.target;
        setCustomerData(prevState => {
            const updatedvaccinations = [...prevState.vaccinations];
            updatedvaccinations[index] = { ...updatedvaccinations[index], [name]: value };
            return { ...prevState, vaccinations: updatedvaccinations };
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'dateOfReceivingAPositiveResult' || name === 'dateOfRecovery') {
            const dateOfReceivingAPositiveResult = new Date(customerData.dateOfReceivingAPositiveResult);
            const dateOfRecovery = new Date(customerData.dateOfRecovery);
            if (dateOfReceivingAPositiveResult < dateOfRecovery) {
                alert('The test date must be before the recovery date')
                return
            }
        }        
        const splitName = name.split('.')
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
    }

    const saveDetails = async (e) => {
        e.preventDefault()
        const postResponse = await fetch('http://localhost:8080/customers', {
            method: 'POST',
            body: JSON.stringify(customerData),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (postResponse.ok) {
            alert("customer added succesfully!")
            setAddCustomer(false)
            fetchAllData()
        }
        else alert("error fetching!")
    }

    return (
        <div id='addCustomer'>
            <button onClick={() => setAddCustomer(false)}>❌</button><br />
            <form className="continar" onSubmit={saveDetails}>
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
                        <input type="text" id="id" name="id" value={customerData.id} required max={9} min={7} onChange={handleChange} />
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
                        <input type="date" id="birthday" name="birthday" value={customerData.birthday} onChange={handleChange} required />
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
                <div className="DetailsOnTheCoronaVirus">
                    <div className="form-row">
                        <label htmlFor="dateOfRecovery">Date of Recovery:</label>
                        <input type="date" id="dateOfRecovery" name="dateOfRecovery" value={customerData.dateOfRecovery} onChange={handleChange} />
                    </div>
                    <div className="form-row">
                        <label htmlFor="dateOfReceivingAPositiveResult">Date of Receiving a Positive Result:</label>
                        <input type="date" id="dateOfReceivingAPositiveResult" name="dateOfReceivingAPositiveResult" value={customerData.dateOfReceivingAPositiveResult} onChange={handleChange} />
                    </div>
                    <div>
                        {customerData.vaccinations.map((item, index) => (
                            <div key={index} className="form-row">
                                <label htmlFor={`date`}>{`Date of Vaccine ${index + 1}:`}</label>
                                <input
                                    type="date"
                                    id={`date`}
                                    name={`date`}
                                    value={customerData.vaccinations[index].date}
                                    onChange={(e) => handleChangeVaccine(e, index)}
                                />
                                <label htmlFor={`.manufacturer`}>{`Manufacturer of Vaccine ${index + 1}:`}</label>
                                <select
                                    id={`manufacturer`}
                                    name={`manufacturer`}
                                    value={customerData.vaccinations[index].manufacturer}
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
                <button type="submit">Add</button>
            </form>
        </div >
    )
}
export default AddCustomer