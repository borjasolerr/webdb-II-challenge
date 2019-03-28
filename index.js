const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './data/lambda.sqlite3'
  },
  useNullAsDefault: true
};

const zooDb = knex(knexConfig);

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here

// GET ALL
server.get('/api/zoos', async (req, res) => {
  try {
    const allZoos = await zooDb('zoos');
    res.status(200).json(allZoos);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET ALL by ID
server.get('/api/zoos/:id', async (req, res) => {
  try {
    const zooById = await zooDb('zoos')
      .where({ id: req.params.id })
      .first();
    res.status(200).json(zooById);
  } catch (error) {
    res.status(500).json({ message: 'No entry with specified ID.' });
  }
});

// POST
server.post('/api/zoos', async (req, res) => {
  try {
    const [id] = await zooDb('zoos').insert(req.body);

    const newZoo = await zooDb('zoos')
      .where({ id })
      .first();

    res.status(201).json(newZoo);
  } catch (error) {
    res.status(500).json({ message: 'New zoo cannot be saved at this time.' });
  }
});

// PUT
server.put('/api/zoos/:id', async (req, res) => {
  try {
    const count = await zooDb('zoos')
      .where({ id: req.params.id })
      .update(req.body);

    if (count > 0) {
      const updatedZoo = await zooDb('zoos')
        .where({ id: req.params.id })
        .first();
      res.status(200).json(updatedZoo);
    } else {
      res.status(404).json({ message: 'Zoo with specified ID cannot be found.' });
    }
  } catch (error) {}
});

// DELETE
server.delete('/api/zoos/:id', async (req, res) => {
  try {
    const count = await zooDb('zoos')
      .where({ id: req.params.id })
      .del();

    if (count > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Zoo with specified ID cannot be found.' });
    }
  } catch (error) {}
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on port ${port} ===\n`);
});
