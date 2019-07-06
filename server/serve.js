const express = require('express');
const { AuthenticationError } = require('apollo-server')
const { ApolloServer, gql } = require('apollo-server-express');
const cryptoRandomString = require('crypto-random-string');
const crypto = require('crypto');
const cors = require('cors')

db = require('knex')(require('../knexfile')['development']);


// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Server {
    id: Int
    name: String
    description: String
    channels: [Channel]
  }

  type Account {
    id: Int
    username: String
  }

  type Profile {
    id: Int
    username: String
    email: String
  }

  type Channel {
    id: Int
    name: String
    description: String
  }

  type Query {
    ping: String
  }
`;

const addBoard = (name, description) =>
  db('boards').insert({name, description}, 'boardID')
    .then((x) => x[0])

const addThread = (boardID, name, message, author) =>
  db('threads').insert({name, boardID}, 'threadID')
    .then((id) =>
      db('posts').insert({message, author, threadID: id[0]}).return(id[0]))

const addPost = (threadID, message, author) =>
  db('posts').insert({message, author, threadID}, 'postID')
    .then((x) => x[0])

const getBoards = () =>
  db('boards').select()

const getBoard = (id) =>
  db('boards').where({boardID: id}).select()
    .then((x) => x[0])

const getChannel = (id) =>
  db('channels').where({channelID: id}).select()
    .then((x) => x[0])

const getThreads = (id) =>
  db('threads').select().where({boardID: id})

const getThread = (id) =>
  db('threads').where({threadID: id}).select()
    .then((x) => x[0])

const getPosts = (id) =>
  db('posts').select().where({threadID: id})

const getPost = (id) =>
  db('posts').where({postID: id}).select()
    .then((x) => x[0])

const getUser = (id) =>
  db('accounts').where({accountID: id}).select()
    .then((x) => x[0])

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    ping: (root, args, { accountID }) => getUser(accountID).then(x => "welcome back, " + x.username)
  },

  Channel: {
    id: (root) => root.channelID,
    name: (root) => getChannelName(root.boardID),
  },
};



const generateNonce = () =>
  cryptoRandomString({length: 64, type: 'hex'})

const hash = (password, salt) =>
  crypto.pbkdf2Sync(password, salt, 200000, 512, 'sha512')

const createNewKey = async (id) => {
  const [value] = await db('accessKeys').insert({ value: generateNonce(), accountID: id }, 'value');
  return value;
}

const authenticate = async (user, password) => {
  const [{passwordHash, nonce}] = await db('accounts').select('passwordHash', 'nonce').where({ username: user });
  var currentHash = hash(password, nonce);
  if (crypto.timingSafeEqual(currentHash, Buffer.from(passwordHash, 'hex'))) {
    const [id] = await db('accounts').select('accountID').where({ username: user });
    return createNewKey(id.accountID);
  } else {
    throw new Error('incorrect password');
  }
}

const createAccount = async (username, password, email) => {
  const [v] = await db('accounts').count('accountID').where({ username: username });
  if (v.count != "0") {
    throw new Error('username already exists');
  }
  var nonce = generateNonce();
  var passwordHash = hash(password, nonce).toString('hex');
  const [id] = await db('accounts').insert({ username, email, passwordHash, nonce }, 'accountID');
  return createNewKey(id);
}

var cache = {};

const getAccount = async (key) => {
  var c = cache[key];
  if (c) {
    return c;
  } else {
    const [id] = await db('accessKeys').select('accountID').where({ value: key });
    if (!id) { throw new Error('invalid key'); }
    cache[key] = id.accountID;
    return id.accountID;
  }
}

const server = new ApolloServer({
  typeDefs, resolvers,
  context: async ({ req }) => {
   const token = req.headers.authorization;
   if (!token) throw new AuthenticationError('API key required');
   const accountID = await getAccount(token).then((x) => x);
   if (!accountID) throw new AuthenticationError('Invalid API key');
   return { accountID };
 },
});

var app = express();
server.applyMiddleware({ app });
app.use(express.static('public'))
app.use(express.json())
app.use(cors())

app.get('/',
  (req, res) => res.sendFile('public/index.html')
)

app.post('/login',
  (req, res) => {
    const {user, password} = req.body;
    authenticate(user, password)
    .then(key => res.send({status: true, value: key}))
    .catch(e => res.send({status: false}));
  }
)

app.post('/register',
  (req, res) => {
    const {user, password, email} = req.body;
    createAccount(user, password, email)
    .then(key => res.send({status: true, value, key}))
    .catch(e => res.send({status: false}));
  }
)

app.get('/testkey',
  (req, res) => {
    getAccount(req.headers.authorization)
    .then(id => res.send({status: true}))
    .catch(e => res.send({status: false}))
  }
)

app.listen(4000);
