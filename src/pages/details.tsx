import { useEffect } from "react";
import { useBookDetails } from "../apiclient/api-book-details";
import { ErrorTextWidget } from "../widgets/error-text";
import { BookDetailInfoWidget } from "../widgets/book-detail-info";
import { useBookDelete } from "../apiclient/api-book-delete";
import { useBookVerify } from "../apiclient/api-book-verify";
import { useNavigate, useParams } from "react-router-dom";
import { useDeduplicateBookByPageBody } from "../apiclient/api-deduplicate";

export function BookDetailsScreen() {
    const params = useParams()
    const bookID = params.bookID!

    const [bookDetailsResponse, getBookDetails] = useBookDetails()
    const [bookDeleteResponse, postBookDelete] = useBookDelete()
    const [bookVerifyResponse, postBookVerify] = useBookVerify()
    const [bookDeduplicateResponse, doBookDeduplicate] = useDeduplicateBookByPageBody()

    const navigate = useNavigate();

    useEffect(() => {
        getBookDetails({ id: bookID })
    }, [getBookDetails, bookID])


    useEffect(() => {
        bookDeduplicateResponse.cleanData()
    }, [bookID])

    return <div>
        <ErrorTextWidget value={bookDetailsResponse} />
        <ErrorTextWidget value={bookDeleteResponse} />
        <ErrorTextWidget value={bookVerifyResponse} />
        {!bookDetailsResponse.data ? null : <BookDetailInfoWidget
            book={bookDetailsResponse.data!}
            onDelete={() => {
                if (!confirm(`Удалить книгу: ${bookDetailsResponse.data?.name}`)) {
                    return;
                }

                if (bookDetailsResponse.data?.size?.unique && !confirm(`У книги ${bookDetailsResponse.data?.name} есть ${bookDetailsResponse.data?.size?.unique_formatted} уникального контента, точно хотите ее удалить?`)) {
                    return;
                }

                postBookDelete({ id: bookID }).then(() => { getBookDetails({ id: bookID }) })
            }}
            onDownload={() => { window.open('/api/book/archive/' + bookID, "_blank") }}
            onRead={(page: number) => {
                navigate(`/book/${bookID}/read/${page}`)
            }}
            onVerify={() => {
                if (!confirm(`Подтвердить книгу: ${bookDetailsResponse.data?.name}`)) {
                    return;
                }

                postBookVerify({ id: bookID }).then(() => { getBookDetails({ id: bookID }) })
            }}
            onShowDuplicate={() => {
                doBookDeduplicate({ book_id: bookID })
            }}
            deduplicateBookInfo={bookDeduplicateResponse.data?.result}
        />}
    </div>
}