import { useEffect, useState } from "react"
import "./list.css"
import { BookFilter } from "../apiclient/model-book-filter"
import { BookListResponsePages, useBookList } from "../apiclient/api-book-list"
import { useAgentList } from "../apiclient/api-agent-list"
import { useAgentTaskExport } from "../apiclient/api-agent-task-export"
import { ErrorTextWidget } from "../widgets/error-text"
import { BookFilterWidget } from "../widgets/book-filter"
import { BookShortInfoWidget } from "../widgets/book-short-info"
import { useAppSettings } from "../apiclient/settings"


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


    const [booksResponse, getBooks] = useBookList()

    useEffect(() => { getBooks(bookFilter) }, [getBooks])

    return <>
        <ErrorTextWidget isError={booksResponse.isError} errorText={booksResponse.errorText} />
        <details className="filter">
            <summary>Фильтр, всего {booksResponse.data?.count || 0}</summary>
            <BookFilterWidget value={bookFilter} onChange={setBookFilter} />
            <button className="app" disabled={booksResponse.isLoading} onClick={() => {
                getBooks({ ...bookFilter, page: 1 })
            }}>Применить</button>
            <AgentExportWidget filter={bookFilter} />
        </details >
        <PaginatorWidget onChange={(v: number) => {
            setBookFilter({ ...bookFilter, page: v })
            getBooks({ ...bookFilter, page: v })
        }} value={booksResponse.data?.pages || []} />
        <div id="book-list">
            {booksResponse.data?.books?.map(book =>
                <BookShortInfoWidget key={book.id} value={book} onClick={() => { }} /> // FIXME: роутинг
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
        <ErrorTextWidget isError={agentsResponse.isError} errorText={agentsResponse.errorText} />

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
        <ErrorTextWidget isError={exportResponse.isError} errorText={exportResponse.errorText} />
        <button className="app" disabled={exportResponse.isLoading || !agentID} onClick={() => {
            makeExport({
                book_filter: { ...props.filter, count: 0, page: 0 }, // Принудительно срезаем параметры пагинации.
                delete_after: deleteAfterExport,
                exporter: agentID,
            })
        }}> Выгрузить</button>
    </details>
}

function PaginatorWidget(props: {
    value: Array<BookListResponsePages>
    onChange: (v: number) => void
}) {
    return <div id="paginator">
        {props.value.map((page, index) => <span
            key={index}
            className="page"
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