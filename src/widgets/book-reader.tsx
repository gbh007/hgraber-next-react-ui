import { PropsWithChildren, useState } from "react"
import { BookSimplePage } from "../apiclient/model-book"
import { DialogWidget } from "./common"
import { BookLabelEditorButtonCoordinatorWidget } from "./book-label-editor"
import { Link } from "react-router-dom"


export function BookReadActionButtonWidget(props: PropsWithChildren & {
    bookID: string
    pageNumber: number
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
            {props.currentPage?.has_dead_hash === false ?
                <button
                    className="app"
                    onClick={() => {
                        setShow(false)
                        props.onCreateDeadHash()
                    }}
                    style={{ color: "#b00" }}
                >Создать мертвый хеш</button> : null
            }
            {props.currentPage?.has_dead_hash === true ?
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
            {props.children}
        </DialogWidget>
    </>
}