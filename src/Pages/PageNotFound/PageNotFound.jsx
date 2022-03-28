import React from 'react'
import { useNavigate } from 'react-router-dom'
import style from './pagenotfound.module.css'

export default function PageNotFound() {
    const nav = useNavigate();
    const onHomeHandler = e => {
        nav('/');
    }
    return (
        <section className={style.page_404}>
            <div className={style.container}>
                <div className={style.four_zero_four_bg}>
                    <h1>404</h1>
                </div>
                <div className={style.contant_box_404}>
                    <h3>Look like you're lost</h3>
                    <p>the page you are looking for not avaible!</p>
                    <button className={style.link_404} onClick={onHomeHandler}>Go to Home</button>
                </div>
            </div>
        </section>
    )
}
