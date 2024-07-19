
export class FeedbackModel {
    id?: number;
    type?: 'Facture' | 'Devis';
    numero?: string;
    message?: string;
    description?: string;
    demandeur?: string;
    handledBy?: string;
    status: string;
    responseMessage: string;
    createdDate?: Date;
    handledDate?: Date;
    read?: boolean;
}
