/* 1. Import Express and axios */
const express = require('express');
const axios = require('axios');

/* 2. Create an express app */
const app = express();

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


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
        
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }

});

app.get('/update', async (req, res) => {
    // http://localhost:3000/update?email=rick@crowbars.net
    const email = req.query.email;

    const getContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email&properties=email,favorite_books`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(getContact, { headers });
        const data = response.data;

        // res.json(data);
        res.render('update', {userEmail: data.properties.email, favoriteBook: data.properties.favorite_books});
        
    } catch(err) {
        console.error(err);
    }
});
/* Here is a simple description of all:

POST is always for creating a resource ( does not matter if it was duplicated )
PUT is for checking if resource exists then update, else create new resource
PATCH is always for updating a resource */
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_books": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});


app.listen(3000, () => console.log('Listening on http://localhost:3000'));

