import style from "./chapter-number.module.scss";

type Props = {
	number: number;
};

const ChapterNumber = ({ number }: Props) => (
	<span className={style.number} aria-hidden="true">
		{number}
	</span>
);

export default ChapterNumber;
