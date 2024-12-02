import { PostAction, useAPIPost, Response } from "./client-hooks"
import { BookFilter } from "./model-book-filter"
import { BookShortInfo } from "./model-book-short-info"

interface BookListResponse {
    books?: Array<BookShortInfo>
    count: number
    pages: Array<BookListResponsePages>
}

interface BookListResponsePages {
    value: number
    is_current: boolean
    is_separator: boolean
}

export function useBookList(): [Response<BookListResponse | null>, PostAction<BookFilter>] {
    const [response, fetchData] = useAPIPost<BookFilter, BookListResponse>('/api/book/list')

    return [response, fetchData]
}