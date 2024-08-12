const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para registrar un nuevo usuario
app.post('/register', (req, res) => {
  const newUser = req.body;
  const usersFilePath = path.join(__dirname, 'public', 'users.json');

  fs.readFile(usersFilePath, (err, data) => {
    if (err) {
      console.error('Error reading users file:', err);
      return res.status(500).json({ message: 'Error reading users file' });
    }

    const users = JSON.parse(data);
    users.push(newUser);

    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.error('Error writing users file:', err);
        return res.status(500).json({ message: 'Error writing users file' });
      }

      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

// Ruta para obtener los usuarios
app.get('/users', (req, res) => {
  const usersFilePath = path.join(__dirname, 'public', 'users.json');

  fs.readFile(usersFilePath, (err, data) => {
    if (err) {
      console.error('Error reading users file:', err);
      return res.status(500).json({ message: 'Error reading users file' });
    }

    const users = JSON.parse(data);
    res.status(200).json(users);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
