import { Link, useParams } from "react-router-dom"
import { useDeduplicateBooksByPage } from "../apiclient/api-deduplicate"
import { useEffect } from "react"
import { ErrorTextWidget } from "../widgets/error-text"
import { BookSimple } from "../apiclient/model-book"
import styles from "./books-by-page.module.css"
import { HumanTimeWidget } from "../widgets/common"
import { BookImagePreviewWidget } from "../widgets/book-short-info"

export function BooksByPageScreen() {
    const params = useParams()
    const bookID = params.bookID!
    const pageNumber = parseInt(params.page!)

    const [booksByPageResponse, fetchBooksByPage] = useDeduplicateBooksByPage()

    useEffect(() => {
        fetchBooksByPage({
            book_id: bookID,
            page_number: pageNumber,
        })
    }, [fetchBooksByPage, bookID, pageNumber])

    return <div>
        <ErrorTextWidget value={booksByPageResponse} />
        <BookDuplicates value={booksByPageResponse.data?.books} />
    </div>
}

function BookDuplicates(props: {
    value?: Array<BookSimple>
}) {
    return <div className={styles.preview}>
        {props.value?.map(book =>
            <div className="app-container" key={book.id}>
                <Link to={`/book/${book.id}`}>
                    <BookImagePreviewWidget
                        flags={book.flags}
                        preview_url={book.preview_url}
                        previewSize="medium"
                    />
                </Link>
                <b>{book.name}</b>
                <span>Создана: <HumanTimeWidget value={book.created_at} /></span>
                <span>Страниц: {book.page_count}</span>
            </div>
        )}
    </div>
}