const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
let jwt = require('jsonwebtoken');
require('dotenv').config()


// Middle wares
app.use(cors())
app.use(express.json())

// get in the root api
app.get('/', (req, res)=> {
    res.send(`server is Running`)
})

// mongodb connected
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.URI_SECKET;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
       return res.status(401).send({message:'unauthorization access'})
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_TOKEN_SECRET, function(err, decoded){
        if(err){
           return res.status(401).send({message:'unauthorization access'})
        }
        req.decoded = decoded;
    })
    next()
}

async function run () {
    try{
        const servicesCollection = client.db('geniusCar').collection('services');
        const orderCollection = client.db('geniusCar').collection('orders')
        // read api crud er
        app.get('/services', async(req, res)=> {
            const query = {};
            const cursor = servicesCollection.find(query);
            // console.log(cursor)
            const result = await cursor.toArray();
            res.send(result)

        })
        // যেকোন একটি আইডি দিয়ে স্পেসিপিক তথ্য নিতে হলে  এই মেথড ব্যবহার করতে হবে
        app.get('/services/:id', async(req, res)=> {
            const {id} = req.params;
            const query = {_id: ObjectId(id)};
            const result = await servicesCollection.findOne(query);
            res.send(result)
        })


        // order api post method
        app.get('/orders',verifyJWT, async(req, res)=> {
            if(req.decoded.email !== req.query.email){
                 res.status(403).send({message: 'unauthorization access token'});
            }
            let query = {};
            if(req.query.email){
                query= {
                    email: req.query.email,
                }
            }
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders)
        })


        app.post('/jwt', (req, res)=> {
            const user = req.body;
            const token = jwt.sign(user, process.env.JWT_TOKEN_SECRET, {expiresIn: '1hr'});
            res.send({token})
        })


        app.post('/orders', async(req, res)=> {
            const query = req.body;
            const order = await orderCollection.insertOne(query);
            res.send(order)
        })

        app.delete('/orders/:id', async(req, res)=> {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            res.send(result)
        })
       


    }
    catch{(err=> {
        console.log(err.message)
    })}
}
run().catch((error)=> {
    console.log(error)
})










// get.read api method
app.get('/services', (req, res)=> {

})





app.listen(port, ()=> {
    console.log(`server is connected ${port}`)
})