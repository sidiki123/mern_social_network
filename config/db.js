const mongoose =  require('mongoose');

mongoose.connect("mongodb+srv://" + process.env.DB_USER_PASS + "@mern.theq7yh.mongodb.net/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Connecté à MongoDB"))
.catch((err) => console.log("Echec de la connection à MongoDB", err));