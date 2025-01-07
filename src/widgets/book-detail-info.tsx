import { Link } from "react-router-dom"
import styles from "./book-detail-info.module.css"
import { DeduplicateBookByPageBodyResponseResult } from "../apiclient/api-deduplicate"
import { PropsWithChildren, useEffect, useState } from "react"
import { BookAttribute, BookDetails, BookSimplePage } from "../apiclient/model-book"
import missingImage from "../assets/missing-image.png"


// FIXME: необходимо разобрать виджет на компоненты и перенести часть в модель выше.
export function BookDetailInfoWidget(props: PropsWithChildren & {
    book: BookDetails
    deduplicateBookInfo?: Array<DeduplicateBookByPageBodyResponseResult>
}) {
    return <div>
        <div
            className="app-container container-row"
            data-background-color={props.book.flags.parsed_name ? '' : 'danger'}
        >
            <div>
                <BookMainImagePreviewWidget value={props.book.preview_url} />
            </div>
            <div className={styles.bookInfo}>
                <h1 data-color={props.book.flags.parsed_name ? '' : 'danger'} style={{ wordBreak: "break-all" }}>
                    {props.book.name}
                </h1>
                <div className={styles.bookInfoPanel}>
                    <span> #{props.book.id} </span>
                    <span data-color={props.book.flags.parsed_page ? '' : 'danger'}>
                        Страниц: {props.book.page_count}
                        {props.book.pages && props.book.pages.length != props.book.page_count ? ` (${props.book.pages.length})` : null}
                    </span>
                    <span data-color={props.book.page_loaded_percent != 100.0 ? 'danger' : ''}>
                        Загружено: {props.book.page_loaded_percent}%
                    </span>
                    <span>{new Date(props.book.created).toLocaleString()}</span>
                </div>
                <BookAttributesWidget value={props.book.attributes} />
                {props.book.size ? <div className="container-column">
                    <b>Размер:</b>
                    <span>уникальный (без мертвых хешей) {props.book.size.unique_without_dead_hashes_formatted}</span>
                    <span>уникальный (с мертвыми хешами) {props.book.size.unique_formatted}</span>
                    <span>разделяемый {props.book.size.shared_formatted}</span>
                    <span>мертвые хеши {props.book.size.dead_hashes_formatted}</span>
                    <span>общий {props.book.size.total_formatted}</span>
                </div> : null}
                {props.children}
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
    return <div>
        <img
            className={styles.mainPreview}
            src={props.value ?? missingImage}
        />
    </div>
}

export function BookPagesPreviewWidget(props: {
    bookID: string
    pages?: Array<BookSimplePage>
    pageLimit?: number
}) {
    if (!props.pages?.length) {
        return null
    }

    const [pageLimit, setPageLimit] = useState(20)

    useEffect(() => {
        setPageLimit(props.pageLimit ?? 20)
    }, [setPageLimit, props.pageLimit, props.bookID])

    return <div className={styles.preview}>
        {props.pages?.filter(page => page.preview_url)
            .filter((_, i) => pageLimit == -1 || i < pageLimit)
            .map((page) =>
                <div className="app-container" key={page.page_number}>
                    <Link to={`/book/${props.bookID}/read/${page.page_number}`}>
                        <img className={styles.preview} src={page.preview_url} />
                    </Link>
                    {page.has_dead_hash == true ? <span style={{ color: "red" }}>мертвый хеш</span> : null}
                </div>

            )}
        {pageLimit != -1 && (pageLimit < props.pages.length) ?
            <button className="app" onClick={() => setPageLimit(-1)}>Показать все страницы</button>
            : null}
    </div>
}

export function BookAttributesWidget(props: {
    value?: Array<BookAttribute>
}) {
    if (!props.value) {
        return null
    }

    return <div className="container-column container-gap-small">
        {props.value?.map(attr =>
            <BookAttributeWidget key={attr.code} value={attr} />
        )}
    </div>
}

export function BookAttributeWidget(props: {
    value: BookAttribute
}) {
    return <div className="container-row container-gap-small" style={{ alignItems: "center", flexWrap: "wrap" }}>
        <span>{props.value.name}:</span>
        {props.value.values.map(v =>
            <span className={styles.tag} key={v}>{v}</span>
        )}
    </div>
}

function BookDuplicates(props: {
    originID: string
    deduplicateBookInfo?: Array<DeduplicateBookByPageBodyResponseResult>
}) {
    return <div className={styles.preview}>
        {props.deduplicateBookInfo?.map(book =>
            <div className="app-container" key={book.book.id}>
                <Link to={`/book/${book.book.id}`}>
                    <img className={styles.preview} src={book.book.preview_url ?? missingImage} />
                </Link>
                <b>{book.book.name}</b>
                <span>Страниц: {book.book.page_count}</span>
                <span title="Сколько страниц этой книги есть в открытой">Покрытие книги: {prettyPercent(book.origin_covered_target)}% ({prettyPercent(book.origin_covered_target_without_dead_hashes)}%)</span>
                <span title="Сколько страниц открытой книги есть в этой">Покрытие оригинала: {prettyPercent(book.target_covered_origin)}% ({prettyPercent(book.target_covered_origin_without_dead_hashes)}%)</span>
                <Link className="app-button" to={`/book/${props.originID}/compare/${book.book.id}`}>Сравнить</Link>
            </div>
        )}
    </div>
}

function prettyPercent(raw: number): number {
    return Math.round(raw * 1000) / 10
}