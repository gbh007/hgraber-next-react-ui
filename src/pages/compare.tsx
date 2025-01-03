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
            <div>
                <BookMainImagePreviewWidget value={compareResult.data?.origin.preview_url} />
            </div>
            <BookShortInfo value={compareResult.data?.origin} />
            <div style={{ flexGrow: 1, textAlign: "center" }}>
                <select
                    className="app"
                    value={currentShow}
                    onChange={e => setCurrentShow(e.target.value)}
                >
                    <option value="origin">Страницы оригинала</option>
                    <option value="origin_without_dead_hashes">Страницы оригинала (без мертвых хешей)</option>
                    <option value="origin_only_dead_hashes">Страницы оригинала (только мертвые хеши)</option>
                    <option value="both">Страницы общие</option>
                    <option value="both_without_dead_hashes">Страницы общие (без мертвых хешей)</option>
                    <option value="both_only_dead_hashes">Страницы общие (только мертвые хеши)</option>
                    <option value="target">Страницы цели</option>
                    <option value="target_without_dead_hashes">Страницы цели (без мертвых хешей)</option>
                    <option value="target_only_dead_hashes">Страницы цели (только мертвые хеши)</option>
                </select>
            </div>
            <BookShortInfo value={compareResult.data?.target} />
            <div>
                <BookMainImagePreviewWidget value={compareResult.data?.target.preview_url} />
            </div>
        </div>


        {/* FIXME: Переделать это непотребство */}
        {currentShow == "origin" ?
            <BookPagesPreviewWidget bookID={originBookID} pages={compareResult.data?.origin_pages} />
            : currentShow == "origin_without_dead_hashes" ?
                <BookPagesPreviewWidget bookID={originBookID} pages={compareResult.data?.origin_pages_without_dead_hashes} />
                : currentShow == "origin_only_dead_hashes" ?
                    <BookPagesPreviewWidget bookID={originBookID} pages={compareResult.data?.origin_pages_only_dead_hashes} />
                    : currentShow == "both" ?
                        <BookPagesPreviewWidget bookID={originBookID} pages={compareResult.data?.both_pages} />
                        : currentShow == "both_without_dead_hashes" ?
                            <BookPagesPreviewWidget bookID={originBookID} pages={compareResult.data?.both_pages_without_dead_hashes} />
                            : currentShow == "both_only_dead_hashes" ?
                                <BookPagesPreviewWidget bookID={originBookID} pages={compareResult.data?.both_pages_only_dead_hashes} />
                                : currentShow == "target" ?
                                    <BookPagesPreviewWidget bookID={targetBookID} pages={compareResult.data?.target_pages} />
                                    : currentShow == "target_without_dead_hashes" ?
                                        <BookPagesPreviewWidget bookID={targetBookID} pages={compareResult.data?.target_pages_without_dead_hashes} />
                                        : currentShow == "target_only_dead_hashes" ?
                                            <BookPagesPreviewWidget bookID={targetBookID} pages={compareResult.data?.target_pages_only_dead_hashes} />
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