import { Model, Types, FilterQuery } from 'mongoose';
import { UsersDocumentInterface, UsersModelInterface } from './users.types';
import { GridParams, GridResponse } from '../../helpers/general_types/general_models_types';
import utils from '../../helpers/general_utils/models_utils';
import { UsersInterface } from './users.interface';

export interface UsersFunctions extends Model<UsersDocumentInterface> {}

export class UsersFunctions implements UsersModelInterface {
    async grid(
        conditions: FilterQuery<UsersDocumentInterface>,
        gridParams: GridParams
    ): Promise<GridResponse<UsersInterface>> {
        conditions = utils.excluedDeleted(conditions);
        const [result, count] = await Promise.all([
            utils.addGridParams(this.find(conditions), gridParams).lean(),
            this.count(conditions),
        ]);

        const paginationReponse = utils.getPaginationReponse(count, gridParams);

        return {
            list: result,
            page_details: paginationReponse,
        };
    }
}
