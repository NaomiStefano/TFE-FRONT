export class MyButton {
    public text?: string;
    public icon?: string;
    public iconPosition?: string;
    public background?: string;
    public color?: string;
    public disabled?: boolean;
    public function?: any;
    public children?: any[];
    public click?: Function;

    constructor(data: any = {}) {
         Object.assign(this, data);
    }
}