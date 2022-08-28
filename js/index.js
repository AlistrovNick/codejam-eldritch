import Ancients from './../data/ancients.js';
import { blueCards, brownCards, greenCards } from './../data/mythicCards/index.js';

const DIFFICULTIES = {
    'veryEasy': '0',
    'easy': '1',
    'normal': '2',
    'hard': '3',
    'insane': '4'
};

const CARD_DIFFICULTIES = { easy: 'easy', normal: 'normal', hard: 'hard' };

const ancientCards = document.querySelector('.settings__cards');
const difficulties = document.querySelector('.difficulty');
const shuffleBtn = document.querySelector('.setting__btn');
const deckElement = document.querySelector('.game__deck');
const openedCard = document.querySelector('.game__opened-card');
const tracker = document.querySelector('.game__tracker');
const trackerTitles = document.querySelectorAll('.game__title');

let selectedAcncientCard = Ancients[ancientCards.querySelector('input[type="radio"]:checked').value];
let selectedDifficulty = difficulties.querySelector('input[type="radio"]:checked').value;
let deck;
let currentCard = 0;
let trackerValues = new Array(3);

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
    initGameArea();
}

function onDeckClick(e) {
    if (currentCard === deck.length) {
        return;
    }
    openCard();
    updateTracker();
    currentCard++;
}

function openCard() {
    openedCard.src = deck[currentCard].cardFace;
    if (currentCard === 0) {
        openedCard.classList.add('active');
    }
    if (currentCard === deck.length - 1) {
        deckElement.classList.remove('active');
    }
}

function updateTracker() {
    setCurrentStage();
    updateTrackerValues();
    setTrackerElementsValues();
}

function setCurrentStage() {
    let gameStage = getGameStage();
    for (let i = 0; i < trackerTitles.length; i++) {
        if (i === gameStage) {
            trackerTitles[i].classList.add('active');
        } else {
            trackerTitles[i].classList.remove('active');
        }
    }
}

function updateTrackerValues() {
    let gameStage = getGameStage();
    let cardColor = deck[currentCard].color;
    trackerValues[gameStage][cardColor]--;
}

function getGameStage() {
    let firstStageCardsCount = [...Object.values(selectedAcncientCard.firstStage)].reduce((prev, current) => prev + current);
    let secondStageCardsCount = [...Object.values(selectedAcncientCard.secondStage)].reduce((prev, current) => prev + current);
    if (currentCard < firstStageCardsCount) {
        return 0;
    } else if (currentCard < firstStageCardsCount + secondStageCardsCount) {
        return 1;
    } else {
        return 2;
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
    let filteredBlueCards;
    let filteredBrownCards;
    let filteredGreenCards;
    switch (selectedDifficulty) {
        case DIFFICULTIES.veryEasy:
            filteredBlueCards = getVeryEasyModeColorCards(blueCards, cardsCount.blue);
            filteredBrownCards = getVeryEasyModeColorCards(brownCards, cardsCount.brown);
            filteredGreenCards = getVeryEasyModeColorCards(greenCards, cardsCount.green);
            break;
        case DIFFICULTIES.easy:
            filteredBlueCards = getEasyModeColorCards(blueCards);
            filteredBrownCards = getEasyModeColorCards(brownCards);
            filteredGreenCards = getEasyModeColorCards(greenCards);
            break;
        case DIFFICULTIES.normal:
            filteredBlueCards = blueCards;
            filteredBrownCards = brownCards;
            filteredGreenCards = greenCards;
            break;
        case DIFFICULTIES.hard:
            filteredBlueCards = getHardModeColorCards(blueCards);
            filteredBrownCards = getHardModeColorCards(brownCards);
            filteredGreenCards = getHardModeColorCards(greenCards);
            break;
        case DIFFICULTIES.insane:
            filteredBlueCards = getInsaneModeColorCards(blueCards, cardsCount.blue);
            filteredBrownCards = getInsaneModeColorCards(brownCards, cardsCount.brown);
            filteredGreenCards = getInsaneModeColorCards(greenCards, cardsCount.green);
            break;
        default:
            new Error('Unknow mode');
    }
    let blue = shuffleCards(filteredBlueCards).slice(0, cardsCount.blue);
    let brown = shuffleCards(filteredBrownCards).slice(0, cardsCount.brown);
    let green = shuffleCards(filteredGreenCards).slice(0, cardsCount.green);
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

function initGameArea() {
    currentCard = 0;
    initTracker();
    setElementsVisibility();
}

function initTracker() {
    setCurrentStage();
    setInitTrackerValues();
    setTrackerElementsValues();
}

function setInitTrackerValues() {
    trackerValues[0] = {
        blue: selectedAcncientCard.firstStage.blueCards,
        brown: selectedAcncientCard.firstStage.brownCards,
        green: selectedAcncientCard.firstStage.greenCards
    };
    trackerValues[1] = {
        blue: selectedAcncientCard.secondStage.blueCards,
        brown: selectedAcncientCard.secondStage.brownCards,
        green: selectedAcncientCard.secondStage.greenCards
    };
    trackerValues[2] = {
        blue: selectedAcncientCard.thirdStage.blueCards,
        brown: selectedAcncientCard.thirdStage.brownCards,
        green: selectedAcncientCard.thirdStage.greenCards
    };
}

function setTrackerElementsValues() {
    let stages = tracker.querySelectorAll('.game__stage');
    for (let i = 0; i < trackerValues.length; i++) {
        stages[i].querySelector('.game__counter_green').textContent = trackerValues[i].green;
        stages[i].querySelector('.game__counter_brown').textContent = trackerValues[i].brown;
        stages[i].querySelector('.game__counter_blue').textContent = trackerValues[i].blue;
    }
}

function setElementsVisibility() {
    deckElement.classList.add('active');
    openedCard.classList.remove('active');
    tracker.classList.add('active');
}

function getVeryEasyModeColorCards(cards, count) {
    let filteredCards = cards.filter(card => card.difficulty === CARD_DIFFICULTIES.easy);
    if (filteredCards.length < count) {
        let additionalNormalCards = cards.filter(card => card.difficulty === CARD_DIFFICULTIES.normal);
        if (filteredCards.length + additionalNormalCards.length < count) {
            let additionalHardCards = cards.filter(card => card.difficulty === CARD_DIFFICULTIES.hard);
            additionalHardCards = shuffleCards(additionalHardCards)
                .slice(0, count - (filteredCards.length + additionalNormalCards.length));
            filteredCards = [].concat(filteredCards, additionalNormalCards, additionalHardCards);
        } else {
            additionalNormalCards = shuffleCards(additionalNormalCards)
                .slice(0, count - filteredCards.length);
            filteredCards = [].concat(filteredCards, additionalNormalCards);
        }
    }
    return filteredCards;
}

function getEasyModeColorCards(cards) {
    return cards.filter(card => card.difficulty !== CARD_DIFFICULTIES.hard);
}

function getHardModeColorCards(cards) {
    return cards.filter(card => card.difficulty !== CARD_DIFFICULTIES.easy);
}

function getInsaneModeColorCards(cards, count) {
    let filteredCards = cards.filter(card => card.difficulty === CARD_DIFFICULTIES.hard);
    if (filteredCards.length < count) {
        let additionalNormalCards = cards.filter(card => card.difficulty === CARD_DIFFICULTIES.normal);
        if (filteredCards.length + additionalNormalCards.length < count) {
            let additionalEasyCards = cards.filter(card => card.difficulty === CARD_DIFFICULTIES.easy);
            additionalEasyCards = shuffleCards(additionalEasyCards)
                .slice(0, count - (filteredCards.length + additionalNormalCards.length));
            filteredCards = [].concat(filteredCards, additionalNormalCards, additionalEasyCards);
        } else {
            additionalNormalCards = shuffleCards(additionalNormalCards)
                .slice(0, count - filteredCards.length);
            filteredCards = [].concat(filteredCards, additionalNormalCards);
        }
    }
    return filteredCards;
}