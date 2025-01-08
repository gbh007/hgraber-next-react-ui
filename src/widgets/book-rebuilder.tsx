import { AttributeCountResponseAttribute } from "../apiclient/api-attribute";
import { BookRebuildRequest, BookRebuildRequestFlags } from "../apiclient/api-book";
import { LabelPresetListResponseLabel } from "../apiclient/api-labels";
import { BookSimplePage } from "../apiclient/model-book";
import { BookAttributeInfoEditorWidget, BookLabelInfoEditorWidget, BookMainInfoEditorWidget } from "./book-editor";
import styles from "./book-rebuilder.module.css"
import { Link } from "react-router-dom";
import { BookFilterWidget } from "./book-filter";
import { BookFilter } from "../apiclient/model-book-filter";
import { BookListResponse, BookShortInfo } from "../apiclient/api-book-list";
import { PaginatorWidget } from "../pages/list";
import { HumanTimeWidget } from "./common";
import { useCallback, useEffect, useState } from "react";
import { BookImagePreviewWidget, PageImagePreviewWidget } from "./book-short-info";

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

    return <div className="container-column container-gap-big">
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
            <BuilderFlagsWidget
                value={props.value.flags}
                onChange={e => props.onChange({ ...props.value, flags: e })}
            />
        </div>

        {targetPreview && targetPreview.info.id == props.value.merge_with_book ?
            <div className="app-container container-column container-gap-small">
                <span>Данные будут внесены в</span>
                <BooksPreview value={targetPreview} />
            </div>
            :
            <details>
                <summary>Выбрать целевую книгу</summary>
                <div className="container-column container-gap-big">
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
                    </div>
                    <BooksList
                        value={props.targetBookResponse?.books}
                        onChange={e => {
                            props.onChange({ ...props.value, merge_with_book: e.info.id || undefined })
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


function BuilderFlagsWidget(props: {
    value?: BookRebuildRequestFlags
    onChange: (v: BookRebuildRequestFlags) => void
}) {
    return <div className="container-column container-gap-small">
        <label className="color-good">
            <input
                className="app"
                type="checkbox"
                checked={props.value?.set_origin_labels ?? false}
                onChange={e => props.onChange({ ...props.value, set_origin_labels: e.target.checked })}
            />Проставить каждой страницы метки об оригинальной книге если ее нет
        </label>
        <label>
            <input
                className="app"
                type="checkbox"
                checked={props.value?.only_unique ?? false}
                onChange={e => props.onChange({ ...props.value, only_unique: e.target.checked })}
            />Оставить только уникальные страницы в результате (без дублей)
        </label>
        <label>
            <input
                className="app"
                type="checkbox"
                checked={props.value?.exclude_dead_hash_pages ?? false}
                onChange={e => props.onChange({ ...props.value, exclude_dead_hash_pages: e.target.checked })}
            />Исключить страницы с мертвыми хешами
        </label>
        <label>
            <input
                className="app"
                type="checkbox"
                checked={props.value?.only_1_copy ?? false}
                onChange={e => props.onChange({ ...props.value, only_1_copy: e.target.checked })}
            />Только уникальные страницы в системе (без копий) и без дублей
        </label>
        <label className="color-danger-lite">
            <input
                className="app"
                type="checkbox"
                checked={props.value?.extract_mode ?? false}
                onChange={e => props.onChange({ ...props.value, extract_mode: e.target.checked })}
            />Режим экстракции - вынос страниц в новую книгу с удалением их только из исходной
        </label>
        <label className="color-danger-lite">
            <input
                className="app"
                type="checkbox"
                checked={props.value?.mark_unused_pages_as_dead_hash ?? false}
                onChange={e => props.onChange({ ...props.value, mark_unused_pages_as_dead_hash: e.target.checked })}
            />Отметить страницы что не вошли в ребилд как мертвый хеш
        </label>
        <label className="color-danger">
            <input
                className="app"
                type="checkbox"
                checked={props.value?.mark_unused_pages_as_deleted ?? false}
                onChange={e => props.onChange({ ...props.value, mark_unused_pages_as_deleted: e.target.checked })}
            />Удалить страницы что не вошли в ребилд и их копии в системе
        </label>
        <label className="color-danger-lite">
            <input
                className="app"
                type="checkbox"
                checked={props.value?.mark_empty_book_as_deleted_after_remove_pages ?? false}
                onChange={e => props.onChange({ ...props.value, mark_empty_book_as_deleted_after_remove_pages: e.target.checked })}
            />Отметить удаленным книги что остались без страниц после их удаления
        </label>
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
    const [showOnlySelected, setShowOnlySelected] = useState(false)
    const [showDeadHash, setShowDeadHash] = useState(true)


    const pages = props.pages?.
        filter(page => !showOnlySelected || props.value.includes(page.page_number)).
        filter(page => showDeadHash || !page.has_dead_hash)

    return <div className="container-column container-gap-middle">
        <div className="app-container container-column container-gap-middle">
            <div className="container-row container-gap-middle">
                <button className="app" onClick={() => props.onChange(props.pages?.map(page => page.page_number) ?? [])}>Выбрать все</button>
                <button className="app" onClick={() => props.onChange([])}>Снять все</button>
                <select
                    className="app"
                    value={viewMode}
                    onChange={e => setViewMode(e.target.value)}
                >
                    <option value="reader">Режим просмотра: постранично</option>
                    <option value="list">Режим просмотра: все страницы</option>
                </select>
                <span>Выбрано {props.value.length} из {props.pages?.length}</span>
            </div>
            <div className="container-column container-gap-middle">
                <label><input
                    type="checkbox"
                    className="app"
                    checked={showOnlySelected}
                    onChange={e => setShowOnlySelected(e.target.checked)}
                />Только выбранные страницы</label>
                <label><input
                    type="checkbox"
                    className="app"
                    checked={showDeadHash}
                    onChange={e => setShowDeadHash(e.target.checked)}
                />Показывать с мертвым хешом</label>
            </div>
        </div>
        {!pages?.length ? null :
            viewMode == "reader" ?
                <PageSelectorReaderWidget
                    bookID={props.bookID}
                    onChange={props.onChange}
                    value={props.value}
                    pages={pages}
                    pageCount={props.pageCount}
                /> : viewMode == "list" ?
                    <PageListPreview
                        bookID={props.bookID}
                        onChange={props.onChange}
                        value={props.value}
                        pages={pages}
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
                        <PageImagePreviewWidget
                            previewSize="medium"
                            flags={page}
                            preview_url={page.preview_url}
                        />
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
            <div className="app-container" key={book.info.id}>
                <Link to={`/book/${book.info.id}`} style={{ flexGrow: 1 }}>
                    <BookImagePreviewWidget
                        flags={book.info.flags}
                        previewSize="small"
                        preview_url={book.info.preview_url}
                    />
                </Link>
                <b>{book.info.name}</b>
                <span>Создана: <HumanTimeWidget value={book.info.created_at} /></span>
                <span>Страниц: {book.info.page_count}</span>
                <button
                    className="app"
                    onClick={() => props.onChange(book)}
                    disabled={book.info.id == props.selected}
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

    return <div className="container-column container-gap-smaller" key={book.info.id} style={{ alignItems: "self-start" }}>
        <Link to={`/book/${book.info.id}`}>
            <BookImagePreviewWidget
                flags={book.info.flags}
                previewSize="medium"
                preview_url={book.info.preview_url}
            />
        </Link>
        <b>{book.info.name}</b>
        <span>Создана: <HumanTimeWidget value={book.info.created_at} /></span>
        <span>Страниц: {book.info.page_count}</span>
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
    }, [props.bookID, props.pages.length])

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

    return <div className="container-column container-gap-middle">
        <div className="app-container">
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
        </div>
        <div className={styles.pageView}>
            {currentPage?.preview_url ? <img
                src={currentPage?.preview_url}
                style={{ // TODO: подумать что с таким делать
                    maxWidth: "100%",
                    maxHeight: "100%",
                }}
                onClick={goGo}
            /> : null}
        </div>
    </div>
}