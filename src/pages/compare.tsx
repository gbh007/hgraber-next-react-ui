import { Link, useParams } from "react-router-dom";
import { useDeduplicateCompare } from "../apiclient/api-deduplicate";
import { useEffect, useState } from "react";
import { ErrorTextWidget } from "../widgets/error-text";
import { BookMainImagePreviewWidget, BookPagesPreviewWidget } from "../widgets/book-detail-info";
import { BookSimple } from "../apiclient/model-book";
import { HumanTimeWidget } from "../widgets/common";

export function CompareBookScreen() {
    const [compareResult, doCompare] = useDeduplicateCompare()
    const params = useParams()
    const originBookID = params.origin!
    const targetBookID = params.target!

    const [currentShow, setCurrentShow] = useState("origin")

    useEffect(() => {
        doCompare({
            origin_book_id: originBookID,
            target_book_id: targetBookID,
        })
    }, [doCompare, originBookID, targetBookID])

    return <div className="container-column container-gap-middle">
        <ErrorTextWidget value={compareResult} />

        <div className="app-container container-row container-gap-middle">
            <BookMainImagePreviewWidget value={compareResult.data?.origin.preview_url} />
            <BookShortInfo value={compareResult.data?.origin} />
            <div style={{ flexGrow: 1, textAlign: "center" }}>
                <select
                    className="app"
                    value={currentShow}
                    onChange={e => setCurrentShow(e.target.value)}
                >
                    <option value="origin">Страницы оригинала</option>
                    <option value="both">Страницы общие</option>
                    <option value="target">Страницы цели</option>
                </select>
            </div>
            <BookShortInfo value={compareResult.data?.target} />
            <BookMainImagePreviewWidget value={compareResult.data?.target.preview_url} />
        </div>


        {currentShow == "origin" ?
            <BookPagesPreviewWidget bookID={originBookID} pages={compareResult.data?.origin_pages} />
            : currentShow == "both" ?
                <BookPagesPreviewWidget bookID={originBookID} pages={compareResult.data?.both_pages} />
                : currentShow == "target" ?
                    <BookPagesPreviewWidget bookID={originBookID} pages={compareResult.data?.target_pages} />
                    : null
        }

    </div>
}

function BookShortInfo(props: {
    value?: BookSimple
}) {
    if (!props.value) {
        return
    }

    return <div className="container-column container-gap-small">
        <b>{props.value.name}</b>
        <span>Создана: <HumanTimeWidget value={props.value.create_at} /> </span>
        <span>Страниц: {props.value.page_count}</span>
        {props.value.origin_url ? <a href={props.value.origin_url}>Ссылка на первоисточник</a> : null}
        <Link className="app-button" to={`/book/${props.value.id}`}>Страница книги</Link>
    </div>
}