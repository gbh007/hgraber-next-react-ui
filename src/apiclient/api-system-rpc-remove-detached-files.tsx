import { PostAction, useAPIPost, Response } from "./client-hooks"

interface systemRPCRemoveDetachedFilesResponse {
    count: number
    size: number
    pretty_size: string
}

export function useSystemRPCRemoveDetachedFiles(): [Response<systemRPCRemoveDetachedFilesResponse | null>, PostAction<void>] {
    const [response, fetchData] = useAPIPost<void, systemRPCRemoveDetachedFilesResponse>('/api/system/rpc/remove/detached-files')

    return [response, fetchData]
}