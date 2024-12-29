import { GetAction, Response, useAPIGet } from "./client-hooks"

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