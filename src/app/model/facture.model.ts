import {UserModel} from "./user.model";
import {DevisModel} from "./devis.model";

export class FactureModel {
    id: number;

    message: string;

    read: boolean = false;

    devis?: DevisModel;

    user: UserModel;

    createdAt: Date;
}
