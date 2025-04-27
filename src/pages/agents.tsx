import { useCallback, useEffect, useState } from "react"
import { Agent, AgentListResponse, AgentListResponseStatusProblems, useAgentDelete, useAgentGet, useAgentList, useAgentNew, useAgentUpdate } from "../apiclient/api-agent"
import { ErrorTextWidget } from "../widgets/error-text"
import { ColorizedTextWidget, ContainerWidget, HumanTimeWidget } from "../widgets/common"
import { Link, useNavigate, useParams } from "react-router-dom"
import { AgentEditLink, AgentListLink } from "../core/routing"
import { AgentStatusWidget } from "../widgets/agent"

export function AgentListScreen() {
    const [agentListResponse, fetchAgentList] = useAgentList()
    const [agentDeleteResponse, doAgentDelete] = useAgentDelete()

    useEffect(() => { fetchAgentList({ include_status: true }) }, [fetchAgentList])

    return (
        <ContainerWidget direction="column" gap="big">
            <ErrorTextWidget value={agentListResponse} />
            <ErrorTextWidget value={agentDeleteResponse} />

            <div>
                <Link className="app-button" to={AgentEditLink()}>Новый</Link>
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
        </ContainerWidget>
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
        has_fs: false,
        has_hproxy: false,
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
            doAgentNew(data).then(() => navigate(AgentListLink()))
        }
    }, [doAgentUpdate, doAgentNew, isExists, data])

    return <div>
        <ErrorTextWidget value={agentGetResponse} />
        <ErrorTextWidget value={agentNewResponse} />
        <ErrorTextWidget value={agentUpdateResponse} />

        <ContainerWidget appContainer direction="column" gap="medium">
            <b>Редактор агента</b>

            <AgentEditorWidget
                value={data}
                onChange={setData}
            />

            <button className="app" onClick={useSave}>Сохранить</button>
        </ContainerWidget>
    </div>
}

function AgentInfoWidget(props: {
    value: AgentListResponse
    onDelete: () => void
}) {
    return <ContainerWidget appContainer direction="column" gap="medium">
        <h3>
            <ContainerWidget direction="row" gap="medium">
                <AgentStatusWidget value={props.value.status?.status} />
                <span>{props.value.info.name}</span>
            </ContainerWidget>
        </h3>
        <ContainerWidget direction="2-column" gap="medium">
            {props.value.status?.start_at ? <>
                <b>Запущен:</b>
                <HumanTimeWidget value={props.value.status.start_at} />
            </> : null}
            <b>ID:</b>
            <span>{props.value.info.id}</span>
            <b>Адрес:</b>
            <span>{props.value.info.addr}</span>
            <b>Может обрабатывать новые:</b>
            <span>{props.value.info.can_parse ? 'Да' : 'Нет'}</span>
            <b>Может обрабатывать новые массово:</b>
            <span>{props.value.info.can_parse_multi ? 'Да' : 'Нет'}</span>
            <b>Может экспортировать:</b>
            <span>{props.value.info.can_export ? 'Да' : 'Нет'}</span>
            <b>Есть ФС:</b>
            <span>{props.value.info.has_fs ? 'Да' : 'Нет'}</span>
            <b>Есть HProxy:</b>
            <span>{props.value.info.has_hproxy ? 'Да' : 'Нет'}</span>
            <b>Приоритет:</b>
            <span>{props.value.info.priority}</span>
            <b>Создан:</b>
            <HumanTimeWidget value={props.value.info.created_at} />
        </ContainerWidget>
        <AgentStatusInfoWidget value={props.value.status?.problems} />
        <ContainerWidget direction="row" gap="medium">
            <Link className="app-button" to={AgentEditLink(props.value.info.id)}>Редактировать</Link>
            <button className="app" onClick={() => props.onDelete()} >
                <ColorizedTextWidget bold color="danger">Удалить</ColorizedTextWidget>
            </button>
        </ContainerWidget>
    </ContainerWidget>
}

function AgentStatusInfoWidget(props: {
    value?: Array<AgentListResponseStatusProblems>
}) {
    return <ContainerWidget direction="column" gap="small">
        {props.value?.map((problem, i) => <span key={i}>{problem.type}: {problem.details}</span>)}
    </ContainerWidget>
}

function AgentEditorWidget(props: {
    value: Agent
    onChange: (v: Agent) => void
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
        <ContainerWidget direction="column" gap="small">
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

            <label>
                <input
                    className="app"
                    placeholder="Есть ФС"
                    type="checkbox"
                    autoComplete="off"
                    checked={props.value.has_fs}
                    onChange={(e) => {
                        props.onChange({ ...props.value, has_fs: e.target.checked })
                    }}
                />
                <span>Есть ФС</span>
            </label>

            <label>
                <input
                    className="app"
                    placeholder="Есть HProxy"
                    type="checkbox"
                    autoComplete="off"
                    checked={props.value.has_hproxy}
                    onChange={(e) => {
                        props.onChange({ ...props.value, has_hproxy: e.target.checked })
                    }}
                />
                <span>Есть HProxy</span>
            </label>
        </ContainerWidget>
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
    </ContainerWidget>
}
