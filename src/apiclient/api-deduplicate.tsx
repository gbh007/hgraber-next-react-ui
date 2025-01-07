import { PostAction, useAPIPost, Response } from "./client-hooks"
import { BookAttribute, BookSimple, BookSimplePage } from "./model-book"

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

    origin_covered_target: number
    target_covered_origin: number
    origin_covered_target_without_dead_hashes: number
    target_covered_origin_without_dead_hashes: number

    origin_pages?: Array<BookSimplePage>
    both_pages?: Array<BookSimplePage>
    target_pages?: Array<BookSimplePage>

    origin_attributes?: Array<BookAttribute>
    both_attributes?: Array<BookAttribute>
    target_attributes?: Array<BookAttribute>
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

export interface CreateDeadHashByPageRequest {
    book_id: string
    page_number: number
}

export function useCreateDeadHashByPage(): [Response<void | null>, PostAction<CreateDeadHashByPageRequest>] {
    const [response, fetchData] = useAPIPost<CreateDeadHashByPageRequest, void>('/api/deduplicate/dead-hash-by-page/create')

    return [response, fetchData]
}

export interface DeleteDeadHashByPageRequest {
    book_id: string
    page_number: number
}

export function useDeleteDeadHashByPage(): [Response<void | null>, PostAction<DeleteDeadHashByPageRequest>] {
    const [response, fetchData] = useAPIPost<DeleteDeadHashByPageRequest, void>('/api/deduplicate/dead-hash-by-page/delete')

    return [response, fetchData]
}

export interface DeletePagesByBodyRequest {
    book_id: string
    page_number: number
    set_dead_hash?: boolean
}

export function useDeletePagesByBody(): [Response<void | null>, PostAction<DeletePagesByBodyRequest>] {
    const [response, fetchData] = useAPIPost<DeletePagesByBodyRequest, void>('/api/deduplicate/delete-all-pages-by-hash')

    return [response, fetchData]
}


export interface CreateDeadHashByBookPagesRequest {
    book_id: string
}

export function useCreateDeadHashByBookPages(): [Response<void | null>, PostAction<CreateDeadHashByBookPagesRequest>] {
    const [response, fetchData] = useAPIPost<CreateDeadHashByBookPagesRequest, void>('/api/deduplicate/dead-hash-by-book-pages/create')

    return [response, fetchData]
}

export interface DeleteDeadHashByBookPagesRequest {
    book_id: string
}

export function useDeleteDeadHashByBookPages(): [Response<void | null>, PostAction<DeleteDeadHashByBookPagesRequest>] {
    const [response, fetchData] = useAPIPost<DeleteDeadHashByBookPagesRequest, void>('/api/deduplicate/dead-hash-by-book-pages/delete')

    return [response, fetchData]
}

export interface DeleteAllPagesByBookRequest {
    book_id: string
    mark_as_deleted_empty_book?: boolean
}

export function useDeleteAllPagesByBook(): [Response<void | null>, PostAction<DeleteAllPagesByBookRequest>] {
    const [response, fetchData] = useAPIPost<DeleteAllPagesByBookRequest, void>('/api/deduplicate/delete-all-pages-by-book')

    return [response, fetchData]
}

export interface DeleteBookDeadHashedPagesRequest {
    book_id: string
}

export function useDeleteBookDeadHashedPages(): [Response<void | null>, PostAction<DeleteBookDeadHashedPagesRequest>] {
    const [response, fetchData] = useAPIPost<DeleteBookDeadHashedPagesRequest, void>('/api/deduplicate/delete-book-dead-hashed-pages')

    return [response, fetchData]
}