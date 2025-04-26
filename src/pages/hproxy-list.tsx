import { Link, useSearchParams } from "react-router-dom"
import { useHProxyList } from "../apiclient/api-hproxy"
import { useEffect, useState } from "react"
import { ColorizedTextWidget, ContainerWidget } from "../widgets/common"
import { ErrorTextWidget } from "../widgets/error-text"
import { HProxyBookLink, HProxyListLink } from "../core/routing"
import { BookImagePreviewWidget } from "../widgets/book-short-info"

export function HProxyListScreen() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [hProxyListResponse, doHProxyList] = useHProxyList()

    const [currentURL, setCurrentURL] = useState("")

    useEffect(() => {
        const u = searchParams.get("url")
        if (!u) {
            return
        }

        setCurrentURL(u)
        doHProxyList({ url: u })
    }, [doHProxyList, searchParams])

    return <ContainerWidget direction="column" gap="medium">
        <ErrorTextWidget value={hProxyListResponse} />

        <ContainerWidget appContainer direction="row" gap="medium">
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
        </ContainerWidget>

        <ContainerWidget
            direction="columns"
            columns={5}
            gap="medium"
            wrap
        >
            {hProxyListResponse.data?.books?.map((book, i) =>
                <ContainerWidget
                    key={i}
                    appContainer
                    direction="column"
                    gap="medium"
                    style={{
                        alignItems: "center",
                    }}
                >
                    <BookImagePreviewWidget preview_url={book.preview_url} previewSize="small" />
                    <ColorizedTextWidget bold>{book.name}</ColorizedTextWidget>
                    <Link
                        to={HProxyBookLink(book.ext_url)}
                        className="app-button"
                    >Открыть</Link>
                </ContainerWidget>
            )}
        </ContainerWidget>

        <ContainerWidget appContainer direction="row" gap="medium" wrap>
            {hProxyListResponse.data?.pagination?.map((page, i) =>
                <Link
                    key={i}
                    to={HProxyListLink(page.ext_url)}
                    className="app-button"
                >{page.name}</Link>
            )}
        </ContainerWidget>
    </ContainerWidget>
}