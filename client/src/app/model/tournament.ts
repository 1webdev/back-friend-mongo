export class Tournament {
    _id: string = '';
    amount: number = 0;
    status: string = 'open';
    players: any = [];
    
    constructor(_id: string = '', _amount: number = 0, _status: string = '') {
        this._id = _id;
        this.amount = _amount;
        this.status = _status;
    }
}