import { useEffect, useState } from "react"
import { useSystemRPCDeduplicateFiles } from "../apiclient/api-system-rpc-deduplicate-files"
import { useSystemRPCRemoveDetachedFiles } from "../apiclient/api-system-rpc-remove-detached-files"
import { useSystemRPCRemoveMismatchFiles } from "../apiclient/api-system-rpc-remove-mismatch-files"
import { systemWorkerRunnerConfig, useSystemWorkerConfig } from "../apiclient/api-system-worker-config"

import "./rpc.css"
import { useSystemInfo } from "../apiclient/api-system-info"

export function RPCScreen() {
    return (
        <>
            <h1 style={{ color: "red" }}>
                Операции на данной странице не являются обратимыми.<br />
                Перед их выполнением рекомендуется произвести бекап как файлового
                хранилища так и БД.<br />
                Выполнение операций во время загрузки данных или парсинга или прочей
                обработки гарантированно приводит к повреждению данных.
            </h1>
            <h2 style={{ color: "red" }}>
                Операции на данной странице также являются медленными и тежеловесными,
                не рекомендуется их выполнять без крайней необходимости.
            </h2>

            <DeduplicateFilesWidget />
            <RemoveDetachedFilesWidget />
            <RemoveMismatchFilesWidget />
            <RunnersWidget />
        </>
    )
}

function DeduplicateFilesWidget() {
    const [{ isError, errorText, data, isLoading }, doRequest] = useSystemRPCDeduplicateFiles()

    return <div className="app-container" style={{ display: "flex", flexDirection: "column" }}>
        <h3>Очистка файлов дубликов</h3>
        {isError ? <div className="app-error-container">
            {errorText}
        </div> : null}
        {data ? <>
            <span>Количество очищенных: {data?.count || 0}</span>
            <span>Объем очищенных: {data?.pretty_size || ''}</span>
        </> : null}
        <button className="app" onClick={() => doRequest()} disabled={isLoading}>Дедуплицировать файлы</button>
    </div >
}

function RemoveDetachedFilesWidget() {
    const [{ isError, errorText, data, isLoading }, doRequest] = useSystemRPCRemoveDetachedFiles()

    return <div className="app-container" style={{ display: "flex", flexDirection: "column" }}>
        <h3>Удаление ни с чем не связанных файлов</h3>
        {isError ? <div className="app-error-container">
            {errorText}
        </div> : null}
        {data ? <>
            <span>Количество удаленных: {data?.count || 0}</span>
            <span>Объем удаленных: {data?.pretty_size || ''}</span>
        </> : null}
        <button className="app" onClick={() => doRequest()} disabled={isLoading}>Удалить непривязанные файлы</button>
    </div >
}

function RemoveMismatchFilesWidget() {
    const [{ isError, errorText, data, isLoading }, doRequest] = useSystemRPCRemoveMismatchFiles()

    return <div className="app-container" style={{ display: "flex", flexDirection: "column" }}>
        <h3>Удаление рассинхронизированных файлов</h3>
        {isError ? <div className="app-error-container">
            {errorText}
        </div> : null}
        {data ? <>
            <span>Удалено из файловой системы: {data?.remove_from_fs || 0}</span>
            <span>Удалено из БД: {data?.remove_from_db || 0}</span>
        </> : null}
        <button className="app" onClick={() => doRequest()} disabled={isLoading}>Удалить рассинхронизированные файлы</button>
    </div >
}

function RunnersWidget() {
    const [runners, setRunners] = useState<Array<systemWorkerRunnerConfig>>()
    const [runnerObj, fetchRunnerData] = useSystemInfo()

    useEffect(() => { fetchRunnerData() }, [fetchRunnerData])
    useEffect(() => {
        let newRunners: Array<systemWorkerRunnerConfig> = [];

        (runnerObj.data?.monitor?.workers || []).map(e => {
            newRunners.push({
                count: e.runners,
                name: e.name,
            })
        })

        setRunners(newRunners)
    }, [runnerObj.data])



    const [{ isError, errorText, isLoading }, doRequest] = useSystemWorkerConfig()

    return <div className="app-container">
        <h3>Изменение количества раннеров</h3>
        {isError ? <div className="app-error-container">
            {errorText}
        </div> : null}
        {runnerObj.isError ? <div className="app-error-container">
            {runnerObj.errorText}
        </div> : null}
        <table>
            <thead>
                <tr>
                    <td>Название</td>
                    <td>Раннеров</td>
                </tr>
            </thead>
            <tbody>
                {runners?.map((worker =>
                    <tr key={worker.name}>
                        <td>{worker.name}</td>
                        <td><input type="number" value={worker.count} onChange={e => {
                            setRunners(runners.map(runner =>
                                runner.name == worker.name ?
                                    { name: worker.name, count: e.target.valueAsNumber } : runner
                            ))
                        }} /></td>
                    </tr>
                )) || null}
            </tbody>
        </table>
        <button
            className="app"
            onClick={() => { doRequest({ runners_count: runners! }) }}
            disabled={isLoading || !runners}
        >Установить количество раннеров</button>
    </div >
}
