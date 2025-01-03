import { Link, useNavigate, useParams } from "react-router-dom"
import styles from "./read.module.css"
import { useBookDetails } from "../apiclient/api-book-details"
import { useCallback, useEffect, useState } from "react"
import { ErrorTextWidget } from "../widgets/error-text"
import { BookLabelEditorButtonCoordinatorWidget } from "../widgets/book-label-editor"
import { DialogWidget } from "../widgets/common"
import { BookSimplePage } from "../apiclient/model-book"
import { useCreateDeadHashByPage, useDeleteDeadHashByPage, useDeletePagesByBody } from "../apiclient/api-deduplicate"

export function BookReadScreen() {
    const params = useParams()
    const bookID = params.bookID!
    const pageNumber = parseInt(params.page!)

    const [currentPage, setCurrentPage] = useState<BookSimplePage>()
    const [onlyActivePage, setOnlyActivePage] = useState(false)

    const [bookDetailsResponse, getBookDetails] = useBookDetails()
    const [createDeadHashResponse, doCreateDeadHash] = useCreateDeadHashByPage()
    const [deleteDeadHashResponse, doDeleteDeadHash] = useDeleteDeadHashByPage()
    const [deleteAllPageByBodyResponse, doDeleteAllPageByBody] = useDeletePagesByBody()

    const navigate = useNavigate();

    useEffect(() => {
        getBookDetails({ id: bookID })
    }, [getBookDetails, bookID])


    useEffect(() => { // TODO: заменить на вычисляемую функцию
        setCurrentPage(bookDetailsResponse.data?.pages?.filter(page => page.page_number == pageNumber).pop())
    }, [bookDetailsResponse.data, bookID, pageNumber])

    const goPage = useCallback((page: number) => {
        navigate(`/book/${bookID}/read/${page}`)
    }, [bookID])


    const prevPage = useCallback(() => {
        if (pageNumber == 1) return

        const pageNumberInArray = bookDetailsResponse.data?.pages?.
            map(e => e.page_number).
            filter(e => e < pageNumber).
            sort((a: number, b: number) => a - b).
            reduce((_, cur) => cur)

        if (onlyActivePage && pageNumberInArray) {
            goPage(pageNumberInArray)
        } else {
            goPage(pageNumber - 1)
        }
    }, [bookDetailsResponse.data, bookID, pageNumber, goPage, onlyActivePage])

    const nextPage = useCallback(() => {
        if (pageNumber == bookDetailsResponse.data?.page_count) return

        const pageNumberInArray = bookDetailsResponse.data?.pages?.
            map(e => e.page_number).
            filter(e => e > pageNumber).
            sort((a: number, b: number) => b - a).
            reduce((_, cur) => cur)

        if (onlyActivePage && pageNumberInArray) {
            goPage(pageNumberInArray)
        } else {
            goPage(pageNumber + 1)
        }
    }, [bookDetailsResponse.data, bookID, pageNumber, goPage, onlyActivePage])


    const goGo = useCallback((event: any) => {
        const pos = document.getElementById("main-image")!.getBoundingClientRect();
        const dx = (event.pageX - pos.left) / (pos.right - pos.left);
        if (dx < 0.3) {
            prevPage();
        } else {
            nextPage();
        }
    }, [prevPage, nextPage])

    useEffect(() => {
        const eventHandler = (event: KeyboardEvent) => {
            if (event.keyCode === 37) prevPage();
            if (event.keyCode === 39) nextPage();
        }

        window.addEventListener("keydown", eventHandler)

        return () => {
            window.removeEventListener("keydown", eventHandler)
        }
    }, [prevPage, nextPage])

    return <div>
        <ErrorTextWidget value={bookDetailsResponse} />
        <ErrorTextWidget value={createDeadHashResponse} />
        <ErrorTextWidget value={deleteDeadHashResponse} />
        <ErrorTextWidget value={deleteAllPageByBodyResponse} />
        <div className={styles.viewScreen}>
            <div className={"app-container " + styles.actions}>
                <Link className="app-button" to={`/book/${bookID}`}>На страницу книги</Link>
                {currentPage?.has_dead_hash == true ? <span style={{ color: "red" }}>мертвый хеш</span> : null}
                <label><input
                    type="checkbox"
                    className="app"
                    checked={onlyActivePage}
                    onChange={e => setOnlyActivePage(e.target.checked)}
                />только активные страницы</label>
                <span>
                    Страница {pageNumber} из {bookDetailsResponse.data?.page_count || 0}
                </span>
            </div>
            <div className={styles.view}>
                {currentPage?.preview_url ? <img
                    src={currentPage?.preview_url}
                    id="main-image"
                    className={styles.view}
                    onClick={goGo}
                /> : null}
            </div>
            <div className={"app-container " + styles.actions}>
                <span>
                    <button className="app" onClick={prevPage}><span className={styles.pageNavigate}>{"<"}</span></button>
                    <button className="app" onClick={nextPage}><span className={styles.pageNavigate}>{">"}</span></button>
                </span>
                {currentPage ?
                    <button
                        className="app"
                        onClick={() => {
                            if (!confirm("Удалить такие страницы и добавить их в мертвый хеш? (ЭТО НЕОБРАТИМО)")) {
                                return
                            }

                            doDeleteAllPageByBody({
                                book_id: bookID,
                                page_number: currentPage.page_number,
                                set_dead_hash: true,
                            }).then(() => {
                                getBookDetails({ id: bookID })
                            })
                        }}
                    >
                        <b style={{ color: "red" }}>Удалить такие страницы</b>
                    </button> : null

                }
                <BookReadActionButtonWidget
                    bookID={bookID}
                    pageNumber={pageNumber}
                    has_dead_hash={currentPage?.has_dead_hash}
                    currentPage={currentPage}
                    onCreateDeadHash={() => {
                        if (!currentPage) {
                            return
                        }

                        if (!confirm("Создать мертвых хеш для таких страниц?")) {
                            return
                        }

                        doCreateDeadHash({
                            book_id: bookID,
                            page_number: currentPage.page_number
                        }).then(() => {
                            getBookDetails({ id: bookID })
                        })
                    }}
                    onDeleteDeadHash={() => {
                        if (!currentPage) {
                            return
                        }

                        if (!confirm("Удалить мертвых хеш для таких страниц?")) {
                            return
                        }

                        doDeleteDeadHash({
                            book_id: bookID,
                            page_number: currentPage.page_number
                        }).then(() => {
                            getBookDetails({ id: bookID })
                        })
                    }}
                    onDeleteAllPages={() => {
                        if (!currentPage) {
                            return
                        }

                        if (!confirm("Удалить такие страницы? (ЭТО НЕОБРАТИМО)")) {
                            return
                        }

                        const setDeadHash = confirm("Установить для текущих страниц мертвый хеш?")

                        doDeleteAllPageByBody({
                            book_id: bookID,
                            page_number: currentPage.page_number,
                            set_dead_hash: setDeadHash,
                        }).then(() => {
                            getBookDetails({ id: bookID })
                        })
                    }}
                />
                <span>
                    <button className="app" onClick={prevPage}><span className={styles.pageNavigate}>{"<"}</span></button>
                    <button className="app" onClick={nextPage}><span className={styles.pageNavigate}>{">"}</span></button>
                </span>
            </div>
        </div>
    </div>
}

function BookReadActionButtonWidget(props: {
    bookID: string
    pageNumber: number
    has_dead_hash?: boolean
    currentPage?: BookSimplePage
    onCreateDeadHash: () => void
    onDeleteDeadHash: () => void
    onDeleteAllPages: () => void
}) {
    const [show, setShow] = useState(false)

    return <>
        <button
            className="app"
            onClick={() => {
                setShow(true)
            }}
        >опции</button>
        <DialogWidget open={show} onClose={() => setShow(false)}>
            <BookLabelEditorButtonCoordinatorWidget
                bookID={props.bookID}
                pageNumber={props.pageNumber}
            />
            {props.has_dead_hash === false ?
                <button
                    className="app"
                    onClick={() => {
                        setShow(false)
                        props.onCreateDeadHash()
                    }}
                    style={{ color: "#b00" }}
                >Создать мертвый хеш</button> : null
            }
            {props.has_dead_hash === true ?
                <button
                    className="app"
                    onClick={() => {
                        setShow(false)
                        props.onDeleteDeadHash()
                    }}
                    style={{ color: "#b00" }}
                >Удалить мертвый хеш</button> : null
            }
            {props.currentPage ?
                <>
                    <button
                        className="app"
                        onClick={() => {
                            setShow(false)
                            props.onDeleteAllPages()
                        }}
                    >
                        <b style={{ color: "red" }}>Удалить такие страницы</b>
                    </button>
                    <Link className="app-button" to={`/deduplicate/${props.bookID}/${props.pageNumber}`}>Книги с этой страницей</Link>
                </> : null
            }
        </DialogWidget>
    </>
}