import { PostAction, useAPIPost, Response } from "./client-hooks"
import { BookRaw } from "./model-book"

export function useBookUpdate(): [Response<void | null>, PostAction<BookRaw>] {
    const [response, fetchData] = useAPIPost<BookRaw, void>('/api/book/update')

    return [response, fetchData]
}

export interface BookRawRequest {
    id?: string
    url?: string
}

export function useBookRaw(): [Response<BookRaw | null>, PostAction<BookRawRequest>] {
    const [response, fetchData] = useAPIPost<BookRawRequest, BookRaw>('/api/book/raw')

    return [response, fetchData]
}


export interface BookRebuildRequest {
    old_book: BookRaw
    selected_pages: Array<number>
    merge_with_book?: string
    only_unique?: boolean
    exclude_dead_hash_pages?: boolean
}

export interface BookRebuildResponse {
    id: string
}

export function useBookRebuild(): [Response<BookRebuildResponse | null>, PostAction<BookRebuildRequest>] {
    const [response, fetchData] = useAPIPost<BookRebuildRequest, BookRebuildResponse>('/api/book/rebuild')

    return [response, fetchData]
}

export interface BookRestoreRequest {
    book_id: string
    only_pages?: boolean
}

export function useBookRestore(): [Response<void | null>, PostAction<BookRestoreRequest>] {
    const [response, fetchData] = useAPIPost<BookRestoreRequest, void>('/api/book/restore')

    return [response, fetchData]
}
