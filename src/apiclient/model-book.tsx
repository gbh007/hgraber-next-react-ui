export interface BookSimple {
    id: string
    created_at: string
    origin_url?: string
    name: string
    page_count: number
    preview_url?: string
    flags: BookFlags
}

export interface BookSimplePage {
    page_number: number
    preview_url?: string
    has_dead_hash?: boolean
}

export interface BookFlags {
    parsed_name: boolean
    parsed_page: boolean
    is_verified: boolean
    is_deleted: boolean
    is_rebuild: boolean
}

export interface BookAttribute {
    code: string
    name: string
    values: Array<string>
}

export interface BookDetailsSize {
    unique: number
    unique_without_dead_hashes: number
    shared: number
    dead_hashes: number
    total: number
    unique_formatted: string
    unique_without_dead_hashes_formatted: string
    shared_formatted: string
    dead_hashes_formatted: string
    total_formatted: string
    unique_count: number
    unique_without_dead_hashes_count: number
    shared_count: number
    dead_hashes_count: number
    inner_duplicate_count: number
    avg_page_size: number
    avg_page_size_formatted: string
}

export interface BookRaw {
    id: string
    create_at: string
    origin_url?: string
    name: string
    page_count: number
    attributes?: Array<BookRawAttribute>
    pages?: Array<BookRawPage>
    labels?: Array<BookRawLabel>
}

export interface BookRawAttribute {
    code: string
    values: Array<string>
}

export interface BookRawPage {
    page_number: number
    origin_url?: string
    ext: string
    create_at: string
    downloaded: boolean
    load_at: string
}

export interface BookRawLabel {
    page_number: number
    name: string
    value: string
    create_at: string
}
