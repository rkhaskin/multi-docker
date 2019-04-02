const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

// duplicate of the redis client
const sub = redisClient.duplicate();

function fib(index) {
    if (index < 2) return 1;

    let val = fib(index - 1) + fib(index - 2);
    console.log("SSSSSSS", val)
    return val;
}

// sub stands for subscription. Listen to a new message 
// and run a callback and insert the value in the hash
sub.on('message', (channel, message) => {
    console.log("EEEEEEEEEEEEEE", message, parseInt(message))
    redisClient.hset('values', message, fib(parseInt(message)));
});

// when a new event is inserted in to redis, fib will be called
sub.subscribe('insert');