import { AttributeCountResponseAttribute } from "../apiclient/api-attribute-count";
import { BookRebuildRequest } from "../apiclient/api-book";
import { LabelPresetListResponseLabel } from "../apiclient/api-labels";
import { BookSimplePage } from "../apiclient/model-book";
import { BookAttributeInfoEditorWidget, BookLabelInfoEditorWidget, BookMainInfoEditorWidget } from "./book-editor";
import styles from "./book-detail-info.module.css"
import { Link } from "react-router-dom";

export function BookRebuilderWidget(props: {
    value: BookRebuildRequest
    onChange: (v: BookRebuildRequest) => void
    pages?: Array<BookSimplePage>
    labelsAutoComplete?: Array<LabelPresetListResponseLabel>
    attributeCount?: Array<AttributeCountResponseAttribute>
}) {
    return <div className="container-column container-gap-middle">
        <div className="app-container container-column container-gap-small">
            {/* FIXME: сделать выбор через фильтр как для обычного просмотра книг */}
            <input
                className="app"
                value={props.value.merge_with_book ?? ""}
                onChange={e => props.onChange({ ...props.value, merge_with_book: e.target.value || undefined })}
                placeholder="книга с которой надо соединить"
            />
            <label>
                <input
                    className="app"
                    type="checkbox"
                    checked={props.value.only_unique ?? false}
                    onChange={e => props.onChange({ ...props.value, only_unique: e.target.checked })}
                /> Только уникальные страницы
            </label>
        </div>
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