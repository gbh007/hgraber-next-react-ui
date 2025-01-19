import { Link } from "react-router-dom"
import { BookSimple } from "../apiclient/model-book"
import { BookImagePreviewWidget, ImageSize } from "./book-short-info"
import { ContainerWidget, HumanTimeWidget } from "./common"
import { PropsWithChildren } from "react"
import { Property } from "csstype"
import { BookDetailsLink } from "../core/routing"

export function BooksSimpleWidget(props: PropsWithChildren & {
    value?: BookSimple
    align?: Property.AlignItems
    previewSize?: ImageSize
}) {
    if (!props.value) {
        return null
    }

    return <ContainerWidget
        appContainer
        direction="column"
        gap="smaller"
        style={{
            alignItems: props.align,
            flexGrow: 1,
        }}

    >
        <Link to={BookDetailsLink(props.value.id)} style={{ flexGrow: 1 }}>
            <BookImagePreviewWidget
                flags={props.value.flags}
                previewSize={props.previewSize ?? "small"}
                preview_url={props.value.preview_url}
            />
        </Link>
        <b>{props.value.name}</b>
        <span>Создана: <HumanTimeWidget value={props.value.created_at} /></span>
        <span>Страниц: {props.value.page_count}</span>
        {props.children}
    </ContainerWidget>
}