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
import { ColorizedTextWidget, ContainerWidget } from "./common";
import { useCallback, useEffect, useState } from "react";
import { ImageSize, PageBadgesWidget, PageImagePreviewWidget } from "./book-short-info";
import { usePreviewSizeWidget } from "./book-detail-info";
import { BooksSimpleWidget } from "./book";
import { BookReaderLink } from "../core/routing";

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

    return <ContainerWidget direction="column" gap="big">
        <ContainerWidget appContainer direction="column" gap="small">
            <ContainerWidget direction="row" gap="small">
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
            </ContainerWidget>
            <BuilderFlagsWidget
                value={props.value.flags}
                onChange={e => props.onChange({ ...props.value, flags: e })}
            />
        </ContainerWidget>

        {targetPreview && targetPreview.info.id == props.value.merge_with_book ?
            <ContainerWidget appContainer direction="column" gap="small">
                <span>Данные будут внесены в</span>
                <BooksSimpleWidget value={targetPreview.info} align="start" previewSize="medium" />
            </ContainerWidget>
            :
            <details className="app">
                <summary>Выбрать целевую книгу</summary>
                <ContainerWidget direction="column" gap="big">
                    <ContainerWidget appContainer direction="column" gap="small">
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
                    </ContainerWidget>
                    <BooksList
                        value={props.targetBookResponse?.books}
                        onChange={e => {
                            props.onChange({ ...props.value, merge_with_book: e.info.id || undefined })
                            setTargetPreview(e)
                        }}
                        selected={props.value.merge_with_book}
                    />
                </ContainerWidget>
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
    </ContainerWidget>
}


function BuilderFlagsWidget(props: {
    value?: BookRebuildRequestFlags
    onChange: (v: BookRebuildRequestFlags) => void
}) {
    return <ContainerWidget direction="column" gap="small">
        <label>
            <input
                className="app"
                type="checkbox"
                checked={props.value?.set_origin_labels ?? false}
                onChange={e => props.onChange({ ...props.value, set_origin_labels: e.target.checked })}
            />
            <ColorizedTextWidget color="good">Проставить каждой страницы метки об оригинальной книге если ее нет</ColorizedTextWidget>
        </label>
        <label>
            <input
                className="app"
                type="checkbox"
                checked={props.value?.auto_verify ?? false}
                onChange={e => props.onChange({ ...props.value, auto_verify: e.target.checked })}
            />
            <ColorizedTextWidget color="good">Проставить билду статус подтвержденной книги</ColorizedTextWidget>
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
        <label>
            <input
                className="app"
                type="checkbox"
                checked={props.value?.extract_mode ?? false}
                onChange={e => props.onChange({ ...props.value, extract_mode: e.target.checked })}
            />
            <ColorizedTextWidget color="danger-lite">Режим экстракции - вынос страниц в новую книгу с удалением их только из исходной</ColorizedTextWidget>
        </label>
        <label>
            <input
                className="app"
                type="checkbox"
                checked={props.value?.mark_unused_pages_as_dead_hash ?? false}
                onChange={e => props.onChange({ ...props.value, mark_unused_pages_as_dead_hash: e.target.checked })}
            />
            <ColorizedTextWidget color="danger-lite">Отметить страницы что не вошли в ребилд как мертвый хеш</ColorizedTextWidget>
        </label>
        <label>
            <input
                className="app"
                type="checkbox"
                checked={props.value?.mark_unused_pages_as_deleted ?? false}
                onChange={e => props.onChange({ ...props.value, mark_unused_pages_as_deleted: e.target.checked })}
            />
            <ColorizedTextWidget color="danger">Удалить страницы что не вошли в ребилд и их копии в системе</ColorizedTextWidget>
        </label>
        <label>
            <input
                className="app"
                type="checkbox"
                checked={props.value?.mark_empty_book_as_deleted_after_remove_pages ?? false}
                onChange={e => props.onChange({ ...props.value, mark_empty_book_as_deleted_after_remove_pages: e.target.checked })}
            />
            <ColorizedTextWidget color="danger-lite">Отметить удаленным книги что остались без страниц после их удаления</ColorizedTextWidget>
        </label>
    </ContainerWidget>
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


    const [imageSize, imageSizeWidget] = usePreviewSizeWidget("medium")

    const pages = props.pages?.
        filter(page => !showOnlySelected || props.value.includes(page.page_number)).
        filter(page => showDeadHash || !page.has_dead_hash)

    return <ContainerWidget direction="column" gap="medium">
        <ContainerWidget appContainer direction="column" gap="medium">
            <ContainerWidget direction="row" gap="medium">
                <button className="app" onClick={() => props.onChange(props.pages?.map(page => page.page_number) ?? [])}>Выбрать все</button>
                <button className="app" onClick={() => props.onChange([])}>Снять все</button>
                <span>Выбрано {props.value.length} из {props.pages?.length}</span>
            </ContainerWidget>
            <ContainerWidget direction="row" gap="medium">
                <select
                    className="app"
                    value={viewMode}
                    onChange={e => setViewMode(e.target.value)}
                >
                    <option value="reader">Режим просмотра: постранично</option>
                    <option value="list">Режим просмотра: все страницы</option>
                </select>
                {viewMode == "list" ? imageSizeWidget : null}
            </ContainerWidget>
            <ContainerWidget direction="column" gap="medium">
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
            </ContainerWidget>
        </ContainerWidget>
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
                        previewSize={imageSize}
                    /> : null}
    </ContainerWidget>
}

function PageListPreview(props: {
    value: Array<number>
    onChange: (v: Array<number>) => void
    bookID: string
    pages?: Array<BookSimplePage>
    previewSize: ImageSize
}) {
    return <div className={styles.preview}>
        {props.pages?.map(page =>
            <ContainerWidget appContainer key={page.page_number}>
                {page.preview_url ? <PageImagePreviewWidget
                    previewSize={props.previewSize}
                    flags={page}
                    preview_url={page.preview_url}
                    onClick={() => {
                        const checked = props.value.includes(page.page_number)
                        props.onChange(
                            !checked ?
                                [...props.value, page.page_number]
                                :
                                props.value.filter(v => v != page.page_number)
                        )
                    }}
                /> : null}
                <span>Страница: {page.page_number}</span>
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
                <Link
                    className="app-button"
                    to={BookReaderLink(props.bookID, page.page_number)}>
                    Открыть в читалке
                </Link>
            </ContainerWidget>
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
            <BooksSimpleWidget value={book.info} key={book.info.id}>
                <button
                    className="app"
                    onClick={() => props.onChange(book)}
                    disabled={book.info.id == props.selected}
                >Выбрать</button>
            </BooksSimpleWidget>
        )}
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

    return <ContainerWidget direction="column" gap="medium">
        <ContainerWidget appContainer>
            <div className={styles.pageViewActions}>
                <span>
                    <button className="app" onClick={prevPage}><span className={styles.pageViewActionsPageNavigate}>{"<"}</span></button>
                    <button className="app" onClick={nextPage}><span className={styles.pageViewActionsPageNavigate}>{">"}</span></button>
                </span>
                <PageBadgesWidget flags={currentPage} badgeSize="medium" />
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
        </ContainerWidget>
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
    </ContainerWidget>
}