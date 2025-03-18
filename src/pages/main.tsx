import { useEffect, useState } from "react"
import { useSystemInfoSize, useSystemInfoWorkers } from "../apiclient/api-system-info"
import { systemHandleResponseDetails, useSystemHandle } from "../apiclient/api-system-handle"
import { AutoRefresherWidget, ColorizedTextWidget, ContainerWidget } from "../widgets/common"
import { ErrorTextWidget } from "../widgets/error-text"
import { Link } from "react-router-dom"
import { BookDetailsLink } from "../core/routing"
import styles from "./main.module.css"

export function MainScreen() {
    const [systemInfoSizeResponse, fetchSystemInfoSize] = useSystemInfoSize()
    const [systemInfoWorkersResponse, fetchSystemInfoWorkers] = useSystemInfoWorkers()

    useEffect(() => { fetchSystemInfoSize() }, [fetchSystemInfoSize])
    useEffect(() => { fetchSystemInfoWorkers() }, [fetchSystemInfoWorkers])

    return <ContainerWidget direction="column" gap="bigger">
        <ErrorTextWidget value={systemInfoSizeResponse} />
        <ErrorTextWidget value={systemInfoWorkersResponse} />
        <ContainerWidget appContainer direction="row" gap="big" wrap>
            <ContainerWidget direction="column" gap="smaller">
                <b>Книги</b>
                <ContainerWidget direction="2-column" gap="small" className={styles.statAlign}>
                    <span className="">Всего:</span>
                    <ColorizedTextWidget bold>{systemInfoSizeResponse.data?.count ?? 0}</ColorizedTextWidget>
                    <span>Загружено:</span>
                    <ColorizedTextWidget bold>{systemInfoSizeResponse.data?.downloaded_count ?? 0}</ColorizedTextWidget>
                    <span>Подтверждено:</span>
                    <ColorizedTextWidget bold>{systemInfoSizeResponse.data?.verified_count ?? 0}</ColorizedTextWidget>
                    <span>Пересобрано:</span>
                    <ColorizedTextWidget bold>{systemInfoSizeResponse.data?.rebuilded_count ?? 0}</ColorizedTextWidget>
                    <span>Незагруженно:</span>
                    <ColorizedTextWidget bold color={systemInfoSizeResponse.data?.not_load_count ?? 0 > 0 ? "danger" : "good"}>
                        {systemInfoSizeResponse.data?.not_load_count ?? 0}
                    </ColorizedTextWidget>
                    <span>Удалено:</span>
                    <ColorizedTextWidget bold>{systemInfoSizeResponse.data?.deleted_count ?? 0}</ColorizedTextWidget>
                </ContainerWidget>
            </ContainerWidget>
            <ContainerWidget direction="column" gap="smaller">
                <b>Страницы</b>
                <ContainerWidget direction="2-column" gap="small" className={styles.statAlign}>
                    <span>Всего:</span>
                    <ColorizedTextWidget bold>{systemInfoSizeResponse.data?.page_count ?? 0}</ColorizedTextWidget>
                    <span>Незагруженно:</span>
                    <ColorizedTextWidget bold color={systemInfoSizeResponse.data?.not_load_page_count ?? 0 > 0 ? "danger" : "good"}>
                        {systemInfoSizeResponse.data?.not_load_page_count ?? 0}
                    </ColorizedTextWidget>
                    <span>Без тела (файла):</span>
                    <ColorizedTextWidget bold color={systemInfoSizeResponse.data?.page_without_body_count ?? 0 > 0 ? "danger" : "good"}>
                        {systemInfoSizeResponse.data?.page_without_body_count ?? 0}
                    </ColorizedTextWidget>
                    <span>Удалено:</span>
                    <ColorizedTextWidget bold color={systemInfoSizeResponse.data?.deleted_page_count ?? 0 > 0 ? "danger-lite" : "good"}>
                        {systemInfoSizeResponse.data?.deleted_page_count ?? 0}
                    </ColorizedTextWidget>
                    <span>Объем:</span>
                    <ColorizedTextWidget bold>{systemInfoSizeResponse.data?.pages_size_formatted ?? 0}</ColorizedTextWidget>
                </ContainerWidget>
            </ContainerWidget>
            <ContainerWidget direction="column" gap="smaller">
                <b>Файлы</b>
                <ContainerWidget direction="2-column" gap="small" className={styles.statAlign}>
                    <span>Всего:</span>
                    <ColorizedTextWidget bold>{systemInfoSizeResponse.data?.file_count ?? 0}</ColorizedTextWidget>
                    <span>Без хешей:</span>
                    <ColorizedTextWidget bold color={systemInfoSizeResponse.data?.unhashed_file_count ?? 0 > 0 ? "danger" : "good"}>
                        {systemInfoSizeResponse.data?.unhashed_file_count ?? 0}
                    </ColorizedTextWidget>
                    <span>Поврежденные:</span>
                    <ColorizedTextWidget bold color={systemInfoSizeResponse.data?.invalid_file_count ?? 0 > 0 ? "danger" : "good"}>
                        {systemInfoSizeResponse.data?.invalid_file_count ?? 0}
                    </ColorizedTextWidget>
                    <span>Неиспользуемые:</span>
                    <ColorizedTextWidget bold color={systemInfoSizeResponse.data?.detached_file_count ?? 0 > 0 ? "danger-lite" : "good"}>
                        {systemInfoSizeResponse.data?.detached_file_count ?? 0}
                    </ColorizedTextWidget>
                    <span>Мертвых хешей:</span>
                    <ColorizedTextWidget bold>{systemInfoSizeResponse.data?.dead_hash_count ?? 0}</ColorizedTextWidget>
                    <span>Объем:</span>
                    <ColorizedTextWidget bold>{systemInfoSizeResponse.data?.files_size_formatted ?? 0}</ColorizedTextWidget>
                </ContainerWidget>
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

    return <ContainerWidget direction="column" gap="big">
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
        </ContainerWidget>
        <ParseDetailsWidget value={systemHandleResponse.data?.details} />
    </ContainerWidget>
}

function ParseDetailsWidget(props: {
    value?: Array<systemHandleResponseDetails>
}) {
    if (!props.value) {
        return null
    }

    const newBooks = props.value.filter(v => v.is_handled)
    const duplicateBooks = props.value.filter(v => v.is_duplicate)
    const errorBooks = props.value.filter(v => v.error_reason)

    return <details className="app">
        <summary>Показать подробности парсинга</summary>
        <ContainerWidget direction="column" gap="big">

            {newBooks.length ?
                <ContainerWidget appContainer direction="column" gap="medium">
                    <b>Новые книги</b>
                    {newBooks.map((v, i) => <ContainerWidget key={i} direction="row" gap="small">
                        <span>{v.url}</span>
                        {v.id ?
                            <Link className="app-button" to={BookDetailsLink(v.id)}>{v.id}</Link>
                            : <span></span>
                        }
                    </ContainerWidget>)}
                </ContainerWidget>
                : null}

            {errorBooks.length ?
                <ContainerWidget appContainer direction="column" gap="medium">
                    <b>Ошибки при обработке</b>
                    {errorBooks.map((v, i) => <ContainerWidget key={i} direction="row" gap="small">
                        <span>{v.url}</span>
                        {v.error_reason ?
                            <ColorizedTextWidget color="danger-lite">{v.error_reason}</ColorizedTextWidget>
                            : null
                        }
                    </ContainerWidget>)}
                </ContainerWidget>
                : null}

            {duplicateBooks.length ?

                <ContainerWidget appContainer direction="column" gap="medium">
                    <b>Дубликаты</b>
                    {duplicateBooks.map((v, i) => <ContainerWidget key={i} direction="row" gap="small">
                        <span>{v.url}</span>
                        {v.duplicate_ids?.map(id => <Link key={id} className="app-button" to={BookDetailsLink(id)}>{id}</Link>)}
                    </ContainerWidget>)}
                </ContainerWidget>
                : null}
        </ContainerWidget>
    </details>
}