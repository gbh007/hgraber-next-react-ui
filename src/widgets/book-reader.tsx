import { PropsWithChildren, useState } from "react"
import { BookSimplePage } from "../apiclient/model-book"
import { DialogWidget } from "./common"
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
            <Link className="app-button" to={`/book/${props.bookID}/labels?pageNumber=${props.pageNumber}`}>Редактировать метки</Link>
            {props.currentPage?.has_dead_hash === false ?
                <button
                    className="app"
                    onClick={() => {
                        setShow(false)
                        props.onCreateDeadHash()
                    }}
                >
                    <span className="color-danger-lite">Создать мертвый хеш</span>
                </button> : null
            }
            {props.currentPage?.has_dead_hash === true ?
                <button
                    className="app"
                    onClick={() => {
                        setShow(false)
                        props.onDeleteDeadHash()
                    }}
                >
                    <span className="color-danger-lite">Удалить мертвый хеш</span>
                </button> : null
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
                        <b className="color-danger">Удалить такие страницы</b>
                    </button>
                    <Link className="app-button" to={`/deduplicate/${props.bookID}/${props.pageNumber}`}>Книги с этой страницей</Link>
                </> : null
            }
            {props.children}
        </DialogWidget>
    </>
}