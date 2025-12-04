const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const userCollection = db.collection('user');
const rosterCollection = db.collection('roster');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log(`Connect to database`);
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
})();

function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function addUser(user) {
  console.log('in database');
  await userCollection.insertOne(user);
}

async function updateUser(user) {
  await userCollection.updateOne({ email: user.email }, { $set: user });
}

async function addRoster(email, players, name = "My Roster") {
  const rosterDoc = {
    userEmail: email,
    players,
    name,
    savedAt: new Date()
  };
  const result = await rosterCollection.insertOne(rosterDoc);
  return result.insertedId;
}

async function getUserRoster(email) {
  const user = await getUser(email);
  return user?.currentRoster || [];
}

async function saveUserRoster(email, players) {
  await updateUser({ email, currentRoster: players });
}

module.exports = {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  addRoster,
  getUserRoster,
  saveUserRoster
};
