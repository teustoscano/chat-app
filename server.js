const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Chatkit = require("@pusher/chatkit-server");

const app = express();

const chatkit = new Chatkit.default({
    instanceLocator: "v1:us1:973e9d53-6950-4a79-844c-52248ae4d756",
    Key: "3cc11378-3c5e-43d2-8c8c-7ca52f7eac80:jf2IHMEVH/hdoYyR2RZonl+jnIFc0ybsdSQ4QvL1ioo="
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.post("/users", (req, res) => {
    const { username } = req.body;
    chatkit
      .createUser({
        id: username,
        name: username
      })
      .then(() => {
        console.log(`User created: ${username}`);
        res.sendStatus(201);
      })
      .catch(err => {
        if (err.error === "services/chatkit/user_already_exists") {
          console.log(`User already exists: ${username}`);
          res.sendStatus(200);
        } else {
          res.status(err.status).json(err);
        }
      });
  });

  app.post("/authenticate", (req, res) => {
    const authData = chatkit.authenticate({ userId: req.query.user_id });
    res.status(authData.status).send(authData.body);
  });
  
  const port = 3001;
  app.listen(port, err => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Running on port ${port}`);
    }
  });