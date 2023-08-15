import { DocumentQuery, Document } from 'mongoose'

export type ListQuery<T extends Document> = DocumentQuery<T[], T, {}>
export type ItemQuery<T extends Document> = DocumentQuery<T, T, {}>

export interface GridParams{
  page_no?: number;
  page_size?: number;
  sort?: string
}

export interface PaginationReponse{
  no_of_pages: number;
  page_no: number;
  page_size: number;
  total_items: number
}

export interface GridResponse<T> {
  page_details: PaginationReponse,
  list: T[]
}
