const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express");
const cors = require("cors");
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("This Server is Running...🌟🌟");
});

const uri = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@tariqul-islam.mchvj.mongodb.net/?retryWrites=true&w=majority&appName=TARIQUL-ISLAM`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const coffeeCollection = client.db('CoffeesData').collection("Coffees")

        app.post('/coffees', async (req, res) => {
            const newCoffees = req.body
            const result = await coffeeCollection.insertOne(newCoffees)
            res.send(result)
        })

        app.get('/coffees', async (req, res) => {
            const cursor = coffeeCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/coffees/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await coffeeCollection.findOne(query)
            res.send(result)
        })

        app.delete('/coffees/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await coffeeCollection.deleteOne(query)
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("☘️  You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Your Server Running on Port: ${port}💫`);
});
