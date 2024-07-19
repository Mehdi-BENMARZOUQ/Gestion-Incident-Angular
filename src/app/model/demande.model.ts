
export class DemandeModel {
    id?: number;
    type: 'Facture' | 'Devis';
    numero: string;
    message: string;
    description: string;
    read?: boolean;
}
