import {FC} from "react";
import 'react-toastify/dist/ReactToastify.css';
import {useSearchParams} from "react-router-dom";
import ReactPlayer from "react-player";
import './watch.css';

const Watch: FC = () => {
	const [searchParams] = useSearchParams();
	const url = searchParams.get("url");

	return <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'black'}}>
		{url && <ReactPlayer url={url} playing={true} controls={true} width='100%' height='100%'/>}
	</div>;
};

export default Watch;
