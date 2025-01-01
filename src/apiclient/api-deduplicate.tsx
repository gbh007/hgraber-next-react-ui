import { PostAction, useAPIPost, Response } from "./client-hooks"
import { BookSimple } from "./model-book"
import { BookSimplePage } from "./model-book-details"

export interface DeduplicateBookByPageBodyRequest {
    book_id: string
}

export interface DeduplicateBookByPageBodyResponse {
    result?: Array<DeduplicateBookByPageBodyResponseResult>
}

export interface DeduplicateBookByPageBodyResponseResult {
    book: BookSimple
    origin_covered_target: number
    target_covered_origin: number
}


export function useDeduplicateBookByPageBody(): [Response<DeduplicateBookByPageBodyResponse | null>, PostAction<DeduplicateBookByPageBodyRequest>] {
    const [response, fetchData] = useAPIPost<DeduplicateBookByPageBodyRequest, DeduplicateBookByPageBodyResponse>('/api/deduplicate/book-by-page-body')

    return [response, fetchData]
}


export interface DeduplicateCompareRequest {
    origin_book_id: string
    target_book_id: string
}

export interface DeduplicateCompareResponse {
    origin: BookSimple
    target: BookSimple
    origin_pages?: Array<BookSimplePage>
    both_pages?: Array<BookSimplePage>
    target_pages?: Array<BookSimplePage>
}



export function useDeduplicateCompare(): [Response<DeduplicateCompareResponse | null>, PostAction<DeduplicateCompareRequest>] {
    const [response, fetchData] = useAPIPost<DeduplicateCompareRequest, DeduplicateCompareResponse>('/api/deduplicate/compare')

    return [response, fetchData]
}

export interface UniqueBookPagesRequest {
    book_id: string
}

export interface UniqueBookPagesResponse {
    pages?: Array<BookSimplePage>
}



export function useUniqueBookPages(): [Response<UniqueBookPagesResponse | null>, PostAction<UniqueBookPagesRequest>] {
    const [response, fetchData] = useAPIPost<UniqueBookPagesRequest, UniqueBookPagesResponse>('/api/deduplicate/unique-pages')

    return [response, fetchData]
}