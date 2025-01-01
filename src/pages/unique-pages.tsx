import { useParams } from "react-router-dom"
import { useUniqueBookPages } from "../apiclient/api-deduplicate"
import { useEffect } from "react"
import { ErrorTextWidget } from "../widgets/error-text"
import { BookPagesPreviewWidget } from "../widgets/book-detail-info"

// TODO: выглядит скорее как виджет обрезок, подумать что с этим можно сделать
export function UniqueBookPagesScreen() {
    const params = useParams()
    const bookID = params.bookID!

    const [uniquePagesResponse, fetchUniquePages] = useUniqueBookPages()

    useEffect(() => {
        fetchUniquePages({ book_id: bookID })
    }, [fetchUniquePages, bookID])

    return <div>
        <ErrorTextWidget value={uniquePagesResponse} />
        <BookPagesPreviewWidget bookID={bookID} pages={uniquePagesResponse.data?.pages} />
    </div>
}