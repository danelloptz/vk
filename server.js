const express = require('express');
const cors = require('cors');  
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


app.get('/api/check-auth', (req, res) => {
    res.json({ 
        "isAuthorized" : true
    });
});

app.get('/api/user-info', (req, res) => {
    res.json({ 
        "img" : "avatar.jpg",
        "name" : "Василенко Данил",
        "id" : "ID: 942744235",
        "status": "Leader",
        "sentence" : "Здесь написано какое-то вип-предложение",
        "links": {
            "vk" : "link",
            "telegram" : "link",
            "whatsapp" : "link",
        },
        "groupLink" : "https://vk.com/profcom.petrsu",
        "balance": "80"
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

app.get('/api/assembly-groups', (req, res) => {
    res.json({ 
        "groups": [
            {
                "id": "0",
                "link": "link",
                "name": "Название группы",
                "img": "avatar.jpg"
            },
            {
                "id": "1",
                "link": "link",
                "name": "Название группы",
                "img": "avatar.jpg"
            },
            {
                "id": "2",
                "link": "link",
                "name": "Название группы",
                "img": "avatar.jpg"
            },
            {
                "id": "3",
                "link": "link",
                "name": "Название группы",
                "img": "avatar.jpg"
            },
            {
                "id": "4",
                "link": "link",
                "name": "Название группы",
                "img": "avatar.jpg"
            },
            {
                "id": "5",
                "link": "link",
                "name": "Название группы",
                "img": "avatar.jpg"
            },
            {
                "id": "6",
                "link": "link",
                "name": "Название группы",
                "img": "avatar.jpg"
            },
            {
                "id": "7",
                "link": "link",
                "name": "Название группы",
                "img": "avatar.jpg"
            },
            {
                "id": "8",
                "link": "link",
                "name": "Название группы",
                "img": "avatar.jpg"
            },
            {
                "id": "9",
                "link": "link",
                "name": "Название группы",
                "img": "avatar.jpg"
            },
        ]
    });
});

app.post('/api/get-add', (req, res) => {
    if (!req.body) return res.sendStatus(400);

    const k = parseInt(req.body.len, 10);
    if (isNaN(k) || k <= 0) {
        return res.status(400).json({ error: 'Invalid length' });
    }

    const photos = ['wide-bg2.jpg', 'wide-bg.jpg'];

    const adds = Array.from({ length: k }, () => {
        const randomIndex = Math.floor(Math.random() * photos.length);
        return { img: photos[randomIndex] };
    });

    res.json({
        adds
    });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});