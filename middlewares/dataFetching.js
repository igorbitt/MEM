const axios = require('axios');

/* Station api url */
const API_URL = 'https://api.npoint.io/5bb98c17ad3552c11632';

/* Fetch and return data to index.js */
async function fetch(){
    return await axios.get(API_URL)
        .then(response => response.data)
}
module.exports = { fetch };