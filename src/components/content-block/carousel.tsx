import { Button } from "@base-ui/react/button";
import clsx from "clsx";
import { Heading } from "components/heading/heading";
import Icon from "components/icon/icon";
import RichText from "components/rich-text/rich-text";
import type { ContentBlockSlideResource } from "lib/heyapi";
import * as m from "lib/paraglide/messages";
import {
	type KeyboardEvent,
	type TouchEvent,
	useId,
	useRef,
	useState,
} from "react";

import style from "./carousel.module.scss";

const SWIPE_THRESHOLD = 50;

type Props = {
	slides: ContentBlockSlideResource[];
};

const Carousel = ({ slides }: Props) => {
	const [index, setIndex] = useState(0);
	const touchStartX = useRef<number | null>(null);
	const slidesId = useId();

	if (slides.length === 0) {
		return null;
	}

	const current = Math.min(index, slides.length - 1);

	const isFirst = current === 0;
	const isLast = current === slides.length - 1;
	const previous = () => setIndex(Math.max(current - 1, 0));
	const next = () => setIndex(Math.min(current + 1, slides.length - 1));

	const onKeyDown = (event: KeyboardEvent) => {
		if (event.key === "ArrowLeft") {
			event.preventDefault();
			previous();
		} else if (event.key === "ArrowRight") {
			event.preventDefault();
			next();
		}
	};

	const onTouchStart = (event: TouchEvent) => {
		touchStartX.current = event.touches[0]?.clientX ?? null;
	};

	const onTouchEnd = (event: TouchEvent) => {
		const startX = touchStartX.current;
		const endX = event.changedTouches[0]?.clientX;
		touchStartX.current = null;
		if (startX === null || endX === undefined) return;

		const distance = endX - startX;
		if (distance <= -SWIPE_THRESHOLD) next();
		if (distance >= SWIPE_THRESHOLD) previous();
	};

	return (
		<section
			className={style.carousel}
			aria-roledescription={m.elearning_block_carousel()}
			aria-label={m.elearning_block_carousel_label()}
		>
			<div className={style.stage}>
				<Button
					className={style.arrow}
					onClick={previous}
					disabled={isFirst}
					focusableWhenDisabled
					onKeyDown={onKeyDown}
					aria-controls={slidesId}
					aria-label={m.elearning_block_carousel_previous()}
				>
					<Icon name="arrow-left" size={24} />
				</Button>

				<div
					id={slidesId}
					className={style.slides}
					aria-live="polite"
					onTouchStart={onTouchStart}
					onTouchEnd={onTouchEnd}
				>
					{slides.map((slide, slideIndex) => (
						<div
							key={slide.id}
							className={clsx(
								style.slide,
								slideIndex !== current && style.inactive,
							)}
							// oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- the WAI-ARIA carousel pattern makes each slide a group; fieldset is for form controls
							role="group"
							aria-roledescription={m.elearning_block_carousel_slide()}
							aria-label={m.elearning_block_carousel_position({
								current: slideIndex + 1,
								total: slides.length,
							})}
						>
							<img className={style.image} src={slide.imageUrl} alt="" />
							<div className={style.text}>
								<Heading
									el="h2"
									size="20-24"
									weight="semibold"
									className={style.title}
								>
									<span className={style.number}>{slideIndex + 1}. </span>
									<span className={style.label}>{slide.title}</span>
								</Heading>
								<RichText html={slide.body} />
							</div>
						</div>
					))}
				</div>

				<Button
					className={style.arrow}
					onClick={next}
					disabled={isLast}
					focusableWhenDisabled
					onKeyDown={onKeyDown}
					aria-controls={slidesId}
					aria-label={m.elearning_block_carousel_next()}
				>
					<Icon name="arrow-right" size={24} />
				</Button>
			</div>

			<p aria-hidden="true">
				{current + 1}/{slides.length}
			</p>
		</section>
	);
};

export default Carousel;
