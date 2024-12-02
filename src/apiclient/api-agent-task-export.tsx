import { PostAction, useAPIPost, Response } from "./client-hooks"
import { BookFilter } from "./model-book-filter"

interface AgentTaskExportRequest {
    book_filter: BookFilter
    exporter: string
    delete_after: boolean
}

export function useAgentTaskExport(): [Response<void | null>, PostAction<AgentTaskExportRequest>] {
    const [response, fetchData] = useAPIPost<AgentTaskExportRequest, void>('/api/agent/task/export')

    return [response, fetchData]
}