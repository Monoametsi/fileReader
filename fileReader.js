const fs = require('fs');
const csv = require('csv-parser');
const pool = require('./dbCon');
const format = require('pg-format');
const { formValidation } = require('./formDataValidation');
const { emailSender } = require('./emailSender');

let table = [];
let userTable = [];
let allUsersEmails = [];
let error;

const findRoleId = async () => {
    const getRoleId = await pool.query(`SELECT * FROM roles`);
    return getRoleId.rows;;
}

const getAllEmails = async () => {
    const getEmail = await pool.query(`SELECT email FROM users`);
    return getEmail.rows;
}

fs.createReadStream('biostats.csv').pipe(csv()).on('data', (row) => {
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
        table.push(row);
    }

}).on('close', async () => {
    if(!error){

    try{
        const userEmails = await getAllEmails();
        let emailExists;

        table.map((row) => {
            let { Email } = row;
            
            userEmails.map((email) => {
                if(email.email === Email){
                    emailExists = true;
                }
            })
        })

        if(emailExists){
            console.log(`One or more of the email addresses within the file you provided
            have already been registered`);

            return `One or more of the email addresses within 
            the file you provided have already been registered`

            // return res.status(409).json({
            //     message: `One or more of the email addresses within the file you provided
            //     have already been registered`
            // })
        }else{
            
            const roles = await findRoleId();
            table.map((row) => {
                let { Role } = row;
                
                roles.map((role) => {
                    if(role.roles === Role.trim()){
                        row.Role = role.role_id;
                        row.Username = row.Username.trim();
                        row.Email = row.Email.trim();
                        row.Surname = row.Surname.trim();
                        const rowData = Object.values(row);
                        allUsersEmails.push(row.Email);
                        userTable.push(rowData);
                    }
                })
            })

            pool.query(format('INSERT INTO users( username, surname, email, role_id ) VALUES %L RETURNING *', userTable), [], async (err, res) => {
                if (err) {
                    return console.log(err);
                } else {
                    try{
                        return await emailSender(allUsersEmails);
                    }catch(err){
                        console.log(err);
                        return err;
                    }
                }
            })
        }
    }catch(err){
        console.log(err)
        return err;
        // res.status(503).json({
        //     message: `Internal server error`,
        //     error: err
        // })
    }
        
    }else{
        console.log(error)
        return error;
    }
})