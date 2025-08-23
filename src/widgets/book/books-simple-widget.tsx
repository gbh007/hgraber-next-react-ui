import { PropsWithChildren } from "react"
import { BookSimple } from "../../apiclient/model-book"
import { ImageSize } from "./image-size"
import { Link } from "react-router-dom"
import { BookDetailsLink } from "../../core/routing"
import { BookImagePreviewWidget } from "./book-image-preview-widget"
import { Property } from "csstype"
import { ContainerWidget, HumanTimeWidget } from "../design-system"

export function BooksSimpleWidget(props: PropsWithChildren & {
    value?: BookSimple
    align?: Property.AlignItems
    previewSize?: ImageSize
    actualPageCount?: number
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
        <span>Страниц: {props.value.page_count}{props.actualPageCount ? ` (${props.actualPageCount})` : null}</span>
        {props.children}
    </ContainerWidget>
}

