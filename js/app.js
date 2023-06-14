document.addEventListener("DOMContentLoaded", () => {
  const questionElement = document.getElementById('question');
  const optionsElement = document.getElementById('options');
  const resultElement = document.getElementById('result');
  
  // Variables globales pour stocker les données du quiz
  let countries = []; // Tableau pour stocker les données des pays
  let currentQuestion = {}; // Objet pour stocker la question actuelle
  let availableOptions = []; // Tableau pour stocker les options de réponse disponibles
  
  // Fonction pour récupérer les données des pays depuis l'API
  async function getCountriesData() {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      const data = await response.json();
      countries = data;
      startQuiz();
    } catch (error) {
      console.error('Une erreur s\'est produite lors de la récupération des données des pays:', error);
    }
  }
  
  // Fonction pour sélectionner une question aléatoire
  function getRandomQuestion() {
    const randomIndex = Math.floor(Math.random() * countries.length);
    const randomCountry = countries[randomIndex];
  
    // Récupérer le nom du pays et son drapeau
    const countryName = randomCountry.translations.fra.common;
    const flagUrl = randomCountry.flags.svg;
  
    // Récupérer la capitale du pays
    let capital = '';
    if (randomCountry.capital && typeof randomCountry.capital === 'string') {
      capital = randomCountry.translations.fra.common;
    } else if (randomCountry.capital && typeof randomCountry.capital === 'object') {
      // Dans certains cas, la capitale peut être un objet avec des noms de différentes langues
      capital = Object.values(randomCountry.capital)[0];
    }
  
    // Créer un objet pour représenter la question
    return {
      countryName,
      capital,
      flagUrl
    };
  }
  
  // Fonction pour mélanger les options de réponse
  function shuffleOptions(options) {
    const shuffledOptions = [...options];
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }
    return shuffledOptions;
  }
  
  // Fonction pour afficher une nouvelle question
  function displayQuestion() {
    currentQuestion = getRandomQuestion();
    availableOptions = shuffleOptions([currentQuestion.capital, ...getCountriesForOptions()]);
  
    // Afficher le drapeau
    const flagImage = document.createElement('img');
    flagImage.src = currentQuestion.flagUrl;
    flagImage.alt = currentQuestion.countryName;
    optionsElement.appendChild(flagImage);
  
    // Afficher la question
    questionElement.textContent = `Quelle est la capitale de ${currentQuestion.countryName}?`;
  
    // Afficher les options de réponse
    availableOptions.forEach(option => {
      const optionButton = document.createElement('button');
      optionButton.textContent = option;
      optionButton.addEventListener('click', checkAnswer);
      optionsElement.appendChild(optionButton);
    });
  }
  
  // Fonction pour obtenir des pays supplémentaires pour les options de réponse
  function getCountriesForOptions() {
    const countriesForOptions = [];
    while (countriesForOptions.length < 3) {
      const randomIndex = Math.floor(Math.random() * countries.length);
      const randomCountry = countries[randomIndex];
      const randomCapital = getRandomCapital(randomCountry);
      if (randomCapital && !countriesForOptions.includes(randomCapital)) {
        countriesForOptions.push(randomCapital);
      }
    }
    return countriesForOptions;
  }
  
  // Fonction pour récupérer une capitale aléatoire d'un pays
  function getRandomCapital(country) {
    let capital = '';
    if (country.capital && typeof country.capital === 'string') {
      capital = country.capital;
    } else if (country.capital && typeof country.capital === 'object') {
      capital = Object.values(country.capital)[0];
    }
    return capital;
  }
  
  // Fonction pour vérifier la réponse sélectionnée
  function checkAnswer(event) {
    const selectedOption = event.target.textContent;
    if (selectedOption === currentQuestion.capital) {
      resultElement.textContent = 'Bonne réponse!';
    } else {
      resultElement.textContent = `Mauvaise réponse! La capitale de ${currentQuestion.countryName} est ${currentQuestion.capital}.`;
    }
    
    // Nettoyer l'élément des options de réponse
    optionsElement.innerHTML = '';
  
    // Afficher la prochaine question après un court délai
    setTimeout(displayQuestion, 1000);
  }
  
  // Fonction pour démarrer le quiz
  function startQuiz() {
    // Vérifier si des pays sont disponibles
    if (countries.length === 0) {
      console.log('Veuillez attendre le chargement des données des pays...');
      return;
    }
  
    // Afficher la première question
    displayQuestion();
  }
  
  // Démarrer le quiz en récupérant les données des pays depuis l'API
  getCountriesData();


  

  
  });
  