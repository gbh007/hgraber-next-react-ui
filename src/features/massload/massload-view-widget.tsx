import { Link } from "react-router-dom"
import { AttributeColor } from "../../apiclient/api-attribute"
import { MassloadFlag, MassloadInfo } from "../../apiclient/api-massload"
import { MassloadFlagViewWidget } from "./flag"
import { HProxyListLink } from "../../core/routing"
import { BookOneAttributeWidget } from "../../widgets/attribute/book-attribute"
import { ContainerWidget } from "../../widgets/design-system"

export function MassloadViewWidget(props: {
    value: MassloadInfo
    colors?: Array<AttributeColor>
    flagInfos?: Array<MassloadFlag>
}) {
    return <ContainerWidget appContainer direction="column" gap="medium">
        <ContainerWidget direction="2-column" gap="medium">
            <b>Название</b>
            <span>{props.value.name}</span>

            <b>Описание</b>
            <pre className="app">{props.value.description}</pre>

            {props.value.page_size_formatted ? <>
                <b>Размер страниц</b>
                <span>{props.value.page_size_formatted}</span>
            </> : null}

            {props.value.file_size_formatted ? <>
                <b>Размер файлов</b>
                <span>{props.value.file_size_formatted}</span>
            </> : null}

            <b>Флаги</b>
            <span><MassloadFlagViewWidget flags={props.value.flags} flagInfos={props.flagInfos} /></span>
        </ContainerWidget>

        <b>Аттрибуты</b>
        {props.value.attributes?.map((attr, i) =>
            <ContainerWidget key={i} direction="row" gap="small" style={{ alignItems: "center" }}>
                <BookOneAttributeWidget value={attr.value} colors={props.colors} code={attr.code} />
                {attr.page_size_formatted ? <>
                    <span>{attr.page_size_formatted}</span>
                </> : null}

                {attr.file_size_formatted && attr.file_size_formatted != attr.page_size_formatted ? <>
                    <span>({attr.file_size_formatted})</span>
                </> : null}
            </ContainerWidget>
        )}


        <b>Ссылки</b>
        {props.value.external_links?.map((link, i) =>
            <ContainerWidget key={i} direction="row" gap="smaller">
                <Link className="app-button" to={HProxyListLink(link.url)}>{link.url}</Link>
            </ContainerWidget>
        )}
    </ContainerWidget>
}