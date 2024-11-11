import { PostAction, useAPIPost, Response } from "./client-hooks"

interface systemRPCDeduplicateFilesResponse {
    count: number
    size: number
    pretty_size: string
}

export function useSystemRPCDeduplicateFiles(): [Response<systemRPCDeduplicateFilesResponse | null>, PostAction<void>] {
    const [response, fetchData] = useAPIPost<void, systemRPCDeduplicateFilesResponse>('/api/system/rpc/deduplicate/files')

    return [response, fetchData]
}