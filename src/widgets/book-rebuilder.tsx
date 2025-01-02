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
import { useState } from "react";

export function BookRebuilderWidget(props: {
    value: BookRebuildRequest
    onChange: (v: BookRebuildRequest) => void
    targetBookFilter: BookFilter
    targetBookFilterChange: (v: BookFilter) => void
    getTargetBooks: (data: BookFilter) => void // TODO: Сильно перегруженный виджет, подумать над возможностью его упрощения
    targetBookResponse?: BookListResponse
    pages?: Array<BookSimplePage>
    labelsAutoComplete?: Array<LabelPresetListResponseLabel>
    attributeCount?: Array<AttributeCountResponseAttribute>
}) {
    const [targetPreview, setTargetPreview] = useState<BookShortInfo>()

    return <div className="container-column container-gap-middle">
        <div className="app-container container-column container-gap-small">
            {/* FIXME: сделать выбор через фильтр как для обычного просмотра книг */}
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
        </div>

        {targetPreview && targetPreview.id == props.value.merge_with_book ?

            <div className="app-container container-column container-gap-small">
                <span>Данные будут внесены в</span>
                <BooksPreview value={targetPreview} />
            </div>
            :
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
        />
    </div>
}


function BookPagesSelectWidget(props: {
    value: Array<number>
    onChange: (v: Array<number>) => void
    bookID: string
    pages?: Array<BookSimplePage>

}) {
    return <div className={styles.preview}>
        <div>
            <button className="app" onClick={() => props.onChange(props.pages?.map(page => page.page_number) ?? [])}>Выбрать все</button>
            <button className="app" onClick={() => props.onChange([])}>Снять все</button>
        </div>
        {props.pages?.map(page =>
            <div className="app-container" key={page.page_number}>
                {page.preview_url ?
                    <Link to={`/book/${props.bookID}/read/${page.page_number}`}>
                        <img className={styles.preview} src={page.preview_url} />
                    </Link> : null}
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
                {book.preview_url ?
                    <Link to={`/book/${book.id}`} style={{ flexGrow: 1 }}>
                        <img className={styles.bookPreview} src={book.preview_url} />
                    </Link> : null}
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
        {book.preview_url ?
            <Link to={`/book/${book.id}`}>
                <img className={styles.bookPreview} src={book.preview_url} />
            </Link> : null}
        <b>{book.name}</b>
        <span>Создана: <HumanTimeWidget value={book.created} /></span>
        <span>Страниц: {book.page_count}</span>
    </div>
}