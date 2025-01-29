import { useEffect } from "react";
import { useBookDetails } from "../apiclient/api-book-details";
import { ErrorTextWidget } from "../widgets/error-text";
import { BookDetailInfoWidget } from "../widgets/book-detail-info";
import { useBookDelete } from "../apiclient/api-book-delete";
import { useBookVerify } from "../apiclient/api-book-verify";
import { Link, useParams } from "react-router-dom";
import { useCreateDeadHashByBookPages, useDeduplicateBookByPageBody, useDeleteAllPagesByBook, useDeleteBookDeadHashedPages, useDeleteDeadHashByBookPages } from "../apiclient/api-deduplicate";
import styles from "./details.module.css"
import { useBookRestore } from "../apiclient/api-book";
import { useAttributeColorList } from "../apiclient/api-attribute";
import { ColorizedTextWidget, ContainerWidget } from "../widgets/common";
import { BookEditLink, BookLabelEditLink, BookReaderLink, BookRebuildLink, BookUniquePagesLink } from "../core/routing";
import { BookTransferCoordinatorWidget } from "../widgets/book";

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
    const [deleteBookDeadHashedPagesResponse, doDeleteBookDeadHashedPages] = useDeleteBookDeadHashedPages()


    const [attributeColorListResponse, fetchAttributeColorList] = useAttributeColorList()
    useEffect(() => { fetchAttributeColorList() }, [fetchAttributeColorList])

    useEffect(() => {
        getBookDetails({ id: bookID })
    }, [getBookDetails, bookID])


    useEffect(() => {
        bookDeduplicateResponse.cleanData()
    }, [bookID])

    const hasPages = (bookDetailsResponse.data?.pages?.length ?? 0) > 0
    const hasUniquePages = (!bookDetailsResponse.data?.info.flags.is_deleted && (!bookDetailsResponse.data?.size || bookDetailsResponse.data.size.unique != 0))
    const hasSharedPages = (!bookDetailsResponse.data?.info.flags.is_deleted && (!bookDetailsResponse.data?.size || bookDetailsResponse.data.size.shared != 0))
    const hasDeletedPages = bookDetailsResponse.data?.pages && bookDetailsResponse.data?.pages.length != bookDetailsResponse.data?.info.page_count

    return <ContainerWidget direction="column" gap="big">
        <ErrorTextWidget value={bookDetailsResponse} />
        <ErrorTextWidget value={bookDeleteResponse} />
        <ErrorTextWidget value={bookVerifyResponse} />
        <ErrorTextWidget value={bookDeduplicateResponse} />
        <ErrorTextWidget value={createDeadHashByBookResponse} />
        <ErrorTextWidget value={deleteDeadHashByBookResponse} />
        <ErrorTextWidget value={deleteAllPagesByBookResponse} />
        <ErrorTextWidget value={bookRestoreResponse} />
        <ErrorTextWidget value={deleteBookDeadHashedPagesResponse} />
        <ErrorTextWidget value={attributeColorListResponse} />
        {bookDetailsResponse.data ? <BookDetailInfoWidget
            book={bookDetailsResponse.data}
            deduplicateBookInfo={bookDeduplicateResponse.data?.result}
            colors={attributeColorListResponse.data?.colors}
        >
            <ContainerWidget direction="column" gap="big">
                <ContainerWidget direction="row" gap="medium" wrap>
                    <button className={"app " + styles.mainButton} onClick={() => { window.open('/api/book/archive/' + bookID, "_blank") }}>Скачать</button>
                    {hasPages ? <Link className={"app-button " + styles.mainButton} to={BookReaderLink(bookID)}>Читать</Link> : null}
                    {bookDetailsResponse.data.info.flags.is_deleted ? null : <button
                        className={"app " + styles.mainButton}
                        disabled={bookDeleteResponse.isLoading}
                        onClick={() => {
                            if (!confirm(`Удалить книгу: ${bookDetailsResponse.data?.info.name}?`)) {
                                return;
                            }

                            if (bookDetailsResponse.data?.size?.unique && !confirm(`У книги ${bookDetailsResponse.data?.info.name} есть ${bookDetailsResponse.data?.size?.unique_formatted} уникального контента, точно хотите ее удалить?`)) {
                                return;
                            }

                            postBookDelete({ id: bookID }).then(() => { getBookDetails({ id: bookID }) })
                        }}
                    >
                        <ColorizedTextWidget color="danger">Удалить</ColorizedTextWidget>
                    </button>}
                    {bookDetailsResponse.data.info.flags.is_verified ?
                        <button
                            className={"app " + styles.mainButton}
                            disabled={bookVerifyResponse.isLoading}
                            onClick={() => {
                                if (!confirm(`Снять подтверждение с книги: ${bookDetailsResponse.data?.info.name}?`)) {
                                    return;
                                }

                                postBookVerify({ id: bookID, verify_status: false }).then(() => { getBookDetails({ id: bookID }) })
                            }}
                        >
                            <ColorizedTextWidget color="danger-lite">Снять статус подтвержденной</ColorizedTextWidget>
                        </button>
                        :
                        <button
                            className={"app " + styles.mainButton}
                            disabled={bookVerifyResponse.isLoading}
                            onClick={() => {
                                if (!confirm(`Подтвердить книгу: ${bookDetailsResponse.data?.info.name}?`)) {
                                    return;
                                }

                                postBookVerify({ id: bookID, verify_status: true }).then(() => { getBookDetails({ id: bookID }) })
                            }}
                        >
                            <ColorizedTextWidget color="good">Подтвердить</ColorizedTextWidget>
                        </button>
                    }
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
                        <Link className={"app-button " + styles.mainButton} to={BookUniquePagesLink(bookDetailsResponse.data.info.id)}>Показать уникальные страницы</Link>
                        : null}
                </ContainerWidget>
                <details className="app">
                    <summary>дополнительные действия</summary>
                    <ContainerWidget direction="row" gap="medium" wrap>
                        <Link className="app-button" to={BookEditLink(bookDetailsResponse.data.info.id)}>Редактировать</Link>
                        <Link className="app-button" to={BookRebuildLink(bookDetailsResponse.data.info.id)}>Пересобрать</Link>
                        <Link className="app-button" to={BookLabelEditLink(bookDetailsResponse.data.info.id)}>Редактировать метки</Link>
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
                                <ColorizedTextWidget color="danger-lite">Создать мертвый хеш</ColorizedTextWidget>
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
                                <ColorizedTextWidget color="danger-lite">Удалить мертвый хеш</ColorizedTextWidget>
                            </button>
                            <button
                                className="app"
                                disabled={deleteBookDeadHashedPagesResponse.isLoading}
                                onClick={() => {
                                    if (!confirm("Удалить все страницы из этой книги с мертвым хешом? (ЭТО НЕОБРАТИМО)")) {
                                        return
                                    }

                                    doDeleteBookDeadHashedPages({
                                        book_id: bookID,
                                    }).then(() => {
                                        getBookDetails({ id: bookID })
                                    })
                                }}
                            >
                                <ColorizedTextWidget color="danger">Удалить все страницы из книги с мертвым хешом</ColorizedTextWidget>
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
                                <ColorizedTextWidget bold color="danger">Удалить все страницы из книги и их копии</ColorizedTextWidget>
                            </button>
                            <BookTransferCoordinatorWidget bookID={bookID} />
                        </> : null}
                        {!hasPages || hasDeletedPages || bookDetailsResponse.data.info.flags.is_deleted ? <button
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
                            <ColorizedTextWidget color="good">Восстановить книгу</ColorizedTextWidget>
                        </button> : null}
                    </ContainerWidget>
                </details>
            </ContainerWidget>
        </BookDetailInfoWidget> : null}
    </ContainerWidget>
}