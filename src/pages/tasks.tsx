import { useEffect, useState } from "react";
import { useTaskCreate, useTaskResults } from "../apiclient/api-task";
import { ErrorTextWidget } from "../widgets/error-text";

export function TaskScreen() {
    const [taskCode, setTaskCode] = useState("")

    const [createTaskResponse, doCreateTask] = useTaskCreate()
    const [taskResultsResponse, fetchTaskResults] = useTaskResults()

    useEffect(() => {
        fetchTaskResults()
    }, [fetchTaskResults])

    return <div className="container-column container-gap-middle">
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
        <div className="app-container">
            <ErrorTextWidget value={createTaskResponse} />
            <select
                className="app"
                value={taskCode}
                onChange={e => setTaskCode(e.target.value)}
            >
                <option value="">Не выбрано</option>
                <option value="deduplicate_files">Дедуплицировать файлы</option>
                <option value="remove_detached_files">Удалить ни с чем не связанные файлы</option>
                <option value="remove_mismatch_files">Удалить не синхронизированные (FS/DB) файлы</option>
                <option value="fill_dead_hashes">Наполнить мертвые хеши</option>
                <option value="fill_dead_hashes_with_remove_deleted_pages">Наполнить мертвые хеши и удалить удаленные страницы с ними</option>
                <option value="clean_deleted_pages">Очистить удаленные страницы</option>
                <option value="clean_deleted_rebuilds">Очистить удаленные ребилды</option>
            </select>
            <button className="app" onClick={() => { doCreateTask({ code: taskCode }) }}>Создать задачу</button>
            <button className="app" onClick={() => { fetchTaskResults() }}>Обновить</button>
        </div>
        <ErrorTextWidget value={taskResultsResponse} />
        {taskResultsResponse.data?.results?.reverse().map((taskResult, i) =>
            <div className="app-container" key={i}>
                <div className="container-column container-gap-small">
                    <h4>{taskResult.name}</h4>
                    <span>{taskResult.duration_formatted}</span>
                    {taskResult.error ? <span>{taskResult.error}</span> : null}
                    {taskResult.result ? <pre>{taskResult.result}</pre> : null}
                    {taskResult.stages?.map((stage, i) =>
                        <div className="container-column container-gap-smaller" key={i}>
                            <h5>{stage.name}</h5>
                            <span>{stage.duration_formatted}</span>
                            <span>{stage.progress}/{stage.total} ({prettyPercent(stage.progress / stage.total)}%)</span>
                            {stage.error ? <span>{stage.error}</span> : null}
                            {stage.result ? <pre>{stage.result}</pre> : null}
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
}

function prettyPercent(raw: number): number {
    return Math.round(raw * 1000) / 10
}