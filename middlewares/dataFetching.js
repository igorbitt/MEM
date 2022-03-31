const axios = require('axios');

/* Station api url */
const API_URL = '';

/* Fetch and return data to index.js */
async function fetch(){
    return await axios.get(API_URL)
        .then(response => response.data)
}
module.exports = { fetch };