import { useEffect, useState } from "react"
import { useSystemInfoSize, useSystemInfoWorkers } from "../apiclient/api-system-info"
import { useSystemHandle } from "../apiclient/api-system-handle"
import { AutoRefresherWidget, ContainerWidget } from "../widgets/common"
import { ErrorTextWidget } from "../widgets/error-text"

export function MainScreen() {
    const [systemInfoSizeResponse, fetchSystemInfoSize] = useSystemInfoSize()
    const [systemInfoWorkersResponse, fetchSystemInfoWorkers] = useSystemInfoWorkers()

    useEffect(() => { fetchSystemInfoSize() }, [fetchSystemInfoSize])
    useEffect(() => { fetchSystemInfoWorkers() }, [fetchSystemInfoWorkers])

    return (
        <ContainerWidget direction="column" gap="bigger">
            <ErrorTextWidget value={systemInfoSizeResponse} />
            <ErrorTextWidget value={systemInfoWorkersResponse} />
            <ContainerWidget appContainer direction="row" gap="big" wrap>
                <ContainerWidget direction="column" gap="smaller">
                    <b>Книги</b>
                    <span>Всего: <b>{systemInfoSizeResponse.data?.count ?? 0}</b></span>
                    <span>Загружено: <b>{systemInfoSizeResponse.data?.downloaded_count ?? 0}</b></span>
                    <span>Подтверждено: <b>{systemInfoSizeResponse.data?.verified_count ?? 0}</b></span>
                    <span>Пересобрано: <b>{systemInfoSizeResponse.data?.rebuilded_count ?? 0}</b></span>
                    <span>Незагруженно: <b>{systemInfoSizeResponse.data?.not_load_count ?? 0}</b></span>
                    <span>Удалено: <b>{systemInfoSizeResponse.data?.deleted_count ?? 0}</b></span>
                </ContainerWidget>
                <ContainerWidget direction="column" gap="smaller">
                    <b>Страницы</b>
                    <span>Всего: <b>{systemInfoSizeResponse.data?.page_count ?? 0}</b></span>
                    <span>Незагруженно: <b>{systemInfoSizeResponse.data?.not_load_page_count ?? 0}</b></span>
                    <span>Без тела (файла): <b>{systemInfoSizeResponse.data?.page_without_body_count ?? 0}</b></span>
                    <span>Удалено: <b>{systemInfoSizeResponse.data?.deleted_page_count ?? 0}</b></span>
                    <span>Объем: <b>{systemInfoSizeResponse.data?.pages_size_formatted ?? 0}</b></span>
                </ContainerWidget>
                <ContainerWidget direction="column" gap="smaller">
                    <b>Файлы</b>
                    <span>Всего: <b>{systemInfoSizeResponse.data?.file_count ?? 0}</b></span>
                    <span>Без хешей: <b>{systemInfoSizeResponse.data?.unhashed_file_count ?? 0}</b></span>
                    <span>Поврежденные: <b>{systemInfoSizeResponse.data?.invalid_file_count ?? 0}</b></span>
                    <span>Неиспользуемые: <b>{systemInfoSizeResponse.data?.detached_file_count ?? 0}</b></span>
                    <span>Мертвых хешей: <b>{systemInfoSizeResponse.data?.dead_hash_count ?? 0}</b></span>
                    <span>Объем: <b>{systemInfoSizeResponse.data?.files_size_formatted ?? 0}</b></span>
                </ContainerWidget>
                <div><AutoRefresherWidget callback={fetchSystemInfoSize} /></div>
            </ContainerWidget>
            <ContainerWidget appContainer direction="row" wrap gap="medium">
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
                        {(systemInfoWorkersResponse.data?.workers || []).map((worker) =>
                            <tr key={worker.name}>
                                <td>{worker.name}</td>
                                <td>{worker.in_queue}</td>
                                <td>{worker.in_work}</td>
                                <td>{worker.runners}</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div><AutoRefresherWidget callback={fetchSystemInfoWorkers} /></div>
            </ContainerWidget>
            <BookHandleWidget />
        </ContainerWidget>
    )
}

function BookHandleWidget() {
    const [bookList, setBookList] = useState("")
    const [isMultiParse, setIsMultiParse] = useState(false)
    const [isAutoVerify, setIsAutoVerify] = useState(false)
    const [isReadOnlyMode, setIsReadOnlyMode] = useState(false)

    const [systemHandleResponse, doSystemHandle] = useSystemHandle()

    useEffect(() => {
        if (!systemHandleResponse.isError) setBookList((systemHandleResponse.data?.not_handled || []).join("\n"))
    }, [systemHandleResponse.data, systemHandleResponse.isError, setBookList])

    return (
        <ContainerWidget appContainer direction="row" gap="medium" wrap>
            <ContainerWidget direction="column">
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
                <label>
                    <span>Режим моделирования без изменений данных</span>
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
                            urls: bookList.split("\n").map((s) => s.trim()).filter(e => e.length > 0),
                            is_multi: isMultiParse,
                            auto_verify: isAutoVerify,
                            read_only_mode: isReadOnlyMode,
                        })
                    }}
                    disabled={systemHandleResponse.isLoading}
                >Загрузить</button>
            </ContainerWidget>
            <ContainerWidget direction="column">
                <ErrorTextWidget value={systemHandleResponse} />
                <div><b>Всего: </b>{systemHandleResponse.data?.total_count || 0}</div>
                <div><b>Загружено: </b>{systemHandleResponse.data?.loaded_count || 0}</div>
                <div><b>Дубликаты: </b>{systemHandleResponse.data?.duplicate_count || 0}</div>
                <div><b>Ошибки: </b>{systemHandleResponse.data?.error_count || 0}</div>
            </ContainerWidget>
        </ContainerWidget >
    )
}