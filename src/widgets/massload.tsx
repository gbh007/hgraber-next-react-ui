import { Link } from "react-router-dom";
import { MassloadInfo } from "../apiclient/api-massload";
import { ColorizedTextWidget, ContainerWidget } from "./common";
import { MassloadEditorLink } from "../core/routing";
import { BookOneAttributeWidget } from "./attribute";
import { AttributeColor } from "../apiclient/api-attribute";

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
                            {ml.attributes?.map(attr =>
                                <BookOneAttributeWidget value={attr.value} colors={props.colors} code={attr.code} />
                            )}
                        </ContainerWidget>
                    </td>
                    <td>
                        <ContainerWidget direction="column" gap="small">
                            <Link className="app-button" to={MassloadEditorLink(ml.id)} >Редактировать</Link>
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