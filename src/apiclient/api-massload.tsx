import { GetAction, PostAction, Response, useAPIGet, useAPIPost } from "./client-hooks"

export interface MassloadInfo {
    id: number
    name: string
    description?: string
    is_deduplicated: boolean
    page_size?: number
    page_size_formatted?: string
    file_size?: number
    file_size_formatted?: string
    created_at: string
    updated_at?: string
    external_links?: Array<MassloadInfoExternalLink>
    attributes?: Array<MassloadInfoAttribute>
}

export interface MassloadInfoExternalLink {
    url: string
    created_at: string
}

export interface MassloadInfoAttribute {
    code: string
    value: string
    page_size?: number
    page_size_formatted?: string
    file_size?: number
    file_size_formatted?: string
    created_at: string
    updated_at?: string
}



export interface MassloadInfoCreateRequest {
    id: number
    name: string
    description?: string
    is_deduplicated: boolean
}

export interface MassloadInfoCreateResponse {
    id: number
}

export function useMassloadInfoCreate(): [Response<MassloadInfoCreateResponse | null>, PostAction<MassloadInfoCreateRequest>] {
    const [response, fetchData] = useAPIPost<MassloadInfoCreateRequest, MassloadInfoCreateResponse>('/api/massload/info/create')

    return [response, fetchData]
}

export interface MassloadInfoUpdateRequest {
    id: number
    name: string
    description?: string
    is_deduplicated: boolean
}


export function useMassloadInfoUpdate(): [Response<void | null>, PostAction<MassloadInfoUpdateRequest>] {
    const [response, fetchData] = useAPIPost<MassloadInfoUpdateRequest, void>('api/massload/info/update')

    return [response, fetchData]
}

export interface MassloadInfoDeleteRequest {
    id: number
}

export function useMassloadInfoDelete(): [Response<void | null>, PostAction<MassloadInfoDeleteRequest>] {
    const [response, fetchData] = useAPIPost<MassloadInfoDeleteRequest, void>('/api/massload/info/delete')

    return [response, fetchData]
}

export interface MassloadInfoGetRequest {
    id: number
}

export function useMassloadInfoGet(): [Response<MassloadInfo | null>, PostAction<MassloadInfoGetRequest>] {
    const [response, fetchData] = useAPIPost<MassloadInfoGetRequest, MassloadInfo>('/api/massload/info/get')

    return [response, fetchData]
}


export interface MassloadInfoListResponse {
    massloads?: Array<MassloadInfo>
}

export function useMassloadInfoList(): [Response<MassloadInfoListResponse | null>, GetAction] {
    const [response, fetchData] = useAPIGet<MassloadInfoListResponse>('/api/massload/info/list')

    return [response, fetchData]
}

export interface MassloadExternalLinkCreateRequest {
    massload_id: number
    url: string
}

export function useMassloadExternalLinkCreate(): [Response<void | null>, PostAction<MassloadExternalLinkCreateRequest>] {
    const [response, fetchData] = useAPIPost<MassloadExternalLinkCreateRequest, void>('/api/massload/info/external_link/create')

    return [response, fetchData]
}


export interface MassloadExternalLinkDeleteRequest {
    massload_id: number
    url: string
}

export function useMassloadExternalLinkDelete(): [Response<void | null>, PostAction<MassloadExternalLinkDeleteRequest>] {
    const [response, fetchData] = useAPIPost<MassloadExternalLinkDeleteRequest, void>('/api/massload/info/external_link/delete')

    return [response, fetchData]
}


export interface MassloadAttributeCreateRequest {
    massload_id: number
    code: string
    value: string
}

export function useMassloadAttributeCreate(): [Response<void | null>, PostAction<MassloadAttributeCreateRequest>] {
    const [response, fetchData] = useAPIPost<MassloadAttributeCreateRequest, void>('/api/massload/info/attribute/create')

    return [response, fetchData]
}


export interface MassloadAttributeDeleteRequest {
    massload_id: number
    code: string
    value: string
}

export function useMassloadAttributeDelete(): [Response<void | null>, PostAction<MassloadAttributeDeleteRequest>] {
    const [response, fetchData] = useAPIPost<MassloadAttributeDeleteRequest, void>('/api/massload/info/attribute/delete')

    return [response, fetchData]
}
