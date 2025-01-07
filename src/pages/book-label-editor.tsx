import { Link, useParams, useSearchParams } from "react-router-dom"
import { useLabelGet, useLabelPresetList, useLabelSet, useLabelDelete, LabelSetRequest, LabelDeleteRequest } from "../apiclient/api-labels"
import { ErrorTextWidget } from "../widgets/error-text"
import { BookLabelEditorWidget } from "../widgets/book-label-editor"
import { useEffect } from "react"

export function BookLabelsEditorScreen() {
    const params = useParams()
    const bookID = params.bookID!

    const [searchParams, setSearchParams] = useSearchParams()

    const pageNumber = parseInt(searchParams.get("pageNumber") ?? "0")

    const [labelsResponse, fetchLabels] = useLabelGet()
    const [labelPresetsResponse, fetchLabelPresets] = useLabelPresetList()
    const [labelSetResponse, doSetLabel] = useLabelSet()
    const [labelDeleteResponse, doDeleteLabel] = useLabelDelete()

    useEffect(() => { fetchLabelPresets() }, [fetchLabelPresets])

    useEffect(() => {
        fetchLabels({ book_id: bookID })
    }, [fetchLabels, bookID])

    const labels = labelsResponse.data?.labels?.filter(label => !pageNumber || label.page_number == pageNumber)

    return <div className="container-column container-gap-big">
        <ErrorTextWidget value={labelsResponse} />
        <ErrorTextWidget value={labelPresetsResponse} />
        <ErrorTextWidget value={labelSetResponse} />
        <ErrorTextWidget value={labelDeleteResponse} />
        <div className="app-container container-row container-gap-middle">
            <Link className="app-button" to={`/book/${bookID}`}>На страницу книги</Link>
            {pageNumber ? <>
                <span>Выбрана страница {pageNumber}</span>
                <button
                    className="app"
                    onClick={() => {
                        searchParams.delete("pageNumber")
                        setSearchParams(searchParams)
                    }}
                >смотреть все метки</button>
            </> : null}
        </div>
        <BookLabelEditorWidget
            bookID={bookID}
            onCreate={(v: LabelSetRequest) => {
                doSetLabel(v).then(() => { fetchLabels({ book_id: bookID }) })
            }}
            onDelete={(v: LabelDeleteRequest) => {
                doDeleteLabel(v).then(() => { fetchLabels({ book_id: bookID }) })
            }}
            value={labels}
            labelsAutoComplete={labelPresetsResponse.data?.presets}
        />
    </div>
}