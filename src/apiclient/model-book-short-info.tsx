export interface BookShortInfo {
    id: string
    created: string
    preview_url?: string
    parsed_name: boolean
    name: string
    parsed_page: boolean
    page_count: number
    page_loaded_percent: number
    tags?: Array<string>
    has_more_tags: boolean
}