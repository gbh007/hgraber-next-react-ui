export interface BookFilter {
    sort_desc?: boolean
    sort_field?: string
    count?: number
    page?: number
    from?: string
    to?: string
    verify_status?: string
    delete_status?: string
    download_status?: string
    filter?: BookFilterAdditional
}

export interface BookFilterAdditional {
    name?: string
}