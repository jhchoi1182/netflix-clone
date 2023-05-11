import { Variants, motion } from "framer-motion";
import React, { useState } from "react";
import styled from "styled-components";
import { IContent } from "../../../interface/Interface";
import { ItemCaptionWrapper } from "../../atoms/Layout/Item/ItemCaptionLayouts";
import { ButtonBox, ImageBanner, InfoBox, TagBox } from "../../molecules/Item";

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
    opacity: 1,
    pointerEvents: "auto",
    transition: {
      type: "tween",
      delay: 0.5,
      duration: 0.15,
    },
  },
};

const BookmarkItem: React.FC<IContent> = ({ ...data }) => {
  const { title, name, backdrop_path, poster_path } = data;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <HoverBigScaleContainer
      variants={contentVariants}
      whileHover={isHovered ? "hover" : "normal"}
      initial="normal"
      transition={{ type: "tween" }}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ImageBanner
        onMouseEnter={() => setIsHovered(true)}
        backdrop={backdrop_path}
        poster={poster_path}
        title={title}
        name={name}
      />
      <ItemCaptionWrapper variants={infoVariants}>
        <ButtonBox {...data} />
        <InfoBox {...data} />
        <TagBox genres={data?.genres} />
      </ItemCaptionWrapper>
    </HoverBigScaleContainer>
  );
};

export default BookmarkItem;

const HoverBigScaleContainer = styled(motion.div)`
  margin-bottom: -129px;
  &:nth-child(6n + 1) {
    transform-origin: center left;
  }
  &:nth-child(6n) {
    transform-origin: center right;
  }
`;
