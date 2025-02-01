import { GetAction, useAPIGet, Response } from "./client-hooks"

interface systemInfo {
  count: number
  downloaded_count: number
  verified_count: number
  rebuilded_count: number
  not_load_count: number
  deleted_count: number
  page_count: number
  not_load_page_count: number
  page_without_body_count: number
  deleted_page_count: number
  file_count: number
  unhashed_file_count: number
  invalid_file_count: number
  detached_file_count: number
  dead_hash_count: number
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