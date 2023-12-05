// 

const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
// const uri = "mongodb://localhost:27017";
const uri = "mongodb://127.0.0.1:27017";

const port = process.env.port || 3000;

let collection;

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function runDBConnection() {
  try {
    await client.connect();
    collection = client.db().collection('Cat');
    console.log('MongoDB connected');
  } catch (ex) {
    console.error('Error connecting to MongoDB:', ex);
  }
}

app.get('/', function (req, res) {
  res.render('indexMongo.html');
});

app.get('/api/cats', async (req, res) => {
  try {
    const result = await getAllCats();
    res.json({ statusCode: 200, data: result, message: 'get all cats successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ statusCode: 500, message: 'Internal Server Error' });
  }
});

app.post('/api/cat', async (req, res) => {
  try {
    const cat = req.body;
    const result = await postCat(cat);
    res.json({ statusCode: 201, data: result, message: 'success' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ statusCode: 500, message: 'Internal Server Error' });
  }
});

async function postCat(cat) {
  return collection.insertOne(cat);
}

async function getAllCats() {
  return collection.find({}).toArray();
}

app.listen(port, () => {
  console.log('Express server started');
  runDBConnection();
});
