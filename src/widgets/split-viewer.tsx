import { PropsWithChildren, useCallback, useEffect, useState } from "react"
import { BookSimplePage } from "../apiclient/model-book"
import styles from "./split-viewer.module.css"
import { BookReadActionButtonWidget } from "./book-reader"


export function DualReaderWidget(props: {
    aBookID: string
    aPageCount?: number
    aPages?: Array<BookSimplePage>
    bBookID: string
    bPageCount?: number
    bPages?: Array<BookSimplePage>
    onCreateDeadHash: (bookID: string, page: BookSimplePage) => void
    onDeleteDeadHash: (bookID: string, page: BookSimplePage) => void
    onDeleteAllPages: (bookID: string, page: BookSimplePage) => void
    onDeleteAllPagesWithDeadHash: (bookID: string, page: BookSimplePage) => void
}) {
    const [currentAIndex, setCurrentAIndex] = useState(0)
    const [currentAPage, setCurrentAPage] = useState<BookSimplePage>()

    const [currentBIndex, setCurrentBIndex] = useState(0)
    const [currentBPage, setCurrentBPage] = useState<BookSimplePage>()

    useEffect(() => {
        setCurrentAIndex(0)
    }, [props.aBookID])

    useEffect(() => {
        setCurrentAPage(props.aPages![currentAIndex])
    }, [currentAIndex, props.aPages])


    useEffect(() => {
        setCurrentBIndex(0)
    }, [props.bBookID])

    useEffect(() => {
        setCurrentBPage(props.bPages![currentBIndex])
    }, [currentBIndex, props.bPages])

    const prevAPage = useCallback(() => {
        if (currentAIndex == 0) return
        setCurrentAIndex(currentAIndex - 1)
    }, [props.aPages, currentAIndex])

    const nextAPage = useCallback(() => {
        if (currentAIndex == props.aPages!.length - 1) return
        setCurrentAIndex(currentAIndex + 1)
    }, [props.aPages, currentAIndex])


    const prevBPage = useCallback(() => {
        if (currentBIndex == 0) return
        setCurrentBIndex(currentBIndex - 1)
    }, [props.bPages, currentBIndex])

    const nextBPage = useCallback(() => {
        if (currentBIndex == props.bPages!.length - 1) return
        setCurrentBIndex(currentBIndex + 1)
    }, [props.bPages, currentBIndex])


    const prevBothPage = useCallback(() => {
        if (currentBIndex == 0) return
        if (currentAIndex == 0) return
        setCurrentBIndex(currentBIndex - 1)
        setCurrentAIndex(currentAIndex - 1)
    }, [props.bPages, currentBIndex, props.aPages, currentAIndex])

    const nextBothPage = useCallback(() => {
        if (currentAIndex == props.aPages!.length - 1) return
        if (currentBIndex == props.bPages!.length - 1) return
        setCurrentBIndex(currentBIndex + 1)
        setCurrentAIndex(currentAIndex + 1)
    }, [props.bPages, currentBIndex, props.aPages, currentAIndex])

    return <div className="container-column container-gap-small">
        <div className="app-container container-row container-gap-small">
            <button className="app" onClick={prevBothPage}>Пролистать назад</button>
            <button className="app" onClick={nextBothPage}>Пролистать вперед</button>
        </div>
        <div className="container-row container-gap-small">
            <ReaderWidget
                bookID={props.aBookID}
                currentIndex={currentAIndex}
                nextPage={nextAPage}
                prevPage={prevAPage}
                currentPage={currentAPage}
                pageCount={props.aPageCount}
                pages={props.aPages}
            >{currentAPage ? <>
                <BookReadActionButtonWidget
                    bookID={props.aBookID}
                    pageNumber={currentAPage.page_number}
                    currentPage={currentAPage}
                    onCreateDeadHash={() => props.onCreateDeadHash(props.aBookID, currentAPage)}
                    onDeleteAllPages={() => props.onDeleteAllPages(props.aBookID, currentAPage)}
                    onDeleteDeadHash={() => props.onDeleteDeadHash(props.aBookID, currentAPage)}
                />
                <button
                    className="app"
                    onClick={() => props.onDeleteAllPagesWithDeadHash(props.aBookID, currentAPage)}
                >
                    <b className="color-danger">Удалить такие страницы</b>
                </button>
                <span></span>
            </> : null}
            </ReaderWidget>
            <ReaderWidget
                bookID={props.bBookID}
                currentIndex={currentBIndex}
                nextPage={nextBPage}
                prevPage={prevBPage}
                currentPage={currentBPage}
                pageCount={props.bPageCount}
                pages={props.bPages}
            >{currentBPage ? <>
                <BookReadActionButtonWidget
                    bookID={props.bBookID}
                    pageNumber={currentBPage.page_number}
                    currentPage={currentBPage}
                    onCreateDeadHash={() => props.onCreateDeadHash(props.bBookID, currentBPage)}
                    onDeleteAllPages={() => props.onDeleteAllPages(props.bBookID, currentBPage)}
                    onDeleteDeadHash={() => props.onDeleteDeadHash(props.bBookID, currentBPage)}
                />
                <button
                    className="app"
                    onClick={() => props.onDeleteAllPagesWithDeadHash(props.bBookID, currentBPage)}
                >
                    <b className="color-danger">Удалить такие страницы</b>
                </button>
                <span></span>
            </> : null}</ReaderWidget>
        </div>
    </div>
}

function ReaderWidget(props: PropsWithChildren & {
    bookID: string
    pageCount?: number
    pages?: Array<BookSimplePage>
    currentPage?: BookSimplePage
    currentIndex: number
    prevPage: () => void
    nextPage: () => void
}) {
    if (!props.pages) {
        return null
    }

    const goGo = useCallback((event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        const pos = event.currentTarget.getBoundingClientRect()
        const dx = (event.pageX - pos.left) / (pos.right - pos.left);
        if (dx < 0.3) {
            props.prevPage();
        } else {
            props.nextPage();
        }
    }, [props.prevPage, props.nextPage])

    return <div className="app-container container-column container-gap-middle">
        <div className={styles.pageViewActions}>
            <span>
                <button className="app" onClick={props.prevPage}><span className={styles.pageViewActionsPageNavigate}>{"<"}</span></button>
                <button className="app" onClick={props.nextPage}><span className={styles.pageViewActionsPageNavigate}>{">"}</span></button>
            </span>
            {props.currentPage?.has_dead_hash == true ? <span style={{ color: "red" }}>мертвый хеш</span> : null}
            <span>
                {`Страница ${props.currentPage?.page_number}` +
                    ` из ${props.pageCount ?? props.pages.length ?? 0}` +
                    (props.pageCount && props.pageCount != props.pages.length ? ` (${props.currentIndex + 1}/${props.pages.length})` : '')
                }
            </span>
        </div>
        <div className={styles.pageView}>
            {props.currentPage?.preview_url ? <img
                src={props.currentPage?.preview_url}
                className={styles.pageView}
                onClick={goGo}
            /> : null}
        </div>
        {props.children ? <div className={styles.pageViewActions}>{props.children}</div> : null}
    </div>
}
