// implement your API here
const express = require('express');
const users = require('./data/db');
const server = express();

// this is middleware that allows express to parse JSON request bodies
server.use(express.json());

server.post('/api/users', (req, res) => {
  // destructured request body data
  const { name, bio } = req.body;
  // check if name or bio is missing in request body
  if (!name || !bio) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide name and bio for the user.' });
  } else {
    //add new name user to db
    users
      .insert(req.body)
      .then((user) => {
        res.status(201).json(user);
      })
      .catch(() => {
        res.status(500).json({
          errorMessage:
            'There was an error while saving the user to the database',
        });
      });
  }
});

// get a list of all the db users
server.get('/api/users', (req, res) => {
  users
    .find()
    .then((userlist) => {
      res.status(200).json(userlist);
    })
    .catch(() => {
      res.status(500).json({
        errorMessage: 'The users information could not be retrieved.',
      });
    });
});

// get a specific user from the db list
server.get('/api/users/:id', (req, res) => {
  users
    //find user by unique id
    .findById(req.params.id)
    .then((user) => {
      // if user id is found return that user
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist.' });
      }
    })
    .catch(() => {
      res
        .status(500)
        .json({ errorMessage: 'The user information could not be retrieved.' });
    });
});

// delete a user from the list
server.delete('/api/users/:id', (req, res) => {
  users
    .remove(req.params.id)
    .then((user) => {
      if (user === user) {
        res.status(200).json({
          message: 'the user was deleted.',
        });
      } else {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist.' });
      }
    })
    .catch(() => {
      res.status(500).json({ errorMessage: 'The user could not be removed' });
    });
});

// update a user in the list
server.put('/api/users/:id', (req, res) => {
  // destructured request body data
  const { name, bio } = req.body;

  if (!name || !bio) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide name and bio for the user.' });
  } else {
    users
      // update matched ID with new request body for bio and name
      .update(req.params.id, req.body)
      .then((user) => {
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({
            message: 'The user with the specified ID does not exist.',
          });
        }
      })
      .catch(() => {
        res.status(500).json({
          errorMessage: 'The user information could not be modified.',
        });
      });
  }
});

const port = 5000;

// start the server on localhost at port 5000
server.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
