import { PostAction, useAPIPost, Response } from "./client-hooks"

interface AgentDeleteRequest {
    id: string
}

export function useAgentDelete(): [Response<void | null>, PostAction<AgentDeleteRequest>] {
    const [response, fetchData] = useAPIPost<AgentDeleteRequest, void>('/api/agent/delete')

    return [response, fetchData]
}