import Ancients from './../data/ancients.js';
import { blueCards, brownCards, greenCards } from './../data/mythicCards/index.js';

const DIFFICULTIES = {
    'veryEasy': 0,
    'easy': 1,
    'normal': 2,
    'hard': 3,
    'insane': 4
};

const ancientCards = document.querySelector('.settings__cards');
const difficulties = document.querySelector('.difficulty');
const shuffleBtn = document.querySelector('.setting__btn');
const deckElement = document.querySelector('.game__deck');
const openedCard = document.querySelector('.game__opened-card');

let selectedAcncientCard = Ancients[ancientCards.querySelector('input[type="radio"]:checked').value];
let selectedDifficulty = difficulties.querySelector('input[type="radio"]:checked').value;
let deck;
let currentCard = 0;

ancientCards.addEventListener('click', onAncientCardClick);
difficulties.addEventListener('click', onDifficultyClick);
shuffleBtn.addEventListener('click', onShuffleBtnClick);
deckElement.addEventListener('click', onDeckClick);

function onAncientCardClick(e) {
    if (e.target.classList.contains('settings__input')) {
        let selectedCardIndex = ancientCards.querySelector('input[type="radio"]:checked').value;
        selectedAcncientCard = Ancients[selectedCardIndex];
    }
}

function onDifficultyClick(e) {
    if (e.target.classList.contains('difficulty__input')) {
        selectedDifficulty = difficulties.querySelector('input[type="radio"]:checked').value;
    }
}

function onShuffleBtnClick(e) {
    let cardsCount = getCardsCount();
    let cards = getRandomCards(cardsCount);
    deck = createDeck(cards);
    setVisibleGameArea();
}

function onDeckClick(e) {
    if (currentCard < deck.length) {
        openedCard.src = deck[currentCard].cardFace;
        if (currentCard === 0) {
            openedCard.classList.add('active');
        }
        currentCard++;
    } else {
        deckElement.classList.remove('active');
    }
}

function getCardsCount() {
    let greenCardsCount = selectedAcncientCard.firstStage.greenCards +
        selectedAcncientCard.secondStage.greenCards +
        selectedAcncientCard.thirdStage.greenCards;
    let brownCardsCount = selectedAcncientCard.firstStage.brownCards +
        selectedAcncientCard.secondStage.brownCards +
        selectedAcncientCard.thirdStage.brownCards;
    let blueCardsCount = selectedAcncientCard.firstStage.blueCards +
        selectedAcncientCard.secondStage.blueCards +
        selectedAcncientCard.thirdStage.blueCards;
    return {
        blue: blueCardsCount,
        brown: brownCardsCount,
        green: greenCardsCount,
    }
}

function getRandomCards(cardsCount) {
    let blue = shuffleCards(blueCards).slice(0, cardsCount.blue);
    let brown = shuffleCards(brownCards).slice(0, cardsCount.brown);
    let green = shuffleCards(greenCards).slice(0, cardsCount.green);
    return { blue, brown, green };
}

function createDeck(cards) {
    let firstStageBlueCards = cards.blue.slice(0, selectedAcncientCard.firstStage.blueCards);
    let firstStageBrowCards = cards.brown.slice(0, selectedAcncientCard.firstStage.brownCards);
    let firstStageGreenCards = cards.green.slice(0, selectedAcncientCard.firstStage.greenCards);
    let shuffledFirstStageCards = shuffleCards([].concat(firstStageBlueCards, firstStageBrowCards, firstStageGreenCards));
    let secondStageBlueCards = cards.blue.slice(firstStageBlueCards.length,
        firstStageBlueCards.length + selectedAcncientCard.secondStage.blueCards);
    let secondStageBrownCards = cards.brown.slice(firstStageBrowCards.length,
        firstStageBrowCards.length + selectedAcncientCard.secondStage.brownCards);
    let secondStageGreenCards = cards.green.slice(firstStageGreenCards.length,
        firstStageGreenCards.length + selectedAcncientCard.secondStage.greenCards);
    let shuffledSecondStageCards = shuffleCards([].concat(secondStageBlueCards, secondStageBrownCards, secondStageGreenCards));
    let thirdStageBlueCards = cards.blue.slice(firstStageBlueCards.length + secondStageBlueCards.length,
        firstStageBlueCards.length + secondStageBlueCards.length + selectedAcncientCard.thirdStage.blueCards);
    let thirdStageBrowCards = cards.brown.slice(firstStageBrowCards.length + secondStageBrownCards.length,
        firstStageBrowCards.length + secondStageBrownCards.length + selectedAcncientCard.thirdStage.brownCards);
    let thirdStageGreenCards = cards.green.slice(firstStageGreenCards.length + secondStageGreenCards.length,
        firstStageGreenCards.length + secondStageGreenCards.length + selectedAcncientCard.thirdStage.greenCards);
    let shuffledThirdStageCards = shuffleCards([].concat(thirdStageBlueCards, thirdStageBrowCards, thirdStageGreenCards));
    return [].concat(shuffledFirstStageCards, shuffledSecondStageCards, shuffledThirdStageCards);
}

function shuffleCards(cards) {
    let indeces = Array.from(Array(cards.length).keys());
    let shuffledCards = new Array(cards.length);
    for (let i = 0; i < cards.length; i++) {
        let randomIndex = randomizer(0, indeces.length);
        shuffledCards[i] = cards[indeces[randomIndex]];
        indeces = indeces.filter((el, index) => index !== randomIndex);
    }
    return shuffledCards;
}

function randomizer(from, to) {
    return (from + Math.floor(Math.random() * (to - from)));
}

function setVisibleGameArea() {
    currentCard = 0;
    deckElement.classList.add('active');
    openedCard.classList.remove('active');
}