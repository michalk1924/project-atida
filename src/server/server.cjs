const database = require('./DB.cjs');
const cors = require('cors');

const dotenv = require('dotenv')
dotenv.config();

const express = require('express');
const app = express();

const host = process.env.HOST_NAME;
const port = process.env.PORT_SERVER;

app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
    credentials: true
}))

app.use(express.json());

app.get('/countOfCustomersNotVaccinated', (req, res) => {
  database.countOfcustomersNotVaccinated()
  .then((data) => {
    console.log(data[0]['count(*)'])
    res.status(200).end(JSON.stringify(data[0]['count(*)']));
  })
  .catch((statusError) => {
    res.status(statusError).end()
  });
})

app.get('/countOfPatientsEveryDayOfTheMonth', (req, res) => {
  database.countOfPatientsEveryDayOfTheMonth()
  .then((data) => {
    res.status(200).end(JSON.stringify(data));
  })
  .catch((statusError) => {
    res.status(statusError).end()
  });
})

app.get('/customers', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.writeHead(200, { 'Content-Type': 'text/json' });
  database.getAllCustomers()
    .then((data) => {
      res.status(200).end(JSON.stringify(data));
    })
    .catch((statusError) => {
      res.status(statusError).end()
    });
})

app.get('/customers/:id', (req, res) => {
  const id = req.params.id
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.writeHead(200, { 'Content-Type': 'text/json' });
  database.getCustomerById(id)
    .then((data) => {
      console.log(data);
      res.status(200).end(JSON.stringify(data));
    })
    .catch((statusError) => {
      res.status(statusError).end()
    });
})

app.delete('/customers/:id', (req, res) => {
  const id = req.params.id
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.writeHead(200, { 'Content-Type': 'text/json' });
  database.deleteCustomer(id)
    .then((data) => {
      console.log(data);
      res.status(200).end();
    })
    .catch((statusError) => {
      res.status(statusError).end()
    });
})

app.put('/customers/:id', (req, res) => {
  const id = req.params.id
  const customer = req.body
  console.log(customer);
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.writeHead(200, { 'Content-Type': 'text/json' });
  database.updateCustomer(customer)
    .then(() => {
      res.status(200).end();
    })
    .catch((statusError) => {
      res.status(statusError).end()
    });
})

app.post('/customers', (req, res) => {
  try {
    const customer = req.body
    database.addCustomer(customer)
      .then(() => {
        console.log("wow");
        res.status(200).end();
      })
      .catch((statusError) => {
        res.status(statusError).end()
      });
  } catch (error) {
    console.log(error);
    res.status(400).end();
  }
})

const createTables = ()=>{
  database.createTableCustomers();
  database.createTableVaccinations();
}

const deleteTables = ()=>{
  database.deleteTable("customers");
  database.deleteTable("vaccinations");
}

app.listen(port, host, () => {
  console.log(`database is running on port ${port}`);
});