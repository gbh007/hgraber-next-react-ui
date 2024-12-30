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

    return bookDetailsResponse.isError ?
        <ErrorTextWidget value={bookDetailsResponse} /> :
        <>
            <ErrorTextWidget value={bookDeleteResponse} />
            <ErrorTextWidget value={bookVerifyResponse} />
            {!bookDetailsResponse.data ? null : <BookDetailInfoWidget
                book={bookDetailsResponse.data!}
                onDelete={() => { postBookDelete({ id: bookID }) }}
                onDownload={() => { window.open('/api/book/archive/' + bookID, "_blank") }}
                onRead={(page: number) => {
                    navigate(`/book/${bookID}/read/${page}`)
                }}
                onVerify={() => { postBookVerify({ id: bookID }) }}
                onShowDuplicate={() => {
                    doBookDeduplicate({ book_id: bookID })
                }}
                deduplicateBookInfo={bookDeduplicateResponse.data?.result}
            />}
        </>
}