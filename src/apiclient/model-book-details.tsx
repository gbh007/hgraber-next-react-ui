export interface BookDetails {
    id: string
    created: string
    preview_url?: string
    parsed_name: boolean
    name: string
    parsed_page: boolean
    page_count: number
    page_loaded_percent: number
    attributes?: Array<BookDetailsAttribute>
    pages?: Array<BookSimplePage>
    size?: BookDetailsSize
}

export interface BookDetailsAttribute {
    name: string
    values: Array<string>
}

export interface BookSimplePage {
    page_number: number
    preview_url?: string
}

export interface BookDetailsSize {
    unique: number
    shared: number
    total: number
    unique_formatted: string
    shared_formatted: string
    total_formatted: string
}