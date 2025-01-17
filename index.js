const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());

//mongoDb connect



app.get('/', (req, res) => {
  res.send('art and craft server is running')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fdffxhb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    // craft database of homepage
    const craftCollection = client.db('craftsDB').collection('craft')
    const userCollection = client.db('craftsDB').collection('user')

    //add craft items DB for  All Art & Craft Items page
    const addCraftCollection = client.db('addCrafts').collection('newCrafts')
    const subCategories = client.db('addCrafts').collection('subCategories')



    // craft items 
    app.get('/crafts', async (req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/crafts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await craftCollection.findOne(query);
      res.send(result)
    })


    // app.post('/crafts', async (req, res) => {
    //   const newCraft = req.body
    //   const result = await craftCollection.insertOne(newCraft);
    //   res.send(result)
    // })


    //add all craft items

    app.get('/addCraftItems', async (req, res) => {
      const cursor = addCraftCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/addCraftItems/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await addCraftCollection.findOne(query);
      res.send(result)
    })

    app.post('/addCraftItems', async (req, res) => {
      const newCrafts = req.body;
      console.log(newCrafts);
      const result = await addCraftCollection.insertOne(newCrafts)
      res.send(result)
    })


    // myArtAndCraft
    app.get('/myArtAndCraft/:email', async (req, res) => {
      console.log(req.params.email);
      const result = await addCraftCollection.find({ email: req.params.email }).toArray();
      res.send(result)
    })

    app.get('/myArtAndCraft/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await addCraftCollection.findOne(query);
      res.send(result)
    })

    app.put('/addCraftItems/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const data = {
        $set: {
          image: req.body.image,
          itemName: req.body.itemName,
          subcategoryName: req.body.subcategoryName,
          shortDescription: req.body.shortDescription,
          price: req.body.price,
          rating: req.body.rating,
          customization: req.body.customization,
          processingTime: req.body.processingTime,
          stockStatus: req.body.stockStatus,
          email: req.body.email,
          name: req.body.name,
        }
      }
      const result = await addCraftCollection.updateOne(query, data);
      console.log(result);
      res.send(result)
    })

    app.delete('/addCraftItems/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await addCraftCollection.deleteOne(query);
      res.send(result)
    })


    //user related apis

    app.get('/users', async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    })

    
    app.get('/subCategories', async (req, res) => {
      const cursor = subCategories.find()
      const result = await cursor.toArray();
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.listen(port, () => {
  console.log(`art server is running on port, ${port}`);
})