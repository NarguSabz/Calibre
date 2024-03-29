/*cette methode permet de faire un requete post ajax au route inscription et si le courriel n est pas existant dans la bd 
le compte de client va etre cree sinon l utilisateur devrait changer le courriel jusqu a ce qu il soit unique
l utilisation d ajax permet de faire des requetes sans la rechargement de la page et pour que l utilisateur n aie
 pas a reentrer tous ses donnees en cas d erreur*/
function soummettreFormulaire() {
	/*si le champs d avertissement de nom d utilisateur est vide on fait une requete post sinon on attend jusqu a
	 ce qu il sois vide pour proceder avec la requete post ajax*/
	var formulaire = $("#formulaireInscription");
	calorie_quotidien_recommendee = {
		total: caloriesRecommendee,
		repas: CaloriesParRepas
	}

	$.ajax({
		url: "http://localhost:3000/inscription",
		type: "POST",
		data: formulaire.serialize() + '&BMR=' + BMR + '&imc=' + Imc + '&TDEE=' + TDEE + '&calorie_quotidien_recommendee=' + JSON.stringify(calorie_quotidien_recommendee),
		dataType: "json",
		success: gererSuccesCourriel,
	});
}

//cette methode permet de valider le nom d utilisateur et elle est appelee a chaque keyup dans le champs de nom d utilisateur
async function validerNomUtilisateur(nomUtilisateur) {
	//on fait une requete get ajax pour verifier si le nom d utilisateur est deja existant dans la bd
	if (nomUtilisateur.value) {
		var url = encodeURI("http://localhost:3000/inscription/" + nomUtilisateur.value);
		await $.ajax({
			url: url,
			type: "GET",
			dataType: "json",
			success: gererSucces,
		})
	}
	validerForm(nomUtilisateur)
}
const gererSucces = (result) => {
	//si le nom d utilisateur est existant le champs d avertissement va contenir un avertissement sinon il sera vide
	console.log(result.msg)
	document.getElementById("avertirNomUtilisateur").innerHTML =
		result.msg;
}
const gererSuccesCourriel = (result) => {
	//on alert le resultat sois : courriel deja existant ou creation avec succes
	if (result.titre == "existant") {
		//si le resultat de route post est existant on vide le champs de courriel
		document.getElementById("email").value = "";
		//si le nom d utilisateur est existant le champs d avertissement va contenir un avertissement sinon il sera vide
		document.getElementById("avertirEmail").innerHTML = result.msg;
	} else {
		//si le compte a ete cree avec succes on va a la page d accueil
		alert('votre compte a été crée avec succès');
		location.replace("/");
	}
}

var tabcourant = 0; // le tab courant est 0 au debut
var unite = ''
var unitePrefere = ''
var Imc = 0
var BMR = 0
var TDEE = 0
var caloriesRecommendee = 0
var CaloriesParRepas = {}
document.addEventListener('DOMContentLoaded', function () {
	unite = document.getElementById("unitePrefere");
	unitePrefere = unite.options[unite.selectedIndex].value;
	if (unitePrefere == "metrique") {
		unitePoids = 'kg'
	} else {
		unitePoids = 'lbs'
	}
	document.getElementById('unitePrefere').addEventListener("change", function () {
		unite = document.getElementById("unitePrefere");
		unitePrefere = unite.options[unite.selectedIndex].value;
		if (unitePrefere == "metrique") {
			unitePoids = 'kg'
		} else {
			unitePoids = 'lbs'
		}
		afficherUnite();
	});
});
// affichage du tab courant
function montrerTab(n) {
	tabcourant = n;
	// cette fonction affiche le tab courant
	var x = document.getElementsByClassName("tab");
	x[n].style.display = "block";
	//pour fixer les bouttons prochain précédent
	if (n == 0) {
		document.getElementById("prevBtn").style.display = "none";
		document.getElementById("nextBtn").setAttribute('onclick','afficherModalAlert()')
	} else {
		document.getElementById("prevBtn").style.display = "inline";
		document.getElementById("nextBtn").setAttribute('onclick','changerTab(1)')
	}

	if (n == (x.length - 1)) {
		document.getElementById("nextBtn").innerHTML = "Soumettre";
	} else {
		document.getElementById("nextBtn").innerHTML = "Prochain";
	}
	//corrige le indicateur d etape en bas du formulaire
	indiquerEtap(n)
}

function changerTab(n) {

	//cette methode permet de changer de tab selon le bouton clique
	var x = document.getElementsByClassName("tab");

	// si validation echoue pour le tab courant et bouton prochain clique, retourne faux
	var tabValider = ''
	if(tabcourant != 6){
			tabValider =validerTab() }else{
				tabValider = true;
			}
	if (tabValider && n == 1) {
		if (tabcourant == 1) {
			let imcCalculee = calculerIMC(unitePrefere,unitePoids);
			Imc = imcCalculee.Imc
			let minEchelle = imcCalculee.minEchelle
			let maxEchelle = imcCalculee.maxEchelle
			let situation = afficherIMC(Imc, minEchelle, maxEchelle);
			afficherSituation(Imc, situation);
			let calcul = calculerTDEE(unitePrefere,unitePoids)
			BMR = calcul.BMR
			TDEE = calcul.TDEE
			validerForm(document.getElementById('objectif_poids'))
		} else if (tabcourant == 2) {
			var objectifSemaine = document.getElementById('objSemaine');
			var input = objectifSemaine.getElementsByTagName('input');
			if (Math.round(parseFloat(document.getElementById(unitePoids).value) * 10) / 10 == Math.round(parseFloat(document.getElementById('objectif_poids').value) * 10) / 10) {
				input[0].setAttribute('disabled', '')
				objectifSemaine.style.display = "none"
			} else {
				input[0].removeAttribute("disabled");
				objectifSemaine.style.display = "block"
			}
		}
		else if (tabcourant == 3) {
			caloriesRecommendee = calculerCalories(unitePrefere,unitePoids);
		}else if (tabcourant == 4){			
			CaloriesParRepas = calculerCaloriesParRepas(caloriesRecommendee);
		}
	} else if (!tabValider) {
		if (n == 1) { return false }
		else if (n == -1) { document.getElementsByClassName("step")[tabcourant].className = document.getElementsByClassName("step")[tabcourant].className.replace(" finish", ""); }
	}

	x[tabcourant].style.display = "none";
	// numero de tabcourant est changee
	tabcourant = tabcourant + n;

	// si fin du form on va soumettre
	if (tabcourant >= x.length) {
		// document.getElementById("formulaireInscription").submit();
		soummettreFormulaire();
		tabcourant = x.length - 1
		x[tabcourant].style.display = "block";
		return false;
	} else {//sinon on va afficher le tab voulu
		montrerTab(tabcourant);
	}

}
function validerTab() {
	// cette fonction permet de valider le tab courant
	var valide = true;
	var x, y, i;
	x = document.getElementsByClassName("tab");
	y = x[tabcourant].getElementsByTagName("input");
	// verifie si les inputs d un tab ne sont pas vides
	for (let i = 0; i < y.length; i++) {
		// si vide le nom de la classe de l input change a invalid et par css la couleur de background est mis a rouge
		if (y[i].className == "invalid" && !y[i].disabled) {
			// valid est mis a faux
			return false;
		} else if ((y[i].value == "" || y[i].value.trim() == "") && !y[i].disabled) {
			y[i].className = "invalid"
			valide = false;
		}
	}
	// si valid l indicateur etape indique le fin de l etape
	if (valide) {
		document.getElementsByClassName("step")[tabcourant].className = "step finish";
	}
	return valide; // retourn si validee ou pas
}
function validerForm(element) {
	var valide = true;
	// cette fonction permet de valider le tab courant

	// verifie si les inputs d un tab ne sont pas vides
	// si vide le nom de la classe de l input change a invalid et par css la couleur de background est mis a rouge
	if (element.name in { "age": '', "taille": '', "poids": '', "objectif_de_poids_saine": '', "objectif_par_semaine": '', "repas_par_jour": '' }) {
		let ageTaillePoids = validerAgeTaillePoids(element.value, element.min, element.max, element.id, unitePrefere,unitePoids)
		valide = ageTaillePoids.validite
		changerValidite("message " + element.id, ageTaillePoids.valide)
		ecrireMessage(element, ageTaillePoids.titre, ageTaillePoids.minOuMax, ageTaillePoids.combien)

	} else if (element.name == "email") {
		let courriel = validerCourriel(element.value);
		valide = courriel.validite;
		changerMessage(courriel.id, courriel.display)
	} else if (element.name == "nom_utilisateur") {
		let nomUtilisateurNonExistant = document.getElementById("avertirNomUtilisateur").innerHTML == "";
		let utilisateur = validerUtilisateur(element.value, nomUtilisateurNonExistant);
		valide = utilisateur.validite
		changerValidite(utilisateur.MinMaj.id, utilisateur.MinMaj.validite)
		changerValidite(utilisateur.LongMax.id, utilisateur.LongMax.validite)
		changerValidite(utilisateur.LongMin.id, utilisateur.LongMin.validite)
		changerMessage("patternUtilisateur", "block")
	} else if (element.name == "mot_passe") {
		let motPasse = validerMotPasse(element.value);
		valide = motPasse.validite
		changerValidite(motPasse.min.id, motPasse.min.validite)
		changerValidite(motPasse.maj.id, motPasse.maj.validite)
		changerValidite(motPasse.nombre.id, motPasse.nombre.validite)
		changerValidite(motPasse.longueurMin.id, motPasse.longueurMin.validite)
		changerMessage("patternMotPasse", "block")
	}
	if (!valide) {
		element.className = "invalid";
	} else {
		element.className = "";
	}
}
// si valid l indicateur etape indique le fin de l etape
// retourn si validee ou pas

function validerAgeTaillePoids(valeur, min, max, id, unitePrefere,unitePoids) {
	var titre = id;
	if (id == "objectif_poids" || id == "objectifSemaine") {
		titre = unitePoids
	}
	if (id == 'repas' && !Number.isInteger(parseFloat(valeur))) {
		return { 'validite': false, 'titre': titre, 'minOuMax': '', 'valide': 'invalid', 'combien': 'un entier' };
	} else if (valeur < parseFloat(min)) {
		//document.getElementById("message " + element.id).className = "invalid";
		//document.getElementById("message " + element.id).innerHTML = "Votre " + element.name.replaceAll("_", " ") + " doit etre plus que " + element.min + " " + titre;
		return { 'validite': false, 'titre': titre, 'minOuMax': min, 'valide': 'invalid', 'combien': 'plus que ' };
	} else if (valeur > parseFloat(max)) {
		//document.getElementById("message " + element.id).className = "invalid";
		//document.getElementById("message " + element.id).innerHTML = "Votre " + element.name.replaceAll("_", " ") + " doit etre moins que " + element.max + " " + titre;
		return { 'validite': false, 'titre': titre, 'minOuMax': max, 'valide': 'invalid', 'combien': 'moins que ' };
	}
	//document.getElementById("message " + element.id).className = "";
	//document.getElementById("message " + element.id).innerHTML = "";
	return { 'validite': true, 'titre': '', 'minOuMax': '', 'valide': 'valid', 'combien': '' };
}
function validerCourriel(valeur) {
	var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/g;
	if (valeur.match(pattern)) {
		//document.getElementById("messageCourriel").style.display = "none"
		return { 'id': "messageCourriel", 'display': "none", 'validite': true };
	} else {
		//document.getElementById("messageCourriel").style.display = "block"
		return { 'id': "messageCourriel", 'display': "block", 'validite': false };
	}

}
function validerMotPasse(valeur) {
	//pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
	var valideMin = true;
	var min = { id: '', validite: '' }
	var maj = { id: '', validite: '' }
	var nombre = { id: '', validite: '' }
	var longueurMin = { id: '', validite: '' }
	var pattern = /[a-z]/g;
	if (valeur.match(pattern)) {
		//document.getElementById("minisculeMotPasse").className = "valid";
		min.id = "minisculeMotPasse"
		min.validite = "valid"
		valideMin = true;
	} else {
		//document.getElementById("minisculeMotPasse").className = "invalid";
		min.id = "minisculeMotPasse"
		min.validite = "invalid"
		valideMin = false;
	}
	valideMaj = true;
	pattern = /[A-Z]/g;
	if (valeur.match(pattern)) {
		//document.getElementById("majMotPasse").className = "valid";
		maj.id = "majMotPasse"
		maj.validite = "valid"
		valideMaj = true;
	} else {
		//document.getElementById("majMotPasse").className = "invalid";
		maj.id = "majMotPasse"
		maj.validite = "invalid"
		valideMaj = false;
	}
	valideNombre = true;
	pattern = /[0-9]/g;
	if (valeur.match(pattern)) {
		//document.getElementById("nombreMotPasse").className = "valid";
		nombre.id = "nombreMotPasse"
		nombre.validite = "valid"
		valideNombre = true;
	} else {
		//document.getElementById("nombreMotPasse").className = "invalid";
		nombre.id = "nombreMotPasse"
		nombre.validite = "invalid"
		valideNombre = false;
	}
	valideLongueur = true;
	if (valeur.length < 8) {
		//document.getElementById("longueurMinPass").className = "invalid";
		longueurMin.id = "longueurMinPass"
		longueurMin.validite = "invalid"
		valideLongueur = false;
	} else {
		//document.getElementById("longueurMinPass").className = "valid";
		longueurMin.id = "longueurMinPass"
		longueurMin.validite = "valid"
		valideLongueur = true;
	}
	return { 'validite': valideLongueur && valideMin && valideMaj && valideNombre, 'nombre': nombre, 'longueurMin': longueurMin, 'maj': maj, 'min': min };
}
function validerUtilisateur(valeur, nomUtilisateurNonExistant) {
	//peut contenir juste des nombres, lettres majuscules et lettres miniscules et underscore doit etre entre 8 et 20 caracteres
	//^[a-zA-Z0-9_]{8,20}$
	var valideMinMaj = true;
	var MinMaj = { id: '', validite: '' }
	var LongMin = { id: '', validite: '' }
	var LongMax = { id: '', validite: '' }
	var commenceMiniscule = /^[a-zA-Z0-9_]+$/g;
	if (valeur.match(commenceMiniscule)) {
		//document.getElementById("minisculeUtilisateur").className = "valid";
		MinMaj.id = "minisculeUtilisateur"
		MinMaj.validite = "valid"
		valideMinMaj = true;
	} else {
		//document.getElementById("minisculeUtilisateur").className = "invalid";
		MinMaj.id = "minisculeUtilisateur"
		MinMaj.validite = "invalid"
		valideMinMaj = false;
	}
	valideLongueur = true;
	if (valeur.length < 8) {
		//document.getElementById("longueurMin").className = "invalid";
		//document.getElementById("longueurMax").className = "valid";
		LongMin.id = "longueurMin"
		LongMin.validite = "invalid"
		LongMax.id = "longueurMax"
		LongMax.validite = "valid"
		valideLongueur = false;
	} else if (valeur.length > 20) {
		//document.getElementById("longueurMax").className = "invalid";
		//document.getElementById("longueurMin").className = "valid";
		LongMin.id = "longueurMin"
		LongMin.validite = "valid"
		LongMax.id = "longueurMax"
		LongMax.validite = "invalid"
		valideLongueur = false;
	} else {
		//document.getElementById("longueurMax").className = "valid";
		//document.getElementById("longueurMin").className = "valid";
		LongMin.id = "longueurMin"
		LongMin.validite = "valid"
		LongMax.id = "longueurMax"
		LongMax.validite = "valid"
		valideLongueur = true;
	}
	return { 'MinMaj': MinMaj, "LongMax": LongMax, "LongMin": LongMin, 'validite': (valideLongueur && valideMinMaj && nomUtilisateurNonExistant) };


}
function changerMessage(id, display) {
	document.getElementById(id).style.display = display
}
function changerValidite(id, className) {
	document.getElementById(id).className = className;
}
function ecrireMessage(element, titre, maxouMin, combien) {
	if (titre == 'repas') {
		document.getElementById("message " + element.id).innerHTML = "Votre " + element.name.replaceAll("_", " ") + " doit etre " + combien;
	} else if (titre != "") {
		document.getElementById("message " + element.id).innerHTML = "Votre " + element.name.replaceAll("_", " ") + " doit etre " + combien + maxouMin + " " + titre;
	}
	else {
		document.getElementById("message " + element.id).className = "";
		document.getElementById("message " + element.id).innerHTML = "";
	}
}
function indiquerEtap(n) {
	// cette methode permet d afficher l indicateur d etape
	var i, x
	i, x = document.getElementsByClassName("step");
	for (let i = 0; i < x.length; i++) {
		x[i].className = x[i].className.replace(" active", "");
	}
	//ajout active au nom de classe 
	x[n].className += " active";
}
function afficherUnite() {
	var imperial = document.getElementById("imperial");
	var imperialInputs = imperial.getElementsByTagName("input");
	var metrique = document.getElementById("metrique");
	var metriqueInputs = metrique.getElementsByTagName("input");

	if (unitePrefere == "metrique") {
		for (const input of imperialInputs) {
			input.setAttribute("disabled", "")
		}
		for (const input of metriqueInputs) {
			input.removeAttribute("disabled");
		}
		metrique.style.display = "block"
		imperial.style.display = "none"
	} else if (unitePrefere == "imperial") {
		metrique = document.getElementById("metrique");
		for (const input of metriqueInputs) {
			input.setAttribute("disabled", "")
		}
		for (const input of imperialInputs) {
			input.removeAttribute("disabled");
		}
		imperial.style.display = "block"
		metrique.style.display = "none"
	}
}
function afficherModalAlert(){
	$('#ModalAlert').modal('show'); 
	changerTab(1)
}
module.exports = { validerAgeTaillePoids, validerCourriel, validerMotPasse, validerUtilisateur, validerNomUtilisateur, gererSucces, gererSuccesCourriel, soummettreFormulaire }