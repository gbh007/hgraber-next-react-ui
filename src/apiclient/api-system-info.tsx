import { GetAction, useAPIGet, Response } from "./client-hooks"

interface systemInfo {
  count: number
  not_load_count: number
  page_count: number
  not_load_page_count: number
  page_without_body_count: number
  pages_size: number
  pages_size_formatted: string
  files_size: number
  files_size_formatted: string
  monitor?: systemInfoMonitor
}

interface systemInfoMonitor {
  workers?: Array<systemInfoMonitorWorker>
}

export interface systemInfoMonitorWorker {
  name: string
  in_queue: number
  in_work: number
  runners: number
}

export function useSystemInfo(): [Response<systemInfo | null>, GetAction] {
  const [response, fetchData] = useAPIGet<systemInfo>('/api/system/info')

  return [response, fetchData]
}