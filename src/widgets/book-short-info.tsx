import { Link } from "react-router-dom";
import { BookShortInfo } from "../apiclient/api-book-list";
import { BookFlags } from "../apiclient/model-book";

import missingImage from "../assets/missing-image.png"
import deletedBadge from "../assets/deleted.png"
import rebuildedBadge from "../assets/rebuilded.png"
import verifiedBadge from "../assets/verified.png"
import deadHashBadge from "../assets/dead-hash.png"
import { AttributeColor } from "../apiclient/api-attribute";
import { BookAttributeValuesWidget } from "./attribute";
import { ColorizedTextWidget, ContainerWidget } from "./common";
import { BookDetailsLink } from "../core/routing";

export type ImageSize = "small" | "medium" | "big" | "superbig"

export function BookShortInfoWidget(props: {
    value: BookShortInfo
    colors?: Array<AttributeColor>
}) {
    const book = props.value
    const tags = book.tags?.filter((_, i) => i < 8)
    const hasMoreTags = book.tags?.length ?? 0 > 8

    return <ContainerWidget appContainer>
        <ContainerWidget direction="row" gap="medium">
            <Link to={BookDetailsLink(book.info.id)}>
                <BookImagePreviewWidget
                    flags={book.info.flags}
                    preview_url={book.info.preview_url}
                    previewSize="small"
                />
            </Link>
            <ContainerWidget direction="column">
                {book.info.flags.parsed_name ?
                    <b>{book.info.name}</b>
                    : <ColorizedTextWidget bold color="danger">НЕТ НАЗВАНИЯ</ColorizedTextWidget>
                }
                <ContainerWidget direction="row" gap="small" wrap style={{ justifyContent: "space-between" }}>
                    <ColorizedTextWidget color={book.info.flags.parsed_page ? undefined : 'danger'}>Страниц: {book.info.page_count}</ColorizedTextWidget>
                    <ColorizedTextWidget color={book.page_loaded_percent != 100.0 ? 'danger' : undefined}> Загружено: {book.page_loaded_percent}%</ColorizedTextWidget>
                    <span>{new Date(book.info.created_at).toLocaleString()}</span>
                </ContainerWidget>
                {tags ? <span>
                    <BookAttributeValuesWidget
                        code="tag" // FIXME: прибито гвоздями, устранить
                        values={tags}
                        colors={props.colors}
                    />
                    {hasMoreTags ? <b>и больше!</b> : null}
                </span> : null}
            </ContainerWidget>
        </ContainerWidget>
    </ContainerWidget>
}

export function BookImagePreviewWidget(props: {
    preview_url?: string
    flags?: BookFlags
    previewSize: ImageSize
}) {
    const activeBadge = [deletedBadge, verifiedBadge, rebuildedBadge]
        .filter(badge => badge == deletedBadge && props.flags?.is_deleted ||
            badge == verifiedBadge && props.flags?.is_verified ||
            badge == rebuildedBadge && props.flags?.is_rebuild)

    const badgeSize = props.previewSize == "superbig" ? 5
        : props.previewSize == "big" ? 60
            : props.previewSize == "medium" ? 45
                : 30

    const imageWidth = props.previewSize == "superbig" ? 20
        : props.previewSize == "big" ? 260
            : props.previewSize == "medium" ? 195
                : 130

    const imageHeight = props.previewSize == "superbig" ? 50
        : props.previewSize == "big" ? 400
            : props.previewSize == "medium" ? 300
                : 200

    const widthUnit = props.previewSize == "superbig" ? "vw" : "px"
    const heightUnit = props.previewSize == "superbig" ? "vh" : "px"

    return <div style={{
        position: "relative",
        minWidth: `${badgeSize * activeBadge.length}${widthUnit}`,
        textAlign: "right",
    }}>
        <img
            style={{
                maxWidth: `${imageWidth}${widthUnit}`,
                maxHeight: `${imageHeight}${heightUnit}`,
            }}
            src={props.preview_url ?? missingImage}
        />
        <div style={{
            position: "absolute",
            display: "flex",
            flexDirection: "row-reverse",
            top: 0,
            right: 0,
        }}>
            {activeBadge.map(badge => <img
                style={{
                    maxWidth: `${badgeSize}${widthUnit}`,
                    maxHeight: `${badgeSize}${heightUnit}`,
                }}
                src={badge}
                key={badge}
            />)}
        </div>

    </div>
}


export function PageImagePreviewWidget(props: {
    preview_url?: string
    flags?: {
        has_dead_hash?: boolean
    }
    previewSize: ImageSize
}) {
    const activeBadge = [deadHashBadge]
        .filter(badge => badge == deadHashBadge && props.flags?.has_dead_hash)

    const badgeSize = props.previewSize == "superbig" ? 5
        : props.previewSize == "big" ? 60
            : props.previewSize == "medium" ? 40
                : 20

    const imageWidth = props.previewSize == "superbig" ? 80
        : props.previewSize == "big" ? 600
            : props.previewSize == "medium" ? 400
                : 200

    const imageHeight = props.previewSize == "superbig" ? 80
        : props.previewSize == "big" ? 300
            : props.previewSize == "medium" ? 200
                : 100

    const widthUnit = props.previewSize == "superbig" ? "vw" : "px"
    const heightUnit = props.previewSize == "superbig" ? "vh" : "px"

    return <div style={{
        position: "relative",
        minWidth: `${badgeSize * activeBadge.length}${widthUnit}`,
        textAlign: "right",
    }}>
        <img
            style={{
                maxWidth: `${imageWidth}${widthUnit}`,
                maxHeight: `${imageHeight}${heightUnit}`,
            }}
            src={props.preview_url ?? missingImage}
        />
        <div style={{
            position: "absolute",
            display: "flex",
            flexDirection: "row-reverse",
            top: 0,
            right: 0,
        }}>
            {activeBadge.map(badge => <img
                style={{
                    maxWidth: `${badgeSize}${widthUnit}`,
                    maxHeight: `${badgeSize}${heightUnit}`,
                }}
                src={badge}
                key={badge}
            />)}
        </div>

    </div>
}


export function PageBadgesWidget(props: {
    flags?: {
        has_dead_hash?: boolean
    }
    badgeSize: ImageSize
}) {
    const activeBadge = [deadHashBadge]
        .filter(badge => badge == deadHashBadge && props.flags?.has_dead_hash)

    const badgeSize = props.badgeSize == "superbig" ? 5
        : props.badgeSize == "big" ? 60
            : props.badgeSize == "medium" ? 40
                : 20


    const widthUnit = props.badgeSize == "superbig" ? "vw" : "px"
    const heightUnit = props.badgeSize == "superbig" ? "vh" : "px"

    if (!activeBadge.length) {
        return null
    }

    return <ContainerWidget direction="row" gap="small">
        {activeBadge.map(badge => <img
            style={{
                maxWidth: `${badgeSize}${widthUnit}`,
                maxHeight: `${badgeSize}${heightUnit}`,
            }}
            src={badge}
            key={badge}
        />)}
    </ContainerWidget>
}
