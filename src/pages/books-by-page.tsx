import { Link, useParams } from "react-router-dom"
import { useDeduplicateBooksByPage } from "../apiclient/api-deduplicate"
import { useEffect } from "react"
import { ErrorTextWidget } from "../widgets/error-text"
import { BookSimple } from "../apiclient/model-book"
import styles from "./books-by-page.module.css"
import { HumanTimeWidget } from "../widgets/common"
import missingImage from "../assets/missing-image.png"

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
                    <img className={styles.preview} src={book.preview_url ?? missingImage} />
                </Link>
                <b>{book.name}</b>
                <span>Создана: <HumanTimeWidget value={book.create_at} /></span>
                <span>Страниц: {book.page_count}</span>
            </div>
        )}
    </div>
}