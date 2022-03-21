import { CSSProperties } from "react";
import "./Card.css";

type CardProps = {
    children?: any;
    style?: CSSProperties;
}

const Card = ({ children, style }: CardProps) => {
    return (
        <div className="Card" style={style}>
            {children}
        </div>
    );
}

export default Card