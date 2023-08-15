import { Document, FilterQuery, Model } from 'mongoose';
import { GridParams, GridResponse } from '../../helpers/general_types/general_models_types';
import { UsersInterface, _UsersInterface } from './users.interface';

export interface UsersDocumentInterface extends _UsersInterface, Document {}

export interface UsersModelInterface extends Model<UsersDocumentInterface> {
    grid: (
        conditions: FilterQuery<UsersDocumentInterface>,
        gridParams: GridParams,
        organization: string
    ) => Promise<GridResponse<UsersInterface>>;
}
