const axios = require('axios');
const API_URL = 'https://api.npoint.io/5bb98c17ad3552c11632';
async function fetch(){
    return await axios.get(API_URL)
        .then(response => response.data)
        .catch((error) => {
            console.log(error.message)
        });
}
module.exports.fetch = fetch;