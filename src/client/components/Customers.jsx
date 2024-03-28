
import { useState, useEffect } from 'react'
import '../css/App.css'
import Customer from './Customer'
import AddCustomer from './AddCustomer'
import Table from './Table'

function Customers() {

  const [customers, setCustomers] = useState([])
  const [addCustomer, setAddCustomer] = useState(false)
  const [table, setTable] = useState(false)
  const [dataTable, setDataTable] = useState({})

  async function fetchAllData(setCustomers) {
    const url = `http://localhost:8080/customers`
    const response = await fetch(url)
    if (response.ok) {
      const data = await response.json()
      await data.sort(function (a, b) { return a.id - b.id });
      setCustomers(await data)
    }
    else console.log("error");
  }

  async function countOfcustomersNotVaccinated() {
    const url = `http://localhost:8080/countOfCustomersNotVaccinated`
    const response = await fetch(url)
    if (response.ok) {
      const data = await response.json()
      alert(await data);
    }
    else console.log("error");
  }

  async function countOfPatientsEveryDayOfTheMonth() {
    const url = `http://localhost:8080/countOfPatientsEveryDayOfTheMonth`
    const response = await fetch(url)
    if (response.ok) {
      const data = await response.json()
      setDataTable(await data)
      setTable(true)
    }
    else console.log("error");
  }

  useEffect(() => {
    fetchAllData(setCustomers)
  }, [])

  return (
    <>
      <button id='countOfcustomersNotVaccinated' onClick={countOfcustomersNotVaccinated}>show count of customers not vaccinated</button>
      <button id='countOfPatientsEveryDayOfTheMonth' onClick={countOfPatientsEveryDayOfTheMonth}>show count of patients every day of the month</button>
      {!addCustomer && <button id='addButton' onClick={() => { setAddCustomer(true) }}>add customer</button>}
      {addCustomer && <AddCustomer setAddCustomer={setAddCustomer} fetchAllData={() => fetchAllData(setCustomers)} />}
      {customers.map(customer => <Customer key={customer.id} customer={customer} setAddCustomer={setAddCustomer}
        fetchAllData={() => fetchAllData(setCustomers)} />)}
      {table && <Table id='table' data={dataTable} setTable={setTable} />}
    </>
  )
}

export default Customers
