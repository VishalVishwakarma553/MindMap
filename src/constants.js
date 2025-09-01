export const cardValues = ['🍎', '🍌', '🍓', '🍇', '🍉', '🍍', '🍊', '🥝'];
export const createBoard = () => {
    // Duplicate the card values to create pairs.
    const deck = [...cardValues, ...cardValues];
    // Shuffle the deck randomly.
    const shuffledDeck = shuffleCard(deck)
    // Map the shuffled deck to a board with unique IDs.
    return shuffledDeck.map((value) => ({
        id: crypto.randomUUID(),
        value,
        isFlipped: true,
        isMatched: false,
    }));
};

function shuffleCard(card) {
    let arr = [...card]
    for (let i = arr.length -1; i >= 0; i--){
        let j = Math.floor(Math.random()*(i+1));
        // make shuffle with their index
        [arr[i],arr[j]] = [arr[j], arr[i]]
    }
    return arr
}

export const MOCK_LEADERBOARD = [
    { name: "Aanya", score: 42 },
    { name: "Rahul", score: 31 },
    { name: "Maya", score: 27 },
    { name: "Zed", score: 20 },
    { name: "Kai", score: 15 },
  ];

export const sortLeaderBoard = (leaderBoard) => {
    if(leaderBoard) {
        return leaderBoard.sort((a, b) => b.score - a.score)
    }
    return []
}