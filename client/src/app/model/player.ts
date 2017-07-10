export class Player {
    _id: string = '';
    name: string = '';
    ballance: number = 0;
    fund: number = 0;
    is_backer: number = 0;
    
    constructor(player: any = false) {
        if(player) {
            this._id = player._id;
            this.name = player.name;
            this.ballance = player.ballance;
        }
    }
}