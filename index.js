const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors')


// Middle wares
app.use(cors())
app.use(express.json())

// get in the root api
app.get('/', (req, res)=> {
    res.send(`server is Running`)
})

// mongodb connected
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://geniusCar:vqd3IqTIY9sn8Jju@cluster0.cn0mdvb.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run () {
    try{
        const servicesCollection = client.db('geniusCar').collection('services');
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
            // console.log(query)
            const result = await servicesCollection.findOne(query);
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