import { PostAction, useAPIPost, Response } from "./client-hooks"

interface systemHandleRequest {
    urls: Array<string>
    is_multi: boolean
}

interface systemHandleResponse {
    total_count: number
    loaded_count: number
    duplicate_count: number
    error_count: number
    not_handled?: Array<string>
    details: Array<systemHandleResponseDetails>
}

interface systemHandleResponseDetails {
    url: string
    is_duplicate: boolean
    duplicate_id?: string
    is_handled: boolean
    error_reason?: string
}


export function useSystemHandle(): [Response<systemHandleResponse | null>, PostAction<systemHandleRequest>] {
    const [response, fetchData] = useAPIPost<systemHandleRequest, systemHandleResponse>('/api/system/handle')

    return [response, fetchData]
}