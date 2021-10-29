const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ebhzh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri)
async function run(){
    try{
        await client.connect();
        const database = client.db('theme_park');
        const offerCollection = database.collection('offers');

        //GET OFFERS API
        app.get('/offers', async(req,res)=>{
            const cursor = offerCollection.find({});

            const offers = await cursor.toArray();
            res.send(offers);
        });

        //POST OFFERS API
        app.post('/offers',async(req,res)=>{
            const addService = req.body;
            const result = await offerCollection.insertOne(addService);
            res.json(result);
        })

    }
    finally{
        //await client.close();
    }

}
run().catch(console.dir);

app.get('/', (req, res) =>{
    res.send('Theme park running');
});

app.listen(port, ()=>{
    console.log('hey i am running')
})

//ThemeParkUser
//rDSNWmSbo0N8iW0m