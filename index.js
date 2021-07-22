const express = require("express");

const app = express();
const port= 3001;
const maxSize = 10;

// parse JSON using express
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, PURGE, DELETE");
    next();
});

let cachedKeys = [];

const compare = ((a, b) => {
    const tsA = a.timestamp;
    const tsB = b.timestamp;

    return ((tsA > tsB) ? 1 : ((tsA < tsB) ? -1 : 0));
});

//
// get /keys
// returns all cachedKeys (Not part of requirements)
//
app.get('/keys', (request, response) => {
    cachedKeys.sort(compare);
    response.json(cachedKeys);
});

//
// Give ability to find out what the max size value is
//
app.get('/max', (request, response) => {
    response.status(200).json(maxSize);
});

//
// purge /keys
// Reset cachedKeys list by clearing all entries
// Build two versions of the purge; one with purge and the other with post.
// Using Postman, they both work. I was having issues from the frontend so
// wanted to eliminate the issue that the purge was causing the issues.
//
app.purge('/keys', (request, response) => {
    cachedKeys = [];
    response.status(200).send("Cached Keys have been cleared.");
});
// using post instead of purge
app.post('/keys/reset', (request, response) => {
    cachedKeys = [];
    response.status(200).send("Cached Keys have been removed.");
});

//
// put /key
// Add or update the cachedKey list based on object specified
//
app.put("/key", (request, response) => {
    const newValue = request.body;
    const currentDate = new Date();
    const timestamp = currentDate.getTime();

    // Does the key already exist? If so, update the timestamp
    const cachedKey = cachedKeys.find((cachedRecord, index) => {
        if (cachedRecord.key === newValue.key) {
            cachedRecord.value = newValue.value;
            cachedRecord.timestamp = timestamp;
            return true;
        }
    });

    //
    // Adding. Make sure we haven't reached the maxSize limit
    //
    if (cachedKey === undefined) {
        // maxSize reached. Remove LRU item
        if (cachedKeys.length === maxSize) {
            cachedKeys.sort(compare);
            cachedKeys.splice(0,1);
        }
        // Add the new item
        newValue.timestamp = timestamp;
        cachedKeys.push(newValue);
    }

    response.status(201).send("Cached Key is added to the list");
});

//
// get /key/:id
// Get a single entry from cachedKey
//
app.get("/key/:id", (request, response) => {
    const inputKey = request.params.id;
    const currentDate = new Date();
    const timestamp = currentDate.getTime();

    for (let cachedKey of cachedKeys) {
        if (cachedKey.key === inputKey) {
            cachedKey.timestamp = timestamp;
            response.status(200).json(cachedKey);
            return;
        }
    }

    response.status(404).send('Cached Key not found');
});

app.delete('/key/:id', (request, response) => {
    const inputKey = request.params.id;
    const count = cachedKeys.length;

    cachedKeys = cachedKeys.filter(cachedKey => {
        if (cachedKey.key !== inputKey) {
            return true;
        }
        return false;
    });

    // Using find would have worked as well.
    if (count === cachedKeys.length) {
        response.status(404).send('Cached Key to be deleted does not exist.');
    } else {
        response.status(200).send('Cached Key has been deleted');
    }
});

app.listen(port, () => console.log(`Server listening at port ${port}`));