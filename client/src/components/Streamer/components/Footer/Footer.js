// Libraries & utils
import React, { useState, useEffect, useRef } from "react";

// Hooks
import useWindowSize from "./useWindowSize";

// SCSS
import "./Footer.scss";

const negativeIndent = {
    0: "-50px",
    1: "-25px",
    2: "-90px",
    3: "0",
};

const Footer = ({ streamer }) => {
    const size = useWindowSize();
    const [dimensions, setDimentions] = useState({ rows: 0, columns: 0 });
    const fillerRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        let canvas;
        if (canvasRef.current) {
            canvas = canvasRef.current;
        } else {
            canvas = document.createElement("canvas");
            canvasRef.current = canvas;
        }

        const context = canvas.getContext("2d");
        context.font = "600 40px Jost";
        const metrics = context.measureText(streamer.display_name);
        const rows = Math.round(fillerRef.current.clientHeight / 40) + 2;
        const columns = Math.round(fillerRef.current.clientWidth / metrics.width) + 2;
        setDimentions({ rows, columns });
    }, [size, streamer]);

    const names = `${streamer.display_name.toUpperCase()} `.repeat(dimensions.columns);

    return (
        <div ref={fillerRef} className="streamer-footer">
            {[...Array(dimensions.rows)].map((e, i) => (
                <span key={i} style={{ marginLeft: negativeIndent[i % 4] }}>
                    {names}
                </span>
            ))}
        </div>
    );
};

export default Footer;
