import { PostAction, useAPIPost, Response } from "./client-hooks"
import { BookAttribute, BookDetailsSize, BookSimple, BookSimplePage } from "./model-book"

export interface BookDetailsRequest {
    id: string
}

export interface BookDetails {
    info: BookSimple
    page_loaded_percent: number
    attributes?: Array<BookAttribute>
    pages?: Array<BookSimplePage>
    size?: BookDetailsSize
}

export function useBookDetails(): [Response<BookDetails | null>, PostAction<BookDetailsRequest>] {
    const [response, fetchData] = useAPIPost<BookDetailsRequest, BookDetails>('/api/book/details')

    return [response, fetchData]
}