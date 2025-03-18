import { Link } from "react-router-dom"
import { DeduplicateBookByPageBodyResponseResult } from "../apiclient/api-deduplicate"
import { PropsWithChildren, ReactNode, useEffect, useState } from "react"
import { BookAttribute, BookDetailsSize, BookSimplePage } from "../apiclient/model-book"
import { BookDetails } from "../apiclient/api-book-details"
import { BookImagePreviewWidget, ImageSize, PageImagePreviewWidget } from "./book-short-info"
import { AttributeColor } from "../apiclient/api-attribute"
import { BookAttributeValuesWidget } from "./attribute"
import { ColorizedTextWidget, ContainerWidget } from "./common"
import { BooksSimpleWidget } from "./book"
import { BookCompareLink, BookReaderLink } from "../core/routing"


export function BookDetailInfoWidget(props: PropsWithChildren & {
    book: BookDetails
    deduplicateBookInfo?: Array<DeduplicateBookByPageBodyResponseResult>
    colors?: Array<AttributeColor>
}) {
    const originDomain = /https?:\/\/([^\/]+)\/.*/.exec(props.book.info.origin_url ?? "")?.[1]
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
                <BookSizeWidget value={props.book.size} />
                {props.children}
            </ContainerWidget>
        </ContainerWidget>
        <ContainerWidget direction="row" gap="medium" wrap>
            {props.book.fs_disposition?.map(fs =>
                <ContainerWidget key={fs.id} appContainer direction="column" gap="small">
                    <b>{fs.name}</b>
                    <span>{fs.id}</span>
                    <span>{fs.files.size_formatted} ({fs.files.count})</span>
                </ContainerWidget>
            )}
        </ContainerWidget>
        <BookDuplicates deduplicateBookInfo={props.deduplicateBookInfo} originID={props.book.info.id} />
        <BookPagesPreviewWidget
            bookID={props.book.info.id}
            pages={props.book.pages}
        />
    </ContainerWidget>
}

function BookSizeWidget(props: {
    value?: BookDetailsSize
}) {
    if (!props.value) {
        return null
    }

    return <ContainerWidget direction="column">
        <b>Размер:</b>
        <span>уникальный (без мертвых хешей) <b>{props.value.unique_without_dead_hashes_formatted}</b> ({props.value.unique_without_dead_hashes_count} шт)</span>
        <span>уникальный (с мертвыми хешами) <b>{props.value.unique_formatted}</b> ({props.value.unique_count} шт)</span>
        <span>разделяемый <b>{props.value.shared_formatted}</b> ({props.value.shared_count} шт)</span>
        <span>мертвые хеши <b>{props.value.dead_hashes_formatted}</b> ({props.value.dead_hashes_count} шт)</span>
        <span>количество внутренних дублей <b>{props.value.inner_duplicate_count}</b></span>
        <span>общий <b>{props.value.total_formatted}</b> / {props.value.avg_page_size_formatted}</span>
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
        <option value={"bigger"}>очень большой</option>
        <option value={"biggest"}>супер большой</option>
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
                        <Link to={BookReaderLink(props.bookID, page.page_number)}>
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
            <BooksSimpleWidget
                value={book.book}
                align="center"
                key={book.book.id}
                actualPageCount={book.book.page_count != book.target_page_count ? book.target_page_count : undefined}
            >
                <ContainerWidget direction="column" style={{ alignItems: "center" }}>
                    <ContainerWidget direction="row" gap="small">
                        <span title="Сколько страниц этой книги есть в открытой">Покрытие книги:</span>
                        <ColorizedTextWidget bold color={book.origin_covered_target == 1 ? "good" : undefined}>
                            {prettyPercent(book.origin_covered_target)}%
                        </ColorizedTextWidget>
                        {book.origin_covered_target != book.origin_covered_target_without_dead_hashes ?
                            <span>({prettyPercent(book.origin_covered_target_without_dead_hashes)}%)</span>
                            : null}
                    </ContainerWidget>
                    <ContainerWidget direction="row" gap="small">
                        <span title="Сколько страниц открытой книги есть в этой">Покрытие оригинала:</span>
                        <ColorizedTextWidget bold color={book.target_covered_origin == 1 ? "good" : undefined}>
                            {prettyPercent(book.target_covered_origin)}%
                        </ColorizedTextWidget>
                        {book.target_covered_origin != book.target_covered_origin_without_dead_hashes ?
                            <span>({prettyPercent(book.target_covered_origin_without_dead_hashes)}%)</span>
                            : null}
                    </ContainerWidget>
                </ContainerWidget>
                <ContainerWidget direction="column" style={{ alignItems: "center" }}>
                    <span>Размер: {book.target_size_formatted} / {book.target_avg_page_size_formatted}</span>
                    <ContainerWidget direction="row" gap="small">
                        <span>Общий размер: {book.shared_size_formatted}</span>
                        {book.shared_size_formatted != book.shared_size_without_dead_hashes_formatted ?
                            <span>({book.shared_size_without_dead_hashes_formatted})</span>
                            : null}
                    </ContainerWidget>
                    <ContainerWidget direction="row" gap="small">
                        <span>Общие страницы: {book.shared_page_count}</span>
                        {book.shared_page_count != book.shared_page_count_without_dead_hashes ?
                            <span>({book.shared_page_count_without_dead_hashes})</span>
                            : null}
                    </ContainerWidget>
                    <Link className="app-button" to={BookCompareLink(props.originID, book.book.id)}>Сравнить</Link>
                </ContainerWidget>
            </BooksSimpleWidget>
        )}
    </ContainerWidget>
}

function prettyPercent(raw: number): number {
    return Math.round(raw * 1000) / 10
}