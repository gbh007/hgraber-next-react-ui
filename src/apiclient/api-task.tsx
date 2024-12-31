import { PostAction, useAPIPost, Response, useAPIGet, GetAction } from "./client-hooks"

export interface TaskCreateRequest {
    code: string
}

export function useTaskCreate(): [Response<void | null>, PostAction<TaskCreateRequest>] {
    const [response, fetchData] = useAPIPost<TaskCreateRequest, void>('/api/task/create')

    return [response, fetchData]
}

export interface TaskResultsResponse {
    results?: Array<TaskResultsResponseResult>
}

export interface TaskResultsResponseResult {
    name: string
    error?: string
    result?: string
    duration_formatted: string
    started_at: string
    ended_at: string
    stages?: Array<TaskResultsResponseResultStage>
}

export interface TaskResultsResponseResultStage {
    name: string
    error?: string
    result?: string
    duration_formatted: string
    started_at: string
    ended_at: string
    progress: number
    total: number
}

export function useTaskResults(): [Response<TaskResultsResponse | null>, GetAction] {
    const [response, fetchData] = useAPIGet<TaskResultsResponse>('/api/task/results')

    return [response, fetchData]
}
