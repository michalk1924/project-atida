var mysql = require('mysql2');
require('dotenv').config();

var con = mysql.createConnection({
  host: process.env.HOST_NAME,
  user: process.env.USER,
  port: process.env.PORT_SQL,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

exports.createTableCustomers = () => {
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = String.raw`CREATE TABLE customers (
      id INT PRIMARY KEY,
      firstName VARCHAR(255),
      lastName VARCHAR(255),
      city VARCHAR(255),
      street VARCHAR(255),
      houseNumber VARCHAR(255),
      birthday DATE,
      phone INT,
      mobilePhone INT,
      dateOfReceivingAPositiveResult DATE,
      dateOfRecovery DATE
  );`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Table created");
    });
  });
}

exports.createTableVaccinations = () => {
  con.connect(function (err) {
    if (err) reject(500);
    console.log("Connected!");
    var sql = String.raw
      `CREATE TABLE vaccinations (
    customerId int,
    date DATE,
    manufacturer VARCHAR(255),
    FOREIGN KEY (customerId) REFERENCES customers(id)
  );`;
    con.query(sql, function (err, result) {
      if (err) reject(500);
      console.log("Table created");
    });
  });
}

exports.deleteTable = (tableName) => {
  con.connect(function (err) {
    if (err) reject(500);
    console.log("Connected!");
    var sql = `DROP TABLE ${tableName};`;
    con.query(sql, function (err, result) {
      if (err) reject(500);
      console.log("Table created");
    });
  });
}

exports.addCustomer = (customer) => {
  return new Promise(async (resolve, reject) => {
    try {
      con.connect()
      console.log("Connected!");
      console.log(customer);
      let sqlCustomers = '';
      if (customer.dateOfReceivingAPositiveResult == null || customer.dateOfRecovery == null) {
        sqlCustomers = String.raw
          `INSERT INTO customers
   (firstName, lastName, id,
     city, street, houseNumber,
      phone, mobilePhone,
      birthday ) 
    VALUES ('${customer.firstName}', '${customer.lastName}',
     '${customer.id}', '${customer.address.city}',
      '${customer.address.street}', '${customer.address.houseNumber}',
       '${customer.phone}', '${customer.mobilePhone}',
       '${customer.birthday})`;
      }
      else {
        sqlCustomers = String.raw
          `INSERT INTO customers
        (firstName, lastName, id,
          city, street, houseNumber,
          phone, mobilePhone,
          birthday, dateOfRecovery, dateOfReceivingAPositiveResult ) 
          VALUES ('${customer.firstName}', '${customer.lastName}',
          '${customer.id}', '${customer.address.city}',
          '${customer.address.street}', '${customer.address.houseNumber}',
          '${customer.phone}', '${customer.mobilePhone}',
          '${customer.birthday ?? ''}', '${customer.dateOfRecovery ?? ''}',
          '${customer.dateOfReceivingAPositiveResult ?? ''}')`;
      }
      try {
        const [result, fileds] = await con.promise().query(sqlCustomers)
        console.log("added");
        for (let i = 0; i < customer.vaccinations.length; i++) {
          var sqlVaccinations = String.raw
          if (customer.vaccinations[i].date != null) {
            const sqlVaccinations = `INSERT INTO vaccinations
                (customerId, date, manufacturer)
                 VALUES ('${customer.id}',
                  '${customer.vaccinations[i].date}',
                  '${customer.vaccinations[i].manufacturer}')`
            const [result2, fileds2] = await con.promise().query(sqlVaccinations)
          }
        }
        resolve()
      }
      catch (err) {
        console.log("Error: " + err);
        reject(400)
      }
    }
    catch (err) {
      console.log("error connecting");
      console.log(err);
      reject(500);
    }
  })
}

exports.getAllCustomers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await con.connect()
      try {
        const [customers, fileds] = await con.promise().query("SELECT * FROM customers")
        console.log(customers);
        for (let i = 0; i < customers.length; i++) {
          customers[i].address = {
            city: "",
            street: "",
            houseNumber: ""
          }
          customers[i].address.city = customers[i].city ?? null;
          customers[i].address.street = customers[i].street ?? null;
          customers[i].address.houseNumber = customers[i].houseNumber ?? null;
          console.log(customers[i]);
          var sqlVaccinations = String.raw
            `SELECT date, manufacturer
          FROM vaccinations
          WHERE customerId='${customers[i].id}'`
          const [result, fileds] = await con.promise().query(sqlVaccinations)
          customers[i] = {
            ...customers[i],
            vaccinations : result.length>0 ? result : [{ date: null, manufacturer: '' },
            { date: null, manufacturer: '' },
            { date: null, manufacturer: '' },
            { date: null, manufacturer: '' }]
          };
        }
        console.log("good");
        console.log(customers);
        resolve(customers)
      }
      catch (err) {
        console.log("Error: ", err);
        reject(400);

      }
    }
    catch (err) {
      console.log("Error + " + err);
      reject(500);
    }
  });
}

exports.getCustomerById = (id) => {
  return new Promise((resolve, reject) => {
    con.connect(function (err) {
      if (err) reject(500);
      con.query(`SELECT * FROM customers WHERE id=${id}`,
        function (err, customer, fields) {
          if (err) reject(400);
          else {
            customer.address = {}
            customer.address.city = customer.city ?? '';
            customer.address.street = customer.street ?? '';
            customer.address.houseNumber = customer.houseNumber ?? '';
            var sqlVaccinations = String.raw
              `SELECT date, manufacturer
               FROM vaccinations
               WHERE customerId=${id}`
            con.query(sqlVaccinations, function (err, result) {
              if (err) {
                console.log(err);
                reject(400);
              } else {
                console.log(result);
                customer.vaccinations = result;
                console.log(customer);
                resolve(customer);
              }
            })
          }
        })
    })
  })
}

exports.deleteCustomer = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const connect = await con.connect()
      try {
        const [result, fileds] = await con.promise().query(`DELETE FROM vaccinations WHERE customerId=${id}`)
        const [result2, fileds2] = await con.promise().query(`DELETE FROM customers WHERE id=${id}`)
        resolve();
      } catch (err) {
        console.log("error connecting");
        console.log(err);
        reject(400);
      }
    }

    catch (err) {
      console.log("error connecting");
      console.log(err);
      reject(500);
    }

  })
}

exports.updateCustomer = (customer) => {
  return new Promise(async (resolve, reject) => {
    try {
      await con.promise().connect()
    }
    catch (err) {
      console.log(err);
      reject(500);
    }

    console.log(await customer.firstName);
    var sql = String.raw`UPDATE customers 
          SET firstName = '${customer.firstName}', 
          lastName = '${customer.lastName}', 
          city = '${customer.address.city}', 
          street = '${customer.address.street}', 
          houseNumber = '${customer.address.houseNumber}', 
          birthday = '${customer.birthday}', 
          phone = '${customer.phone}', 
          mobilePhone = '${customer.mobilePhone}',
          dateOfReceivingAPositiveResult = '${customer.dateOfReceivingAPositiveResult}', 
          dateOfRecovery = '${customer.dateOfRecovery}'
          WHERE id = '${customer.id}'`;
    try {
      const [result, fileds] = await con.promise().query(sql)
      console.log("1");
      var sqlVaccinationsDelete = String.raw
        `DELETE FROM vaccinations
         WHERE customerId = ${customer.id}`;
      const [result2, fileds2] = await con.promise().query(sqlVaccinationsDelete)
      console.log("2");
      for (let i = 0; i < customer[0].vaccinations.length; i++) {
        var sqlVaccinationsInsert = String.raw
          `INSERT INTO vaccinations
                    (customerId, date, manufacturer)
                     VALUES ('${customer.id}', '${customer.vaccinations[i].date}',
                      '${customer.vaccinations[i].manufacturer}')`;
        const [result3, fileds3] = con.promise().query(sqlVaccinationsInsert)
      }
      resolve();
    }
    catch (err) {
      console.log("err1");
      console.log(err);
      reject(400);
    }
  });
}

exports.countOfcustomersNotVaccinated = () => {
  return new Promise((resolve, reject) => {
    con.connect(function (err) {
      if (err) {
        console.log(err);
        reject(500);
      }
      var sql = String.raw
        `select count(*)
    from customers
    where id not in
    (select customerId
    from vaccinations);`;
      con.query(sql, function (err, result) {
        if (err) {
          console.log(err);
          reject(400);
        }
        else {
          resolve(result);
        }
      }
      )
    })
  })
}

exports.countOfPatientsEveryDayOfTheMonth = () => {
  return new Promise((resolve, reject) => {
    con.connect(function (err) {
      if (err) {
        console.log(err);
        reject(500);
      }
      const { startOfMonth, endOfMonth, addDays } = require('date-fns');

      const lastMonthStart = new Date();
      lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
      lastMonthStart.setDate(1);

      const lastMonthEnd = new Date();
      lastMonthEnd.setMonth(lastMonthEnd.getMonth());
      lastMonthEnd.setDate(0);

      let currentDate = new Date(lastMonthStart);

      const finalResult = []

      function queryNextDate() {
        if (currentDate <= lastMonthEnd) {
          console.log(currentDate.toISOString().split('T')[0]);
          var sql = String.raw
            `SELECT COUNT(*) AS count
            FROM customers
            WHERE dateOfRecovery >= '${currentDate.toISOString().split('T')[0]}' AND
             dateOfReceivingAPositiveResult <= '${currentDate.toISOString().split('T')[0]}'`;
          con.query(sql, function (err, result) {
            if (err) {
              console.log(err);
              reject(400);
            }
            else {
              console.log(result);
              finalResult.push({ date: currentDate.toISOString().split('T')[0], count: result[0].count });
              currentDate.setDate(currentDate.getDate() + 1);
              queryNextDate();
            }
          });
        } else {
          resolve(finalResult);
        }
      }

      queryNextDate();
    });
  });
};
