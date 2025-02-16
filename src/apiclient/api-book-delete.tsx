import { PostAction, useAPIPost, Response } from "./client-hooks"

export interface BookDeleteRequest {
    book_id: string
    type: "soft" | "page_and_copy" | "dead_hashed_pages"
    mark_as_deleted_empty_book?: boolean
}

export function useBookDelete(): [Response<void | null>, PostAction<BookDeleteRequest>] {
    const [response, fetchData] = useAPIPost<BookDeleteRequest, void>('/api/book/delete')

    return [response, fetchData]
}