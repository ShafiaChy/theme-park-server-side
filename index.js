const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
console.log(app);
//middleware
app.use(cors());
app.use(express.json());
console.log("hi");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ebhzh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// console.log(uri)
async function run() {
  try {
    await client.connect();
    const database = client.db("theme_park");
    const offerCollection = database.collection("offers");
    const orderCollection = database.collection("order");

    //GET OFFERS API
    app.get("/offers", async (req, res) => {
      const cursor = offerCollection.find({});
      const offers = await cursor.toArray();
      res.send(offers);
    });

    //POST OFFERS API
    app.post("/offers", async (req, res) => {
      const addService = req.body;
      const result = await offerCollection.insertOne(addService);
      res.json(result);
    });

    //GET ORDERS API
    app.get("/orders", async (req, res) => {
      const cursor = orderCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });

    //ADD ORDERS API
    app.post("/orders", async (req, res) => {
      const order = req.body;

      const result = await orderCollection.insertOne(order);
      res.json(result);
    });

    //DELETE AN ORDER API
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.json(result);
    });

    //UPDATE STATUS
    app.put("/orders/:id", async (req, res) => {
      const id = req.params;
      console.log(id);
      const updateStatus = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      console.log(updateStatus[0]?.status);

      const updateDoc = {
        $set: {
          status: updateStatus[0]?.status,
        },
      };

      const result = await orderCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log("show id", id);
      res.json(result);
    });
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Yay running");
});

app.listen(port, () => {
  console.log("hey i am running");
});

module.exports = app;
