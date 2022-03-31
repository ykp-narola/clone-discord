import React, { useEffect, useState } from 'react'
import style from './Profile.module.css'
// import uploadImage from '../../assets/UploadImage.png'
import { useNavigate } from 'react-router-dom';
import { getUserData } from '../../APIs/API';
const imgPath = "http://192.168.100.130:3000/images/users/";

export default function Profile() {
    const nav = useNavigate();
    const [user, setUser] = useState({ name: '', email: '', image: 'Accord.png' });
    const [image, setImage] = useState();
    const [isChanged, setIsChanged] = useState(false);

    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setImage(e.target.files[0]);
        }
    };
    useEffect(() => {
        async function fetchData() {
            let token = JSON.parse(localStorage.getItem("token"));
            const res = await getUserData(token);
            setUser(res.data.user);
        }
        fetchData();
    }, []);

    const updateProfile = async e => {
        e.preventDefault();
        if (image) {
            const formdata = new FormData();
            formdata.append('image', image);
            let token = JSON.parse(localStorage.getItem("token"));
            await fetch("http://192.168.100.130:3000/api/users/updateMe", {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formdata
            }).then(data => data.json());
            setIsChanged(true);
        }
    }

    return (
        <div className={style.Profile_section}>
            {isChanged &&
                <div style={{ color: 'green' }}>Profile Image Updated Successfully</div>
            }
            <div className={style.main_sec}>
                <div className={style.name}>
                    <div className={`${style.emailid} ${style.inputField}`}>
                        <label htmlFor="Username">Username</label>
                        <input className={style.inputBox} type="text" id='UserName' disabled value={user.name} />
                    </div>
                    <div className={`${style.emailid} ${style.inputField}`}>
                        <label htmlFor="emailid">Email</label>
                        <input className={style.inputBox} type="email" id='emailID' disabled value={user.email} />
                    </div>
                    <div>
                        {`Profile Created On: ${(new Date(user.createdAt)).toDateString()}`}
                    </div>
                </div>
                <div className={style.profile_photo}>
                    <div>
                        <div className={style.imagephoto}>
                            <label htmlFor="image">
                                {image ?
                                    <img className={style.image} src={URL.createObjectURL(image)} alt="" />
                                    : <img className={style.image} src={`${imgPath}${user.image}`} alt="" />}
                            </label>
                            <span>
                                <input
                                    id='image'
                                    className={style.input_img}
                                    accept="image/jpeg, image/jpg, image/png"
                                    type="file"
                                    onChange={imageChange}
                                    hidden
                                />
                            </span>
                        </div>
                        <div>Profile Image</div>
                    </div>
                </div>
            </div>
            <div className={style.buttons}>
                <button onClick={updateProfile}>Save</button>
                <button onClick={() => nav("/")}>Discard Changes</button>
            </div>
        </div>
    )
}
