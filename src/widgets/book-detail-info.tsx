import { BookDetails } from "../apiclient/model-book-details"
import styles from "./book-detail-info.module.css"

interface BookDetailInfoWidgetProps {
    book: BookDetails
    onDownload: () => void
    onRead: (page: number) => void
    onDelete: () => void
    onVerify: () => void
}

export function BookDetailInfoWidget(props: BookDetailInfoWidgetProps) {
    return <div>
        <div
            className={"app-container " + styles.bookDetails}
            data-parsed={props.book.parsed_name ? '' : 'bred'}
        >
            <div>
                {props.book.preview_url ?
                    <img
                        className={styles.mainPreview}
                        src={props.book.preview_url}
                    /> :
                    <span></span>
                }
            </div>
            <div className={styles.bookInfo}>
                <h1 data-parsed={props.book.parsed_name ? '' : 'red'}>
                    {props.book.name}
                </h1>
                <div className={styles.bookInfoPanel}>
                    <span> #{props.book.id} </span>
                    <span data-parsed={props.book.parsed_page ? '' : 'red'}>
                        Страниц: {props.book.page_count}
                    </span>
                    <span data-parsed={props.book.page_loaded_percent != 100.0 ? 'red' : ''}>
                        Загружено: {props.book.page_loaded_percent}%
                    </span>
                    <span>{new Date(props.book.created).toLocaleString()}</span>
                </div >
                {props.book.attributes?.map(attr =>
                    <BookDetailInfoAttribute key={attr.name} name={attr.name} values={attr.values} />
                )}
                <div className={styles.bottomButtons}>
                    <button className={"app " + styles.load} onClick={props.onDownload}> Скачать</button>
                    <button className={"app " + styles.read} onClick={() => props.onRead(1)}> Читать</button>
                    <button className={"app " + styles.delete} onClick={props.onDelete}> Удалить</button>
                    <button className={"app " + styles.verify} onClick={props.onVerify}>Подтвердить</button>
                </div >
            </div >
        </div >
        <div className={styles.preview}>
            {props.book.pages?.filter(page => page.preview_url).map(page =>
                <div className="app-container" key={page.page_number}>
                    <span onClick={() => { props.onRead(page.page_number) }}>
                        <img className={styles.preview} src={page.preview_url} />
                    </span>
                </div>
            )}
        </div >
    </div >
}

function BookDetailInfoAttribute(props: { name: string, values: Array<string> }) {
    return <span>
        <span>{props.name}: </span>
        {props.values.map(tagname =>
            <span className={styles.tag} key={tagname}>{tagname}</span>
        )}
    </span>
}