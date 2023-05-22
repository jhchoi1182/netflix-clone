import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Wrapper } from "../atoms/Layout";
import { BannerCoverImage } from "../atoms/UI/BannerCoverImage";
import { posterAPI } from "../../api/Apis";
import MainBanner from "../organisms/MainBanner/MainBanner";
import SlideContainer from "../atoms/Slide/SlideContainer";
import { AnimatePresence } from "framer-motion";
import DetailModalContainer from "../templates/DetailModal/DetailModalContainer";
import styled from "styled-components";
import { font } from "../../styles/Fonts";
import { useLocalWithDummy, useQueryWithDummy, useRenderSlide } from "../../utils/Hooks";
import Loadingspinner from "../molecules/Loading/Loadingspinner";

const Tv = () => {
  const { pathnameId } = useParams();
  const { PopularTv, TopRateTV, OnTheAirTV, AiringTodayTV } = useQueryWithDummy();
  const favoriteTvCopyWithDummy = useLocalWithDummy("tv");

  const { data: popular, isLoading: PopularTvLoading } = PopularTv;

  const backgroundImg = popular?.results[1]?.backdrop_path ?? popular?.results[1]?.poster_path;
  const id = popular?.results[1]?.id ?? 0;

  const slides = [
    { ref: useRef(null), title: "지금 뜨고 있는 시리즈", category: "popular", type: "tv", data: PopularTv },
    { ref: useRef(null), title: "평단의 찬사를 받은 시리즈", category: "top_rated", type: "tv", data: TopRateTV },
    { ref: useRef(null), title: "지금 방영 중인 시리즈", category: "nowPlaying", type: "tv", data: OnTheAirTV },
    { ref: useRef(null), title: "오늘 방영 예정인 시리즈", category: "upcoming", type: "tv", data: AiringTodayTV },
    {
      ref: useRef(null),
      title: "내가 찜한 시리즈",
      category: "favoriteTv",
      type: "tv",
      bookmarkdata: favoriteTvCopyWithDummy,
    },
  ];

  const renderSlide = useRenderSlide(slides);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return PopularTvLoading ? (
    <Loadingspinner />
  ) : (
    <Wrapper>
      <BannerCoverImage bgimg={posterAPI(backgroundImg)}>
        <TabLabel>시리즈</TabLabel>
        <MainBanner id={id} media_type={"tv"} category="popular" />
      </BannerCoverImage>
      <SlideContainer marginTop="-7rem">{renderSlide}</SlideContainer>
      <AnimatePresence>{pathnameId && <DetailModalContainer pathnameId={pathnameId} />}</AnimatePresence>
    </Wrapper>
  );
};

export default Tv;

const TabLabel = styled.div`
  padding: 75px 60px 0;
  ${font.page_title}
`;
