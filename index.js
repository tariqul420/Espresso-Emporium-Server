const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express");
const cors = require("cors");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("This Server is Running...🌟🌟");
});

const uri = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@tariqul-islam.mchvj.mongodb.net/?retryWrites=true&w=majority&appName=TARIQUL-ISLAM`;

// MongoDB client setup
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // await client.connect();
        const coffeeCollection = client.db('CoffeesData').collection("Coffees");

        app.post('/coffees', async (req, res) => {
            try {
                const newCoffees = req.body;
                const result = await coffeeCollection.insertOne(newCoffees);
                res.send(result);
            } catch (error) {
                console.error('Error inserting coffee:', error.message);
                res.status(500).send({ error: "Failed to insert coffee" });
            }
        });

        app.get('/coffees', async (req, res) => {
            try {
                const cursor = coffeeCollection.find();
                const result = await cursor.toArray();
                res.send(result);
            } catch (error) {
                console.error('Error fetching coffees:', error.message);
                res.status(500).send({ error: "Failed to fetch coffees" });
            }
        });

        app.get('/coffees/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };
                const result = await coffeeCollection.findOne(query);
                res.send(result);
            } catch (error) {
                console.error('Error fetching coffee by ID:', error.message);
                res.status(500).send({ error: "Failed to fetch coffee" });
            }
        });

        app.put('/coffees/:id', async (req, res) => {
            try {
                const id = req.params.id
                const query = { _id: new ObjectId(id) }
                const options = { upsert: true };
                const updatedCoffee = req.body
                const coffee = {
                    $set: {
                        name: updatedCoffee.name,
                        chef: updatedCoffee.chef,
                        supplier: updatedCoffee.supplier,
                        taste: updatedCoffee.taste,
                        category: updatedCoffee.category,
                        details: updatedCoffee.details,
                        photo: updatedCoffee.photo,
                        price: updatedCoffee.price
                    }
                }
                const result = await coffeeCollection.updateOne(query, coffee, options)
                res.send(result)
            } catch {
                console.error('Error update coffee: ', error.message);
                res.status(500).send({ error: "Failed to updated coffee" })
            }
        })

        app.delete('/coffees/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };
                const result = await coffeeCollection.deleteOne(query);
                res.send(result);
            } catch (error) {
                console.error('Error deleting coffee:', error.message);
                res.status(500).send({ error: "Failed to delete coffee" });
            }
        });

        // await client.db("admin").command({ ping: 1 });
        console.log("☘️  You successfully connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
}

run().catch((error) => {
    console.error('Error in the main run function:', error.message);
});

app.listen(port, () => {
    console.log(`Your Server Running on Port: ${port}💫`);
});

