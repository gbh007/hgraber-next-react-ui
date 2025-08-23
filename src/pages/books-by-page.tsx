import { useParams } from "react-router-dom"
import { useDeduplicateBooksByPage } from "../apiclient/api-deduplicate"
import { useEffect } from "react"
import { ErrorTextWidget } from "../widgets/error-text"
import { BookSimple } from "../apiclient/model-book"
import styles from "./books-by-page.module.css"
import { BooksSimpleWidget } from "../widgets/book/books-simple-widget"

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
            <BooksSimpleWidget value={book} align="center" previewSize="medium" key={book.id} />
        )}
    </div>
}