import React from 'react'

function ImagewithPreview(props, ref) {
    return (
        <>
            <label>{props.label}</label>
            <input type="file" id="profileimg" onChange={Imagechange} />
        </>
    )
}

export default React.forwardRef(ImagewithPreview)
