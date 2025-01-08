import { Link, useParams } from "react-router-dom"
import { useBookRaw, useBookUpdate } from "../apiclient/api-book"
import { useEffect, useState } from "react"
import { ErrorTextWidget } from "../widgets/error-text"
import { BookEditorWidget } from "../widgets/book-editor"
import { BookRaw } from "../apiclient/model-book"
import { useLabelPresetList } from "../apiclient/api-labels"
import { useAttributeCount } from "../apiclient/api-attribute"

export function BookEditorScreen() {
    const params = useParams()
    const bookID = params.bookID!

    const [book, setBook] = useState<BookRaw>({
        create_at: new Date().toJSON(),
        id: "",
        name: "",
        page_count: 0,
    })

    const [bookRawResponse, fetchBookRaw] = useBookRaw()
    const [bookUpdateResponse, doBookUpdate] = useBookUpdate()
    const [labelPresetsResponse, fetchLabelPresets] = useLabelPresetList()

    const [attributeCountResponse, getAttributeCount] = useAttributeCount()


    useEffect(() => {
        fetchBookRaw({ id: bookID })
    }, [fetchBookRaw, bookID])


    useEffect(() => { fetchLabelPresets() }, [fetchLabelPresets])
    useEffect(() => { getAttributeCount() }, [getAttributeCount])

    useEffect(() => {
        if (bookRawResponse.data) {
            setBook(bookRawResponse.data)
        }
    }, [bookRawResponse.data])

    return <div className="container-column container-gap-middle">
        <ErrorTextWidget value={bookRawResponse} />
        <ErrorTextWidget value={bookUpdateResponse} />
        <ErrorTextWidget value={labelPresetsResponse} />
        <ErrorTextWidget value={attributeCountResponse} />
        <div>
            <Link className="app-button" to={`/book/${bookID}`}>На страницу книги</Link>
        </div>
        <BookEditorWidget
            value={book}
            onChange={e => setBook(e)}
            labelsAutoComplete={labelPresetsResponse.data?.presets}
            attributeCount={attributeCountResponse.data?.attributes}
        />
        <div>
            <button
                className="app"
                onClick={() => {
                    doBookUpdate(book).then(() => fetchBookRaw({ id: bookID }))
                }}
            >Сохранить</button>
        </div>
    </div>
}