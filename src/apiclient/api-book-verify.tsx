import { PostAction, useAPIPost, Response } from "./client-hooks"

export interface BookVerifyRequest {
    id: string
}

export function useBookVerify(): [Response<void | null>, PostAction<BookVerifyRequest>] {
    const [response, fetchData] = useAPIPost<BookVerifyRequest, void>('/api/book/verify')

    return [response, fetchData]
}