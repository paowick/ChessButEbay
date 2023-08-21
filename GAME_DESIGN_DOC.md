<h1 align='center'>Game design doc</h1>

# 1. Introduction

- **Game Concept**

    "Auction War Chess Edition" is a unique take on the traditional game of chess. In this game, every chess piece must be acquired through an auction before it can be used. Players bid on pieces, and the highest bidder wins the right to use that piece in their chess army. The objective is to create a powerful and strategic chess army while managing your resources effectively.

- **Technical Infrastructure**

    The entire game is powered by Docker, ensuring seamless integration and deployment. Players need two instances of Docker running on their computer or server to play the game. Additionally, having Node.js installed is recommended for a streamlined development experience.

# 2. Game Overview

- **Objective**

    The primary objective of "Auction War Chess Edition" is to defeat your opponent's king while protecting your own. However, the twist lies in how you acquire your chess pieces. Instead of starting with a standard set of pieces, players must bid on and win auctions to obtain their chess pieces. The player who strategically assembles the most powerful chess army wins the game.

- **Gameplay Mechanics**

    * **Chess Board:**
        The game board is a standard 8x8 chessboard.

    * **Auctions:** 
        Before each player's turn, there is an auction phase where a random chess piece is put up for auction. Players bid using in-game currency to acquire the piece. The highest bidder wins the piece.

    * **Chess Rules:**
        Once a player acquires a chess piece, they must follow traditional chess rules for movement and captures.

    * **Resource Management:** 
        Players have a limited pool of in-game currency for bidding. Managing this currency efficiently is crucial to assembling a formidable chess army.

    * **Mine System:**
        Players can choose to send a piece to a mine to earn currency, but the piece cannot be used for a specified number of turns. After the designated turns, the piece returns to the player's inventory.
    
    * **Inventory System:**
        Players can store chess pieces in their inventory. Pieces in the inventory can be deployed on the board or sent to the mine.

- **Unique Features**

    * **Dynamic Piece Acquisition:**
        The auction system introduces an element of unpredictability to the game. Players must adapt their strategies based on the pieces they acquire.
    
    * **Strategic Depth:**
        "Auction War Chess Edition" encourages players to think strategically not only in their chess moves but also in their bidding decisions and piece management.

# 3. Game Rules

- **Chess Rules**
    * Standard chess rules apply for piece movement and captures.<br></br>
- **Auction System**
    * Before each turn, a random chess piece is selected for auction.
    * Players bid on the chess piece using their in-game currency.
    * The highest bidder wins the piece and can use it in their army.
    * If a player cannot afford to bid on a piece, they must pass, and the next player gets a chance to bid.<br></br>

- **Mine System**
    * Players can choose to send a chess piece to a mine for a specified number of turns to earn currency.
    * The piece cannot be used during its time in the mine.
    * After the designated turns, the piece returns to the player's inventory.<br></br>
  
- **Inventory System**
    * Players have an inventory where they can store chess pieces.
    * Pieces in the inventory can be deployed on the board or sent to the mine.<br></br>

- **Winning Conditions**
    * The game is won by putting the opponent's king in checkmate.<br></br>

# 4. Technical Stack

The technical stack for "Auction War Chess Edition" includes the following components containerized within Docker:

- **Nodejs:**
     Used for game logic and backend development.

- **Nginx:** 
    Handles web server functionality for the game.

- **MySQL:** 
    Manages the game's database for player data.

- **Redis:** 
    Used for caching and session management.

- **phpMyAdmin:** 
    Provides a user-friendly interface for database management.

- **RedisInsight:** 
    Offers insights and monitoring capabilities for Redis.

- **Dozzle:** 
    A log viewer for Docker containers, aiding in debugging and monitoring.

This technical stack ensures a robust and scalable infrastructure for the game.


"Auction War Chess Edition" is a creative and engaging fusion of traditional chess and auction mechanics, offering players a unique and strategic gaming experience. Players must master both chess strategy and bidding tactics to emerge victorious in this intriguing game.
