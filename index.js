const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express");
const cors = require("cors");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.set('json spaces', 4);

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
        const coffeeCollection = client.db('CoffeesData').collection("Coffees");
        const userCollection = client.db('CoffeesData').collection("Users")

        // Add a new coffee
        app.post('/coffees', async (req, res, next) => {
            try {
                const newCoffees = req.body;
                const result = await coffeeCollection.insertOne(newCoffees);
                res.send(result);
            } catch (error) {
                next(error)
            }
        });

        // Add a new user
        app.post('/users', async (req, res, next) => {
            try {
                const newUser = req.body
                const result = await userCollection.insertOne(newUser)
                res.send(result)
            } catch (error) {
                next(error)
            }
        })

        // Get all coffees
        app.get('/coffees', async (req, res, next) => {
            try {
                const cursor = coffeeCollection.find();
                const result = await cursor.toArray();
                res.json(result);
            } catch (error) {
                next(error)
            }
        });

        // Get all users
        app.get('/users', async (req, res, next) => {
            try {
                const cursor = userCollection.find()
                const result = await cursor.toArray()
                res.json(result)
            } catch (error) {
                next(error)
            }
        })

        // Get a coffee by ID
        app.get('/coffees/:id', async (req, res, next) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };
                const result = await coffeeCollection.findOne(query);
                res.json(result);
            } catch (error) {
                next(error)
            }
        });

        // Update a coffee by ID
        app.put('/coffees/:id', async (req, res, next) => {
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
            } catch (error) {
                next(error)
            }
        })

        // Update last login time
        app.patch('/users', async (req, res, next) => {
            try {
                const email = req.body.email
                const query = { email: email }
                const lastSignInTime = {
                    $set: {
                        lastSignInTime: req.body.lastSignInTime
                    }
                }
                const result = await userCollection.updateOne(query, lastSignInTime)
                res.send(result)
            } catch (error) {
                next(error)
            }
        })

        // Delete a coffee by ID
        app.delete('/coffees/:id', async (req, res, next) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };
                const result = await coffeeCollection.deleteOne(query);
                res.send(result);
            } catch (error) {
                next(error)
            }
        });

        console.log("☘️  You successfully connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
}

run().catch((error) => {
    console.error('Error in the main run function:', error.message);
});

app.use((err, req, res, next) => {
    console.error("Error occurred:", err.stack)
    res.status(err.status || 500).send({
        success: false,
        message: err.message || "Internal Server Error",
    })
})

app.listen(port, () => {
    console.log(`Your Server Running on Port: ${port}💫`);
});

