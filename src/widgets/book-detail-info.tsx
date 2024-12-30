import { Link } from "react-router-dom"
import { BookDetails } from "../apiclient/model-book-details"
import styles from "./book-detail-info.module.css"
import { BookLabelEditorButtonCoordinatorWidget } from "./book-label-editor"
import { DeduplicateBookByPageBodyResponseResult } from "../apiclient/api-deduplicate"

interface BookDetailInfoWidgetProps {
    book: BookDetails
    deduplicateBookInfo?: Array<DeduplicateBookByPageBodyResponseResult>
    onDownload: () => void
    onRead: (page: number) => void
    onDelete: () => void
    onVerify: () => void
    onShowDuplicate: () => void
}

// FIXME: необходимо разобрать виджет на компоненты и перенести часть в модель выше.
export function BookDetailInfoWidget(props: BookDetailInfoWidgetProps) {
    return <div>
        <div
            className={"app-container " + styles.bookDetails}
            data-parsed={props.book.parsed_name ? '' : 'bred'}
        >
            <div>
                {props.book.preview_url ?
                    <img
                        className={styles.mainPreview}
                        src={props.book.preview_url}
                    /> :
                    <span></span>
                }
            </div>
            <div className={styles.bookInfo}>
                <h1 data-parsed={props.book.parsed_name ? '' : 'red'}>
                    {props.book.name}
                </h1>
                <div className={styles.bookInfoPanel}>
                    <span> #{props.book.id} </span>
                    <span data-parsed={props.book.parsed_page ? '' : 'red'}>
                        Страниц: {props.book.page_count}
                    </span>
                    <span data-parsed={props.book.page_loaded_percent != 100.0 ? 'red' : ''}>
                        Загружено: {props.book.page_loaded_percent}%
                    </span>
                    <span>{new Date(props.book.created).toLocaleString()}</span>
                </div >
                {props.book.attributes?.map(attr =>
                    <BookDetailInfoAttribute key={attr.name} name={attr.name} values={attr.values} />
                )}
                <div className={styles.bottomButtons}>
                    <button className={"app " + styles.load} onClick={props.onDownload}> Скачать</button>
                    <button className={"app " + styles.read} onClick={() => props.onRead(1)}> Читать</button>
                    <button className={"app " + styles.delete} onClick={props.onDelete}> Удалить</button>
                    <button className={"app " + styles.verify} onClick={props.onVerify}>Подтвердить</button>
                    <button className="app" onClick={props.onShowDuplicate}>Показать дубли</button>
                    {/* FIXME: это жесть как плохо, надо переделать использование */}
                    <BookLabelEditorButtonCoordinatorWidget bookID={props.book.id} />
                </div >
            </div >
        </div >
        <BookDuplicates deduplicateBookInfo={props.deduplicateBookInfo} />
        <div className={styles.preview}>
            {props.book.pages?.filter(page => page.preview_url).map(page =>
                <div className="app-container" key={page.page_number}>
                    <Link to={`/book/${props.book.id}/read/${page.page_number}`}>
                        <img className={styles.preview} src={page.preview_url} />
                    </Link>
                </div>
            )}
        </div >
    </div >
}

function BookDetailInfoAttribute(props: { name: string, values: Array<string> }) {
    return <span>
        <span>{props.name}: </span>
        {props.values.map(tagname =>
            <span className={styles.tag} key={tagname}>{tagname}</span>
        )}
    </span>
}

function BookDuplicates(props: {
    deduplicateBookInfo?: Array<DeduplicateBookByPageBodyResponseResult>
}) {
    return <div className={styles.preview}>
        {props.deduplicateBookInfo?.map(book =>
            <div className="app-container" key={book.book_id}>
                {book.preview_url ?
                    <Link to={`/book/${book.book_id}`}>
                        <img className={styles.preview} src={book.preview_url} />
                    </Link> : null}
                <b>{book.name}</b>
                <span title="Сколько страниц этой книги есть в открытой">Покрытие книги: {prettyPercent(book.origin_covered_target)}%</span>
                <span title="Сколько страниц открытой книги есть в этой">Покрытие оригинала: {prettyPercent(book.target_covered_origin)}%</span>
            </div>
        )}
    </div>
}

function prettyPercent(raw: number): number {
    return Math.round(raw * 1000) / 10
}