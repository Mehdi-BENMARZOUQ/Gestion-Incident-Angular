import {DevisModel} from "./devis.model";
import {UserModel} from "./user.model";


export class FactureModel {
    id?: number;
    date_traitement?: Date;
    traitepar?: UserModel;

    numero: string;
    date_facture : Date;
    montant: number;
    devis : DevisModel;
}
