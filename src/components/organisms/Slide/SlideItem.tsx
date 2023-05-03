import React from "react";
import { motion, Variants } from "framer-motion";
import styled from "styled-components";
import { detailAPI } from "../../../api/Apis";
import { useButtonOpacity } from "../../../utils/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IResult } from "../../../interface/Interface";
import Loading from "../../atoms/Loading/Loading";
import { IDetail } from "../../../lib/Atoms";
import SlideButtonBox from "../../molecules/Slide/SlideItemButtonBox";
import SlideInfoBox from "../../molecules/Slide/SlideItemInfoBox";
import SlideTagBox from "../../molecules/Slide/SlideItemTagBox";
import SlideBannerImage from "../../molecules/Slide/SlideItemBannerImage";

const contentVariants: Variants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.4,
    zIndex: 1,
    y: -70,
    transition: {
      type: "tween",
      delay: 0.5,
      duration: 0.15,
    },
  },
};

const infoVariants: Variants = {
  hover: {
    display: "block",
    transition: {
      type: "tween",
      delay: 0.5,
      duration: 0.15,
    },
  },
};

const SlideItem: React.FC<IResult> = ({ id, title, name, backdrop_path, poster_path, media_type, category }) => {
  const { setButtonOpacity, setButtonOpacityAfterDelay, setButtonOpacityAfterDelayInvalidation } = useButtonOpacity();
  const queryClient = useQueryClient();

  const queryKey = ["detail", title || name];
  const queryFn = () => detailAPI({ id, media_type });
  const dataOption = { cacheTime: 360000, staleTime: 360000 };

  const { data, isLoading, isError } = useQuery<IDetail | undefined>(queryKey, queryFn, {
    enabled: false,
    ...dataOption,
  });

  const onMouseEnterHandler = async () => {
    await queryClient.fetchQuery(queryKey, queryFn, dataOption);
    setButtonOpacityAfterDelay(0);
  };
  const onMouseLeaveHandler = () => {
    setButtonOpacityAfterDelayInvalidation();
    setButtonOpacity(1);
  };

  return (
    <SlideContent
      layoutId={category + id}
      variants={contentVariants}
      whileHover="hover"
      initial="normal"
      transition={{ type: "tween" }}
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
    >
      <SlideBannerImage backdrop={backdrop_path} poster={poster_path} title={title} name={name} />
      <SlideCaption variants={infoVariants}>
        {isLoading ? (
          <Loading />
        ) : isError ? (
          <div>에러</div>
        ) : (
          <React.Fragment>
            <SlideButtonBox {...(data as IDetail)} media_type={media_type} category={category} />
            <SlideInfoBox {...(data as IDetail)} />
            <SlideTagBox genres={data?.genres ?? []} />
          </React.Fragment>
        )}
      </SlideCaption>
    </SlideContent>
  );
};

export default SlideItem;

const SlideContent = styled(motion.div)`
  width: calc(100% / 8.2);
  &:nth-child(2) {
    transform-origin: center left !important;
  }
  &:nth-child(7) {
    transform-origin: center right !important;
  }
`;

const SlideCaption = styled(motion.div)`
  padding: 1.5rem;
  background-color: ${(props) => props.theme.black.veryDark};
  display: none;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  margin-top: -0.1rem;
`;
