import { PostAction, useAPIPost, Response } from "./client-hooks"

export interface BookDeleteRequest {
    id: string
}

export function useBookDelete(): [Response<void | null>, PostAction<BookDeleteRequest>] {
    const [response, fetchData] = useAPIPost<BookDeleteRequest, void>('/api/book/delete')

    return [response, fetchData]
}