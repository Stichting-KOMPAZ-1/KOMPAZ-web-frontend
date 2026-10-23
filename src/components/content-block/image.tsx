import style from "./image.module.scss";

type Props = {
	src: string | null;
};

const Image = ({ src }: Props) => {
	if (!src) {
		return null;
	}

	return <img className={style.image} src={src} alt="" />;
};

export default Image;
