const PORT = process.env.PORT ?? 8000;
const express = require("express");
const { v4: uuidv4 } = require('uuid');
const sequelize = require("./db");
const cors = require("cors");
const bodyparser = require("body-parser");
const bcrypt = require('bcrypt');
const JWT = require("jsonwebtoken");
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

    if (user_email) {
        todo.user_email = user_email;
    }
    if (title) {
        todo.title = title;
    }
    if (progress) {
        todo.progress = progress;
    }
    if (date) {
        todo.date = date;
    }

    const info = await todo.save();
    res.json({ msg: "Todo cadastrado com sucesso", info });
    return;

})

app.put("/todos/:id", async (req, res) => {

    const { id } = req.params;
    const { user_email, title, progress, date } = req.body


    const todo = await Todo.findByPk(id);

    if (!todo) {
        res.json({ err: `Todo com ${id} n??o encontrado` })
        res.status(404);
        return;
    }


    if (user_email === "" && title === "" && !progress && !date) {
        res.json({ msg: "Nao foi possivel atualizar, informe algum campo a ser atualizado." });
        return;
    }

    if (todo) {
        let updatesTodo = {
            user_email: todo.user_email,
            title: todo.title,
            progress: todo.progress,
            date: todo.date,
        };

        if (user_email) {
            updatesTodo.user_email = user_email;
        }

        if (title) {
            updatesTodo.title = title;
        }

        if (progress) {
            updatesTodo.progress = progress;
        }

        if (date) {
            updatesTodo.date = date;
        }

        //Atualizando com as infos que foram informadas apenas
        todo.update({
            user_email: updatesTodo.user_email, title: updatesTodo.title,
            progress: updatesTodo.progress, date: updatesTodo.date
        }).then(() => { res.json({ msg: "Todo acutalizado con suceso", todo }); return })
    }

})


app.delete("/todos/:id", async (req, res) => {

    let id = req.params.id;

    const todo = await Todo.findByPk(id);

    if (todo) {
        await todo.destroy();
        res.status(200).send();
        return;
    } else {
        res.status(400).json({ msg: `N??o existe tarefa com o id ${id} para ser removida` })
        return;
    }

})

//SIGNUP AND LOGIN ?

app.post('/signup', async (req, res) => {

    const { email, hashed_password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    console.log("SALT", salt);
    const HASH = bcrypt.hashSync(hashed_password, salt);
    console.log("HASH", HASH);

    try {
        const user = new User();
        const userExists = await User.findOne({
            where: {
                email: email
            }
        });

        if (userExists) {
            res.status(400);
            res.json({ error: "Ja existe conta cadastrada com esse email." });
        }

        if (email === undefined || email === "" || email === null || hashed_password === undefined || hashed_password === "" || hashed_password === null) {
            res.json({ error: "Nao foi possivel realizar cadastro, informe algum campo." });
            res.status(404);
            return;

        }

        if (email && hashed_password) {

            const token = JWT.sign({ email }, 'secret', { expiresIn: '1hr' });

            user.email = email;
            user.hashed_password = HASH;
            console.log("hashed password: ", HASH)
            await user.save();
            res.json({ msg: "Cadastro feito com sucesso", email, token })
            res.status(200);
            return;
        }


    } catch (error) {
        console.log(error)
    }


})

app.post('/login', async (req, res) => {

    const { email, hashed_password } = req.body;

    try {

        const user = await User.findOne({
            where: {
                email: email
            }
        });

        if (!user) {
            res.status(400);
            res.json({ error: "Nao existe usuario com este email." });
        } else {

            const success = await bcrypt.compare(hashed_password, user.hashed_password);
            const token = JWT.sign({ email }, 'secret', { expiresIn: '1hr' });

            if(success){
                res.json({'email': user.email, token})
            } else {
                res.json({error: 'Login failed'})
            }

        }

    } catch (error) {
        console.log(error)
    }
})


//Sync DB
sequelize.sync(({ alter: true })).then(() => {
    console.log("sincronizado com sucesso")
}).catch((err) => { console.log("Deu algum erro ao sincronizar o ORM com o BANCO DE DADOS:", err) });









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


