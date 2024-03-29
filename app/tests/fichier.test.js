jest.setTimeout(30000);
const nomDb = "Calibre";
const sel = 10;
const mongoose = require("mongoose")
const utilisateur = require("../models/schemaUtilisateur");
const bcrypt = require("bcrypt");
mongoose.connect("mongodb://127.0.0.1:27017/" + nomDb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

test("tester connexion avec un mauvais mot de passe", async() => {
    try {
        utilisateur_test = new utilisateur({ username: "silvie", email: "silvie@gmail.com", mot_passe: "burger" })
        utilisateur_test.save()
        utilisateur_test.mot_passe = await bcrypt.hash(utilisateur_test.mot_passe, sel)
        utilisateur_test.save()
        const mauvais_mdp = "frites"
        let resultat = bcrypt.compareSync(mauvais_mdp, utilisateur_test.mot_passe)
        expect(resultat).toBe(false)
    } catch (err) {
        throw new Error(err)
    }
});
test("tester connexion avec un bon mot de passe", async() => {
    try {
        utilisateur_test = new utilisateur({ username: "pat", email: "pat@gmail.com", mot_passe: "pizza" })
        utilisateur_test.save()
        utilisateur_test.mot_passe = await bcrypt.hash(utilisateur_test.mot_passe, sel)
        utilisateur_test.save()
        const bon_mdp = "pizza"
        let resultat = bcrypt.compareSync(bon_mdp, utilisateur_test.mot_passe)
        expect(resultat).toBe(true)
    } catch (err) {
        throw new Error(err)
    }
});
test("tester encryption des mots de passe", () => {
    try {
        let mdp_test = "sdgfhr.345"
        let mdp_encrypte = bcrypt.hash(mdp_test, sel)
        expect(mdp_encrypte).toEqual(bcrypt.hash(mdp_test, sel))
    } catch (err) {
        throw new Error(err)
    }
});
test("tester mise jour des calories", async() => {
    try {
        utilisateur_test = new utilisateur({ username: "paul", email: "paul@gmail.com", calorie_quotidien_consommee: 250 })
        utilisateur_test.save()

        utilisateur_test.calorie_quotidien_consommee += 400
        let resultat = utilisateur_test.calorie_quotidien_consommee
        expect(resultat).toEqual(650)
    } catch (err) {
        throw new Error(err)
    }
});
test("tester mise a jour poids", async() => {
    try {
        const utilisateur_test = await utilisateur.findOne({ email: "lyna@lyna.a" });

        utilisateur_test.poids = 60
        utilisateur_test.save()

        expect(utilisateur_test.poids).toEqual(60)
    } catch (err) {
        throw new Error(err)
    }
});
test("tester mise a jour age", async() => {
    try {
        const utilisateur_test = await utilisateur.findOne({ email: "r@r.r" });

        utilisateur_test.age = 40
        utilisateur_test.save()

        expect(utilisateur_test.age).toEqual(40)
    } catch (err) {
        throw new Error(err)
    }
});
test("tester mise a jour des calories quotidiennes", async() => {
    try {
        const utilisateur_test = await utilisateur.findOne({ email: "r@r.r" });

        utilisateur_test.age = 40
        utilisateur_test.save()

        expect(utilisateur_test.poids).toEqual(40)
    } catch (err) {
        throw new Error(err)
    }
});