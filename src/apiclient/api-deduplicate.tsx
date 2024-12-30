import { PostAction, useAPIPost, Response } from "./client-hooks"

export interface DeduplicateBookByPageBodyRequest {
    book_id: string
}

export interface DeduplicateBookByPageBodyResponse {
    result: Array<DeduplicateBookByPageBodyResponseResult>
}

export interface DeduplicateBookByPageBodyResponseResult {
    book_id: string
    create_at: string
    origin_url?: string
    name: string
    page_count: number
    preview_url?: string
    origin_covered_target: number
    target_covered_origin: number
}

export function useDeduplicateBookByPageBody(): [Response<DeduplicateBookByPageBodyResponse | null>, PostAction<DeduplicateBookByPageBodyRequest>] {
    const [response, fetchData] = useAPIPost<DeduplicateBookByPageBodyRequest, DeduplicateBookByPageBodyResponse>('/api/deduplicate/book-by-page-body')

    return [response, fetchData]
}