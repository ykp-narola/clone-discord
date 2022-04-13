import React, { useEffect, useState } from "react";

export const Image = (props) => {
    const [imageSrc, setImageSrc] = useState("");

    useEffect(() => {
        const reader = new FileReader();
        reader.readAsDataURL(props.blob);
        reader.onloadend = function () {
            setImageSrc(reader.result);
        };
        // eslint-disable-next-line
    }, [props.bolb]);
    console.log(props.blob, imageSrc);
    return (
        <img
            src={imageSrc}
            style={{ height: "auto", width: 300 }}
            alt={props.fileName}
        />
    );
};
