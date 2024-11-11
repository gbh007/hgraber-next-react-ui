import { PostAction, useAPIPost, Response } from "./client-hooks"

interface systemRPCRemoveMismatchFilesResponse {
    remove_from_db: number
    remove_from_fs: number
}

export function useSystemRPCRemoveMismatchFiles(): [Response<systemRPCRemoveMismatchFilesResponse | null>, PostAction<void>] {
    const [response, fetchData] = useAPIPost<void, systemRPCRemoveMismatchFilesResponse>('/api/system/rpc/remove/mismatch-files')

    return [response, fetchData]
}