const PORT = process.env.PORT ?? 8000;
const express = require("express");
const { v4: uuidv4 } = require('uuid');
const sequelize = require("./db");
const cors = require("cors");
const bodyparser = require("body-parser");
let router = express.Router();
const User = require("./Models/User");
const Todo = require("./Models/Todo");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyparser.json()) // save this line!

//LISTEN PORT
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
});

//Test DB
sequelize.authenticate().then(() => { console.log("Autenticado no DB com sucesso") })
    .catch((err) => {
        console.log(`Deu algum erro na hora de autenticar: ${err}`);
    });


//ROUTES
app.get("/", (req, res) => {
    res.send("Hello");
});


app.get("/todos/:userEmail", async (req, res) => {

    const { userEmail } = req.params;

    const todos = await Todo.findAll({
        where: {
            user_email: userEmail
        }
    });
    res.json({ todos });
    return;

})


app.post("/todos", async (req, res) => {

    const { user_email, title, progress, date } = req.body
    console.log(req.body);
    const id = uuidv4();

    if (user_email === "" || user_email === null || user_email === undefined || title === "" || title === undefined || title === null
        || progress === null || progress === undefined) {
        res.json({ msg: "Os dados precisam ser preenchidos." });
        return;
    }

    const todo = new Todo();

    todo.id = id;

    if(user_email){
        todo.user_email = user_email;
    }
    if(title){
        todo.title = title;
    }
    if(progress){
        todo.progress = progress;
    }
    if(date){
        todo.date = date;
    }

    const info = await todo.save();
    res.json({ msg: "Todo cadastrado com sucesso", info });
    return;



})





/* app.get("/todos/:userEmail", async (req, res) => {

    console.log(req);
    const { userEmail } = req.params;

    try {
        
        connection.query('SELECT * FROM todos WHERE user_email = ?',
            [userEmail],
            function (err, results, fields) {
                res.json(results);
                console.log(fields);
            }
        );

    } catch (error) {
        console.log(error)
    }

}); */



/* app.post("/todos", async (req, res) => {

    const { user_email, title, progress, date } = req.body
    console.log(req.body);
    const id = uuidv4();

    const sql = `INSERT INTO todos (id, user_email, title, progress, date) VALUES (?, ?, ?, ?, ?)`;

    try {
        connection.query(sql,
            [id, user_email, title, progress, date]);

        res.json({ msg: "Salvo com sucesso" });
        return;

    } catch (error) {
        console.log(error)
        res.json({ err: error })
        return;
    }

}); */


