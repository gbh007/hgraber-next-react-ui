import { useEffect } from "react";
import { useBookDetails } from "../apiclient/api-book-details";
import { ErrorTextWidget } from "../widgets/error-text";
import { BookDetailInfoWidget } from "../widgets/book-detail-info";
import { useBookDelete } from "../apiclient/api-book-delete";
import { useBookVerify } from "../apiclient/api-book-verify";
import { Link, useParams } from "react-router-dom";
import { useCreateDeadHashByBookPages, useDeduplicateBookByPageBody, useDeleteAllPagesByBook, useDeleteDeadHashByBookPages } from "../apiclient/api-deduplicate";
import { BookLabelEditorButtonCoordinatorWidget } from "../widgets/book-label-editor";
import styles from "./details.module.css"
import { useBookRestore } from "../apiclient/api-book";

export function BookDetailsScreen() {
    const params = useParams()
    const bookID = params.bookID!

    const [bookDetailsResponse, getBookDetails] = useBookDetails()
    const [bookDeleteResponse, postBookDelete] = useBookDelete()
    const [bookVerifyResponse, postBookVerify] = useBookVerify()
    const [bookDeduplicateResponse, doBookDeduplicate] = useDeduplicateBookByPageBody()
    const [createDeadHashByBookResponse, doCreateDeadHashByBook] = useCreateDeadHashByBookPages()
    const [deleteDeadHashByBookResponse, doDeleteDeadHashByBook] = useDeleteDeadHashByBookPages()
    const [deleteAllPagesByBookResponse, doDeleteAllPagesByBook] = useDeleteAllPagesByBook()
    const [bookRestoreResponse, doBookRestore] = useBookRestore()

    useEffect(() => {
        getBookDetails({ id: bookID })
    }, [getBookDetails, bookID])


    useEffect(() => {
        bookDeduplicateResponse.cleanData()
    }, [bookID])

    const hasPages = (bookDetailsResponse.data?.pages?.length ?? 0) > 0
    const hasUniquePages = (!bookDetailsResponse.data?.flags.is_deleted && (!bookDetailsResponse.data?.size || bookDetailsResponse.data.size.unique != 0))
    const hasSharedPages = (!bookDetailsResponse.data?.flags.is_deleted && (!bookDetailsResponse.data?.size || bookDetailsResponse.data.size.shared != 0))
    const hasDeletedPages = bookDetailsResponse.data?.pages && bookDetailsResponse.data?.pages.length != bookDetailsResponse.data?.page_count

    return <div>
        <ErrorTextWidget value={bookDetailsResponse} />
        <ErrorTextWidget value={bookDeleteResponse} />
        <ErrorTextWidget value={bookVerifyResponse} />
        <ErrorTextWidget value={bookDeduplicateResponse} />
        <ErrorTextWidget value={createDeadHashByBookResponse} />
        <ErrorTextWidget value={deleteDeadHashByBookResponse} />
        <ErrorTextWidget value={deleteAllPagesByBookResponse} />
        <ErrorTextWidget value={bookRestoreResponse} />
        {bookDetailsResponse.data ? <BookDetailInfoWidget
            book={bookDetailsResponse.data}
            deduplicateBookInfo={bookDeduplicateResponse.data?.result}
        >
            <div className="container-column container-gap-big">
                <div className="container-row container-gap-middle container-wrap">
                    <button className={"app " + styles.mainButton} onClick={() => { window.open('/api/book/archive/' + bookID, "_blank") }}>Скачать</button>
                    {hasPages ? <Link className={"app-button " + styles.mainButton} to={`/book/${bookID}/read/1`}>Читать</Link> : null}
                    {bookDetailsResponse.data.flags.is_deleted ? null : <button
                        className={"app " + styles.mainButton}
                        disabled={bookDeleteResponse.isLoading}
                        onClick={() => {
                            if (!confirm(`Удалить книгу: ${bookDetailsResponse.data?.name}`)) {
                                return;
                            }

                            if (bookDetailsResponse.data?.size?.unique && !confirm(`У книги ${bookDetailsResponse.data?.name} есть ${bookDetailsResponse.data?.size?.unique_formatted} уникального контента, точно хотите ее удалить?`)) {
                                return;
                            }

                            postBookDelete({ id: bookID }).then(() => { getBookDetails({ id: bookID }) })
                        }}
                    >
                        <span className="color-danger">Удалить</span>
                    </button>}
                    {bookDetailsResponse.data.flags.is_verified ? null : <button
                        className={"app " + styles.mainButton}
                        disabled={bookVerifyResponse.isLoading}
                        onClick={() => {
                            if (!confirm(`Подтвердить книгу: ${bookDetailsResponse.data?.name}`)) {
                                return;
                            }

                            postBookVerify({ id: bookID }).then(() => { getBookDetails({ id: bookID }) })
                        }}
                    >
                        <span className="color-good">Подтвердить</span>
                    </button>}
                    {hasSharedPages ?
                        <button
                            className={"app " + styles.mainButton}
                            disabled={bookDeduplicateResponse.isLoading}
                            onClick={() => {
                                doBookDeduplicate({ book_id: bookID })
                            }}
                        >Показать дубли</button>
                        : null}
                    {hasUniquePages ?
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
                                disabled={createDeadHashByBookResponse.isLoading}
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
                                disabled={deleteDeadHashByBookResponse.isLoading}
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
                            <button
                                className="app"
                                disabled={deleteAllPagesByBookResponse.isLoading}
                                onClick={() => {
                                    if (!confirm("Удалить все страницы из этой книги и их копии? (ЭТО НЕОБРАТИМО)")) {
                                        return
                                    }

                                    const markAsDeletedEmptyBook = confirm("Удалить книги которые станут пустыми?")

                                    doDeleteAllPagesByBook({
                                        book_id: bookID,
                                        mark_as_deleted_empty_book: markAsDeletedEmptyBook,
                                    }).then(() => {
                                        getBookDetails({ id: bookID })
                                    })
                                }}
                            >
                                <b className="color-danger">Удалить все страницы из книги и их копии</b>
                            </button>
                        </> : null}
                        {!hasPages || hasDeletedPages || bookDetailsResponse.data.flags.is_deleted ? <button
                            className="app"
                            disabled={bookRestoreResponse.isLoading}
                            onClick={() => {
                                if (!confirm("Восстановить книгу?")) {
                                    return
                                }

                                const onlyPages = confirm("Восстановить только страницы?")

                                doBookRestore({
                                    book_id: bookID,
                                    only_pages: onlyPages,
                                }).then(() => {
                                    getBookDetails({ id: bookID })
                                })
                            }}
                        >
                            <span className="color-good">Восстановить книгу</span>
                        </button> : null}
                    </div>
                </details>
            </div>
        </BookDetailInfoWidget> : null}
    </div>
}