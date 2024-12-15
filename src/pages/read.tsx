import { Link, useNavigate, useParams } from "react-router-dom"
import styles from "./read.module.css"
import { useBookDetails } from "../apiclient/api-book-details"
import { useCallback, useEffect, useState } from "react"
import { ErrorTextWidget } from "../widgets/error-text"

export function BookReadScreen() {
    const params = useParams()
    const bookID = params.bookID!
    const pageNumber = parseInt(params.page!)

    const [pageImage, setPageImage] = useState('')

    const [bookDetailsResponse, getBookDetails] = useBookDetails()

    const navigate = useNavigate();

    useEffect(() => {
        getBookDetails({ id: bookID })
    }, [getBookDetails, bookID])


    useEffect(() => { // TODO: заменить на вычисляемую функцию
        setPageImage(bookDetailsResponse.data?.pages?.filter(page => page.page_number == pageNumber)[0].preview_url || '')
    }, [bookDetailsResponse.data, bookID, pageNumber])

    const goPage = useCallback((page: number) => {
        navigate(`/book/${bookID}/read/${page}`)
    }, [bookID])


    const prevPage = useCallback(() => {
        if (pageNumber == 1) return
        goPage(pageNumber - 1)
    }, [bookDetailsResponse.data, bookID, pageNumber, goPage])

    const nextPage = useCallback(() => {
        if (pageNumber == bookDetailsResponse.data?.page_count) return
        goPage(pageNumber + 1)
    }, [bookDetailsResponse.data, bookID, pageNumber, goPage])


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

    return bookDetailsResponse.isError ?
        <ErrorTextWidget isError={bookDetailsResponse.isError} errorText={bookDetailsResponse.errorText} /> :
        <div className={styles.viewScreen}>
            <div className={"app-container " + styles.actions}>
                <Link className="app-button" to={`/book/${bookID}`}>На страницу книги</Link>
                <span>
                    Страница {pageNumber} из {bookDetailsResponse.data?.page_count || 0}
                </span>
            </div>
            <div className={styles.view}>
                {!pageImage ? null : <img
                    src={pageImage}
                    id="main-image"
                    className={styles.view}
                    onClick={goGo}
                />}
            </div>
            <div className={"app-container " + styles.actions}>
                <span>
                    <button className="app" onClick={prevPage}><span className={styles.pageNavigate}>{"<"}</span></button>
                    <button className="app" onClick={nextPage}><span className={styles.pageNavigate}>{">"}</span></button>
                </span>
                <button className="app" disabled={true} title="На данный момент фича в разработке">действия</button>
                <span>
                    <button className="app" onClick={prevPage}><span className={styles.pageNavigate}>{"<"}</span></button>
                    <button className="app" onClick={nextPage}><span className={styles.pageNavigate}>{">"}</span></button>
                </span>
            </div>
        </div>

}