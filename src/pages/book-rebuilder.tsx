import { Link, useParams } from "react-router-dom"
import { BookRebuildRequest, useBookRaw, useBookRebuild } from "../apiclient/api-book"
import { useEffect, useState } from "react"
import { ErrorTextWidget } from "../widgets/error-text"
import { useLabelPresetList } from "../apiclient/api-labels"
import { useAttributeCount } from "../apiclient/api-attribute-count"
import { useBookDetails } from "../apiclient/api-book-details"
import { BookRebuilderWidget } from "../widgets/book-rebuilder"

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

    const [bookRawResponse, fetchBookRaw] = useBookRaw()
    const [bookRebuildResponse, doBookRebuild] = useBookRebuild()


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

    useEffect(() => { fetchLabelPresets() }, [fetchLabelPresets])
    useEffect(() => { getAttributeCount() }, [getAttributeCount])

    useEffect(() => {
        if (bookRawResponse.data) {
            setBookRebuildData({ ...bookRebuildData, old_book: bookRawResponse.data, selected_pages: [] })
        }
    }, [bookRawResponse.data])

    return <div className="container-column container-gap-middle">
        <ErrorTextWidget value={bookRawResponse} />
        <ErrorTextWidget value={bookDetailsResponse} />
        <ErrorTextWidget value={labelPresetsResponse} />
        <ErrorTextWidget value={attributeCountResponse} />
        <ErrorTextWidget value={bookRebuildResponse} />
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
            <>
                <BookRebuilderWidget
                    value={bookRebuildData}
                    onChange={e => setBookRebuildData(e)}
                    labelsAutoComplete={labelPresetsResponse.data?.presets}
                    attributeCount={attributeCountResponse.data?.attributes}
                    pages={bookDetailsResponse.data?.pages}
                />
                <div>
                    <button
                        className="app"
                        onClick={() => {
                            doBookRebuild(bookRebuildData)
                        }}
                    >Пересобрать</button>
                </div>
            </> : null
        }
    </div>
}