//------------Beginning------------//
const express = require ("express");
const apiRouter = express.Router();

const jwt = require("jsonwebtoken");
const { getUserById } = require("../db");
const { JWT_SECRET } = process.env;

const usersRouter = require("./users");
const postsRouter = require("./posts");
const tagsRouter = require("./tags");

//------------Middle------------//

apiRouter.use( async (req, res, next) => {
    const prefix = "Bearer ";
    const auth = req.header("Authorization");

    if (!auth) {
        next();
    } else if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length);

        try {
            const { id } = jwt.verify(token, JWT_SECRET);
            
            if ( id ) {
                req.user = await getUserById(id);
                    next();
            }
        } catch ({ name, message }) {
            next({ name, message });
        }
    } else {
        next({
            name: "AuthorizationHeaderError",
            messgae: `Authorization token must start with ${ prefix }`
        });
    }
});

apiRouter.use((req, res, next) => {
    if (req.user) {
        console.log("User is set:", req.user);
    }

    next();
});

apiRouter.use("/users", usersRouter);
apiRouter.use("/posts", postsRouter);
apiRouter.use("/tags", tagsRouter);

apiRouter.use((error, req, res ,next) => {
    res.send({
        name: error.name,
        message: error.message  
    });
});

//------------End------------//

module.exports = apiRouter;

//------------Tests------------//

// curl http://localhost:3000/api/users/login -H "Content-Type: application/json" -X POST -d '{"username": "albert", "password": "bertie99"}' 