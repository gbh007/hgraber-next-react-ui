import { useCallback, useEffect, useState } from "react"
import { Agent, AgentListResponse, AgentListResponseStatusProblems, useAgentDelete, useAgentGet, useAgentList, useAgentNew, useAgentUpdate } from "../apiclient/api-agent"
import { ErrorTextWidget } from "../widgets/error-text"
import { HumanTimeWidget } from "../widgets/common"
import { Link, useNavigate, useParams } from "react-router-dom"

export function AgentListScreen() {
    const [agentListResponse, fetchAgentList] = useAgentList()
    const [agentDeleteResponse, doAgentDelete] = useAgentDelete()

    useEffect(() => { fetchAgentList({ include_status: true }) }, [fetchAgentList])

    return (
        <div className="container-column container-gap-big">
            <ErrorTextWidget value={agentListResponse} />
            <ErrorTextWidget value={agentDeleteResponse} />

            <div>
                <Link className="app-button" to={`/agent/edit/new`}>Новый</Link>
            </div>

            {agentListResponse.data?.map(agent => <AgentInfoWidget
                key={agent.info.id}
                value={agent}
                onDelete={() => {
                    doAgentDelete({ id: agent.info.id }).then(() => {
                        fetchAgentList({ include_status: true })
                    })
                }}
            />)}
        </div>
    )
}

export function AgentEditorScreen() {
    const params = useParams()
    const agentID = decodeURIComponent(params.id ?? "new")


    const navigate = useNavigate();

    const [agentGetResponse, fetchAgent] = useAgentGet()
    const [agentNewResponse, doAgentNew] = useAgentNew()
    const [agentUpdateResponse, doAgentUpdate] = useAgentUpdate()

    const [data, setData] = useState<Agent>({
        id: "",
        addr: "",
        can_export: false,
        can_parse: false,
        can_parse_multi: false,
        name: "",
        priority: 0,
        token: "",
        created_at: new Date().toJSON(),
    })


    useEffect(() => {
        if (agentGetResponse.data) {
            setData(agentGetResponse.data!)
        }
    }, [agentGetResponse.data])

    const isExists = agentID != "new"


    useEffect(() => {
        if (isExists) {
            fetchAgent({ id: agentID, })
        }
    }, [fetchAgent, agentID, isExists])

    const useSave = useCallback(() => {
        if (isExists) {
            doAgentUpdate(data)
        } else {
            doAgentNew(data).then(() => navigate("/agent/list"))
        }
    }, [doAgentUpdate, doAgentNew, isExists, data])

    return <div>
        <ErrorTextWidget value={agentGetResponse} />
        <ErrorTextWidget value={agentNewResponse} />
        <ErrorTextWidget value={agentUpdateResponse} />

        <div className="app-container container-column container-gap-middle">
            <b>Редактор агента</b>

            <AgentEditorWidget
                value={data}
                onChange={setData}
            />

            <button className="app" onClick={useSave}>Сохранить</button>
        </div>
    </div>
}

function AgentInfoWidget(props: {
    value: AgentListResponse
    onDelete: () => void
}) {
    return <div className="app-container container-column container-gap-middle">
        <h3>
            <div className="container-row container-gap-middle">
                <AgentStatusWidget value={props.value.status?.status} />
                <span>{props.value.info.name}</span>
            </div>
        </h3>
        <div className="container-2-column container-gap-middle">
            {props.value.status?.start_at ? <>
                <b>Запущен: </b>
                <HumanTimeWidget value={props.value.status.start_at} />
            </> : null}
            <b>ID: </b>
            <span>{props.value.info.id}</span>
            <b>Адрес: </b>
            <span>{props.value.info.addr}</span>
            <b>Может обрабатывать новые: </b>
            <span>{props.value.info.can_parse ? 'Да' : 'Нет'}</span>
            <b>Может обрабатывать новые массово: </b>
            <span>{props.value.info.can_parse_multi ? 'Да' : 'Нет'}</span>
            <b>Может экспортировать: </b>
            <span>{props.value.info.can_export ? 'Да' : 'Нет'}</span>
            <b>Приоритет: </b>
            <span>{props.value.info.priority}</span>
            <b>Создан: </b>
            <HumanTimeWidget value={props.value.info.created_at} />
        </div>
        <AgentStatusInfoWidget value={props.value.status?.problems} />
        <div className="container-row container-gap-middle">
            <Link className="app-button" to={`/agent/edit/${props.value.info.id}`}>Редактировать</Link>
            <button className="app" onClick={() => props.onDelete()} >
                <b className="color-danger">Удалить</b>
            </button>
        </div>
    </div>
}

function AgentStatusInfoWidget(props: {
    value?: Array<AgentListResponseStatusProblems>
}) {
    return <div className="container-column container-gap-small">
        {props.value?.map((problem, i) => <span key={i}>{problem.type}: {problem.details}</span>)}
    </div>
}

function AgentEditorWidget(props: {
    value: Agent
    onChange: (v: Agent) => void
}) {
    return <div className="container-2-column container-gap-middle">
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

        <span>Адрес</span>
        <input
            className="app"
            placeholder="Адрес"
            type="url"
            autoComplete="off"
            value={props.value.addr}
            onChange={(e) => {
                props.onChange({ ...props.value, addr: e.target.value })
            }}
        />

        <span>Токен</span>
        <input
            className="app"
            placeholder="Токен"
            type="password"
            autoComplete="off"
            value={props.value.token}
            onChange={(e) => {
                props.onChange({ ...props.value, token: e.target.value })
            }}
        />

        <span>Флаги</span>
        <div className="container-column container-gap-small">
            <label>
                <input
                    className="app"
                    placeholder="Поддерживает парсинг"
                    type="checkbox"
                    autoComplete="off"
                    checked={props.value.can_parse}
                    onChange={(e) => {
                        props.onChange({ ...props.value, can_parse: e.target.checked })
                    }}
                />
                <span>Поддерживает парсинг</span>
            </label>

            <label>
                <input
                    className="app"
                    placeholder="Поддерживает множественный парсинг"
                    type="checkbox"
                    autoComplete="off"
                    checked={props.value.can_parse_multi}
                    onChange={(e) => {
                        props.onChange({ ...props.value, can_parse_multi: e.target.checked })
                    }}
                />
                <span>Поддерживает множественный парсинг</span>
            </label>

            <label>
                <input
                    className="app"
                    placeholder="Поддерживает экспорт"
                    type="checkbox"
                    autoComplete="off"
                    checked={props.value.can_export}
                    onChange={(e) => {
                        props.onChange({ ...props.value, can_export: e.target.checked })
                    }}
                />
                <span>Поддерживает экспорт</span>
            </label>
        </div>
        <span>Приоритет</span>
        <input
            className="app"
            placeholder="Приоритет"
            type="number"
            autoComplete="off"
            value={props.value.priority}
            onChange={(e) => {
                props.onChange({ ...props.value, priority: e.target.valueAsNumber })
            }}
        />
    </div>
}

function AgentStatusWidget(props: {
    value?: string
}) {
    const color = props.value == "ok" ? "green" :
        props.value == "error" ? "red" :
            props.value == "warning" ? "yellow" :
                props.value == "offline" ? "gray" : "purple"

    return <div> <div
        style={{
            backgroundColor: color,
            padding: "10px",
            borderRadius: "10px",
        }}
    /></div>
}