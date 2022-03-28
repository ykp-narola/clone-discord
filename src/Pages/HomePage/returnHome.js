<div>
	<section className={style.servers_section}>
		<img src={img} alt="" />
	</section>
	<section className={style.channel_section}>
		<div className={style.server}>{channelName}</div>
		<div className={style.channels}>
			<div className={`${style.text_channels} ${style.dropdown}`}>
				<input type="checkbox" className={style.texttouch} id="texttouch" />
				<label htmlFor="texttouch">
					<span className={style.span_channel}>Text channels</span>
				</label>
				<ul className={style.slide}>
					<li onClick={() => setChannelName("ReactJS")}># ReactJS</li>
					<li onClick={() => setChannelName("NodeJS")}># NodeJS</li>
					<li onClick={() => setChannelName("ExpressJS")}># ExpressJS</li>
					<li onClick={() => setChannelName("Angular")}># Angular</li>
				</ul>
			</div>
			<div className={`${style.voice_channels} ${style.dropdown}`}>
				<input type="checkbox" className={style.voicetouch} id="voicetouch" />
				<label htmlFor="voicetouch">
					<span className={style.span_channel}>Voice channels</span>
				</label>
				<ul className={style.slide}>
					<li>Voice1</li>
					<li>Voice2</li>
					<li>Voice3</li>
					<li>Voice4</li>
				</ul>
			</div>
		</div>
		<div className={style.profile_status}>
			<div className={style.user_info}>
				<img className={style.user_image} src={img} alt="" />
				<div className={style.user_name}>
					<div className={style.uname}>{userName}</div>
					<div className={style.uid}>#1234</div>
				</div>
			</div>
			<div className={style.settings}>
				<p onClick={onSettingsHandler}>⚙︎</p>
			</div>
		</div>
	</section>

	<section className={style.main_section}>
		<div className={style.text_channel_section}>
			<section className={style.text_channel_section}>
				<div className={style.channel_title}># {channelName}</div>
			</section>
		</div>
		<div className={style.msg_user_div}>
			<section className={style.text_msg}>
				<div className={style.chat__wrapper}>
					<div className={style.message}>
						<img src={img} alt="" />
						<div className={style.msg}>
							<div className={style.username}>Michel</div>
							<div className={style.msg_text}>Hello, Good Morning</div>
						</div>
					</div>
					<div className={style.message}>
						<img src={img} alt="" />
						<div className={style.msg}>
							<div className={style.username}>Michel</div>
							<div className={style.msg_text}>Hello, Good Morning</div>
						</div>
					</div>
					<div className={style.message}>
						<img src={img} alt="" />
						<div className={style.msg}>
							<div className={style.username}>Michel</div>
							<div className={style.msg_text}>Hello, Good Morning</div>
						</div>
					</div>
				</div>
				<div className={style.chat__form}>
					<form id="inputForm">
						<input
							id="m"
							type="text"
							autoComplete="off"
							placeholder="Type your message here ..."
						/>
						<button>Send</button>
					</form>
				</div>
			</section>
			<section className={style.users_section}>
				<div className={style.channel_name}>
					<div className={style.online_users}>
						<div className={style.head}>Online Members - 3</div>
						<div className={style.online_user}>
							<img src={img} alt="" />
							<div className={style.username}>{userName}</div>
						</div>
						<div className={style.online_user}>
							<img src={img} alt="" />
							<div className={style.username}>{userName}</div>
						</div>
						<div className={style.online_user}>
							<img src={img} alt="" />
							<div className={style.username}>{userName}</div>
						</div>
					</div>

					<div className={style.offline_users}>
						<div className={style.head}>Offline Members - 2</div>
						<div className={style.offline_user}>
							<img src={img} alt="" />
							<div className={style.username}>{userName}</div>
						</div>
						<div className={style.offline_user}>
							<img src={img} alt="" />
							<div className={style.username}>{userName}</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	</section>
</div>;

{
	/* {getAllServers} */
}
{
	/* {Object.keys(servers).map((item, index) => {
            console.log(index, item)
        })}
        <Link to="/server1"><img src={img} alt="" /></Link> */
}
{
	/* {serversObj} */
}
