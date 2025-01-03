import { useParams } from "react-router-dom"
import { useUniqueBookPages } from "../apiclient/api-deduplicate"
import { useEffect, useState } from "react"
import { ErrorTextWidget } from "../widgets/error-text"
import { BookPagesPreviewWidget } from "../widgets/book-detail-info"

// TODO: выглядит скорее как виджет обрезок, подумать что с этим можно сделать
export function UniqueBookPagesScreen() {
    const params = useParams()
    const bookID = params.bookID!

    const [deadHashSelector, setDeadHashSelector] = useState("all")
    const [uniquePagesResponse, fetchUniquePages] = useUniqueBookPages()

    useEffect(() => {
        fetchUniquePages({ book_id: bookID })
    }, [fetchUniquePages, bookID])

    return <div className="container-column container-gap-middle">
        <ErrorTextWidget value={uniquePagesResponse} />

        <div className="app-container container-row container-gap-small">
            <span>Показывать страницы с мертвыми хешами</span>
            <select
                className="app"
                value={deadHashSelector}
                onChange={e => setDeadHashSelector(e.target.value)}
            >
                <option value="all">Все</option>
                <option value="without">Кроме</option>
                <option value="only">Только</option>
            </select>
        </div>


        <BookPagesPreviewWidget bookID={bookID} pages={uniquePagesResponse.data?.pages?.filter(page =>
            deadHashSelector == "all" ||
            deadHashSelector == "without" && page.has_dead_hash === false ||
            deadHashSelector == "only" && page.has_dead_hash === true)} />

        { }
    </div>
}