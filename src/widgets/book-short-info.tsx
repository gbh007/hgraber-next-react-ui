import { Link } from "react-router-dom";
import { BookShortInfo } from "../apiclient/model-book";
import styles from "./book-short-info.module.css"
import missingImage from "../assets/missing-image.png"

interface BookShortInfoProps {
    value: BookShortInfo
}

export function BookShortInfoWidget(props: BookShortInfoProps) {
    const book = props.value

    return <div className="app-container">
        <div className="container-row container-gap-middle" data-background-color={book.flags.parsed_name ? '' : 'danger'}>
            <Link to={`/book/${book.id}`}>
                <img
                    className={styles.preview}
                    src={book.preview_url ?? missingImage}
                />
            </Link>
            <div className="container-column">
                <span data-color={book.flags.parsed_name ? '' : 'danger'}>{book.name}</span>
                <div className={styles["info-area"]}>
                    <span data-color="book.parsed_page ? '' : 'danger'">Страниц: {book.page_count}</span>
                    <span data-color={book.page_loaded_percent != 100.0 ? 'danger' : ''}> Загружено: {book.page_loaded_percent}%</span>
                    <span>{new Date(book.created).toLocaleString()}</span>
                </div >
                <span>
                    {book.tags ? book.tags!.map((tagname: string) =>
                        <span key={tagname} className={styles.tag}>{tagname}</span>
                    ) : null}
                    {book.has_more_tags ? <b>и больше!</b> : null}
                </span>
            </div >
        </div >
    </div >
}