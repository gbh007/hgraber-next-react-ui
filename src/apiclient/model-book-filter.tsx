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
    show_rebuilded?: string
    filter?: BookFilterAdditional
}

export interface BookFilterAdditional {
    name?: string
    attributes?: Array<BookFilterAttribute>
    labels?: Array<BookFilterLabel>
}

export interface BookFilterAttribute {
    code: string
    type: string
    values?: Array<string>
    count?: number
}

export interface BookFilterLabel {
    name: string
    type: string
    values?: Array<string>
    count?: number
}