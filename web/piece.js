export class pieces {
    constructor(name,ID,pos){
        this.name = name
        this.ID = ID
        this.pos = pos
    }

    getinfo(){
        console.log(`${this.name}${this.pos}`)
    }



}


