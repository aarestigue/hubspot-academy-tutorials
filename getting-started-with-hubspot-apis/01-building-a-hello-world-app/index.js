/* 1. Require Express and Axios */
const express = require('express');
const axios = require('axios');

/* 2. Create an app with Express */
const app = express();

/* 7. To setup view engine, you need the write this middleware in your index.js as follow: */
app.set('view engine', 'pug');

/* 10. Link our public directory to our index file

The app. use() method mounts or puts the specified middleware 
functions at the specified path. This middleware function will be 
executed only when the base of the requested path matches the defined path. */
app.use(express.static(__dirname + '/public'));

/* 4. Set a variable for the token (in a .env file) */
const PRIVATE_APP_ACCESS = "pat-eu1-3d38a751-f8a3-4112-97a2-3c5400640c54";

/* 5. Start with routes: 
a. create a variable for inpoint url
b. Set a variable for headers (Auth & content type - where the app variable created
    is set with type)
*/
app.get('/contacts', async (req, res) => {

    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }

    try {

/* 6. Using async await, and get method call the contacts + headers info */
        const resp = await axios.get(contacts, { headers });
/* 9. We use dot notation to access the data object and only target the results array
(it's easier to loop through the data) */
        const data = resp.data.results;
/* 8. To render the results on the browser not like json but with the pug viw
we change the res.json for res.render */
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }

});


/* 3. Pick the port where the app is listened */
app.listen(3000, () => console.log('Listening on http://localhost:3000'));

