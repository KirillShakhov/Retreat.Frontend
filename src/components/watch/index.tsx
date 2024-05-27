import {FC, useEffect} from "react";
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate, useSearchParams} from "react-router-dom";
import ReactPlayer from "react-player";
import {IconPack} from "../../icons";
import IconButton from "../../ui/icon-button";

const Watch: FC = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const url = searchParams.get("url");

	const close = () => {
		navigate(`/`, {replace: true});
	}

	useEffect(()=>{
		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = originalOverflow;
		};	});

	return <>
		<div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'black'}}>
			{url && <ReactPlayer url={url} playing={true} controls={true} width='100%' height='100%'/>}
			<div style={{position: 'absolute', top: 10, right: 10}}>
				<IconButton
					Icon={IconPack.Cross}
					fill={'#fff'}
					stroke={'#fff'}
					onClick={() => {
						close();
					}}
					style={{backgroundColor: "rgba(255,255,255,0.1)", width: 40, height: 40, padding: 5}}
				/>
			</div>
		</div>
	</>;
};

export default Watch;
