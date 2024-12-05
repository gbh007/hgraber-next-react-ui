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
    pages?: Array<BookDetailsPage>
}

export interface BookDetailsAttribute {
    name: string
    values: Array<string>
}
export interface BookDetailsPage {
    page_number: number
    preview_url?: string
}