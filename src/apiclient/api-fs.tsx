import { PostAction, useAPIPost, Response } from "./client-hooks"


export interface FileSystemInfo {
    id: string
    name: string
    description?: string
    agent_id?: string
    path?: string
    download_priority: number
    deduplicate_priority: number
    highway_enabled: boolean
    highway_addr?: string
    created_at: string
};


export interface FSGetRequest {
    id: string
}

export function useFSGet(): [Response<FileSystemInfo | null>, PostAction<FSGetRequest>] {
    const [response, fetchData] = useAPIPost<FSGetRequest, FileSystemInfo>('/api/fs/get')

    return [response, fetchData]
}

export interface FSCreateResponse {
    id: string
}

export function useFSCreate(): [Response<FSCreateResponse | null>, PostAction<FileSystemInfo>] {
    const [response, fetchData] = useAPIPost<FileSystemInfo, FSCreateResponse>('/api/fs/create')

    return [response, fetchData]
}

export function useFSUpdate(): [Response<void | null>, PostAction<FileSystemInfo>] {
    const [response, fetchData] = useAPIPost<FileSystemInfo, void>('/api/fs/update')

    return [response, fetchData]
}

export interface FSDeleteRequest {
    id: string
}

export function useFSDelete(): [Response<void | null>, PostAction<FSDeleteRequest>] {
    const [response, fetchData] = useAPIPost<FSDeleteRequest, void>('/api/fs/delete')

    return [response, fetchData]
}

export interface FSListRequest {
    include_db_file_size?: boolean
}

export interface FSListResponse {
    file_systems?: Array<FSListResponseUnit>
}


export interface FSListResponseUnit {
    info: FileSystemInfo
    is_legacy: boolean
    db_files_info?: {
        count: number
        size: number
        size_formatted: string
    }
}

export function useFSList(): [Response<FSListResponse | null>, PostAction<FSListRequest>] {
    const [response, fetchData] = useAPIPost<FSListRequest, FSListResponse>('/api/fs/list')

    return [response, fetchData]
}

export interface FSValidateRequest {
    id: string
}

export function useFSValidate(): [Response<void | null>, PostAction<FSValidateRequest>] {
    const [response, fetchData] = useAPIPost<FSValidateRequest, void>('/api/fs/validate')

    return [response, fetchData]
}

export interface FSRemoveMismatchRequest {
    id: string
}

export function useFSRemoveMismatch(): [Response<void | null>, PostAction<FSRemoveMismatchRequest>] {
    const [response, fetchData] = useAPIPost<FSRemoveMismatchRequest, void>('/api/fs/remove-mismatch')

    return [response, fetchData]
}