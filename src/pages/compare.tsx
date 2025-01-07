import { Link, useParams } from "react-router-dom";
import { useCreateDeadHashByPage, useDeduplicateCompare, useDeleteDeadHashByPage, useDeletePagesByBody } from "../apiclient/api-deduplicate";
import { useEffect, useState } from "react";
import { ErrorTextWidget } from "../widgets/error-text";
import { BookAttributesWidget, BookMainImagePreviewWidget, BookPagesPreviewWidget } from "../widgets/book-detail-info";
import { BookSimple, BookSimplePage } from "../apiclient/model-book";
import { HumanTimeWidget } from "../widgets/common";
import { DualReaderWidget } from "../widgets/split-viewer";
import { BookFlagsWidget } from "../widgets/book-short-info";

export function CompareBookScreen() {
    const params = useParams()
    const originBookID = params.origin!
    const targetBookID = params.target!

    const [currentShow, setCurrentShow] = useState("origin")
    const [deadHashSelector, setDeadHashSelector] = useState("all")


    const [compareResult, doCompare] = useDeduplicateCompare()
    const [createDeadHashResponse, doCreateDeadHash] = useCreateDeadHashByPage()
    const [deleteDeadHashResponse, doDeleteDeadHash] = useDeleteDeadHashByPage()
    const [deleteAllPageByBodyResponse, doDeleteAllPageByBody] = useDeletePagesByBody()

    useEffect(() => {
        doCompare({
            origin_book_id: originBookID,
            target_book_id: targetBookID,
        })
    }, [doCompare, originBookID, targetBookID])

    const originBookName = compareResult.data?.origin.name
    const targetBookName = compareResult.data?.target.name

    const originPages = compareResult.data?.origin_pages?.filter(page =>
        deadHashSelector == "all" ||
        deadHashSelector == "without" && page.has_dead_hash === false ||
        deadHashSelector == "only" && page.has_dead_hash === true)

    const bothPages = compareResult.data?.both_pages?.filter(page =>
        deadHashSelector == "all" ||
        deadHashSelector == "without" && page.has_dead_hash === false ||
        deadHashSelector == "only" && page.has_dead_hash === true)

    const targetPages = compareResult.data?.target_pages?.filter(page =>
        deadHashSelector == "all" ||
        deadHashSelector == "without" && page.has_dead_hash === false ||
        deadHashSelector == "only" && page.has_dead_hash === true)

    return <div className="container-column container-gap-middle">
        <ErrorTextWidget value={compareResult} />
        <ErrorTextWidget value={createDeadHashResponse} />
        <ErrorTextWidget value={deleteDeadHashResponse} />
        <ErrorTextWidget value={deleteAllPageByBodyResponse} />

        <div className="app-container container-row container-gap-middle" style={{ flexWrap: "wrap" }}>
            <div className="container-row container-gap-small">
                <BookMainImagePreviewWidget value={compareResult.data?.origin.preview_url} />
                <BookShortInfo
                    value={compareResult.data?.origin}
                    covered_target={compareResult.data?.origin_covered_target}
                    covered_target_without_dead_hashes={compareResult.data?.origin_covered_target_without_dead_hashes}
                />
            </div>
            <div style={{ flexGrow: 1, textAlign: "center" }}>
                <div className="container-column container-gap-small">
                    <select
                        className="app"
                        value={currentShow}
                        onChange={e => setCurrentShow(e.target.value)}
                    >
                        <option value="origin">Страницы оригинала</option>
                        <option value="both">Страницы общие</option>
                        <option value="target">Страницы цели</option>
                        <option value="dual_read">Посмотреть отличия постранично</option>
                    </select>
                    <span>Показывать страницы с мертвыми хешами</span>
                    <select
                        className="app"
                        value={deadHashSelector}
                        onChange={e => setDeadHashSelector(e.target.value)}
                    >
                        <option value="all">Все</option>
                        <option value="without">Кроме</option>
                        <option value="only">Только</option>
                    </select>
                </div>
            </div>
            <div className="container-row container-gap-small">
                <BookShortInfo
                    value={compareResult.data?.target}
                    covered_target={compareResult.data?.target_covered_origin}
                    covered_target_without_dead_hashes={compareResult.data?.target_covered_origin_without_dead_hashes}
                />
                <BookMainImagePreviewWidget value={compareResult.data?.target.preview_url} />
            </div>
        </div>

        <div className="app-container container-row container-gap-middle" style={{ justifyContent: "space-between" }}>
            <div className="container-column container-gap-small">
                <b>Аттрибуты оригинала</b>
                <BookAttributesWidget value={compareResult.data?.origin_attributes} />
            </div>
            <div className="container-column container-gap-small">
                <b>Аттрибуты общие</b>
                <BookAttributesWidget value={compareResult.data?.both_attributes} />
            </div>
            <div className="container-column container-gap-small">
                <b>Аттрибуты цели</b>
                <BookAttributesWidget value={compareResult.data?.target_attributes} />
            </div>
        </div>


        {/* FIXME: Переделать это непотребство */}
        {currentShow == "origin" ?
            <BookPagesPreviewWidget bookID={originBookID} pages={originPages} />
            : currentShow == "both" ?
                <BookPagesPreviewWidget bookID={originBookID} pages={bothPages} />
                : currentShow == "target" ?
                    <BookPagesPreviewWidget bookID={targetBookID} pages={targetPages} />
                    : currentShow == "dual_read" && compareResult.data ?
                        <DualReaderWidget
                            aBookID={compareResult.data.origin.id}
                            bBookID={compareResult.data.target.id}
                            onCreateDeadHash={(bookID: string, page: BookSimplePage) => {
                                const bookName = originBookID == bookID ? originBookName :
                                    targetBookID == bookID ? targetBookName : undefined
                                if (!bookName) {
                                    return
                                }

                                if (!confirm(`Создать мертвых хеш для ${bookName} (${page.page_number})?`)) {
                                    return
                                }

                                doCreateDeadHash({ book_id: bookID, page_number: page.page_number })
                                    .then(() => doCompare({
                                        origin_book_id: originBookID,
                                        target_book_id: targetBookID,
                                    }))
                            }}
                            onDeleteDeadHash={(bookID: string, page: BookSimplePage) => {
                                const bookName = originBookID == bookID ? originBookName :
                                    targetBookID == bookID ? targetBookName : undefined
                                if (!bookName) {
                                    return
                                }

                                if (!confirm(`Удалить мертвых хеш для ${bookName} (${page.page_number})?`)) {
                                    return
                                }

                                doDeleteDeadHash({ book_id: bookID, page_number: page.page_number })
                                    .then(() => doCompare({
                                        origin_book_id: originBookID,
                                        target_book_id: targetBookID,
                                    }))
                            }}
                            onDeleteAllPages={(bookID: string, page: BookSimplePage) => {
                                const bookName = originBookID == bookID ? originBookName :
                                    targetBookID == bookID ? targetBookName : undefined
                                if (!bookName) {
                                    return
                                }

                                if (!confirm(`Удалить такие страницы ${bookName} (${page.page_number})? (ЭТО НЕОБРАТИМО)`)) {
                                    return
                                }


                                const setDeadHash = confirm("Установить для страниц мертвый хеш?")

                                doDeleteAllPageByBody({
                                    book_id: bookID,
                                    page_number: page.page_number,
                                    set_dead_hash: setDeadHash,
                                })
                                    .then(() => doCompare({
                                        origin_book_id: originBookID,
                                        target_book_id: targetBookID,
                                    }))
                            }}
                            onDeleteAllPagesWithDeadHash={(bookID: string, page: BookSimplePage) => {
                                if (!confirm("Удалить такие страницы и добавить их в мертвый хеш? (ЭТО НЕОБРАТИМО)")) {
                                    return
                                }

                                doDeleteAllPageByBody({
                                    book_id: bookID,
                                    page_number: page.page_number,
                                    set_dead_hash: true,
                                })
                                    .then(() => doCompare({
                                        origin_book_id: originBookID,
                                        target_book_id: targetBookID,
                                    }))
                            }}
                            aPageCount={compareResult.data.origin.page_count}
                            bPageCount={compareResult.data.target.page_count}
                            aPages={originPages}
                            bPages={targetPages}
                        /> : null
        }

    </div>
}

function BookShortInfo(props: {
    value?: BookSimple
    covered_target?: number
    covered_target_without_dead_hashes?: number
}) {
    if (!props.value) {
        return
    }

    const originDomain = /https?:\/\/([\w.]+)\/.*/.exec(props.value.origin_url ?? "")?.[1]

    return <div className="container-column container-gap-small" style={{ maxWidth: "500px" }}>
        <b style={{ wordBreak: "break-all" }}>{props.value.name}</b>
        <BookFlagsWidget value={props.value.flags} />
        <span>Создана: <HumanTimeWidget value={props.value.created_at} /> </span>
        <span>Страниц: {props.value.page_count}</span>
        {props.value.origin_url ? <a href={props.value.origin_url}>Ссылка на первоисточник</a> : null}
        {originDomain ? <span>Домен: {originDomain}</span> : null}
        {props.covered_target != undefined &&
            props.covered_target_without_dead_hashes != undefined ?
            <span
                title="Сколько страниц этой книги есть в другой"
            >
                Покрытие: {prettyPercent(props.covered_target)}% ({prettyPercent(props.covered_target_without_dead_hashes)}%)
            </span>
            : null}
        <Link className="app-button" to={`/book/${props.value.id}`}>Страница книги</Link>
    </div>
}


function prettyPercent(raw: number): number {
    return Math.round(raw * 1000) / 10
}