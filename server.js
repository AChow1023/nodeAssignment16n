const express = require("express");
const app = express();
const joi = require("joi");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const multer = require("multer");

const upload = multer({dest: __dirname + "/public/images"});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

let characters = [
    {
        _id: 1, name: "Jonathan Joestar", height: "6ft 5in", nationality: "British", stand_power: "N/A", enemy: "Dio Brando", team: ["Robert E. O. Speedwagon", "Will Anthonio Zeppeli", "Poco", "Tonpetty", "Dire", "Straizo"], img: "/images/jonathanPic.png"
    },
    {
        _id: 2, name: "Joseph Joestar", height: "6ft 5in", nationality: "British-American", stand_power: "Hermit Purple", enemy: "Pillar Men", team: ["Robert E. O. Speedwagon", "Smokey Brown", "Caesar Anthonio Zeppeli", "Rudol Von Stroheim"], img: "/images/josephPic.png"
    },
    {
        _id: 3, name: "Jotaro Kujo", height: "6ft 5in", nationality: "Japanese", stand_power: "Star Platinum", enemy: "Dio Brando", team: ["Muhammad Avdol", "Noriaki Kakyoin", "Jean Pierre Polnareff", "Iggy"], img: "/images/jotaroPic.png"
    },
    {
        _id: 4, name: "Josuke Higashikata", height: "5ft 11in", nationality: "British-Japanese", stand_power: "Crazy Diamond", enemy: "Yoshikage Kira", team: ["Koichi Hirose", "Okuyasu Nijimura", "Rohan Kishibe", "Mikitaka Hazekura"], img: "/images/josukePic.png"
    },
    {
        _id: 5, name: "Giorno Giovanna", height: "5ft 9in", nationality: "British-Italian", stand_power: "Gold Experience", enemy: "Diavolo", team: ["Bruno Bucciarati", "Guido Mista", "Narancia Ghirga", "Pannacotta Fugo", "Leone Abbacchio"], img: "/images/giornoPic.png"
    },
    {
        _id: 6, name: "Jolyne Cujoh", height: "5ft 8.7in", nationality: "American", stand_power: "Stone Free", enemy: "Enrico Pucci", team: ["Ermes Costello", "Emporio Alnino", "Foo Fighters", "Weather Report", "Narciso Anasui"], img: "/images/jolynePic.png"
    }
];

app.get("/api/characters", (req, res) => {
    res.send(characters);
});

app.post("/api/characters", upload.single("img"), (req, res) => {
    const result = validateCharacter(req.body);
    
    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    };

    const character = {
        _id: characters.length + 1,
        name: req.body.name,
        height: req.body.height,
        nationality: req.body.nationality,
        stand_power: req.body.stand_power,
        enemy: req.body.enemy,
        team: req.body.team.split(",")
    }
    if(req.file){
        character.img = "images/" + req.file.filename;
    }
    characters.push(character);
    res.send(characters);
});

app.put("/api/characters/:id", upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);
    const character = characters.find((r) => r._id === id);
    const result = validateCharacter(req.body);
    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    character.name = req.body.name;
    character.height = req.body.height;
    character.nationality = req.body.nationality;
    character.stand_power = req.body.stand_power;
    character.enemy = req.body.enemy;
    character.team = req.body.team.split(",");

    if(req.file){
        character.img = "images/" + req.file.filename;
    }
    res.send(character);
});

app.delete("/api/characters/:id", upload.single("img"), (req,res) =>{
    const id = parseInt(req.params.id);
    const character = characters.find((r) => r._id === id);
    const index = characters.indexOf(character);
    characters.splice(index, 1);
    res.send(character);
});

const validateCharacter = (character) => {
    const schema = joi.object({
        _id: joi.allow(""),
        name: joi.string().min(3).required(),
        height: joi.string().min(3).required(),
        nationality: joi.string().min(3).required(),
        stand_power: joi.string().min(3).required(),
        enemy: joi.string().min(3).required(),
        team: joi.allow("")
    });
    return schema.validate(character);
};

app.listen(3000);