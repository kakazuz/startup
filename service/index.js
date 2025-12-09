const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();
const DB = require('./database.js');
const { peerProxy } = require('./peerProxy.js');

const authCookieName = 'token';

// The scores and users are saved in memory and disappear whenever the service is restarted.
let users = [];
let userRosters = {};

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.env.PORT || 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await findUser('email', req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    console.log('Creating user');
    const user = await createUser(req.body.email, req.body.password);

    setAuthCookie(res, user.token);
    console.log('User created');
    res.send({ email: user.email });
  }
});

// GetAuth login an existing user
apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('email', req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      console.log('User logged in');
      user.token = uuid.v4();
      await DB.updateUser(user);
      setAuthCookie(res, user.token);
      console.log('Auth cookie set');
      res.send({ email: user.email });
      console.log('Login successful');
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth logout a user
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    user.token = null;
    await DB.updateUser(user);
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Middleware to verify that the user is authorized to call an endpoint
const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    req.userId = user.email;
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

// GetScores
apiRouter.get('/roster', verifyAuth, async (req, res) => {
  const players = await DB.getUserRoster(req.userId);
  res.json({ players });
});

apiRouter.post('/roster', verifyAuth, async (req, res) => {
  const { players } = req.body;
  await DB.saveUserRoster(req.userId, players);
  res.json({ players });
});


// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

async function getUserRoster(email) {
  const user = await DB.getUser(email);
  return user?.currentRoster || [];
}


async function updateUserRoster(email, players) {
  const updatedUser = {
    email,
    currentRoster: players,
    lastRosterUpdate: new Date()
  };

  await DB.updateUser(updatedUser);      
  return players;                          
}

async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  console.log('password hashed');
  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
    currentRoster: [],
  };
  console.log('creating user in index');
  await DB.addUser(user);

  return user;
}

async function findUser(field, value) {
  if (!value) return null;

  if (field === 'token') {
    return DB.getUserByToken(value);
  }
  console.log('got here');
  return DB.getUser(value);
  console.log('returned user');
}

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

peerProxy(httpService);
