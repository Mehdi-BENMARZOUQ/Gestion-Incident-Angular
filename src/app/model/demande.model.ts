import {UserModel} from './user.model'
export class DemandeModel {
    id: number;
    type: 'Facture' | 'Devis';
    numero: string;
    message: string;
    description: string;
    demandeur: UserModel;
    handledBy: UserModel;
    status: 'Pending' | 'Rejected' | 'Treated';
    responseMessage: string;
    createdDate: Date;
    handledDate: Date;
}
