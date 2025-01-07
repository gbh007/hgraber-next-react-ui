import { useEffect, useState } from "react"
import { BookFilter } from "../apiclient/model-book-filter"
import styles from "./select-to-compare.module.css"
import { BookShortInfo, useBookList } from "../apiclient/api-book-list"
import { Link, useSearchParams } from "react-router-dom"
import { HumanTimeWidget } from "../widgets/common"
import missingImage from "../assets/missing-image.png"
import { BookFilterWidget } from "../widgets/book-filter"
import { PaginatorWidget } from "./list"
import { ErrorTextWidget } from "../widgets/error-text"
import { useAppSettings } from "../apiclient/settings"
import { useAttributeCount } from "../apiclient/api-attribute-count"
import { useLabelPresetList } from "../apiclient/api-labels"
import { BookFlagsWidget } from "../widgets/book-short-info"


export function SelectToCompareScreen() {
    const [settings, _] = useAppSettings()
    const [searchParams, setSearchParams] = useSearchParams()

    const defaultFilterValue = {
        count: settings.book_on_page,
        delete_status: "except",
        download_status: "only",
        verify_status: "only",
        page: 1,
        sort_field: "created_at",
        sort_desc: true,
    }

    const [bookFilter, setBookFilter] = useState<BookFilter>(defaultFilterValue)

    const [booksResponse, getBooks] = useBookList()


    useEffect(() => {
        try {
            const filter = JSON.parse(searchParams.get("filter")!)

            if (!filter) {
                setBookFilter(defaultFilterValue)
                getBooks(defaultFilterValue)
            } else {
                setBookFilter({ ...bookFilter, ...filter })
                getBooks({ ...bookFilter, ...filter })
            }
        } catch (err) {
            console.log(err);
        }
    }, [setBookFilter, searchParams])

    const [attributeCountResponse, getAttributeCount] = useAttributeCount()
    useEffect(() => { getAttributeCount() }, [getAttributeCount])


    const [labelPresetsResponse, fetchLabelPresets] = useLabelPresetList()
    useEffect(() => { fetchLabelPresets() }, [fetchLabelPresets])

    const [originPreview, setOriginPreview] = useState<BookShortInfo>()
    const [targetPreview, setTargetPreview] = useState<BookShortInfo>()

    return <div className="container-column container-gap-big">
        <ErrorTextWidget value={booksResponse} />
        <ErrorTextWidget value={attributeCountResponse} />
        <ErrorTextWidget value={labelPresetsResponse} />
        <div className="app-container container-column container-gap-big">
            <div className="app-container container-row container-gap-big">
                {originPreview ? <div className="container-column container-gap-small">
                    <h3>Оригинальная книга</h3>
                    <BooksPreview value={originPreview} />
                    <button
                        className="app"
                        onClick={() => setOriginPreview(undefined)}
                    >Сбросить</button>
                </div> : null}
                {targetPreview ? <div className="container-column container-gap-small">
                    <h3>Целевая книга</h3>
                    <BooksPreview value={targetPreview} />
                    <button
                        className="app"
                        onClick={() => setTargetPreview(undefined)}
                    >Сбросить</button>
                </div> : null}
            </div>
            <div className="container-row container-gap-middle">
                <button
                    className="app"
                    onClick={() => {
                        setOriginPreview(undefined)
                        setTargetPreview(undefined)
                    }}
                >Сбросить все</button>
                {originPreview && targetPreview ? <Link className="app-button" to={`/book/${originPreview.info.id}/compare/${targetPreview.info.id}`}>Сравнить</Link> : null}
            </div>
        </div>
        <div className="app-container container-column container-gap-middle">
            <BookFilterWidget
                value={bookFilter}
                onChange={setBookFilter}
                attributeCount={attributeCountResponse.data?.attributes}
                labelsAutoComplete={labelPresetsResponse.data?.presets}
            />
            <div className="container-row container-gap-middle">
                <button className="app" onClick={() => {
                    setBookFilter({ ...bookFilter, page: 1 })
                    searchParams.set("filter", JSON.stringify({ ...bookFilter, page: 1 }))
                    setSearchParams(searchParams)
                }}>Применить фильтр</button>
                <button className="app" onClick={() => {
                    setBookFilter(defaultFilterValue)
                    searchParams.delete("filter")
                    setSearchParams(searchParams)
                }}>Очистить фильтр</button>
            </div>
            <span>Всего: {booksResponse.data?.count}</span>
            <PaginatorWidget onChange={(v: number) => {
                setBookFilter({ ...bookFilter, page: v })
                searchParams.set("filter", JSON.stringify({ ...bookFilter, page: v }))
                setSearchParams(searchParams)
            }} value={booksResponse.data?.pages || []} />
        </div>
        <BooksList
            value={booksResponse.data?.books}
            onChangeOrigin={setOriginPreview}
            onChangeTarget={setTargetPreview}
            selectedOrigin={originPreview?.info.id}
            selectedTarget={targetPreview?.info.id}
        />
    </div>
}


function BooksList(props: {
    value?: Array<BookShortInfo>
    selectedOrigin?: string
    selectedTarget?: string
    onChangeTarget: (v: BookShortInfo) => void
    onChangeOrigin: (v: BookShortInfo) => void
}) {
    return <div className={styles.preview}>
        {props.value?.map(book =>
            <div className="app-container" key={book.info.id}>
                <Link to={`/book/${book.info.id}`} style={{ flexGrow: 1 }}>
                    <img className={styles.bookPreview} src={book.info.preview_url ?? missingImage} />
                </Link>
                <b>{book.info.name}</b>
                <BookFlagsWidget value={book.info.flags} />
                <span>Создана: <HumanTimeWidget value={book.info.created_at} /></span>
                <span>Страниц: {book.info.page_count}</span>
                <button
                    className="app"
                    onClick={() => props.onChangeOrigin(book)}
                    disabled={book.info.id == props.selectedOrigin}
                >Выбрать как оригинальную</button>
                <button
                    className="app"
                    onClick={() => props.onChangeTarget(book)}
                    disabled={book.info.id == props.selectedTarget}
                >Выбрать как целевую</button>
            </div>
        )}
    </div>
}

function BooksPreview(props: {
    value?: BookShortInfo
}) {
    if (!props.value) {
        return null
    }

    const book = props.value!

    return <div className="container-column container-gap-smaller" key={book.info.id} style={{ flexGrow: 1 }}>
        <Link to={`/book/${book.info.id}`}>
            <img className={styles.bookPreview} src={book.info.preview_url ?? missingImage} />
        </Link>
        <div style={{ flexGrow: 1 }}></div>
        <b>{book.info.name}</b>
        <BookFlagsWidget value={props.value.info.flags} />
        <span>Создана: <HumanTimeWidget value={book.info.created_at} /></span>
        <span>Страниц: {book.info.page_count}</span>
    </div>
}