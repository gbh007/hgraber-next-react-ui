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