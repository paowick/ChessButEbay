export class pieces {
    constructor(name, pos, team, isKing, board) {
        this.name = name
        this.pos = pos
        this.board = board
        this.team = team
        this.isKing = isKing
        this.setPiece()
    }
    setPiece() {
        if (this.team == "B") {
            this.board[this.pos[0]][this.pos[1]] = this
        }
        if (this.team == "W") {
            this.board[this.pos[0]][this.pos[1]] = this
        }
    }
}
export class king extends pieces {}
export class queen extends pieces {}
export class bishop extends pieces {}
export class rook extends pieces {}
export class knight extends pieces {}
export class pawn extends pieces {
    constructor(name, pos, team, isKing, board, firstmove) {
        super(name, pos, team, isKing, board)
        this.firstmove = firstmove
    };
}