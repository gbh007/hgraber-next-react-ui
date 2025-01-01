import { Link } from "react-router-dom"
import { BookDetails, BookSimplePage } from "../apiclient/model-book-details"
import styles from "./book-detail-info.module.css"
import { BookLabelEditorButtonCoordinatorWidget } from "./book-label-editor"
import { DeduplicateBookByPageBodyResponseResult } from "../apiclient/api-deduplicate"


// FIXME: необходимо разобрать виджет на компоненты и перенести часть в модель выше.
export function BookDetailInfoWidget(props: {
    book: BookDetails
    deduplicateBookInfo?: Array<DeduplicateBookByPageBodyResponseResult>
    onDownload: () => void
    onRead: (page: number) => void
    onDelete: () => void
    onVerify: () => void
    onShowDuplicate: () => void
}) {
    return <div>
        <div
            className={"app-container " + styles.bookDetails}
            data-parsed={props.book.flags.parsed_name ? '' : 'bred'}
        >
            <div>
                <BookMainImagePreviewWidget value={props.book.preview_url} />
            </div>
            <div className={styles.bookInfo}>
                <h1 data-parsed={props.book.flags.parsed_name ? '' : 'red'}>
                    {props.book.name}
                </h1>
                <div className={styles.bookInfoPanel}>
                    <span> #{props.book.id} </span>
                    <span data-parsed={props.book.flags.parsed_page ? '' : 'red'}>
                        Страниц: {props.book.page_count}
                    </span>
                    <span data-parsed={props.book.page_loaded_percent != 100.0 ? 'red' : ''}>
                        Загружено: {props.book.page_loaded_percent}%
                    </span>
                    <span>{new Date(props.book.created).toLocaleString()}</span>
                </div>
                {props.book.attributes?.map(attr =>
                    <BookDetailInfoAttribute key={attr.name} name={attr.name} values={attr.values} />
                )}
                {props.book.size ? <span>Размер: уникальный {props.book.size.unique_formatted} разделяемый {props.book.size.shared_formatted} общий {props.book.size.total_formatted}</span> : null}
                <div className={styles.bottomButtons}>
                    <button className={"app " + styles.load} onClick={props.onDownload}> Скачать</button>
                    <button className={"app " + styles.read} onClick={() => props.onRead(1)}> Читать</button>
                    {props.book.flags.is_deleted ? null : <button className={"app " + styles.delete} onClick={props.onDelete}> Удалить</button>}
                    {props.book.flags.is_verified ? null : <button className={"app " + styles.verify} onClick={props.onVerify}>Подтвердить</button>}
                    {!props.book.flags.is_deleted && (!props.book.size || props.book.size.shared != 0) ?
                        <button className="app" onClick={props.onShowDuplicate}>Показать дубли</button>
                        : null}
                    {!props.book.flags.is_deleted && (!props.book.size || props.book.size.unique != 0) ?
                        <Link className="app-button" to={`/book/${props.book.id}/unique-pages`}>Показать уникальные страницы</Link>
                        : null}
                    {/* FIXME: это жесть как плохо, надо переделать использование */}
                    <BookLabelEditorButtonCoordinatorWidget bookID={props.book.id} />
                </div>
            </div>
        </div>
        <BookDuplicates deduplicateBookInfo={props.deduplicateBookInfo} originID={props.book.id} />
        <BookPagesPreviewWidget
            bookID={props.book.id}
            pages={props.book.pages}
        />
    </div>
}

export function BookMainImagePreviewWidget(props: {
    value?: string
}) {
    return props.value ?
        <img
            className={styles.mainPreview}
            src={props.value}
        /> :
        <span></span>
}

export function BookPagesPreviewWidget(props: {
    bookID: string
    pages?: Array<BookSimplePage>
}) {
    if (!props.pages) {
        return null
    }

    return <div className={styles.preview}>
        {props.pages?.filter(page => page.preview_url).map(page =>
            <div className="app-container" key={page.page_number}>
                <Link to={`/book/${props.bookID}/read/${page.page_number}`}>
                    <img className={styles.preview} src={page.preview_url} />
                </Link>
            </div>
        )}
    </div>
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
    originID: string
    deduplicateBookInfo?: Array<DeduplicateBookByPageBodyResponseResult>
}) {
    return <div className={styles.preview}>
        {props.deduplicateBookInfo?.map(book =>
            <div className="app-container" key={book.book.id}>
                {book.book.preview_url ?
                    <Link to={`/book/${book.book.id}`}>
                        <img className={styles.preview} src={book.book.preview_url} />
                    </Link> : null}
                <b>{book.book.name}</b>
                <span>Страниц: {book.book.page_count}</span>
                <span title="Сколько страниц этой книги есть в открытой">Покрытие книги: {prettyPercent(book.origin_covered_target)}%</span>
                <span title="Сколько страниц открытой книги есть в этой">Покрытие оригинала: {prettyPercent(book.target_covered_origin)}%</span>
                <Link className="app-button" to={`/book/${props.originID}/compare/${book.book.id}`}>Сравнить</Link>
            </div>
        )}
    </div>
}

function prettyPercent(raw: number): number {
    return Math.round(raw * 1000) / 10
}