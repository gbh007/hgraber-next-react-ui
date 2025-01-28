import { Link, useNavigate, useParams } from "react-router-dom";
import { FileSystemInfo, FSListResponseUnit, FSTransferRequest, useFSCreate, useFSDelete, useFSGet, useFSList, useFSRemoveMismatch, useFSTransfer, useFSUpdate, useFSValidate } from "../apiclient/api-fs";
import { FSEditLink, FSListLink } from "../core/routing";
import { ColorizedTextWidget, ContainerWidget, HumanTimeWidget } from "../widgets/common";
import { useCallback, useEffect, useState } from "react";
import { ErrorTextWidget } from "../widgets/error-text";
import { AgentListResponse, useAgentList } from "../apiclient/api-agent";

export function FSListScreen() {
    const [fsListResponse, fetchFSList] = useFSList()
    const [fsDeleteResponse, doFSDelete] = useFSDelete()
    const [fsValidateResponse, doFSValidate] = useFSValidate()
    const [fsRemoveMismatchResponse, doFSRemoveMismatch] = useFSRemoveMismatch()
    const [fsTransferResponse, doFSTransfer] = useFSTransfer()

    useEffect(() => { fetchFSList({ include_db_file_size: true }) }, [fetchFSList])

    const [transferRequest, setTransferRequest] = useState<FSTransferRequest>({
        from: "",
        to: "",
    })

    return (
        <ContainerWidget direction="column" gap="big">
            <ErrorTextWidget value={fsListResponse} />
            <ErrorTextWidget value={fsDeleteResponse} />
            <ErrorTextWidget value={fsValidateResponse} />
            <ErrorTextWidget value={fsRemoveMismatchResponse} />
            <ErrorTextWidget value={fsTransferResponse} />

            <ContainerWidget appContainer direction="row" gap="medium">
                <Link className="app-button" to={FSEditLink()}>Новая</Link>
                <button className="app" onClick={() => fetchFSList({ include_db_file_size: true })}>Обновить данные</button>
            </ContainerWidget>

            <ContainerWidget appContainer direction="column" gap="medium">
                <b>Перенести файлы</b>
                <ContainerWidget direction="2-column" gap="medium">
                    <span>Из</span>
                    <select
                        className="app"
                        value={transferRequest.from}
                        onChange={e => setTransferRequest({ ...transferRequest, from: e.target.value })}
                    >
                        <option value="">Не выбрана</option>
                        {fsListResponse.data?.file_systems?.map(fs =>
                            <option key={fs.info.id} value={fs.info.id}>{fs.info.name}</option>
                        )}
                    </select>
                    <span>В</span>
                    <select
                        className="app"
                        value={transferRequest.to}
                        onChange={e => setTransferRequest({ ...transferRequest, to: e.target.value })}
                    >
                        <option value="">Не выбрана</option>
                        {fsListResponse.data?.file_systems?.map(fs =>
                            <option key={fs.info.id} value={fs.info.id}>{fs.info.name}</option>
                        )}
                    </select>
                </ContainerWidget>
                <label>
                    <input
                        type="checkbox"
                        checked={transferRequest.only_preview_pages ?? false}
                        onChange={e => setTransferRequest({ ...transferRequest, only_preview_pages: e.target.checked })}
                    />
                    <span>Только превью</span>
                </label>
                <button
                    className="app"
                    onClick={() => {
                        if (!confirm("Перенести файлы между файловыми системами?")) {
                            return
                        }

                        doFSTransfer(transferRequest)
                    }}
                    disabled={fsTransferResponse.isLoading}
                >
                    <ColorizedTextWidget color="danger-lite">Перенести файлы</ColorizedTextWidget>
                </button>
            </ContainerWidget>

            {fsListResponse.data?.file_systems?.map(fs => <FSInfoWidget
                key={fs.info.id}
                value={fs}
                onDelete={() => {
                    if (!confirm("Удалить файловую систему и все ее файлы (ЭТО НЕОБРАТИМО)?")) {
                        return
                    }

                    doFSDelete({ id: fs.info.id }).then(() => {
                        fetchFSList({ include_db_file_size: true })
                    })
                }}
                validationLoading={fsValidateResponse.isLoading}
                onValidate={() => {
                    doFSValidate({ id: fs.info.id })
                }}
                onRemoveMismatch={() => {
                    if (!confirm("Удалить рассинхронизированные файлы (ЭТО НЕОБРАТИМО)?")) {
                        return
                    }

                    doFSRemoveMismatch({ id: fs.info.id })
                }}
            />)}
        </ContainerWidget>
    )
}


export function FSEditorScreen() {
    const params = useParams()
    const fsID = decodeURIComponent(params.id ?? "new")


    const navigate = useNavigate();

    const [fsGetResponse, fetchFS] = useFSGet()
    const [fsCreateResponse, doFSCreate] = useFSCreate()
    const [fsUpdateResponse, doFSUpdate] = useFSUpdate()

    const [data, setData] = useState<FileSystemInfo>({
        id: "ffffffff-ffff-ffff-ffff-ffffffffffff",
        name: "",
        download_priority: 0,
        deduplicate_priority: 0,
        highway_enabled: false,
        created_at: new Date().toJSON(),
    })


    useEffect(() => {
        if (fsGetResponse.data) {
            setData(fsGetResponse.data!)
        }
    }, [fsGetResponse.data])

    const isExists = fsID != "new"


    useEffect(() => {
        if (isExists) {
            fetchFS({ id: fsID, })
        }
    }, [fetchFS, fsID, isExists])

    const useSave = useCallback(() => {
        if (isExists) {
            doFSUpdate(data)
        } else {
            doFSCreate(data).then(() => navigate(FSListLink()))
        }
    }, [doFSUpdate, doFSCreate, isExists, data])


    const [agentsResponse, getAgents] = useAgentList()
    useEffect(() => { getAgents({ has_fs: true, }) }, [getAgents])

    return <ContainerWidget direction="column" gap="big">
        <ErrorTextWidget value={fsGetResponse} />
        <ErrorTextWidget value={fsCreateResponse} />
        <ErrorTextWidget value={fsUpdateResponse} />
        <ErrorTextWidget value={agentsResponse} />

        <div>
            <Link className="app-button" to={FSListLink()}>Список файловых систем</Link>
        </div>

        <ContainerWidget appContainer direction="column" gap="medium">
            <b>Редактор FS</b>

            <FSEditorWidget
                value={data}
                onChange={setData}
                agents={agentsResponse.data ?? undefined}
            />

            <button className="app" onClick={useSave}>Сохранить</button>
        </ContainerWidget>
    </ContainerWidget>
}

function FSInfoWidget(props: {
    value: FSListResponseUnit
    onDelete: () => void
    onValidate: () => void
    validationLoading: boolean
    onRemoveMismatch: () => void
}) {
    return <ContainerWidget appContainer direction="column" gap="medium">
        <h3>
            <ContainerWidget direction="row" gap="medium">
                <span>{props.value.info.name}</span>
            </ContainerWidget>
        </h3>
        <ContainerWidget direction="2-column" gap="medium">
            <b>ID:</b>
            <span>{props.value.info.id}</span>

            {props.value.info.description ? <>
                <b>Описание:</b>
                <span>{props.value.info.description}</span>
            </> : null}

            {props.value.info.agent_id ? <>
                <b>Агент ID:</b>
                <span>{props.value.info.agent_id}</span>
            </> : null}


            {props.value.info.path ? <>
                <b>Путь на локальной ФС:</b>
                <span>{props.value.info.path}</span>
            </> : null}

            <b>Приоритет загрузки:</b>
            <span>{props.value.info.download_priority}</span>
            <b>Приоритет дедупликации:</b>
            <span>{props.value.info.deduplicate_priority}</span>

            <b>Включен highway:</b>
            <span>{props.value.info.highway_enabled ? 'Да' : 'Нет'}</span>
            <b>Адрес highway:</b>
            <span>{props.value.info.highway_addr}</span>


            {props.value.db_files_info ? <>
                <b>Количество файлов:</b>
                <span>{props.value.db_files_info.count}</span>
                <b>Размер файлов:</b>
                <span>{props.value.db_files_info.size_formatted}</span>
            </> : null}

            <b>Создан:</b>
            <HumanTimeWidget value={props.value.info.created_at} />
        </ContainerWidget>
        <ContainerWidget direction="row" gap="medium" wrap>
            {!props.value.is_legacy ? <>
                <Link className="app-button" to={FSEditLink(props.value.info.id)}>Редактировать</Link>
                <button className="app" onClick={() => props.onDelete()} >
                    <ColorizedTextWidget bold color="danger">Удалить</ColorizedTextWidget>
                </button>
            </> : null}
            <button className="app" onClick={() => props.onValidate()} disabled={props.validationLoading}>Запустить валидацию файлов</button>
            <button className="app" onClick={() => props.onRemoveMismatch()} >
                <ColorizedTextWidget bold color="danger">Удалить рассинхронизированные файлы</ColorizedTextWidget>
            </button>
        </ContainerWidget>
    </ContainerWidget>
}


function FSEditorWidget(props: {
    value: FileSystemInfo
    onChange: (v: FileSystemInfo) => void
    agents?: Array<AgentListResponse>
}) {
    return <ContainerWidget direction="2-column" gap="medium">
        <span>Название</span>
        <input
            className="app"
            placeholder="Название"
            type="text"
            autoComplete="off"
            value={props.value.name}
            onChange={(e) => {
                props.onChange({ ...props.value, name: e.target.value })
            }}
        />

        <span>Описание</span>
        <input
            className="app"
            placeholder="Описание"
            type="text"
            autoComplete="off"
            value={props.value.description}
            onChange={(e) => {
                props.onChange({ ...props.value, description: e.target.value })
            }}
        />

        <span>Agent ID</span>
        <select
            className="app"
            value={props.value.agent_id}
            onChange={(e) => {
                props.onChange({ ...props.value, agent_id: e.target.value })
            }}
        >
            <option value="">Не выбран</option>
            {props.agents?.map(agent => <option value={agent.info.id} key={agent.info.id}>
                {agent.info.name}
            </option>
            )}
        </select>


        <span>Путь в локальной системе</span>
        <input
            className="app"
            placeholder="Путь в локальной системе"
            type="text"
            autoComplete="off"
            value={props.value.path}
            onChange={(e) => {
                props.onChange({ ...props.value, path: e.target.value })
            }}
        />


        <span>Приоритет загрузки</span>
        <input
            className="app"
            placeholder="Приоритет загрузки"
            type="number"
            autoComplete="off"
            value={props.value.download_priority}
            onChange={(e) => {
                props.onChange({ ...props.value, download_priority: e.target.valueAsNumber })
            }}
        />


        <span>Приоритет дедупликации</span>
        <input
            className="app"
            placeholder="Приоритет дедупликации"
            type="number"
            autoComplete="off"
            value={props.value.deduplicate_priority}
            onChange={(e) => {
                props.onChange({ ...props.value, deduplicate_priority: e.target.valueAsNumber })
            }}
        />


        <span>Флаги</span>
        <ContainerWidget direction="column" gap="small">
            <label>
                <input
                    className="app"
                    placeholder="Включен highway"
                    type="checkbox"
                    autoComplete="off"
                    checked={props.value.highway_enabled}
                    onChange={(e) => {
                        props.onChange({ ...props.value, highway_enabled: e.target.checked })
                    }}
                />
                <span>Включен highway</span>
            </label>
        </ContainerWidget>


        <span>Внешний адрес highway</span>
        <input
            className="app"
            placeholder="Внешний адрес highway"
            type="text"
            autoComplete="off"
            value={props.value.highway_addr}
            onChange={(e) => {
                props.onChange({ ...props.value, highway_addr: e.target.value })
            }}
        />


    </ContainerWidget>
}