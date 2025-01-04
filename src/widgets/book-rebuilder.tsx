import { AttributeCountResponseAttribute } from "../apiclient/api-attribute-count";
import { BookRebuildRequest } from "../apiclient/api-book";
import { LabelPresetListResponseLabel } from "../apiclient/api-labels";
import { BookShortInfo, BookSimplePage } from "../apiclient/model-book";
import { BookAttributeInfoEditorWidget, BookLabelInfoEditorWidget, BookMainInfoEditorWidget } from "./book-editor";
import styles from "./book-rebuilder.module.css"
import { Link } from "react-router-dom";
import { BookFilterWidget } from "./book-filter";
import { BookFilter } from "../apiclient/model-book-filter";
import { BookListResponse } from "../apiclient/api-book-list";
import { PaginatorWidget } from "../pages/list";
import { HumanTimeWidget } from "./common";
import { useCallback, useEffect, useState } from "react";
import missingImage from "../assets/missing-image.png"

export function BookRebuilderWidget(props: {
    value: BookRebuildRequest
    onChange: (v: BookRebuildRequest) => void
    targetBookFilter: BookFilter
    targetBookFilterChange: (v: BookFilter) => void
    getTargetBooks: (data: BookFilter) => void // TODO: Сильно перегруженный виджет, подумать над возможностью его упрощения
    targetBookResponse?: BookListResponse
    pages?: Array<BookSimplePage>
    pageCount?: number
    labelsAutoComplete?: Array<LabelPresetListResponseLabel>
    attributeCount?: Array<AttributeCountResponseAttribute>
}) {
    const [targetPreview, setTargetPreview] = useState<BookShortInfo>()

    return <div className="container-column container-gap-middle">
        <div className="app-container container-column container-gap-small">
            <div className="container-row container-gap-small">
                <span>Выбрана целевой</span>
                <input
                    className="app"
                    value={props.value.merge_with_book ?? ""}
                    onChange={e => props.onChange({ ...props.value, merge_with_book: e.target.value || undefined })}
                    placeholder="книга с которой надо соединить"
                />
                <button
                    className="app"
                    onClick={() => props.onChange({ ...props.value, merge_with_book: undefined })}
                >Сбросить</button>
            </div>
            <label>
                <input
                    className="app"
                    type="checkbox"
                    checked={props.value.only_unique ?? false}
                    onChange={e => props.onChange({ ...props.value, only_unique: e.target.checked })}
                /> Только уникальные страницы
            </label>
            <label>
                <input
                    className="app"
                    type="checkbox"
                    checked={props.value.exclude_dead_hash_pages ?? false}
                    onChange={e => props.onChange({ ...props.value, exclude_dead_hash_pages: e.target.checked })}
                /> Исключить страницы с мертвыми хешами
            </label>
        </div>

        {targetPreview && targetPreview.id == props.value.merge_with_book ?

            <div className="app-container container-column container-gap-small">
                <span>Данные будут внесены в</span>
                <BooksPreview value={targetPreview} />
            </div>
            :
            <details>
                <summary>Выбрать целевую книгу</summary>
                <div className="app-container container-column container-gap-small">
                    <BookFilterWidget
                        value={props.targetBookFilter}
                        onChange={props.targetBookFilterChange}
                    />
                    <button className="app" onClick={() => {
                        props.getTargetBooks({ ...props.targetBookFilter, page: 1 })
                    }}>Применить</button>
                    <PaginatorWidget onChange={(v: number) => {
                        props.targetBookFilterChange({ ...props.targetBookFilter, page: v })
                        props.getTargetBooks({ ...props.targetBookFilter, page: v })
                    }} value={props.targetBookResponse?.pages || []} />
                    <BooksList
                        value={props.targetBookResponse?.books}
                        onChange={e => {
                            props.onChange({ ...props.value, merge_with_book: e.id || undefined })
                            setTargetPreview(e)
                        }}
                        selected={props.value.merge_with_book}
                    />
                </div>
            </details>
        }
        {!props.value.merge_with_book ?
            <BookMainInfoEditorWidget
                value={props.value.old_book}
                onChange={e => props.onChange({ ...props.value, old_book: e })}
            />
            : null}
        <BookLabelInfoEditorWidget
            value={props.value.old_book.labels ?? []}
            onChange={e => props.onChange({ ...props.value, old_book: { ...props.value.old_book, labels: e } })}
            labelsAutoComplete={props.labelsAutoComplete}
        />
        <BookAttributeInfoEditorWidget
            value={props.value.old_book.attributes ?? []}
            onChange={e => props.onChange({ ...props.value, old_book: { ...props.value.old_book, attributes: e } })}
            attributeCount={props.attributeCount}
        />
        <BookPagesSelectWidget
            value={props.value.selected_pages}
            onChange={e => props.onChange({ ...props.value, selected_pages: e })}
            bookID={props.value.old_book.id}
            pages={props.pages}
            pageCount={props.pageCount}
        />
    </div>
}


function BookPagesSelectWidget(props: {
    value: Array<number>
    onChange: (v: Array<number>) => void
    bookID: string
    pages?: Array<BookSimplePage>
    pageCount?: number
}) {
    const [viewMode, setViewMode] = useState("reader")

    return <div className="container-column container-gap-middle">
        <div className="app-container container-row container-gap-small">
            <button className="app" onClick={() => props.onChange(props.pages?.map(page => page.page_number) ?? [])}>Выбрать все</button>
            <button className="app" onClick={() => props.onChange([])}>Снять все</button>
            <select
                className="app"
                value={viewMode}
                onChange={e => setViewMode(e.target.value)}
            >
                <option value="reader">Режим просмотра: постранично</option>
                <option value="list">Режим просмотра: все страницы</option>
                <option value="list_selected">Режим просмотра: все выбранные страницы</option>
            </select>
            <span>Выбрано {props.value.length} из {props.pages?.length}</span>
        </div>
        {viewMode == "reader" ?
            <PageSelectorReaderWidget
                bookID={props.bookID}
                onChange={props.onChange}
                value={props.value}
                pages={props.pages}
                pageCount={props.pageCount}
            /> : viewMode == "list" ?
                <PageListPreview
                    bookID={props.bookID}
                    onChange={props.onChange}
                    value={props.value}
                    pages={props.pages}
                /> : viewMode == "list_selected" ?
                    <PageListPreview
                        bookID={props.bookID}
                        onChange={props.onChange}
                        value={props.value}
                        pages={props.pages?.filter(page => props.value.includes(page.page_number))}
                    /> : null}
    </div>
}

function PageListPreview(props: {
    value: Array<number>
    onChange: (v: Array<number>) => void
    bookID: string
    pages?: Array<BookSimplePage>
}) {
    return <div className={styles.preview}>
        {props.pages?.map(page =>
            <div className="app-container" key={page.page_number}>
                {page.preview_url ?
                    <Link to={`/book/${props.bookID}/read/${page.page_number}`}>
                        <img className={styles.preview} src={page.preview_url} />
                    </Link> : null}
                <span>Страница: {page.page_number}</span>
                {page.has_dead_hash == true ? <span style={{ color: "red" }}>мертвый хеш</span> : null}
                <label><input
                    className="app"
                    type="checkbox"
                    checked={props.value.includes(page.page_number)}
                    onChange={e => props.onChange(
                        e.target.checked ?
                            [...props.value, page.page_number]
                            :
                            props.value.filter(v => v != page.page_number)
                    )}
                /> выбрать</label>
            </div>
        )}
    </div>
}


function BooksList(props: {
    value?: Array<BookShortInfo>
    selected?: string
    onChange: (v: BookShortInfo) => void
}) {
    return <div className={styles.preview}>
        {props.value?.map(book =>
            <div className="app-container" key={book.id}>
                <Link to={`/book/${book.id}`} style={{ flexGrow: 1 }}>
                    <img className={styles.bookPreview} src={book.preview_url ?? missingImage} />
                </Link>
                <b>{book.name}</b>
                <span>Создана: <HumanTimeWidget value={book.created} /></span>
                <span>Страниц: {book.page_count}</span>
                <button
                    className="app"
                    onClick={() => props.onChange(book)}
                    disabled={book.id == props.selected}
                >Выбрать</button>
            </div>
        )}
    </div>
}

function BooksPreview(props: {
    value?: BookShortInfo
}) {
    if (!props.value) {
        return
    }

    const book = props.value!

    return <div className="container-column container-gap-smaller" key={book.id}>
        <Link to={`/book/${book.id}`}>
            <img className={styles.bookPreview} src={book.preview_url ?? missingImage} />
        </Link>
        <b>{book.name}</b>
        <span>Создана: <HumanTimeWidget value={book.created} /></span>
        <span>Страниц: {book.page_count}</span>
    </div>
}

function PageSelectorReaderWidget(props: {
    value: Array<number>
    onChange: (v: Array<number>) => void
    bookID: string
    pageCount?: number
    pages?: Array<BookSimplePage>
}) {
    if (!props.pages) {
        return null
    }

    const [currentIndex, setCurrentIndex] = useState(0)
    const [currentPage, setCurrentPage] = useState<BookSimplePage>()

    useEffect(() => {
        setCurrentIndex(0)
    }, [props.bookID, props.pages])

    useEffect(() => {
        setCurrentPage(props.pages![currentIndex])
    }, [currentIndex])

    const prevPage = useCallback(() => {
        if (currentIndex == 0) return
        setCurrentIndex(currentIndex - 1)
    }, [props.pages, currentIndex])

    const nextPage = useCallback(() => {
        if (currentIndex == props.pages!.length - 1) return
        setCurrentIndex(currentIndex + 1)
    }, [props.pages, currentIndex])


    const goGo = useCallback((event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        const pos = event.currentTarget.getBoundingClientRect()
        const dx = (event.pageX - pos.left) / (pos.right - pos.left);
        if (dx < 0.3) {
            prevPage();
        } else {
            nextPage();
        }
    }, [prevPage, nextPage])

    return <div className="app-container">
        <div className={styles.pageViewActions}>
            <span>
                <button className="app" onClick={prevPage}><span className={styles.pageViewActionsPageNavigate}>{"<"}</span></button>
                <button className="app" onClick={nextPage}><span className={styles.pageViewActionsPageNavigate}>{">"}</span></button>
            </span>
            {currentPage?.has_dead_hash == true ? <span style={{ color: "red" }}>мертвый хеш</span> : null}
            {currentPage ?
                <label><input
                    className="app"
                    type="checkbox"
                    checked={props.value.includes(currentPage!.page_number)}
                    onChange={e => props.onChange(
                        e.target.checked ?
                            [...props.value, currentPage!.page_number]
                            :
                            props.value.filter(v => v != currentPage!.page_number)
                    )}
                /> выбрать</label> : null
            }
            <span>
                {`Страница ${currentPage?.page_number}` +
                    ` из ${props.pageCount ?? props.pages.length ?? 0}` +
                    (props.pageCount && props.pageCount != props.pages.length ? ` (${currentIndex + 1}/${props.pages.length})` : '')
                }
            </span>
        </div>
        <div className={styles.pageView}>
            {currentPage?.preview_url ? <img
                src={currentPage?.preview_url}
                className={styles.pageView}
                onClick={goGo}
            /> : null}
        </div>
    </div>
}