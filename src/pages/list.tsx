import { useEffect, useState } from "react"
import styles from "./list.module.css"
import { BookFilter } from "../apiclient/model-book-filter"
import { BookListResponsePages, useBookList } from "../apiclient/api-book-list"
import { useAgentList } from "../apiclient/api-agent-list"
import { useAgentTaskExport } from "../apiclient/api-agent-task-export"
import { ErrorTextWidget } from "../widgets/error-text"
import { BookFilterWidget } from "../widgets/book-filter"
import { BookShortInfoWidget } from "../widgets/book-short-info"
import { useAppSettings } from "../apiclient/settings"
import { useAttributeCount } from "../apiclient/api-attribute-count"
import { useLabelPresetList } from "../apiclient/api-labels"


export function ListScreen() {
    const [settings, _] = useAppSettings()

    const [bookFilter, setBookFilter] = useState<BookFilter>({
        count: settings.book_on_page,
        delete_status: "except",
        download_status: "only",
        verify_status: "only",
        page: 1, // FIXME: из роутинга?
        sort_field: "created_at",
        sort_desc: true,
    })

    const [attributeCountResponse, getAttributeCount] = useAttributeCount()
    useEffect(() => { getAttributeCount() }, [getAttributeCount])


    const [labelPresetsResponse, fetchLabelPresets] = useLabelPresetList()
    useEffect(() => { fetchLabelPresets() }, [fetchLabelPresets])

    const [booksResponse, getBooks] = useBookList()
    useEffect(() => { getBooks(bookFilter) }, [getBooks])

    return <>
        <ErrorTextWidget value={booksResponse} />
        <ErrorTextWidget value={attributeCountResponse} />
        <ErrorTextWidget value={labelPresetsResponse} />
        <details className={styles.filter}>
            <summary>Фильтр, всего {booksResponse.data?.count || 0}</summary>
            <div className="container-column container-gap-small">
                <BookFilterWidget
                    value={bookFilter}
                    onChange={setBookFilter}
                    attributeCount={attributeCountResponse.data?.attributes}
                    labelsAutoComplete={labelPresetsResponse.data?.presets}
                />
                <button className="app" disabled={booksResponse.isLoading} onClick={() => {
                    getBooks({ ...bookFilter, page: 1 })
                }}>Применить</button>
                <AgentExportWidget filter={bookFilter} />
            </div>
        </details >
        <PaginatorWidget onChange={(v: number) => {
            setBookFilter({ ...bookFilter, page: v })
            getBooks({ ...bookFilter, page: v })
        }} value={booksResponse.data?.pages || []} />
        <div className={styles.bookList}>
            {booksResponse.data?.books?.map(book =>
                <BookShortInfoWidget key={book.id} value={book} />
            )}
        </div>
        <PaginatorWidget onChange={(v: number) => {
            setBookFilter({ ...bookFilter, page: v })
            getBooks({ ...bookFilter, page: v })
        }} value={booksResponse.data?.pages || []} />
    </>
}


function AgentExportWidget(props: { filter: BookFilter }) {
    const [agentsResponse, getAgents] = useAgentList()
    const [agentID, setAgentID] = useState("")
    const [deleteAfterExport, setDeleteAfterExport] = useState(false)
    const [exportResponse, makeExport] = useAgentTaskExport()

    useEffect(() => { getAgents({ can_export: true, }) }, [getAgents])

    return <details>
        <summary>Параметры экспорта</summary>
        <div className="container-row container-gap-small">
            <ErrorTextWidget value={agentsResponse} />

            <select className="app" value={agentID} onChange={e => { setAgentID(e.target.value) }}>
                <option value="">Не выбран</option>
                {agentsResponse.data?.map(agent => <option value={agent.id} key={agent.id}>
                    {agent.name}
                </option>
                )}
            </select>
            <label>
                <span>Удалить после экспорта</span>
                <input
                    className="app"
                    checked={deleteAfterExport}
                    placeholder="Удалить после экспорта"
                    type="checkbox"
                    autoComplete="off"
                    onChange={e => { setDeleteAfterExport(e.target.checked) }}
                />
            </label>
            <ErrorTextWidget value={exportResponse} />
            <button className="app" disabled={exportResponse.isLoading || !agentID} onClick={() => {
                makeExport({
                    book_filter: { ...props.filter, count: undefined, page: undefined }, // Принудительно срезаем параметры пагинации.
                    delete_after: deleteAfterExport,
                    exporter: agentID,
                })
            }}> Выгрузить</button>
        </div>
    </details>
}

export function PaginatorWidget(props: {
    value: Array<BookListResponsePages>
    onChange: (v: number) => void
}) {
    return <div id="paginator">
        {props.value.map((page, index) => <span
            key={index}
            className={styles.page}
            data-current={page.is_current ? 'true' : 'false'}
            data-separator={page.is_separator ? 'true' : 'false'}
            onClick={() => {
                if (page.is_separator) return
                props.onChange(page.value)
            }}
        >
            {page.is_separator ? "..." : page.value}
        </span>
        )}
    </div >
}