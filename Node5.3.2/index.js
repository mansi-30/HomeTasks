const express = require("express");
const joi = require("joi");
const bodyParser = require("body-parser");
const { string, boolean, func } = require("joi");
const users = require("./users").users;
var currUsers = [];

const app = express();

app.use(bodyParser());
const PORT_NO = 8080;

//  Home endpoint 
app.get('/',(req,res)=>{ 
    res.write("<p>http://localhost:8080/get - To get all the data</p>" );
    res.write("<p>http://localhost:8080/id - To get the user of particular id.</p>");
    res.write("<p>http://localhost:8080/delete - To delete the user of particular id.</p>")
    res.write("<p>http://localhost:8080/add - To add the new user.</p>")
    res.write("<p>http://localhost:8080/getAutoSuggest - To get auto suggestion with a substring and limit.</p>")
    res.write("<p>http://localhost:8080/put - To replace the user details.</p>")
    res.send();
})

//  To get all the users available 
app.get('/get',(req,res)=>{
    findAvailabeUsers();
    res.json(currUsers);
})

//  To get the user with particular id provided
app.get('/:id',(req,res)=>{
    const id = req.params.id;
    let d = {};
    console.log(id);
    for(let ind = 0; ind < users.length; ind++){
        const element = users[ind];
        if(element.id == id){
            d = element;
            break;
        }
    }
    res.json(d);
})

// To delete the user with given id
// req format
// {
//     "id": integer,
// }

app.post('/delete',(req,res)=>{
    const id = req.body.id;
    console.log(id);
    
    for(let ind = 0; ind < users.length; ind++){
        const element = users[ind];
        if(element.id == id){
            element.isDeleted = true;
            break;
        }
    }
    findAvailabeUsers();
    res.json(currUsers);
})

// To add the new user
// req format
// {
//     "id": integer,
//     "login": string,
//     "password": string,
//     "age": integer,
//     "isDeleted": boolean
// }

app.post('/add',async(req,res)=>{
    const data = req.body;
    try {
        await schema.validateAsync(data);
        let alredyExist = isExist(data.id);
        if(!alredyExist){
            users.push(data);
            findAvailabeUsers();
            res.json(currUsers);
        }else{
            res.send(`User with id = ${data.id} alredy exists!`);
        }
        
    }
    catch (err) {
        res.status(400).send(err.details[0].message);
    }
    
})

// to get auto suggested list with given substring and size equal to the limit provided
// req format
// {
//     "substring": string,
//     "limit": integer,
// }
app.post('/getAutoSuggest',(req,res)=>{
    const data = req.body;
    const substring = data.substring;
    var limit = data.limit;
    var list = [];
    for (let ind = 0; ind < users.length; ind++) {
        const element = users[ind];
        
        if(element.login.includes(substring) && limit){
            limit-=1;
            list.push(element);
        }
    }
    res.json(list);     
})

// to replace the users data
// req format
// {
//     "id": integer,
//     "login": string,
//     "password": string,
//     "age": integer,
//     "isDeleted": boolean
// }
app.put('/put',async(req,res)=>{
    const data = req.body;
    try {
        await schema.validateAsync(data);
        var flag = false;
        for(let ind = 0; ind < users.length; ind++){
            if(users[ind].id===data.id){
                flag = true;
                users[ind].login = data.login;
                users[ind].password = data.password;
                users[ind].age = data.age;
                users[ind].isDeleted = data.isDeleted;
                break;
            }
        }
        if(!flag){
            users.push(data);
        }
        findAvailabeUsers();
        res.json(currUsers);
    }catch(err){
        res.status(400).send(err.details[0].message);
    }
    
})

// To sort the available users by checking the isDeleted property
function findAvailabeUsers(){
    currUsers = [];
    for (let ind = 0; ind < users.length; ind++) {
        const element = users[ind];
        if(element.isDeleted == false){
            currUsers.push(element);
        }
    }
}

// To check whether the user is alredy exist or not

function isExist(id){
    for (let ind = 0; ind < users.length; ind++) {
        const element = users[ind];
        if(element.id == id){
            return true;
        }
    }
    return false;
}
// Validation using JOI

// Schema of the object
const schema = joi.object({
    id: joi.number()
        .integer()
        .max(10000)
        .required(),
    login: joi.string()
        .alphanum()
        .min(5)
        .max(10)
        .required(),
    password: joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
    age: joi.number()
        .min(4)
        .max(130)
        .required(),
    isDeleted: joi.boolean()
        .valid(false)
        .required()
})
    
// Start server

app.listen(PORT_NO,()=>{
    console.log(`Server is running on port - ${PORT_NO}`);
})
