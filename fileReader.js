const fs = require('fs');
const csv = require('csv-parser');
const pool = require('./dbCon');
const format = require('pg-format');
const { formValidation } = require('./formDataValidation');

let table = [];
let userTable = [];

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
let error;
const findRoleId = async () => {
    const getRoleId = await pool.query(`SELECT * FROM roles`);
    //const { role_id } = getRoleId.rows[0];
    return getRoleId.rows;;
}

fs.createReadStream('biostats.csv').pipe(csv()).on('data', async (row) => {
    let { Username,Surname, Email, Role} = row;
    const validator = new formValidation();
    const checkEmpty = !validator.checkEmpty(Username) || !validator.checkEmpty(Surname) || !validator.checkEmpty(Email) || !validator.checkEmpty(Role);

    if(checkEmpty || !validator.emailValidation(Email) || !validator.roleValidation(Role)){
        if(checkEmpty){
            // return res.status(400).json({
            //     message: "All fields need to be filled"
            // })
            error = "All fields need to be filled";
            return error;
            }else if(!validator.emailValidation(Email)){
                // return res.status(400).json({
                //     message: "Invalid email"
                // })
            error = "Invalid email";
            return error;
            }else if(!validator.roleValidation(Role)){
            //     return res.status(400).json({
            //         message: 'Invalid role'
            // })
            error = 'Invalid role';
            return error;
        }
    }else{
        
        // row.Role = await findRoleId(Role);
        // const rowData = Object.values(row);
        // console.log(rowData);
        table.push(row);

        // if(rowData.length > 0){
        //     table.push(rowData.map((data) => {
        //         if(isNaN(data)){
        //             data.replace(/"/g, "").trim();
        //         }
                
        //         return data;
        //     }))
        // }
    }

}).on('end', async () => {
    if(!error){
        const roles = await findRoleId();
        table = table.map((row) => {
            let { Username,Surname, Email, Role} = row;
            
            return roles.map((role) => {
                
                if(role.roles === Role){
                    row.Role = role.role_id;
                    const rowData = Object.values(row);
                    userTable.push(rowData);
                    return rowData;
                }
            })
        })

        console.log(userTable);

        pool.query(format('INSERT INTO users( username, surname, email, role_id ) VALUES %L RETURNING *', userTable), [], (err, res) => {
            if (err) {
                return console.log(err);
            } else {
                return console.log(res.rows)
            }
        })
        
    }else{
        console.log(error)
        return error;
    }

    //console.log('Proccessing Successful');
})