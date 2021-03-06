const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config()

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gbhkw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('Connected to database');
        const database = client.db("carService");
        const servicesCollection = database.collection("services");
        // GET API
        app.get('/services', async (req, res) => {
            const cusor = servicesCollection.find({}); // sob find krote chaile khali object dilei hobe
            const services = await cusor.toArray();
            res.send(services)
        });
        // GET Dynamic API
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id; // Dynamic ID ta nicche
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service)

        })
        // POST API 
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log(service)

            const result = await servicesCollection.insertOne(service);
            console.log(result);

            res.json(result);
        });
        //Delete API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })


    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Genius Car is Running");
});



app.listen(port, () => {
    console.log("Genius car is running in port", port);
});
