import { Link, useParams } from "react-router-dom"
import { BookRebuildRequest, useBookRaw, useBookRebuild } from "../apiclient/api-book"
import { useEffect, useState } from "react"
import { ErrorTextWidget } from "../widgets/error-text"
import { useLabelPresetList } from "../apiclient/api-labels"
import { useAttributeCount } from "../apiclient/api-attribute-count"
import { useBookDetails } from "../apiclient/api-book-details"
import { BookRebuilderWidget } from "../widgets/book-rebuilder"
import { BookFilter } from "../apiclient/model-book-filter"
import { useBookList } from "../apiclient/api-book-list"

export function BookRebuilderScreen() {
    const params = useParams()
    const bookID = params.bookID!

    const [bookRebuildData, setBookRebuildData] = useState<BookRebuildRequest>({
        old_book: {
            create_at: new Date().toJSON(),
            id: "",
            name: "",
            page_count: 0,
        },
        selected_pages: [],
    })


    const [bookFilter, setBookFilter] = useState<BookFilter>({
        count: 10,
        delete_status: "except",
        download_status: "only",
        verify_status: "only",
        show_rebuilded: "only",
        page: 1,
        sort_field: "created_at",
        sort_desc: true,
    })

    const [bookRawResponse, fetchBookRaw] = useBookRaw()
    const [bookRebuildResponse, doBookRebuild] = useBookRebuild()
    const [booksResponse, getBooks] = useBookList()


    // TODO: сделать другой запрос, который возвращает только нужные данные страниц
    const [bookDetailsResponse, getBookDetails] = useBookDetails()
    const [labelPresetsResponse, fetchLabelPresets] = useLabelPresetList()
    const [attributeCountResponse, getAttributeCount] = useAttributeCount()



    useEffect(() => {
        fetchBookRaw({ id: bookID })
    }, [fetchBookRaw, bookID])

    useEffect(() => {
        getBookDetails({ id: bookID })
    }, [getBookDetails, bookID])

    useEffect(() => { getBooks(bookFilter) }, [getBooks])
    useEffect(() => { fetchLabelPresets() }, [fetchLabelPresets])
    useEffect(() => { getAttributeCount() }, [getAttributeCount])

    useEffect(() => {
        if (bookRawResponse.data) {
            setBookRebuildData({ ...bookRebuildData, old_book: { ...bookRawResponse.data, name: 'Rebuild: ' + bookRawResponse.data.name }, selected_pages: [] })
        }
    }, [bookRawResponse.data])

    return <div className="container-column container-gap-middle">
        <ErrorTextWidget value={bookRawResponse} />
        <ErrorTextWidget value={bookDetailsResponse} />
        <ErrorTextWidget value={labelPresetsResponse} />
        <ErrorTextWidget value={attributeCountResponse} />
        <ErrorTextWidget value={bookRebuildResponse} />
        <ErrorTextWidget value={booksResponse} />
        <div className="container-row container-gap-small">
            <Link className="app-button" to={`/book/${bookID}`}>На страницу исходной книги</Link>
            {bookRebuildResponse.data?.id ?
                <Link className="app-button" to={`/book/${bookRebuildResponse.data?.id}`}>На страницу собранной книги</Link> :
                <button
                    className="app"
                    onClick={() => {
                        doBookRebuild(bookRebuildData)
                    }}
                >Пересобрать</button>
            }

        </div>
        {!bookRebuildResponse.data?.id ?
            <BookRebuilderWidget
                value={bookRebuildData}
                onChange={e => setBookRebuildData(e)}
                labelsAutoComplete={labelPresetsResponse.data?.presets}
                attributeCount={attributeCountResponse.data?.attributes}
                pages={bookDetailsResponse.data?.pages}
                pageCount={bookDetailsResponse.data?.page_count}

                targetBookFilter={bookFilter}
                targetBookFilterChange={setBookFilter}
                getTargetBooks={e => getBooks(e)}
                targetBookResponse={booksResponse.data ?? undefined}
            /> : null
        }
    </div>
}