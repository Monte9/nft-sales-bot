import Leaderboard from "./core/Leaderboard"
import SalesBot from "./core/SalesBot"

if (process.env.MODE === 'LEADERBOARD') {
  // Run the script to generate NFT Leaderboard
  const leaderBoard = new Leaderboard()
  leaderBoard.start()
} else {
  // Run Twitter NFT Sales Bot
  const flipMcBot = new SalesBot()
  flipMcBot.start()
}
