const express = require('express');
const cors = require('cors');  
const app = express();
const port = 3000;

app.use(cors());

app.get('/api/check-auth', (req, res) => {
    res.json({ 
        "isAuthorized" : true
    });
});

app.get('/api/user-info', (req, res) => {
    res.json({ 
        "img" : "avatar.jpg",
        "name" : "Василенко Данил",
        "id" : "ID: 942744235"
    });
});

app.get('/api/refer-info', (req, res) => {
    res.json({ 
        "img" : "avatar.jpg",
        "name" : "Василенко Данил",
        "id" : "ID: 942744235",
        "status": "Leader",
        "links": {
            "vk" : "link",
            "telegram" : "link",
            "whatsapp" : "link",
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});