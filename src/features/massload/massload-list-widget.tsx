import { Link } from "react-router-dom"
import { AttributeColor } from "../../apiclient/api-attribute"
import { MassloadFlag, MassloadInfo } from "../../apiclient/api-massload"
import { ColorizedTextWidget, ContainerWidget } from "../../widgets/common"
import { MassloadEditorLink, MassloadViewLink } from "../../core/routing"
import { MassloadFlagViewWidget } from "./flag"
import { BookOneAttributeWidget } from "../../widgets/attribute"

export function MassloadListWidget(props: {
    value: Array<MassloadInfo>
    colors?: Array<AttributeColor>
    onDelete: (id: number) => void
    flagInfos?: Array<MassloadFlag>
}) {
    return <ContainerWidget appContainer gap="medium" direction="column">
        <table style={{ borderSpacing: "20px" }}>
            <thead>
                <tr>
                    <td>ID <Link className="app-button" to={MassloadEditorLink()} >Новая</Link></td>
                    <td>Название</td>
                    <td>Описание</td>
                    <td>Флаги</td>
                    <td>Размер</td>
                    <td>Аттрибуты</td>
                    <td>Действия</td>
                </tr>
            </thead>
            <tbody>
                {props.value?.map(ml => <tr key={ml.id}>
                    <td>{ml.id}</td>
                    <td>{ml.name}</td>
                    <td><pre className="app">{ml.description}</pre></td>
                    <td><MassloadFlagViewWidget flags={ml.flags} flagInfos={props.flagInfos} /></td>
                    <td>
                        <ContainerWidget direction="row" gap="small" wrap>
                            {ml.page_size_formatted ? <>
                                <span>{ml.page_size_formatted}</span>
                            </> : null}

                            {ml.file_size_formatted && ml.file_size_formatted != ml.page_size_formatted ? <>
                                <span>({ml.file_size_formatted})</span>
                            </> : null}
                        </ContainerWidget>
                    </td>
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
