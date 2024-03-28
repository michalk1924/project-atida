import React, { useState } from 'react'

function AllDataCustomer({ customerData, setAllDataCustomer }) {
    return (
        <div id='allDataCustomer'>
            <button onClick={(e) => { setAllDataCustomer(false); e.stopPropagation(); }}>❌</button><br />
            <div>
                <p>
                    {`First Name: ${customerData.firstName}`}
                </p>
                <p>
                    {`Last Name: ${customerData.lastName}`}
                </p>
                <p>
                    {`ID: ${customerData.id}`}
                </p>
                <p>
                    {`City: ${customerData.address.city}`}
                </p>
                <p>
                    {`Street: ${customerData.address.street}`}
                </p>
                <p>
                    {`House Number: ${customerData.address.houseNumber}`}
                </p>
                <p>
                    {`Phone: ${customerData.phone}`}
                </p>
                <p>
                    {`Mobile Phone: ${customerData.mobilePhone}`}
                </p>
                <p>
                    {`Birthday: ${new Date(customerData.birthday).toLocaleDateString()}`}
                </p>
                <p>
                    {`Date of Recovery: ${new Date(customerData.dateOfRecovery).toLocaleDateString()}`}
                </p>
                <p>
                    {`Date of receiving a positive result: ${new Date(customerData.dateOfReceivingAPositiveResult).toLocaleDateString()}`}
                </p>
                <div>
                    {customerData.vaccinations && customerData.vaccinations.map((vaccine, i) => {
                        return <div id='vaccinations' key={i}>
                            <p>Date of Vaccine {i + 1}: {new Date(vaccine.date).toLocaleDateString()}</p>
                            <p>Manufacturer of Vaccine {i + 1}: {vaccine.manufacturer}</p>
                        </div>
                    })}
                </div>
            </div>
        </div>)
}

export default AllDataCustomer