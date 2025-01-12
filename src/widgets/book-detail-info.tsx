import { Link } from "react-router-dom"
import { DeduplicateBookByPageBodyResponseResult } from "../apiclient/api-deduplicate"
import { PropsWithChildren, ReactNode, useEffect, useState } from "react"
import { BookAttribute, BookSimplePage } from "../apiclient/model-book"
import { BookDetails } from "../apiclient/api-book-details"
import { BookImagePreviewWidget, ImageSize, PageImagePreviewWidget } from "./book-short-info"
import { AttributeColor } from "../apiclient/api-attribute"
import { BookAttributeValuesWidget } from "./attribute"
import { ColorizedTextWidget, ContainerWidget } from "./common"


// FIXME: необходимо разобрать виджет на компоненты и перенести часть в модель выше.
export function BookDetailInfoWidget(props: PropsWithChildren & {
    book: BookDetails
    deduplicateBookInfo?: Array<DeduplicateBookByPageBodyResponseResult>
    colors?: Array<AttributeColor>
}) {
    const originDomain = /https?:\/\/([\w.]+)\/.*/.exec(props.book.info.origin_url ?? "")?.[1]
    return <ContainerWidget direction="column" gap="big">
        <ContainerWidget appContainer direction="row">
            <div>
                <BookImagePreviewWidget
                    flags={props.book.info.flags}
                    previewSize="superbig"
                    preview_url={props.book.info.preview_url}
                />
            </div>
            <ContainerWidget direction="column" gap="medium" style={{ flexGrow: 1, padding: "10px" }}>
                <h1 style={{ wordBreak: "break-all", margin: 0 }}>
                    <ColorizedTextWidget color={props.book.info.flags.parsed_name ? undefined : 'danger'}>{props.book.info.name}</ColorizedTextWidget>
                </h1>
                <ContainerWidget direction="row" wrap style={{ justifyContent: "space-between" }}>
                    <span> #{props.book.info.id} </span>
                    <ColorizedTextWidget color={props.book.info.flags.parsed_page ? undefined : 'danger'}>
                        Страниц: {props.book.info.page_count}
                        {props.book.pages && props.book.pages.length != props.book.info.page_count ? ` (${props.book.pages.length})` : null}
                    </ColorizedTextWidget>
                    <ColorizedTextWidget color={props.book.page_loaded_percent != 100.0 ? 'danger' : undefined}>
                        Загружено: {props.book.page_loaded_percent}%
                    </ColorizedTextWidget>
                    <span>{new Date(props.book.info.created_at).toLocaleString()}</span>
                </ContainerWidget>
                <ContainerWidget direction="row" gap="small">
                    {props.book.info.origin_url ? <a href={props.book.info.origin_url}>Ссылка на первоисточник</a> : null}
                    {originDomain ? <span>({originDomain})</span> : null}
                </ContainerWidget>
                <BookAttributesWidget value={props.book.attributes} colors={props.colors} />
                {props.book.size ? <ContainerWidget direction="column">
                    <b>Размер:</b>
                    <span>уникальный (без мертвых хешей) {props.book.size.unique_without_dead_hashes_formatted}</span>
                    <span>уникальный (с мертвыми хешами) {props.book.size.unique_formatted}</span>
                    <span>разделяемый {props.book.size.shared_formatted}</span>
                    <span>мертвые хеши {props.book.size.dead_hashes_formatted}</span>
                    <span>общий {props.book.size.total_formatted}</span>
                </ContainerWidget> : null}
                {props.children}
            </ContainerWidget>
        </ContainerWidget>
        <BookDuplicates deduplicateBookInfo={props.deduplicateBookInfo} originID={props.book.info.id} />
        <BookPagesPreviewWidget
            bookID={props.book.info.id}
            pages={props.book.pages}
        />
    </ContainerWidget>
}

export function usePreviewSizeWidget(
    defaultSize?: ImageSize
): [ImageSize, ReactNode] {
    const [size, setSize] = useState<ImageSize>(defaultSize ?? "small")

    return [size, <select
        className="app"
        value={size}
        onChange={e => setSize(e.target.value as ImageSize)}
    >
        <option value={"small"}>маленький</option>
        <option value={"medium"}>средний</option>
        <option value={"big"}>большой</option>
        <option value={"superbig"}>огромный</option>
    </select>]
}

export function BookPagesPreviewWidget(props: {
    bookID: string
    pages?: Array<BookSimplePage>
    pageLimit?: number
}) {
    const [pageLimit, setPageLimit] = useState(20)

    useEffect(() => {
        setPageLimit(props.pageLimit ?? 20)
    }, [setPageLimit, props.pageLimit, props.bookID])


    const [imageSize, imageSizeWidget] = usePreviewSizeWidget("medium")

    if (!props.pages?.length) {
        return null
    }

    return <ContainerWidget direction="column" gap="medium">
        <ContainerWidget appContainer direction="row" gap="medium">
            {pageLimit != -1 && (pageLimit < props.pages.length) ?
                <button className="app" onClick={() => setPageLimit(-1)}>Показать все страницы</button>
                : null}
            {imageSizeWidget}
        </ContainerWidget>
        <ContainerWidget direction="row" gap="medium" wrap>
            {props.pages?.filter(page => page.preview_url)
                .filter((_, i) => pageLimit == -1 || i < pageLimit)
                .map((page) =>
                    <ContainerWidget appContainer direction="column" style={{ flexGrow: 1, alignItems: "center" }} key={page.page_number}>
                        <Link to={`/book/${props.bookID}/read/${page.page_number}`}>
                            <PageImagePreviewWidget
                                previewSize={imageSize}
                                flags={page}
                                preview_url={page.preview_url}
                            />
                        </Link>
                    </ContainerWidget>
                )}
        </ContainerWidget>
    </ContainerWidget>
}

export function BookAttributesWidget(props: {
    value?: Array<BookAttribute>
    colors?: Array<AttributeColor>
}) {
    if (!props.value) {
        return null
    }

    return <ContainerWidget direction="column" gap="small">
        {props.value?.map(attr =>
            <BookAttributeWidget key={attr.code} value={attr} colors={props.colors} />
        )}
    </ContainerWidget>
}

export function BookAttributeWidget(props: {
    value: BookAttribute
    colors?: Array<AttributeColor>
}) {
    return <ContainerWidget direction="row" gap="small" wrap style={{ alignItems: "center" }}>
        <span>{props.value.name}:</span>
        <BookAttributeValuesWidget
            code={props.value.code}
            values={props.value.values}
            colors={props.colors}
        />
    </ContainerWidget>
}

function BookDuplicates(props: {
    originID: string
    deduplicateBookInfo?: Array<DeduplicateBookByPageBodyResponseResult>
}) {
    if (!props.deduplicateBookInfo) {
        return null
    }

    return <ContainerWidget direction="row" gap="medium" wrap>
        {props.deduplicateBookInfo?.map(book =>
            <ContainerWidget appContainer direction="column" style={{ flexGrow: 1, alignItems: "center" }} key={book.book.id}>
                <Link to={`/book/${book.book.id}`}>
                    <BookImagePreviewWidget
                        flags={book.book.flags}
                        previewSize="small"
                        preview_url={book.book.preview_url}
                    />
                </Link>
                <b>{book.book.name}</b>
                <span>Страниц: {book.book.page_count}</span>
                <span title="Сколько страниц этой книги есть в открытой">Покрытие книги: {prettyPercent(book.origin_covered_target)}% ({prettyPercent(book.origin_covered_target_without_dead_hashes)}%)</span>
                <span title="Сколько страниц открытой книги есть в этой">Покрытие оригинала: {prettyPercent(book.target_covered_origin)}% ({prettyPercent(book.target_covered_origin_without_dead_hashes)}%)</span>

                <Link className="app-button" to={`/book/${props.originID}/compare/${book.book.id}`}>Сравнить</Link>
            </ContainerWidget>
        )}
    </ContainerWidget>
}

function prettyPercent(raw: number): number {
    return Math.round(raw * 1000) / 10
}