import { useEffect } from "react";
import { useBookDetails } from "../apiclient/api-book-details";
import { ErrorTextWidget } from "../widgets/error-text";
import { BookDetailInfoWidget } from "../widgets/book-detail-info";
import { useBookDelete } from "../apiclient/api-book-delete";
import { useBookVerify } from "../apiclient/api-book-verify";
import { Link, useParams } from "react-router-dom";
import { useCreateDeadHashByBookPages, useDeduplicateBookByPageBody, useDeleteDeadHashByBookPages } from "../apiclient/api-deduplicate";
import { BookLabelEditorButtonCoordinatorWidget } from "../widgets/book-label-editor";
import styles from "./details.module.css"

export function BookDetailsScreen() {
    const params = useParams()
    const bookID = params.bookID!

    const [bookDetailsResponse, getBookDetails] = useBookDetails()
    const [bookDeleteResponse, postBookDelete] = useBookDelete()
    const [bookVerifyResponse, postBookVerify] = useBookVerify()
    const [bookDeduplicateResponse, doBookDeduplicate] = useDeduplicateBookByPageBody()
    const [createDeadHashByBookResponse, doCreateDeadHashByBook] = useCreateDeadHashByBookPages()
    const [deleteDeadHashByBookResponse, doDeleteDeadHashByBook] = useDeleteDeadHashByBookPages()

    useEffect(() => {
        getBookDetails({ id: bookID })
    }, [getBookDetails, bookID])


    useEffect(() => {
        bookDeduplicateResponse.cleanData()
    }, [bookID])

    const hasPages = (bookDetailsResponse.data?.pages?.length ?? 0) > 0

    return <div>
        <ErrorTextWidget value={bookDetailsResponse} />
        <ErrorTextWidget value={bookDeleteResponse} />
        <ErrorTextWidget value={bookVerifyResponse} />
        <ErrorTextWidget value={bookDeduplicateResponse} />
        <ErrorTextWidget value={createDeadHashByBookResponse} />
        <ErrorTextWidget value={deleteDeadHashByBookResponse} />
        {bookDetailsResponse.data ? <BookDetailInfoWidget
            book={bookDetailsResponse.data}
            deduplicateBookInfo={bookDeduplicateResponse.data?.result}
        >
            <div className="container-column container-gap-big">
                <div className="container-row container-gap-middle container-wrap">
                    <button className={"app " + styles.mainButton} onClick={() => { window.open('/api/book/archive/' + bookID, "_blank") }}>Скачать</button>
                    {hasPages ? <Link className={"app-button " + styles.mainButton} to={`/book/${bookID}/read/1`}>Читать</Link> : null}
                    {bookDetailsResponse.data.flags.is_deleted ? null : <button className={"app " + styles.mainButton} onClick={() => {
                        if (!confirm(`Удалить книгу: ${bookDetailsResponse.data?.name}`)) {
                            return;
                        }

                        if (bookDetailsResponse.data?.size?.unique && !confirm(`У книги ${bookDetailsResponse.data?.name} есть ${bookDetailsResponse.data?.size?.unique_formatted} уникального контента, точно хотите ее удалить?`)) {
                            return;
                        }

                        postBookDelete({ id: bookID }).then(() => { getBookDetails({ id: bookID }) })
                    }}><span className="color-danger">Удалить</span></button>}
                    {bookDetailsResponse.data.flags.is_verified ? null : <button className={"app " + styles.mainButton} onClick={() => {
                        if (!confirm(`Подтвердить книгу: ${bookDetailsResponse.data?.name}`)) {
                            return;
                        }

                        postBookVerify({ id: bookID }).then(() => { getBookDetails({ id: bookID }) })
                    }}><span className="color-good">Подтвердить</span></button>}
                    {!bookDetailsResponse.data.flags.is_deleted && (!bookDetailsResponse.data.size || bookDetailsResponse.data.size.shared != 0) ?
                        <button className={"app " + styles.mainButton} onClick={() => {
                            doBookDeduplicate({ book_id: bookID })
                        }}>Показать дубли</button>
                        : null}
                    {!bookDetailsResponse.data.flags.is_deleted && (!bookDetailsResponse.data.size || bookDetailsResponse.data.size.unique != 0) ?
                        <Link className={"app-button " + styles.mainButton} to={`/book/${bookDetailsResponse.data.id}/unique-pages`}>Показать уникальные страницы</Link>
                        : null}
                </div>
                <details className="app container-column container-gap-middle">
                    <summary>дополнительные действия</summary>
                    <div className="container-row container-gap-middle container-wrap">
                        <Link className="app-button" to={`/book/${bookDetailsResponse.data.id}/edit`}>Редактировать</Link>
                        <Link className="app-button" to={`/book/${bookDetailsResponse.data.id}/rebuild`}>Пересобрать</Link>
                        {/* FIXME: это жесть как плохо, надо переделать использование */}
                        <BookLabelEditorButtonCoordinatorWidget bookID={bookDetailsResponse.data.id} />
                        {hasPages ? <>
                            <button
                                className="app"
                                onClick={() => {
                                    if (!confirm("Создать мертвых хеш для всех страниц этой книги?")) {
                                        return
                                    }

                                    doCreateDeadHashByBook({
                                        book_id: bookID,
                                    }).then(() => {
                                        getBookDetails({ id: bookID })
                                    })
                                }}
                            >
                                <span className="color-danger-lite">Создать мертвый хеш</span>
                            </button>
                            <button
                                className="app"
                                onClick={() => {
                                    if (!confirm("Удалить мертвых хеш для всех страниц этой книги?")) {
                                        return
                                    }

                                    doDeleteDeadHashByBook({
                                        book_id: bookID,
                                    }).then(() => {
                                        getBookDetails({ id: bookID })
                                    })
                                }}
                            >
                                <span className="color-danger-lite">Удалить мертвый хеш</span>
                            </button>
                        </> : null}

                    </div>
                </details>
            </div>
        </BookDetailInfoWidget> : null}
    </div>
}