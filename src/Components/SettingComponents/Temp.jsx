import React from 'react'

export default function Temp() {
    return (
        <div>
            <div className="img-upload-box mb-4">
                <div className="upload-btn-wrapper">
                    <button className="btn">
                        <input type="file" accept="image/*" name="rewardImg" />
                        <span>
                            <img src={null} alt="prizeImg" className="w-100" />
                        </span>
                    </button>
                </div>
            </div>
            <div className="img-upload-box mb-4">
                <div className="upload-btn-wrapper">
                    <button className="btn">
                        <input
                            type="file"
                            accept="image/*"
                            name="rewardImg"
                        />
                        <span>
                            <img src={Vector} alt="prizeImg" className="w-100" />
                        </span>
                    </button>
                </div>
            </div>
            {/* <label htmlFor="image">
                                {image ?
                                    <img className={style.image} src={URL.createObjectURL(image)} alt="" />
                                    : <img className={style.image} src={`${imgPath}${user.image}`} alt="" />}
                            </label>
                            <span>

                                <input id='image' accept="image/*" type="file" onChange={imageChange} />
                            </span>
                            <div className={style.middle_img}>
                                <div>
                                    <img src={uploadImage} alt="" />
                                </div>
                            </div> */}
        </div>
    )
}
