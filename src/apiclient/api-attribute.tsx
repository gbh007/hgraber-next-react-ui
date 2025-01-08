import { GetAction, PostAction, Response, useAPIGet, useAPIPost } from "./client-hooks"

export interface AttributeCountResponse {
    attributes?: Array<AttributeCountResponseAttribute>
}

export interface AttributeCountResponseAttribute {
    code: string
    value: string
    count: number
}

export function useAttributeCount(): [Response<AttributeCountResponse | null>, GetAction] {
    const [response, fetchData] = useAPIGet<AttributeCountResponse>('/api/attribute/count')

    return [response, fetchData]
}

export interface AttributeColor {
    code: string
    value: string
    text_color: string
    background_color: string
    created_at: string
}

export interface AttributeColorListResponse {
    colors?: Array<AttributeColor>
}

export function useAttributeColorList(): [Response<AttributeColorListResponse | null>, GetAction] {
    const [response, fetchData] = useAPIGet<AttributeColorListResponse>('/api/attribute/color/list')

    return [response, fetchData]
}

export interface AttributeColorDeleteRequest {
    code: string
    value: string
}

export function useAttributeColorDelete(): [Response<void | null>, PostAction<AttributeColorDeleteRequest>] {
    const [response, fetchData] = useAPIPost<AttributeColorDeleteRequest, void>('/api/attribute/color/delete')

    return [response, fetchData]
}

export interface AttributeColorGetRequest {
    code: string
    value: string
}

export function useAttributeColorGet(): [Response<AttributeColor | null>, PostAction<AttributeColorGetRequest>] {
    const [response, fetchData] = useAPIPost<AttributeColorGetRequest, AttributeColor>('/api/attribute/color/get')

    return [response, fetchData]
}

export function useAttributeColorCreate(): [Response<void | null>, PostAction<AttributeColor>] {
    const [response, fetchData] = useAPIPost<AttributeColor, void>('/api/attribute/color/create')

    return [response, fetchData]
}

export function useAttributeColorUpdate(): [Response<void | null>, PostAction<AttributeColor>] {
    const [response, fetchData] = useAPIPost<AttributeColor, void>('/api/attribute/color/update')

    return [response, fetchData]
}