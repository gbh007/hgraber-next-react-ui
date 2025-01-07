import { Link } from "react-router-dom";
import { BookShortInfo } from "../apiclient/api-book-list";
import { BookFlags } from "../apiclient/model-book";

import missingImage from "../assets/missing-image.png"
import deletedBadge from "../assets/deleted.png"
import rebuildedBadge from "../assets/rebuilded.png"
import verifiedBadge from "../assets/verified.png"
import deadHashBadge from "../assets/dead-hash.png"

export function BookShortInfoWidget(props: {
    value: BookShortInfo
}) {
    const book = props.value
    const tags = book.tags?.filter((_, i) => i < 8)
    const hasMoreTags = book.tags?.length ?? 0 > 8

    return <div className="app-container">
        <div className="container-row container-gap-middle" data-background-color={book.info.flags.parsed_name ? '' : 'danger'}>
            <Link to={`/book/${book.info.id}`}>
                <BookImagePreviewWidget
                    flags={book.info.flags}
                    preview_url={book.info.preview_url}
                    previewSize="small"
                />
            </Link>
            <div className="container-column">
                <b data-color={book.info.flags.parsed_name ? '' : 'danger'}>{book.info.name}</b>
                <div className="container-row container-gap-small container-wrap" style={{ justifyContent: "space-between" }}>
                    <span data-color={book.info.flags.parsed_page ? '' : 'danger'}>Страниц: {book.info.page_count}</span>
                    <span data-color={book.page_loaded_percent != 100.0 ? 'danger' : ''}> Загружено: {book.page_loaded_percent}%</span>
                    <span>{new Date(book.info.created_at).toLocaleString()}</span>
                </div>
                {tags ? <span>
                    {tags?.map((tagname: string) =>
                        <span key={tagname} style={{
                            borderRadius: "3px",
                            padding: "3px",
                            margin: "2px",
                            backgroundColor: "var(--app-background)",
                            display: "inline-block",
                        }}>{tagname}</span>
                    )}
                    {hasMoreTags ? <b>и больше!</b> : null}
                </span> : null}
            </div>
        </div>
    </div>
}

export function BookImagePreviewWidget(props: {
    preview_url?: string
    flags?: BookFlags
    previewSize: "small" | "medium" | "big" | "superbig"
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
    previewSize: "small" | "medium" | "big" | "superbig" // TODO: доконфигурировать размеры
}) {
    const activeBadge = [deadHashBadge]
        .filter(badge => badge == deadHashBadge && props.flags?.has_dead_hash)

    const badgeSize = props.previewSize == "superbig" ? 0
        : props.previewSize == "big" ? 0
            : props.previewSize == "medium" ? 40
                : 0

    const imageWidth = props.previewSize == "superbig" ? 0
        : props.previewSize == "big" ? 0
            : props.previewSize == "medium" ? 400
                : 0

    const imageHeight = props.previewSize == "superbig" ? 0
        : props.previewSize == "big" ? 0
            : props.previewSize == "medium" ? 200
                : 0

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
