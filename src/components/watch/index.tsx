import {FC} from "react";
import 'react-toastify/dist/ReactToastify.css';
import {useParams} from "react-router-dom";

const Watch: FC = () => {
	const params= useParams()

	return <div>
		{params.id}
	</div>;
};

export default Watch;
