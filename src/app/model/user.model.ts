import {DevisModel} from "./devis.model";
import {DemandeModel} from "./demande.model";

export class UserModel {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    password: string;
    role: string;
    notifications?: Notification[];
    devisC?: DevisModel[];
    demandes?: DemandeModel[];
    handledDemandes?: DemandeModel[];
}
