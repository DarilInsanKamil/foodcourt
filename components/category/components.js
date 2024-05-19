import Image from "next/image"
import Link from "next/link"

export const Components = ({ s, w, h, a }) => {
    return (
        <Link href={a}>
            <div>
                <img src={s} width={w} height={h} />
            </div>
        </Link>
    )
}