// implement your API here
const express = require("express");
const users = require("./data/db");
const server = express();

// this is middleware that allows express to parse JSON request bodies
server.use(express.json());

server.post("/api/users", (req, res) => {
 const { name, bio } = req.body;

 if (!name || !bio) {
  res
   .status(400)
   .json({ errorMessage: "Please provide name and bio for the user." });
 } else {
  users
   .insert(req.body)
   .then(user => {
    res.status(201).json(user);
   })
   .catch(() => {
    res.status(500).json({
     errorMessage: "There was an error while saving the user to the database"
    });
   });
 }
});

server.get("/api/users", (req, res) => {
 users
  .find()
  .then(userlist => {
   res.status(200).json(userlist);
  })
  .catch(() => {
   res.status(500).json({
    errorMessage: "The users information could not be retrieved."
   });
  });
});

const port = 5000;

// start the server on localhost at port 5000
server.listen(port, () => {
 console.log(`server started at http://localhost:${port})`);
});
