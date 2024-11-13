import { PostAction, useAPIPost, Response } from "./client-hooks"

interface AgentListRequest {
    can_parse?: boolean
    can_export?: boolean
    can_parse_multi?: boolean
    include_status?: boolean
}

export interface AgentListResponse {
    status?: AgentListResponseStatus
    id: string
    name: string
    addr: string
    can_parse: boolean
    can_parse_multi: boolean
    can_export: boolean
    priority: number
    create_at: string
}

interface AgentListResponseStatus {
    start_at?: string
    check_status_error?: string
    status: string
    problems?: Array<AgentListResponseStatusProblems>
}

interface AgentListResponseStatusProblems {
    type: string
    details: string
}

export function useAgentList(): [Response<Array<AgentListResponse> | null>, PostAction<AgentListRequest>] {
    const [response, fetchData] = useAPIPost<AgentListRequest, Array<AgentListResponse>>('/api/agent/list')

    return [response, fetchData]
}