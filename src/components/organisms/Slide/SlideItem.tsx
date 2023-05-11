import React from "react";
import { motion, useAnimation, Variants } from "framer-motion";
import styled from "styled-components";
import { detailAPI } from "../../../api/Apis";
import { useButtonOpacity } from "../../../utils/Hooks/useButtonOpacity";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IContent } from "../../../interface/Interface";
import SlideItemCaptionSection from "../../atoms/Layout/SlideCaptionSection";
import ImageBanner from "../../molecules/Item/ImageBanner";
import ButtonBox from "../../molecules/Item/ButtonBox";
import InfoBox from "../../molecules/Item/InfoBox";
import TagBox from "../../molecules/Item/TagBox";
import SkeletonCaption from "../../molecules/Item/SkeletonCaption";

const contentVariants: Variants = {
  normal: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.4,
    y: -70,
    transition: {
      type: "tween",
      delay: 0.5,
      duration: 0.15,
    },
  },
};

const infoVariants: Variants = {
  normal: {
    opacity: 0,
    pointerEvents: "none",
  },
  hover: {
    opacity: 1,
    pointerEvents: "auto",
    transition: {
      type: "tween",
      delay: 0.5,
      duration: 0.15,
    },
  },
};

const SlideItem: React.FC<IContent> = ({ id, title, name, backdrop_path, poster_path, media_type, category }) => {
  const { setButtonOpacity, setButtonOpacityAfterDelay, setButtonOpacityAfterDelayInvalidation } = useButtonOpacity();
  const queryClient = useQueryClient();
  const control = useAnimation();

  const queryKey = ["detail", title || name];
  const queryFn = () => detailAPI({ id, media_type });
  const dataOption = { cacheTime: 360000, staleTime: 360000 };

  const { data, isError } = useQuery<IContent | undefined>(queryKey, queryFn, {
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
    control.start("normal");
  };

  const setButtonOpacityHandler = () => {
    setButtonOpacity(0);
  };

  return (
    <SlideContent
      layoutId={category + id}
      variants={contentVariants}
      animate={control}
      initial="normal"
      transition={{ type: "tween" }}
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
    >
      <ImageBanner
        onMouseEnter={() => control.start("hover")}
        backdrop={backdrop_path}
        poster={poster_path}
        title={title}
        name={name}
      />
      <SlideItemCaptionSection variants={infoVariants}>
        {isError ? (
          <div>에러</div>
        ) : data ? (
          <React.Fragment>
            <ButtonBox onMouseEnter={setButtonOpacityHandler} {...data} media_type={media_type} category={category} />
            <InfoBox {...data} />
            <TagBox genres={data?.genres} />
          </React.Fragment>
        ) : (
          <SkeletonCaption />
        )}
      </SlideItemCaptionSection>
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
