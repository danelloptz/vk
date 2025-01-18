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

app.get('/api/group-info', (req, res) => {
    let name = Math.random() < 0.5 ? 'group_avatar.png' : 'avatar.jpg';
    res.json({ 
        "img" : name,
        "name" : "Название группы ",
        "sentence" : "Здесь написано какое-то вип-предложение",
        "status": "Leader",
        "links": {
            "vk" : "link",
            "telegram" : "link",
            "whatsapp" : "link",
        },
        "groupLink" : "https://vk.com/profcom.petrsu"
    });
});

app.get('/api/is-subscribe', (req, res) => {
    res.json({ 
        "isSubscribe" : true
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});