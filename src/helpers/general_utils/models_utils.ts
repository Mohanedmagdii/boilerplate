import { GridParams, ListQuery, PaginationReponse } from "../general_types/general_models_types";
import { Document } from 'mongoose'

let utils = {
  addGridParams: <T extends Document>(listQuery: ListQuery<T>, gridParams: GridParams): ListQuery<T> => {
    const pageNo = Number(gridParams?.page_no) || 1;
    const pageSize = Number(gridParams?.page_size) || 30;

    const offset = (pageNo - 1) * pageSize;
    listQuery = listQuery.skip(offset).limit(pageSize);
    if (gridParams?.sort) {
      listQuery = listQuery.sort(gridParams?.sort);
    }
    return listQuery;
  },

  getPaginationReponse: (count: number, gridParams: GridParams): PaginationReponse => {
    return {
      no_of_pages: Math.ceil(count / Number(gridParams.page_size || 30)),
      page_no: Number(gridParams.page_no) || 1,
      page_size: Number(gridParams.page_size) || 30,
      total_items: count
    }
  },

  excluedDeleted: (conditions) => {
    conditions.is_deleted = { $ne: true }
    return conditions
  }

}


export default utils;