import { Link } from "react-router-dom";
import styles from "./book-short-info.module.css"
import missingImage from "../assets/missing-image.png"
import { BookShortInfo } from "../apiclient/api-book-list";
import { BookFlags } from "../apiclient/model-book";


export function BookShortInfoWidget(props: {
    value: BookShortInfo
}) {
    const book = props.value
    const tags = book.tags?.filter((_, i) => i < 8)
    const hasMoreTags = book.tags?.length ?? 0 > 8

    return <div className="app-container">
        <div className="container-row container-gap-middle" data-background-color={book.info.flags.parsed_name ? '' : 'danger'}>
            <Link to={`/book/${book.info.id}`}>
                <img
                    className={styles.preview}
                    src={book.info.preview_url ?? missingImage}
                />
            </Link>
            <div className="container-column">
                <b data-color={book.info.flags.parsed_name ? '' : 'danger'}>{book.info.name}</b>
                <BookFlagsWidget value={book.info.flags} />
                <div className="container-row container-gap-small container-wrap" style={{ justifyContent: "space-between" }}>
                    <span data-color={book.info.flags.parsed_page ? '' : 'danger'}>Страниц: {book.info.page_count}</span>
                    <span data-color={book.page_loaded_percent != 100.0 ? 'danger' : ''}> Загружено: {book.page_loaded_percent}%</span>
                    <span>{new Date(book.info.created_at).toLocaleString()}</span>
                </div>
                {tags ? <span>
                    {tags?.map((tagname: string) =>
                        <span key={tagname} className={styles.tag}>{tagname}</span>
                    )}
                    {hasMoreTags ? <b>и больше!</b> : null}
                </span> : null}
            </div>
        </div>
    </div>
}


export function BookFlagsWidget(props: {
    value: BookFlags
}) {
    return <div className="container-row container-gap-small container-wrap">
        {props.value.is_deleted ? <span className="color-danger">Удалена</span> : null}
        {props.value.is_verified ? <span className="color-good">Подтверждена</span> : null}
        {props.value.is_rebuild ? <span style={{ color: "blue" }}>Пересобрана</span> : null}
    </div>
}