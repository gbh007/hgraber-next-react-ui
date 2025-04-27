import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { HProxyBookResponsePage, useHProxyBook } from "../apiclient/api-hproxy"
import { BookDetailsLink, HProxyListLink } from "../core/routing"
import { BookImagePreviewWidget, ImageSize, PageImagePreviewWidget } from "../widgets/book-short-info"
import { ContainerWidget } from "../widgets/common"
import { ErrorTextWidget } from "../widgets/error-text"
import { useAttributeColorList } from "../apiclient/api-attribute"
import { BookOneAttributeWidget } from "../widgets/attribute"
import { useSystemHandle } from "../apiclient/api-system-handle"

export function HProxyBookScreen() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [hProxyBookResponse, doHProxyBook] = useHProxyBook()
    const [systemHandleResponse, doSystemHandle] = useSystemHandle()

    const [currentURL, setCurrentURL] = useState("")
    const [isReadOnlyMode, setIsReadOnlyMode] = useState(false)


    const [attributeColorListResponse, fetchAttributeColorList] = useAttributeColorList()
    useEffect(() => { fetchAttributeColorList() }, [fetchAttributeColorList])

    useEffect(() => {
        const u = searchParams.get("url")
        if (!u) {
            return
        }

        setCurrentURL(u)
        doHProxyBook({ url: u })
    }, [doHProxyBook, searchParams])


    const downloadedFlags = {
        is_deleted: false,
        is_rebuild: false,
        is_verified: true,
        parsed_name: false,
        parsed_page: false,
    }

    const isDownloaded = hProxyBookResponse?.data?.exists_ids?.length ?? 0 > 0

    return <ContainerWidget direction="column" gap="medium">
        <ErrorTextWidget value={hProxyBookResponse} />
        <ErrorTextWidget value={attributeColorListResponse} />

        <ContainerWidget appContainer direction="row" gap="medium" wrap>
            <input
                className="app"
                value={currentURL}
                onChange={e => setCurrentURL(e.target.value)}
            />
            <button
                className="app"
                onClick={() => {
                    searchParams.set("url", currentURL)
                    setSearchParams(searchParams)
                }}
            >Перейти</button>

            <label>
                <span>Расчет</span>
                <input
                    className="app"
                    onChange={(e) => { setIsReadOnlyMode(e.target.checked) }}
                    type="checkbox"
                    checked={isReadOnlyMode}
                    autoComplete="off"
                />
            </label>
            <button
                className="app"
                onClick={() => {
                    doSystemHandle({
                        auto_verify: false,
                        is_multi: false,
                        read_only_mode: isReadOnlyMode,
                        urls: [currentURL]
                    })
                }}
            >Загрузить</button>

            <ContainerWidget direction="row" gap="small" wrap>
                <ErrorTextWidget value={systemHandleResponse} />
                <div><b>Всего: </b>{systemHandleResponse.data?.total_count || 0}</div>
                <div><b>Загружено: </b>{systemHandleResponse.data?.loaded_count || 0}</div>
                <div><b>Дубликаты: </b>{systemHandleResponse.data?.duplicate_count || 0}</div>
                <div><b>Ошибки: </b>{systemHandleResponse.data?.error_count || 0}</div>
            </ContainerWidget>
        </ContainerWidget>


        <ContainerWidget appContainer direction="row" gap="medium">
            <div>
                <BookImagePreviewWidget
                    previewSize="superbig"
                    preview_url={hProxyBookResponse.data?.preview_url}
                    flags={isDownloaded ? downloadedFlags : undefined}
                />
            </div>
            <ContainerWidget direction="column" gap="medium">
                <h1 style={{ wordBreak: "break-all", margin: 0 }}>{hProxyBookResponse.data?.name}</h1>
                <span>Страниц: {hProxyBookResponse.data?.page_count}</span>
                {hProxyBookResponse.data?.attributes.map((attr, i) => <ContainerWidget
                    key={i}
                    direction="row"
                    gap="small"
                    wrap
                >
                    <span>{attr.name}:</span>
                    {attr.values.map((v, i) => <ContainerWidget
                        key={i}
                        direction="row"
                        gap="small"
                    >
                        {v.ext_url ?
                            <Link to={HProxyListLink(v.ext_url)} className="app-button">{v.ext_name}</Link>
                            : <span>{v.ext_name}</span>
                        }
                        {v.name ? <BookOneAttributeWidget
                            code={attr.code}
                            value={v.name}
                            colors={attributeColorListResponse.data?.colors}
                        /> : null}
                    </ContainerWidget>)}
                </ContainerWidget>)}
                {isDownloaded ?
                    <ContainerWidget direction="row" gap="medium" wrap>
                        <span>Скачанно:</span>
                        {hProxyBookResponse.data?.exists_ids?.map(id => <Link className="app-button" to={BookDetailsLink(id)}>{id}</Link>)}
                    </ContainerWidget>
                    : null}
            </ContainerWidget>
        </ContainerWidget>

        <BookPagesPreviewWidget
            url={hProxyBookResponse.data?.ext_url ?? ""}
            pages={hProxyBookResponse.data?.pages}
            pageLimit={10}
        />
    </ContainerWidget>
}




function BookPagesPreviewWidget(props: {
    url: string
    pages?: Array<HProxyBookResponsePage>
    pageLimit?: number
}) {
    const [pageLimit, setPageLimit] = useState(20)
    const [size, setSize] = useState<ImageSize>("small")

    useEffect(() => {
        setPageLimit(props.pageLimit ?? 20)
    }, [setPageLimit, props.pageLimit, props.url])


    const scrollToTop = () => {
        document.getElementById('BookPagesPreviewWidgetTop')?.scrollIntoView({
            behavior: 'smooth'
        });
    }

    if (!props.pages?.length) {
        return null
    }

    const notAllPages = pageLimit != -1 && (pageLimit < props.pages.length)

    return <ContainerWidget direction="column" gap="medium" id="BookPagesPreviewWidgetTop">
        <ContainerWidget appContainer direction="row" gap="medium">
            {notAllPages ?
                <button className="app" onClick={() => setPageLimit(-1)}>Показать все страницы</button>
                : null}
            <select
                className="app"
                value={size}
                onChange={e => setSize(e.target.value as ImageSize)}
            >
                <option value={"small"}>маленький</option>
                <option value={"medium"}>средний</option>
                <option value={"big"}>большой</option>
                <option value={"bigger"}>очень большой</option>
                <option value={"biggest"}>супер большой</option>
                <option value={"superbig"}>огромный</option>
            </select>
        </ContainerWidget>
        <ContainerWidget direction="row" gap="medium" wrap>
            {props.pages?.filter(page => page.preview_url)
                .filter((_, i) => pageLimit == -1 || i < pageLimit)
                .map((page) =>
                    <ContainerWidget appContainer direction="column" style={{ flexGrow: 1, alignItems: "center" }} key={page.page_number}>
                        <PageImagePreviewWidget
                            previewSize={size}
                            preview_url={page.preview_url}
                        />
                    </ContainerWidget>
                )}
        </ContainerWidget>
        {!notAllPages ?
            <button className="app" onClick={scrollToTop}>Наверх</button>
            : null}
    </ContainerWidget>
}
