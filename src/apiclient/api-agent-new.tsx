import { PostAction, useAPIPost, Response } from "./client-hooks"

export interface AgentNewRequest {
    name: string
    addr: string
    token: string
    can_parse: boolean
    can_parse_multi: boolean
    can_export: boolean
    priority: number
}

export function useAgentNew(): [Response<void | null>, PostAction<AgentNewRequest>] {
    const [response, fetchData] = useAPIPost<AgentNewRequest, void>('/api/agent/new')

    return [response, fetchData]
}