import { useEffect, useState } from "react"
import { useSystemInfo } from "../apiclient/api-system-info"
import { useSystemHandle } from "../apiclient/api-system-handle"

export function MainScreen() {
    const [{ data, isError, errorText }, fetchData] = useSystemInfo()

    useEffect(() => { fetchData() }, [fetchData])

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {
                isError ?
                    <div className="app-error-container" >
                        {errorText}
                    </div>
                    :
                    <>
                        <div className="app-container container-row container-gap-big" style={{ flexWrap: "wrap" }}>
                            <div className="container-column container-gap-smaller">
                                <b>Книги</b>
                                <span>Всего: <b>{data?.count ?? 0}</b></span>
                                <span>Загружено: <b>{data?.downloaded_count ?? 0}</b></span>
                                <span>Подтверждено: <b>{data?.verified_count ?? 0}</b></span>
                                <span>Пересобрано: <b>{data?.rebuilded_count ?? 0}</b></span>
                                <span>Незагруженно: <b>{data?.not_load_count ?? 0}</b></span>
                                <span>Удалено: <b>{data?.deleted_count ?? 0}</b></span>
                            </div>
                            <div className="container-column container-gap-smaller">
                                <b>Страницы</b>
                                <span>Всего: <b>{data?.page_count ?? 0}</b></span>
                                <span>Незагруженно: <b>{data?.not_load_page_count ?? 0}</b></span>
                                <span>Без тела (файла): <b>{data?.page_without_body_count ?? 0}</b></span>
                                <span>Удалено: <b>{data?.deleted_page_count ?? 0}</b></span>
                            </div>
                            <div className="container-column container-gap-smaller">
                                <b>Файлы</b>
                                <span>Всего: <b>{data?.file_count ?? 0}</b></span>
                                <span>Без хешей: <b>{data?.unhashed_file_count ?? 0}</b></span>
                                <span>Мертвых хешей: <b>{data?.dead_hash_count ?? 0}</b></span>
                                <span>Объем страниц: <b>{data?.pages_size_formatted ?? 0}</b></span>
                                <span>Объем файлов: <b>{data?.files_size_formatted ?? 0}</b></span>
                            </div>
                        </div>

                        <div className="app-container" id="info-workers">
                            <table>
                                <thead>
                                    <tr>
                                        <td>Название</td>
                                        <td>В очереди</td>
                                        <td>В работе</td>
                                        <td>Раннеров</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(data?.monitor?.workers || []).map((worker) =>
                                        <tr key={worker.name}>
                                            <td>{worker.name}</td>
                                            <td>{worker.in_queue}</td>
                                            <td>{worker.in_work}</td>
                                            <td>{worker.runners}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
            }
            <BookHandleWidget />
        </div>
    )
}

function BookHandleWidget() {
    const [bookList, setBookList] = useState("")
    const [isMultiParse, setIsMultiParse] = useState(false)
    const [isAutoVerify, setIsAutoVerify] = useState(false)

    const [{ data, isLoading, isError, errorText }, fetchData] = useSystemHandle()

    useEffect(() => {
        if (!isError) setBookList((data?.not_handled || []).join("\n"))
    }, [data, isError, setBookList])

    return (
        <div className="app-container container-row container-gap-middle" style={{ flexWrap: "wrap" }}>
            <div className="container-column">
                <textarea
                    className="app"
                    rows={10}
                    cols={50}
                    value={bookList}
                    onChange={e => { setBookList(e.target.value) }}
                    placeholder="Загрузить новые книги"
                ></textarea>
                <label>
                    <span>Множественный парсинг</span>
                    <input
                        className="app"
                        onChange={(e) => { setIsMultiParse(e.target.checked) }}
                        type="checkbox"
                        checked={isMultiParse}
                        autoComplete="off"
                    />
                </label>
                <label>
                    <span>Авто-подтверждение</span>
                    <input
                        className="app"
                        onChange={(e) => { setIsAutoVerify(e.target.checked) }}
                        type="checkbox"
                        checked={isAutoVerify}
                        autoComplete="off"
                    />
                </label>
                <button
                    className="app"
                    onClick={() => {
                        fetchData({
                            urls: bookList.split("\n").map((s) => s.trim()).filter(e => e.length > 0),
                            is_multi: isMultiParse,
                            auto_verify: isAutoVerify,
                        })
                    }}
                    disabled={isLoading}
                >Загрузить</button>
            </div>
            <div className="container-column">
                {
                    isError ?
                        <div className="app-error-container">
                            {errorText}
                        </div>
                        :
                        <>
                            <div><b>Всего: </b>{data?.total_count || 0}</div>
                            <div>
                                <b>Загружено: </b>{data?.loaded_count || 0}
                            </div>
                            <div>
                                <b>Дубликаты: </b>{data?.duplicate_count || 0}
                            </div>
                            <div><b>Ошибки: </b>{data?.error_count || 0}</div>
                        </>
                }
            </div>
        </div >
    )
}