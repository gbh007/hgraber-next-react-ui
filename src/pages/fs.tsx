import { Link, useNavigate, useParams } from "react-router-dom";
import { FileSystemInfo, FSListResponseUnit, useFSCreate, useFSDelete, useFSGet, useFSList, useFSUpdate } from "../apiclient/api-fs";
import { FSEditLink, FSListLink } from "../core/routing";
import { ColorizedTextWidget, ContainerWidget, HumanTimeWidget } from "../widgets/common";
import { useCallback, useEffect, useState } from "react";
import { ErrorTextWidget } from "../widgets/error-text";

export function FSListScreen() {
    const [fsListResponse, fetchFSList] = useFSList()
    const [fsDeleteResponse, doFSDelete] = useFSDelete()

    useEffect(() => { fetchFSList({ include_db_file_size: true }) }, [fetchFSList])

    return (
        <ContainerWidget direction="column" gap="big">
            <ErrorTextWidget value={fsListResponse} />
            <ErrorTextWidget value={fsDeleteResponse} />

            <div>
                <Link className="app-button" to={FSEditLink()}>Новая</Link>
            </div>

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

    return <div>
        <ErrorTextWidget value={fsGetResponse} />
        <ErrorTextWidget value={fsCreateResponse} />
        <ErrorTextWidget value={fsUpdateResponse} />

        <ContainerWidget appContainer direction="column" gap="medium">
            <b>Редактор FS</b>

            <FSEditorWidget
                value={data}
                onChange={setData}
            />

            <button className="app" onClick={useSave}>Сохранить</button>
        </ContainerWidget>
    </div>
}

function FSInfoWidget(props: {
    value: FSListResponseUnit
    onDelete: () => void
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
        {!props.value.is_legacy ?
            <ContainerWidget direction="row" gap="medium">
                <Link className="app-button" to={FSEditLink(props.value.info.id)}>Редактировать</Link>
                <button className="app" onClick={() => props.onDelete()} >
                    <ColorizedTextWidget bold color="danger">Удалить</ColorizedTextWidget>
                </button>
            </ContainerWidget>
            : null}
    </ContainerWidget>
}


function FSEditorWidget(props: {
    value: FileSystemInfo
    onChange: (v: FileSystemInfo) => void
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

        {/* FIXME: сделать нормальный выбор агентов, как минимум как при экспорте книг */}
        <span>Agent ID</span>
        <input
            className="app"
            placeholder="Agent ID"
            type="text"
            autoComplete="off"
            value={props.value.agent_id}
            onChange={(e) => {
                props.onChange({ ...props.value, agent_id: e.target.value })
            }}
        />


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