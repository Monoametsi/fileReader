const fs = require('fs');
const csv = require('csv-parser');
const pool = require('./dbCon');
const format = require('pg-format');
const format = require('./formDa');

let table = [];

// fs.readFile('./biostats.csv', 'utf8', async (err, data) => {
//     table = data.split('\n');

//     table = table.filter((row, i) => {
//         return i > 0 && row.length > 0;
//     })

//     table = table.map((row) => {
//         tableRowData = row.toString().split(',');
//         return tableRowData.map((rowData) => {
//             return rowData.replace(/"/g, "").trim();
//         })
//     })

//     pool.query(format('INSERT INTO csv_content (name, sex, age, height, weight) VALUES %L RETURNING *', table), [], (err, res) => {
//         if (err) {
//             return console.log(err)
//         } else {
//             return console.log(res.rows);
//         }
//     })
    
// })

fs.createReadStream('biostats.csv').pipe(csv()).on('data', (row) => {
    const { Username,Surname, Email, Role} = row;
    console.log(Username);
    // const rowData = Object.values(row);

    // if(rowData.length > 0){
    //     table.push(rowData.map((data) => {
    //         return data.replace(/"/g, "").trim();
    //     }))
    // }
    
}).on('end', () => {
    //console.log(table);

    // pool.query(format('INSERT INTO csv_content (name, sex, age, height, weight) VALUES %L RETURNING *', table), [], (err, res) => {
    //     if (err) {
    //         return console.log(err);
    //     } else {
    //         return console.log(res.rows);
    //     }
    // })
    console.log('Proccessing Successful');
})