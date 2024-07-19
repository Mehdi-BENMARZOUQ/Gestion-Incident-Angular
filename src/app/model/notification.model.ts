import {UserModel} from "./user.model";
import {DevisModel} from "./devis.model";

export class NotificationModel {
    id?: number;
    message: string;
    read?: boolean;
    createdAt?: Date;
    user?: UserModel;
    devis?: DevisModel;
}
