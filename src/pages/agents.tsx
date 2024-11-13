import { useEffect, useState } from "react"

import "./agents.css"
import { useAgentList, AgentListResponse } from "../apiclient/api-agent-list"
import { useAgentDelete } from "../apiclient/api-agent-delete"
import { AgentNewRequest, useAgentNew } from "../apiclient/api-agent-new"

export function AgentScreen() {
    const [{ isError, errorText, data }, doRequest] = useAgentList()

    useEffect(() => { doRequest({ include_status: true }) }, [doRequest])

    return (
        <>
            {isError ? <div className="app-container">
                <div className="app-error-container">
                    {errorText}
                </div>
            </div> : null}
            {data ? <AgentListWidget data={data!} callback={() => {
                doRequest({ include_status: true })
            }} /> : null}
            <AgentNewWidget callback={() => {
                doRequest({ include_status: true })
            }} />
        </>
    )
}

function AgentListWidget(props: {
    data: Array<AgentListResponse>
    callback: () => void
}) {
    return (
        <>
            {props.data.map(agent => <div
                className="app-container"
                style={{ display: "flex", flexDirection: "column", rowGap: "10px" }}
                key={agent.id}
            >
                <h3
                    className="agent-status"
                    data-status={(agent.status || {}).status || 'unknown'}
                >
                    {agent.name}
                </h3>
                {agent.status && agent.status.start_at ? <span>
                    <b>Запущен: </b>
                    {new Date(agent.status!.start_at!).toLocaleString()}
                </span> : null}
                <span>
                    <b>ID: </b>
                    {agent.id}
                </span>
                <span>
                    <b>Адрес: </b>
                    {agent.addr}
                </span>
                <span>
                    <b>Может обрабатывать новые: </b>
                    {agent.can_parse ? 'Да' : 'Нет'}
                </span>
                <span>
                    <b>Может обрабатывать новые массово: </b>
                    {agent.can_parse_multi ? 'Да' : 'Нет'}
                </span>
                <span>
                    <b>Может экспортировать: </b>
                    {agent.can_export ? 'Да' : 'Нет'}
                </span>
                <span>
                    <b>Приоритет: </b>
                    {agent.priority}
                </span>
                <span>
                    <b>Создан: </b>
                    {new Date(agent.create_at).toLocaleString()}
                </span>
                <AgentDeleteButton callback={props.callback} agentID={agent.id} />
            </div >)
            }
        </>
    )
}

function AgentDeleteButton(props: {
    agentID: string
    callback: () => void
}) {
    // FIXME: обрабатывать ошибки
    const [_, doRequest] = useAgentDelete()

    return <button className="app" onClick={() => {
        doRequest({ id: props.agentID })
            .then(() => props.callback())
    }} >
        <b style={{ color: "red" }}>Удалить</b>
    </button >
}

function AgentNewWidget(props: { callback: () => void }) {
    const [agentData, setAgentData] = useState<AgentNewRequest>({
        addr: "",
        can_export: false,
        can_parse: false,
        can_parse_multi: false,
        name: "",
        priority: 0,
        token: "",
    })
    const [{ isError, errorText }, doRequest] = useAgentNew()

    return <div
        className="app-container"
        style={{ display: "flex", flexDirection: "column", rowGap: "10px" }}
    >
        <b>Создание агента</b>

        {isError ? <div className="app-error-container">
            {errorText}
        </div> : null}

        <label>
            <span>Название</span>
            <input
                className="app"
                placeholder="Название"
                type="text"
                autoComplete="off"
                value={agentData.name}
                onChange={(e) => {
                    setAgentData({ ...agentData, name: e.target.value })
                }}
            />
        </label>

        <label>
            <span>Адрес</span>
            <input
                className="app"
                placeholder="Адрес"
                type="url"
                autoComplete="off"
                value={agentData.addr}
                onChange={(e) => {
                    setAgentData({ ...agentData, addr: e.target.value })
                }}
            />
        </label>

        <label>
            <span>Токен</span>
            <input
                className="app"
                placeholder="Токен"
                type="password"
                autoComplete="off"
                value={agentData.token}
                onChange={(e) => {
                    setAgentData({ ...agentData, token: e.target.value })
                }}
            />
        </label>

        <label>
            <span>Поддерживает парсинг</span>
            <input
                className="app"
                placeholder="Поддерживает парсинг"
                type="checkbox"
                autoComplete="off"
                checked={agentData.can_parse}
                onChange={(e) => {
                    setAgentData({ ...agentData, can_parse: e.target.checked })
                }}
            />
        </label>

        <label>
            <span>Поддерживает множественный парсинг</span>
            <input
                className="app"
                placeholder="Поддерживает множественный парсинг"
                type="checkbox"
                autoComplete="off"
                checked={agentData.can_parse_multi}
                onChange={(e) => {
                    setAgentData({ ...agentData, can_parse_multi: e.target.checked })
                }}
            />
        </label>

        <label>
            <span>Поддерживает экспорт</span>
            <input
                className="app"
                placeholder="Поддерживает экспорт"
                type="checkbox"
                autoComplete="off"
                checked={agentData.can_export}
                onChange={(e) => {
                    setAgentData({ ...agentData, can_export: e.target.checked })
                }}
            />
        </label>

        <label>
            <span>Приоритет</span>
            <input
                className="app"
                placeholder="Приоритет"
                type="number"
                autoComplete="off"
                value={agentData.priority}
                onChange={(e) => {
                    setAgentData({ ...agentData, priority: e.target.valueAsNumber })
                }}
            />
        </label>

        <button className="app" onClick={() => {
            doRequest(agentData).then(() => {
                props.callback()
                setAgentData({
                    addr: "",
                    can_export: false,
                    can_parse: false,
                    can_parse_multi: false,
                    name: "",
                    priority: 0,
                    token: "",
                })
            })
        }}>Создать</button>
    </div >
}