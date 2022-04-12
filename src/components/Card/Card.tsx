import { CSSProperties } from "react";
import "./Card.css";

type CardProps = {
    children?: any;
    style?: CSSProperties;
    // TODO: handle className as react does
    className?: string;
}

const Card = ({ children, style, className }: CardProps) => {
    return (
        <div className={"Card " + className} style={style}>
            {children}
        </div>
    );
}

export default Card