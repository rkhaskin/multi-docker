const keys = require('./keys');

// express setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// postgres client setup
const {Pool} = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});
pgClient.on('error', () => console.log('Lost PG connection'));

pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .then( () => console.log("PG table successfully created"))
    .catch((err) => console.log(err));

// connection to redis
const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

// express routes
app.get('/', (req, res) => {
    res.send('Hi');
});

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('Select * from values');
    console.log("server:index values = ",  values);
    res.send(values.rows);
});

// redis does not have promise support. So use callback
app.get('/values/current', async (req, res) => {
    console.log("server:index current");
    redisClient.hgetall('values', (err, values) => {
    console.log("server:index current = ",  values);

        res.send(values);
    })
});

app.post('/values', async (req, res) => {
    const index = req.body.index;
    console.log("server:index = ",  index);
   
    if (parseInt(index) > 40)
        return res.status(422).send('Index too high');

    redisClient.hset('values', index, 'Nothing yet!');
    
    console.log("before publish", index);
    redisPublisher.publish('insert', index);
    console.log("after publish", index);

    pgClient.query('insert into values(number) values($1)', [index]);

    res.send({working:true});
});

app.listen(5000, err => {
    console.log('Listening');
});