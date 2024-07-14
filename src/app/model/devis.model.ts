import {AgenceModel} from "./agence.model";
import {UserModel} from "./user.model";
import {TechnicienModel} from "./technicien.model";
import {Observable} from "rxjs";

export class DevisModel {
    id?: number;
    numero: string;
    date?: Date;
    equipementE: string;
    prestataire: string;
    montant: number;
    assurance: boolean;
    rejected: boolean = false;
    notificationSent?: boolean = false;
    handled?: boolean = false;
    technicien: TechnicienModel;
    agence: AgenceModel;
    traitepar?: UserModel;
}
