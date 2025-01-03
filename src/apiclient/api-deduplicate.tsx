import { PostAction, useAPIPost, Response } from "./client-hooks"
import { BookSimple, BookSimplePage } from "./model-book"

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
    origin_covered_target_without_dead_hashes: number
    target_covered_origin_without_dead_hashes: number
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
    origin_pages_without_dead_hashes?: Array<BookSimplePage>
    origin_pages_only_dead_hashes?: Array<BookSimplePage>
    both_pages_without_dead_hashes?: Array<BookSimplePage>
    both_pages_only_dead_hashes?: Array<BookSimplePage>
    target_pages_without_dead_hashes?: Array<BookSimplePage>
    target_pages_only_dead_hashes?: Array<BookSimplePage>
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
    pages_without_dead_hashes?: Array<BookSimplePage>
    pages_only_dead_hashes?: Array<BookSimplePage>
}

export function useUniqueBookPages(): [Response<UniqueBookPagesResponse | null>, PostAction<UniqueBookPagesRequest>] {
    const [response, fetchData] = useAPIPost<UniqueBookPagesRequest, UniqueBookPagesResponse>('/api/deduplicate/unique-pages')

    return [response, fetchData]
}

export interface DeduplicateBooksByPageRequest {
    book_id: string
    page_number: number
}

export interface DeduplicateBooksByPageResponse {
    books?: Array<BookSimple>
}

export function useDeduplicateBooksByPage(): [Response<DeduplicateBooksByPageResponse | null>, PostAction<DeduplicateBooksByPageRequest>] {
    const [response, fetchData] = useAPIPost<DeduplicateBooksByPageRequest, DeduplicateBooksByPageResponse>('/api/deduplicate/books-by-page')

    return [response, fetchData]
}