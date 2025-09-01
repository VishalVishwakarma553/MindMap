import "./App.css";
import { BadgeQuestionMark } from "lucide-react";
import { createBoard, MOCK_LEADERBOARD, sortLeaderBoard } from "./constants";
import { useEffect, useState } from "react";
import { cardValues } from "./constants";

function App() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [timer, setTimer] = useState(50);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [userName, setUserName] = useState("");
  const [leaderBoardData, setLeaderBoardData] = useState([]);
  const [highScore, setHighScore] = useState("N/A")
  const startGame = () => {
    if (!userName) {
      alert("Please provide your name");
      return;
    }
    setCards(createBoard());
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setTimer(50);
    setIsPaused(false);
    setIsGameCompleted(false);
    setIsGameActive(true);
    setGameStartTime(Date.now());
  };

  
  // Fetch leaderboard data single time
  useEffect(() => {
    const savedLeaderBoard = JSON.parse(localStorage.getItem("leaderboard")) || []
    const sortedLeaderBoardData = sortLeaderBoard(savedLeaderBoard)
    setLeaderBoardData(sortedLeaderBoardData);
  }, [isGameCompleted]);
  useEffect(() => {
    const currHighScore = leaderBoardData[0]?.score
    setHighScore(currHighScore)
  }, [leaderBoardData])
  // For some seconds show all the card values to user
  useEffect(() => {
    if (gameStartTime) {
      setTimeout(() => {
        setCards((prev) => prev.map((card) => ({ ...card, isFlipped: false })));
      }, 3000);
    }
  }, [gameStartTime]);
  // Start timer when new game clicked
  useEffect(() => {
    if (!isPaused && isGameActive && timer > 0) {
      var timeInterverId = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timeInterverId);
  }, [isPaused, isGameActive]);

  // TO show game completed part
  useEffect(() => {
    if (timer == 0) {
      
      var leaderTableData = JSON.parse(localStorage.getItem("leaderboard"));
      if (leaderTableData) {
        // check current user is present in leaderboard if yes then check it's score if stored score less than current score then update
        var existedUser = leaderTableData.find(
          (user) => user.name === userName
        );
        if (existedUser) {
          if (existedUser.score < matchedCards.length) {
            leaderTableData = leaderTableData.map((leaderUser) =>
              leaderUser.name === userName
                ? { ...leaderUser, score: matchedCards.length }
                : leaderUser
            );
          }
        } else {
          leaderTableData.push({ name: userName, score: matchedCards.length });
        }
        localStorage.setItem("leaderboard", JSON.stringify(leaderTableData));
      } else {
        localStorage.setItem(
          "leaderboard",
          JSON.stringify([{ name: userName, score: matchedCards.length }])
        );
      }
      setLeaderBoardData(JSON.parse(localStorage.getItem("leaderboard")) || []);
      const sortedAgain = sortLeaderBoard(leaderBoardData)
      setLeaderBoardData(sortedAgain);
      setIsGameCompleted(true);
      setIsGameActive(false);
      setCards([])
    }
  }, [timer]);

  const handleCardClick = (clickedCard) => {
    if (
      flippedCards.length === 2 ||
      flippedCards.some((card) => card.id === clickedCard.id) ||
      clickedCard.isMatched ||
      timer == 0
    ) {
      return;
    }

    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === clickedCard.id ? { ...card, isFlipped: true } : card
      )
    );
    setFlippedCards((prev) => [...prev, clickedCard]);
    setMoves((prev) => prev + 1);
  };
  // if card flipped and cards value does not matched then flip them again
  useEffect(() => {
    if (flippedCards.length != 2) {
      return;
    }
    const [firstCard, secondCard] = flippedCards;
    if (firstCard.value === secondCard.value) {
      setMatchedCards((prev) => [...prev, firstCard.id, secondCard.id]);
      setCards((prev) =>
        prev.map((card) =>
          card.id === firstCard.id || card.id === secondCard.id
            ? { ...card, isFlipped: true, isMatched: true }
            : card
        )
      );
      if (matchedCards.length == 2 * cardValues.length) {
        setIsGameCompleted(true);
        setTimer(0);
        setIsGameActive(false);
      }
      setFlippedCards([]);
    } else {
      setTimeout(() => {
        setCards((prev) =>
          prev.map((card) =>
            card.id === firstCard.id || card.id === secondCard.id
              ? { ...card, isFlipped: false }
              : card
          )
        );
        setFlippedCards([]);
      }, 1000);
    }
  }, [flippedCards]);

  const handlePausedClick = () => {
    setIsPaused(!isPaused);
  };
  return (
    <div className={"z-10 min-h-screen w-full bg-gradient-to-br from-slate-900 via-cyan-900 to-emerald-900 flex justify-center items-center"}>
      <div className={`w-full max-w-4xl rounded-2xl shadow-2xl bg-white/5 border border-white/10 p-4 md:p-6 ${isGameCompleted ? "blur-3xl": ""}`}>
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-start gap-3">
            <div className="p-3 bg-white/10 rounded-xl text-green-400">
              <BadgeQuestionMark className="size-8" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-gray-300">
                Mind Map
              </h3>
              <p className="text-xs md:text-sm text-white/70">
                Click two same cards with minimum moves
              </p>
            </div>
          </div>
          {/* Game Details */}
          <div className="flex gap-3">
            {/* Input */}
            <input
              type="text"
              placeholder="Your Name"
              className="max-w-[150px] bg-transparent outline-none text-xl text-white/94"
              onChange={(e) => setUserName(e.target.value)}
            />
            <div className="p-3 rounded-xl bg-white/10 border border-white/10 shadow-xl text-center">
              <h3 className="text-sm font-semibold text-gray-400">
                High Score
              </h3>
              <p className="text-lg font-semibold text-gray-200">{highScore}</p>
            </div>
          </div>
        </div>
        {/* Button to play and pause */}
        <div className="flex gap-3 justify-between my-4">
          <div className="flex gap-3">
            <div className="p-3 rounded-xl bg-white/10 border border-white/10 shadow-xl text-center">
              <h3 className="text-sm font-semibold text-gray-400">Moves</h3>
              <p className="text-lg font-semibold text-gray-200">{moves}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/10 border border-white/10 shadow-xl text-center">
              <h3 className="text-sm font-semibold text-gray-400">Time</h3>
              <p className="text-lg font-semibold text-gray-200">{timer} s</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => startGame()}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-bold transition-all duration-300 text-white/70 hover:scale-105 shadow-lg cursor-pointer"
            >
              New Game
            </button>
            <button
              onClick={() => handlePausedClick()}
              className="bg-red-500 hover:bg-red-600 px-2 py-3 cursor-pointer rounded-xl hover:scale-105 transition-all duration-200 ease-in-out text-white/70 font-semibold"
            >
              {isPaused ? "Resume" : "Pause"}
            </button>
          </div>
        </div>

        {/* Start Game */}
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {cards.map((card) => (
            <div
              key={card.id}
              className="cursor-pointer aspect-square"
              onClick={() => handleCardClick(card)}
            >
              <div className={`card ${card.isFlipped ? "is-flipped" : ""}`}>
                <div className="card-face card-face-front transform-gpu"></div>
                <div className="card-face card-face-back transform-gpu text-4xl sm:text-5xl">
                  {card.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* LeaderBoard */}
        <div className="space-y-3 mt-8 text-white/70">
          <h1 className="text-xl font-semibold text-center text-white/100">
            Leaderboard
          </h1>
          <div className="rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-3 py-2 text-left">S.NO</th>
                  <th className="text-left px-3 py-2">Name</th>
                  <th className="text-right px-3 py-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderBoardData?.length > 0 ? (
                  leaderBoardData.map((player, idx) => (
                    <tr key={idx} className="even:bg-white/5 ">
                      <td className="px-3 py-2 w-8">{idx + 1}</td>
                      <td className="px-3 py-2">{player.name}</td>
                      <td className="px-3 py-2 text-right font-semibold">
                        {player.score}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-6 text-center px-3 ">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isGameCompleted &&( <div className="absolute max-w-[1200px] rounded-md border-white/70 bg-blue-600  p-4 px-6 z-50 flex flex-col items-center">
        <h1 className="text-2xl font-semibold text-white/70 ">Game Over!</h1>
        <p className="text-xs font-medium text-white/70 mb-6">
          See your score in leaderboard
        </p>
        <button
          onClick={() => startGame()}
          className="px-6 py-3 bg-blue-500 rounded-xl font-bold transition-all duration-300 text-white/70 hover:scale-105 shadow-lg cursor-pointer"
        >
          New Game
        </button>
      </div>)}
    </div>
  );
}

export default App;
