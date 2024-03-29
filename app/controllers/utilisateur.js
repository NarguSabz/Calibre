const Activite = require("../models/activite");
const configuerationConnexion = require("../config/config-connexion");

exports.getActiviteFormAjouter = (req, res, next) => {
    res.render("../views/pages/ajouter-activite", {
        pageTitle: "Ajouter une activite",
        path: "/ajouter-activite",
        utilisateurconnecte: utilisateurCourant,
        utilisateur: configuerationConnexion.utilisateurCourant,
        utilisateurCourant: configuerationConnexion.utilisateurCourant
    });
};

exports.getActiviteFormModifier = (req, res, next) => {
    res.render("../views/pages/modifier-activite", {
        pageTitle: "Modifier une activite",
        path: "/modifier-activite",
        utilisateurconnecte: utilisateurCourant,
        utilisateur: configuerationConnexion.utilisateurCourant,
        utilisateurCourant: configuerationConnexion.utilisateurCourant
    });
};
exports.postActivite = (req, res, next) => {
    const titre = req.body.titre_activite;
    const description = req.body.description;
    const date = req.body.date;

    console.log(
        "Informations de l'activité: " +
        titre +
        "| " +
        description +
        "| " +
        date
    );

    const activite = new Activite({
        titre: titre,
        description: description,
        date: date,
    });
    activite
        .save()
        .then((result) => {
            console.log("Activité créée");
            res.redirect("/afficher-activites");
        })
        .catch((err) => {
            console.log(err);
        });
};

// exports.editActivite = (req, res, next) => {
// 	const titre = req.body.titre;
// 	const description = req.body.description;
// 	const date = req.body.date;
// 	const activite = new Activite({
// 		titre: titre,
// 		description: description,
// 		date: date,
// 	});
// 	activite
// 		.save()
// 		.then((result) => {
// 			console.log("Activite modifiee");
// 			res.redirect("/afficher-activites");

// 		})
// 		.catch((err) => {
// 			console.log(err);
// 		});
// };

exports.getActivite = (req, res, next) => {
    const activiteId = req.params.activiteId;
    console.log(activiteId);
    Activite.findById(activiteId)
        .then((activite) => {
            res.render("page-detaillee-activite", {
                pageTitle: "Details de l'activite",
                path: "/page-detaillee-activite",
                activite: activite,
            });
        })
        .catch((err) => console.log(err));
};

exports.deleteActivite = (req, res, next) => {
    const activiteId = req.body.activiteId;
    Activite.findByIdAndRemove(activiteId)
        .then(() => {
            console.log("Activite supprimee");
            res.redirect("/ajouter-activite");
        })
        .catch((err) => console.log(err));
};

exports.getAllActivities = (req, res, next) => {
    Activite.find({}, function(err, activites) {
        res.render("../views/pages/afficher-activites", {
            listeActivites: activites,
            utilisateurconnecte: utilisateurCourant,
        });
    });
    // .then((activites) => {
    // 	res.render("afficher-activites", {
    // 		pageTitle: "Afficher une activité",
    // 		path: "/afficher-activites",
    // 		activites: activites,
    // 	});
    // })
    // .catch((err) => console.log(err));
};