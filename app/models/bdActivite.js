const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Bd_activite = new Schema({
    nom: { type: String },
    calorie_depense: { type: Number }
});

module.exports = mongoose.model("bdActivite", Bd_activite);