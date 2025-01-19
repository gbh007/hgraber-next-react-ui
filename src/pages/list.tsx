import { useEffect, useState } from "react"
import styles from "./list.module.css"
import { BookFilter } from "../apiclient/model-book-filter"
import { BookListResponsePages, useBookList } from "../apiclient/api-book-list"
import { ErrorTextWidget } from "../widgets/error-text"
import { BookFilterWidget } from "../widgets/book-filter"
import { BookShortInfoWidget } from "../widgets/book-short-info"
import { useAppSettings } from "../apiclient/settings"
import { useAttributeColorList, useAttributeCount } from "../apiclient/api-attribute"
import { useLabelPresetList } from "../apiclient/api-labels"
import { Link, useSearchParams } from "react-router-dom"
import { useAgentList, useAgentTaskExport } from "../apiclient/api-agent"
import { ColorizedTextWidget, ContainerWidget } from "../widgets/common"
import { SelectToCompareLink } from "../core/routing"


export function ListScreen() {
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

    const [attributeCountResponse, getAttributeCount] = useAttributeCount()
    useEffect(() => { getAttributeCount() }, [getAttributeCount])


    const [labelPresetsResponse, fetchLabelPresets] = useLabelPresetList()
    useEffect(() => { fetchLabelPresets() }, [fetchLabelPresets])

    const [attributeColorListResponse, fetchAttributeColorList] = useAttributeColorList()
    useEffect(() => { fetchAttributeColorList() }, [fetchAttributeColorList])

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

    return <ContainerWidget direction="column" gap="medium">
        <ErrorTextWidget value={booksResponse} />
        <ErrorTextWidget value={attributeCountResponse} />
        <ErrorTextWidget value={labelPresetsResponse} />
        <ErrorTextWidget value={attributeColorListResponse} />
        <ContainerWidget appContainer direction="column" gap="medium">
            <details className={"app " + styles.filter}>
                <summary>Фильтр, всего {booksResponse.data?.count || 0}</summary>
                <ContainerWidget direction="column" gap="medium">
                    <BookFilterWidget
                        value={bookFilter}
                        onChange={setBookFilter}
                        attributeCount={attributeCountResponse.data?.attributes}
                        labelsAutoComplete={labelPresetsResponse.data?.presets}
                    />
                    <ContainerWidget direction="row" gap="medium">
                        <button className="app" onClick={() => {
                            setBookFilter({ ...bookFilter, page: 1 })
                            searchParams.set("filter", JSON.stringify({ ...bookFilter, page: 1 }))
                            setSearchParams(searchParams)
                        }}>Применить фильтр</button>
                        <button className="app" onClick={() => {
                            setBookFilter(defaultFilterValue)
                            searchParams.delete("filter")
                            setSearchParams(searchParams)
                        }}>
                            <ColorizedTextWidget color="danger">Очистить фильтр</ColorizedTextWidget>
                        </button>
                        <button className="app" onClick={() => {
                            getBooks(bookFilter)
                        }}>Обновить данные</button>
                        <Link
                            className="app-button"
                            to={SelectToCompareLink(bookFilter)}
                        >Перейти в выбор для сравнения</Link>
                    </ContainerWidget>
                    <AgentExportWidget filter={bookFilter} />
                </ContainerWidget>
            </details >
        </ContainerWidget>
        <PaginatorWidget onChange={(v: number) => {
            setBookFilter({ ...bookFilter, page: v })
            searchParams.set("filter", JSON.stringify({ ...bookFilter, page: v }))
            setSearchParams(searchParams)
        }} value={booksResponse.data?.pages || []} />
        <div className={styles.bookList}>
            {booksResponse.data?.books?.map(book =>
                <BookShortInfoWidget
                    key={book.info.id}
                    value={book}
                    colors={attributeColorListResponse.data?.colors}
                />
            )}
        </div>
        <PaginatorWidget onChange={(v: number) => {
            setBookFilter({ ...bookFilter, page: v })
            searchParams.set("filter", JSON.stringify({ ...bookFilter, page: v }))
            setSearchParams(searchParams)
        }} value={booksResponse.data?.pages || []} />
    </ContainerWidget>
}


function AgentExportWidget(props: { filter: BookFilter }) {
    const [agentsResponse, getAgents] = useAgentList()
    const [agentID, setAgentID] = useState("")
    const [deleteAfterExport, setDeleteAfterExport] = useState(false)
    const [exportResponse, makeExport] = useAgentTaskExport()

    useEffect(() => { getAgents({ can_export: true, }) }, [getAgents])

    return <details className="app">
        <summary>Параметры экспорта</summary>
        <ContainerWidget direction="row" gap="medium">
            <ErrorTextWidget value={agentsResponse} />

            <select className="app" value={agentID} onChange={e => { setAgentID(e.target.value) }}>
                <option value="">Не выбран</option>
                {agentsResponse.data?.map(agent => <option value={agent.info.id} key={agent.info.id}>
                    {agent.info.name}
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
                if (deleteAfterExport && !confirm("Книги будут удалены из системы после экспорта, продолжить?")) {
                    return
                }

                makeExport({
                    book_filter: { ...props.filter, count: undefined, page: undefined }, // Принудительно срезаем параметры пагинации.
                    delete_after: deleteAfterExport,
                    exporter: agentID,
                })
            }}> Выгрузить</button>
        </ContainerWidget>
    </details>
}

export function PaginatorWidget(props: {
    value: Array<BookListResponsePages>
    onChange: (v: number) => void
}) {
    return <div>
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