import { Link } from "react-router-dom";
import { MassloadInfo, MassloadInfoAttribute, MassloadInfoExternalLink } from "../apiclient/api-massload";
import { ColorizedTextWidget, ContainerWidget, HumanTimeWidget } from "./common";
import { HProxyListLink, MassloadEditorLink, MassloadViewLink } from "../core/routing";
import { attributeCodes, BookAttributeAutocompleteList, BookOneAttributeWidget } from "./attribute";
import { AttributeColor } from "../apiclient/api-attribute";
import { useState } from "react";

export function MassloadListWidget(props: {
    value: Array<MassloadInfo>
    colors?: Array<AttributeColor>
    onDelete: (id: number) => void
}) {
    return <ContainerWidget appContainer gap="medium" direction="column">
        <table style={{ borderSpacing: "20px" }}>
            <thead>
                <tr>
                    <td>ID <Link className="app-button" to={MassloadEditorLink()} >Новая</Link></td>
                    <td>Название</td>
                    <td>Описание</td>
                    <td>Флаги</td>
                    <td>Аттрибуты</td>
                    <td>Действия</td>
                </tr>
            </thead>
            <tbody>
                {props.value?.map(ml => <tr key={ml.id}>
                    <td>{ml.id}</td>
                    <td>{ml.name}</td>
                    <td>{ml.description}</td>
                    <td>{ml.is_deduplicated ? <ColorizedTextWidget color="good">Дедуплицирована</ColorizedTextWidget> : null}</td>
                    <td>
                        <ContainerWidget direction="row" gap="smaller" wrap>
                            {ml.attributes?.map((attr, i) =>
                                <BookOneAttributeWidget key={i} value={attr.value} colors={props.colors} code={attr.code} />
                            )}
                        </ContainerWidget>
                    </td>
                    <td>
                        <ContainerWidget direction="column" gap="small">
                            <Link className="app-button" to={MassloadViewLink(ml.id)}>Посмотреть</Link>
                            <Link className="app-button" to={MassloadEditorLink(ml.id)}>Редактировать</Link>
                            <button className="app" onClick={() => {
                                props.onDelete(ml.id)
                            }}>
                                <ColorizedTextWidget color="danger-lite">Удалить</ColorizedTextWidget>
                            </button>
                        </ContainerWidget>
                    </td>
                </tr>)}
            </tbody>
        </table>
    </ContainerWidget>
}

export function MassloadInfoEditorWidget(props: {
    value: MassloadInfo
    onChange: (v: MassloadInfo) => void
    onSave: () => void
    onDelete: () => void
}) {
    return <ContainerWidget appContainer direction="column" gap="medium">
        <ContainerWidget direction="row" gap="medium" wrap>
            <button className="app" onClick={props.onSave}>
                <ColorizedTextWidget color="good">Сохранить</ColorizedTextWidget>
            </button>
            <button className="app" onClick={props.onDelete}>
                <ColorizedTextWidget color="danger-lite">Удалить</ColorizedTextWidget>
            </button>
        </ContainerWidget>
        <ContainerWidget direction="2-column" gap="medium">
            <span>Название</span>
            <input
                className="app"
                value={props.value.name}
                onChange={e => props.onChange({ ...props.value, name: e.target.value })}
            />
            <span>Описание</span>
            <input
                className="app"
                value={props.value.description}
                onChange={e => props.onChange({ ...props.value, description: e.target.value })}
            />
            <span>Флаги</span>
            <ContainerWidget direction="column" gap="small">
                <label>
                    <input
                        className="app"
                        type="checkbox"
                        checked={props.value.is_deduplicated}
                        onChange={e => props.onChange({ ...props.value, is_deduplicated: e.target.checked })}
                    />
                    <span>Дедуплицирована</span>
                </label>
            </ContainerWidget>
        </ContainerWidget>
    </ContainerWidget>
}

export function MassloadAttributeEditorWidget(props: {
    value?: Array<MassloadInfoAttribute>
    onCreate: (code: string, text: string) => void
    onDelete: (code: string, text: string) => void
    colors?: Array<AttributeColor>
}) {
    const [code, setCode] = useState("")
    const [value, setValue] = useState("")

    return <ContainerWidget appContainer gap="medium" direction="column">
        <ContainerWidget direction="row" gap="small">
            <select
                className="app"
                value={code}
                onChange={e => {
                    setCode(e.target.value)
                }}
            >
                <option value="" key="">Не выбрано</option>
                {attributeCodes.map(code =>
                    <option value={code} key={code}>{code}</option>
                )}
            </select>
            <input
                className="app"
                value={value}
                onChange={e => setValue(e.target.value)}
                list={BookAttributeAutocompleteList(code)}
            />
            <button className="app" onClick={() => {
                props.onCreate(code, value)
            }}>
                <ColorizedTextWidget color="good">Создать</ColorizedTextWidget>
            </button>
        </ContainerWidget>

        <table style={{ borderSpacing: "20px" }}>
            <thead>
                <tr>
                    <td>Аттрибут</td>
                    <td>Создан</td>
                    <td>Действия</td>
                </tr>
            </thead>
            <tbody>
                {props.value?.map((attr, i) => <tr key={i}>
                    <td><BookOneAttributeWidget value={attr.value} colors={props.colors} code={attr.code} /></td>
                    <td><HumanTimeWidget value={attr.created_at} /></td>
                    <td>
                        <ContainerWidget direction="column" gap="small">
                            <button className="app" onClick={() => {
                                props.onDelete(attr.code, attr.value)
                            }}>
                                <ColorizedTextWidget color="danger-lite">Удалить</ColorizedTextWidget>
                            </button>
                        </ContainerWidget>
                    </td>
                </tr>)}
            </tbody>
        </table>
    </ContainerWidget>
}

export function MassloadExternalLinkEditorWidget(props: {
    value?: Array<MassloadInfoExternalLink>
    onCreate: (url: string) => void
    onDelete: (url: string) => void
}) {
    const [value, setValue] = useState("")

    return <ContainerWidget appContainer gap="medium" direction="column">
        <ContainerWidget direction="row" gap="small">
            <input
                className="app"
                value={value}
                onChange={e => setValue(e.target.value)}
            />
            <button className="app" onClick={() => {
                props.onCreate(value)
            }}>
                <ColorizedTextWidget color="good">Создать</ColorizedTextWidget>
            </button>
        </ContainerWidget>

        <table style={{ borderSpacing: "20px" }}>
            <thead>
                <tr>
                    <td>Значение</td>
                    <td>Создана</td>
                    <td>Действия</td>
                </tr>
            </thead>
            <tbody>
                {props.value?.map((link, i) => <tr key={i}>
                    <td>{link.url}</td>
                    <td><HumanTimeWidget value={link.created_at} /></td>
                    <td>
                        <ContainerWidget direction="column" gap="small">
                            <button className="app" onClick={() => {
                                props.onDelete(link.url)
                            }}>
                                <ColorizedTextWidget color="danger-lite">Удалить</ColorizedTextWidget>
                            </button>
                        </ContainerWidget>
                    </td>
                </tr>)}
            </tbody>
        </table>
    </ContainerWidget>
}

export function MassloadViewWidget(props: {
    value: MassloadInfo
    colors?: Array<AttributeColor>
}) {
    return <ContainerWidget appContainer direction="column" gap="medium">
        <ContainerWidget direction="2-column" gap="medium">
            <b>Название</b>
            <span>{props.value.name}</span>

            <b>Описание</b>
            <span>{props.value.description}</span>

            <b>Флаги</b>
            <span>{props.value.is_deduplicated ? <ColorizedTextWidget color="good">Дедуплицирована</ColorizedTextWidget> : null}</span>

            <b>Аттрибуты</b>
            <span>
                <ContainerWidget direction="row" gap="smaller" wrap>
                    {props.value.attributes?.map((attr, i) =>
                        <BookOneAttributeWidget key={i} value={attr.value} colors={props.colors} code={attr.code} />
                    )}
                </ContainerWidget>
            </span>


            <b>Ссылки</b>
            <span>
                <ContainerWidget direction="row" gap="smaller" wrap>
                    {props.value.external_links?.map((link, i) =>
                        <Link className="app-button" key={i} to={HProxyListLink(link.url)}>{link.url}</Link>
                    )}
                </ContainerWidget>
            </span>

        </ContainerWidget>
    </ContainerWidget>
}