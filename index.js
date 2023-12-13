const express = require('express')
const cors = require('cors')
const SSLCommerzPayment = require('sslcommerz-lts')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5001

// middle Ware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3gsgkud.mongodb.net/?retryWrites=true&w=majority`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


const store_id = process.env.SSL_STORE_ID
const store_passwd = process.env.SSL_PASSWORD
const is_live = false //true for live, false for sandbox

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const productCollection = client.db('productDB').collection('product')
    const selectedCollection = client.db('productDB').collection('AddToCart')
    const WishedCollection = client.db('productDB').collection('wishCart')


    app.get('/addProduct', async (req, res) => {
      const curser = productCollection.find();
      const result = await curser.toArray()
      res.send(result)
    })

    app.get('/addProduct/:id', async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: new ObjectId(id) }
      const result = await productCollection.findOne(qurey)
      res.send(result)
    })


    app.post('/addProduct', async (req, res) => {
      const newProduct = req.body
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct)
      res.send(result)
    })

    app.put('/addProduct/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upset: true }
      const updatedProduct = req.body
      const product = {
        $set: {
          name: updatedProduct.name,
          brandName: updatedProduct.brandName,
          type: updatedProduct.type,
          price: updatedProduct.price,
          photo: updatedProduct.photo,
          rating: updatedProduct.rating,
          description: updatedProduct.description
        }
      }
      const result = await productCollection.updateMany(filter, product, options)
      res.send(result)
    })


    // selectionCollection

    app.get('/addToCart', async (req, res) => {
      const curser = selectedCollection.find();
      const result = await curser.toArray()
      res.send(result)
    })

    app.get('/addToCart/:id', async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: new ObjectId(id) }
      const result = await selectedCollection.findOne(qurey)
      res.send(result)
    })

    app.post('/addToCart', async (req, res) => {
      const Product = req.body
      console.log(Product);
      const result = await selectedCollection.insertOne(Product)
      res.send(result)
    })

    app.delete('/addToCart/:id', async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: new ObjectId(id) }
      const result = await selectedCollection.deleteOne(qurey)
      res.send(result)
    })


    // wishCart
    app.post('/wishCart', async (req, res) => {
      const Product = req.body
      console.log(Product);
      const result = await WishedCollection.insertOne(Product)
      res.send(result)
    })

    // get
    app.get('/wishCart', async (req, res) => {
      const curser = WishedCollection.find();
      const result = await curser.toArray()
      res.send(result)
    })

    // delete
    app.delete('/wishCart/:id', async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: new ObjectId(id) }
      const result = await WishedCollection.deleteOne(qurey)
      res.send(result)
    })

    // paymant
    app.post('/paymant', async(req, res)=>{
      console.log(req.body);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('mobile shop server is running')
})

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
})