import { PostAction, useAPIPost, Response } from "./client-hooks"
import { BookDetails } from "./model-book"

export interface BookDetailsRequest {
    id: string
}

export function useBookDetails(): [Response<BookDetails | null>, PostAction<BookDetailsRequest>] {
    const [response, fetchData] = useAPIPost<BookDetailsRequest, BookDetails>('/api/book/details')

    return [response, fetchData]
}