import { Link } from "react-router-dom";
import { BookShortInfo } from "../apiclient/api-book-list";
import { BookFlags } from "../apiclient/model-book";

import missingImage from "../assets/missing-image.png"
import deletedBadge from "../assets/deleted.png"
import rebuildedBadge from "../assets/rebuilded.png"
import verifiedBadge from "../assets/verified.png"
import deadHashBadge from "../assets/dead-hash.png"
import { AttributeColor } from "../apiclient/api-attribute";
import { BookAttributeValueWidget } from "./attribute";
import { ColorizedTextWidget, ContainerWidget } from "./common";
import { BookDetailsLink } from "../core/routing";
import { PropsWithChildren } from "react";

export type ImageSize = "small" | "medium" | "big" | "bigger" | "biggest" | "superbig"

export function BookShortInfoWidget(props: {
    value: BookShortInfo
    colors?: Array<AttributeColor>
}) {
    const book = props.value

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
                    <span>{new Date(book.info.created_at).toLocaleString()}</span>
                </ContainerWidget>
                <ContainerWidget direction="row" gap="smaller" wrap>
                    {book.color_attributes?.map(attr => <BookAttributeValueWidget
                        code={attr.code}
                        value={attr.value}
                        color={{
                            text_color: attr.text_color,
                            background_color: attr.background_color,
                        }}
                    />)}
                </ContainerWidget>
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
        : props.previewSize == "biggest" ? 120
            : props.previewSize == "bigger" ? 90
                : props.previewSize == "big" ? 60
                    : props.previewSize == "medium" ? 45
                        : 30

    const imageWidth = props.previewSize == "superbig" ? 20
        : props.previewSize == "biggest" ? 500
            : props.previewSize == "bigger" ? 350
                : props.previewSize == "big" ? 260
                    : props.previewSize == "medium" ? 195
                        : 130

    const imageHeight = props.previewSize == "superbig" ? 50
        : props.previewSize == "biggest" ? 700
            : props.previewSize == "bigger" ? 550
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
            {activeBadge.map(badge => <BadgeWidget
                src={badge}
                previewSize={props.previewSize}
                key={badge}
            />)}
        </div>

    </div>
}


export function BadgeWidget(props: {
    src: string
    previewSize: ImageSize
}) {
    const badgeSize = props.previewSize == "superbig" ? 5
        : props.previewSize == "biggest" ? 120
            : props.previewSize == "bigger" ? 90
                : props.previewSize == "big" ? 60
                    : props.previewSize == "medium" ? 45
                        : 30


    const widthUnit = props.previewSize == "superbig" ? "vw" : "px"
    const heightUnit = props.previewSize == "superbig" ? "vh" : "px"

    return <img
        style={{
            maxWidth: `${badgeSize}${widthUnit}`,
            maxHeight: `${badgeSize}${heightUnit}`,
        }}
        src={props.src}
    />
}


export function PageImagePreviewWidget(props: PropsWithChildren & {
    preview_url?: string
    flags?: {
        has_dead_hash?: boolean
    }
    previewSize: ImageSize
    onClick?: () => void
}) {
    const activeBadge = [deadHashBadge]
        .filter(badge => badge == deadHashBadge && props.flags?.has_dead_hash)

    const badgeSize = props.previewSize == "superbig" ? 5
        : props.previewSize == "biggest" ? 120
            : props.previewSize == "bigger" ? 90
                : props.previewSize == "big" ? 60
                    : props.previewSize == "medium" ? 40
                        : 20

    const imageWidth = props.previewSize == "superbig" ? 80
        : props.previewSize == "biggest" ? 1200
            : props.previewSize == "bigger" ? 900
                : props.previewSize == "big" ? 600
                    : props.previewSize == "medium" ? 400
                        : 200

    const imageHeight = props.previewSize == "superbig" ? 80
        : props.previewSize == "biggest" ? 600
            : props.previewSize == "bigger" ? 450
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
            onClick={props.onClick}
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
        {props.children}
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
        : props.badgeSize == "biggest" ? 120
            : props.badgeSize == "bigger" ? 90
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


export function PreviewSizeWidget(props: {
    value: ImageSize
    onChange: (v: ImageSize) => void
}) {
    return <select
        className="app"
        value={props.value}
        onChange={e => props.onChange(e.target.value as ImageSize)}
    >
        <option value={"small"}>маленький</option>
        <option value={"medium"}>средний</option>
        <option value={"big"}>большой</option>
        <option value={"bigger"}>очень большой</option>
        <option value={"biggest"}>супер большой</option>
        <option value={"superbig"}>огромный</option>
    </select>
}