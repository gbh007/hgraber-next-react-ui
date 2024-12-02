import { BookShortInfo } from "../apiclient/model-book-short-info";
import "./book-short-info.css"

interface BookShortInfoProps {
    value: BookShortInfo
    onClick: (id: string) => void
}

export function BookShortInfoWidget(props: BookShortInfoProps) {
    const book = props.value

    return <div className="app-container">
        <div className="book" data-parsed={book.parsed_name ? '' : 'bred'}>
            {book.preview_url ? <img
                className="preview"
                v-if="book.preview_url"
                src={book.preview_url}
                onClick={() => props.onClick(book.id)}
            /> : null /* FIXME: добавить альтернативную иконку для незагруженного изображения */}
            <div style={{ display: "flex", flexDirection: "column" }}>
                <span data-parsed={book.parsed_name ? '' : 'red'}>{book.name}</span>
                <div className="info-area">
                    <span data-parsed="book.parsed_page ? '' : 'red'">Страниц: {book.page_count}</span>
                    <span data-parsed={book.page_loaded_percent != 100.0 ? 'red' : ''}> Загружено: {book.page_loaded_percent}%</span>
                    <span>{new Date(book.created).toLocaleString()}</span>
                </div >
                <span>
                    {book.tags ? book.tags!.map((tagname: string) =>
                        <span className="tag">{tagname}</span>
                    ) : null}
                    {book.has_more_tags ? <b>и больше!</b> : null}
                </span>
            </div >
        </div >
    </div >
}