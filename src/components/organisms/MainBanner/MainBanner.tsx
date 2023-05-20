import React from "react";
import styled from "styled-components";
import { detailAPI } from "../../../api/Apis";
import { useQuery } from "@tanstack/react-query";
import { IContent } from "../../../interface/Interface";
import * as Button from "../../molecules/Button/RectangleButton";
import { ChildrenProps } from "../../../interface/type";
import { useTooltip } from "../../../utils/Hooks";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { detailSelector } from "../../../lib/atoms";
import { categoryAtom } from "../../../lib/atoms";
import { font } from "../../../styles/Fonts";

export type MainBannerProps = {
  id: number;
  media_type: "movie" | "tv";
  category: string;
};

const MainBanner: React.FC<MainBannerProps> & {
  Wrapper: React.FC<ChildrenProps>;
  Title: React.FC<ChildrenProps>;
  Overview: React.FC<ChildrenProps>;
} = ({ id, media_type, category }) => {
  const { isHovered, showTooltipHandler, disappearTooltipHandler, renderTooltip } = useTooltip();
  const setHoveredCategory = useSetRecoilState(categoryAtom);
  const setDetail = useSetRecoilState(detailSelector);
  const navigate = useNavigate();
  const { data, isError } = useQuery<IContent | undefined>(["bannerDetail", id], () => detailAPI({ id, media_type }));
  const { title, name, overview } = data || {};

  /** 상세 정보 모달 띄우기 */
  const showDetailHandler = () => {
    if (data) {
      setHoveredCategory(category);
      setDetail(data);
      navigate(`${id}`);
    }
  };

  return (
    <MainBanner.Wrapper>
      {isError ? (
        <div>에러</div>
      ) : (
        <React.Fragment>
          <MainBanner.Title>{title ?? name}</MainBanner.Title>
          <MainBanner.Overview>{overview}</MainBanner.Overview>
          <ButtonBox>
            <Button.Play
              data-tooltip-text="지원하지 않는 기능입니다."
              onClick={(event) => showTooltipHandler({ top: 610, x: -8, size: "detailTooltip" }, event)}
              onMouseLeave={disappearTooltipHandler}
              buttonSize="mainButton"
            />
            <Button.Detail onClick={showDetailHandler} buttonSize="mainButton" />
          </ButtonBox>
        </React.Fragment>
      )}
      {isHovered && renderTooltip()}
    </MainBanner.Wrapper>
  );
};

export default MainBanner;

MainBanner.Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100vh;
  padding: 60px;
  @media (max-width: 1099px) {
    height: 80vh;
    padding: 50px;
  }
  @media (max-width: 799px) {
    padding: 40px;
  }
  @media (max-width: 499px) {
    height: 75vh;
    padding: 30px;
  }
`;

MainBanner.Title = styled.h2`
  ${font.RL_title}
  margin-bottom: 2.3rem;
  width: 37%;
`;

MainBanner.Overview = styled.p`
  ${font.L_overview}
  width: 37%;
`;

const ButtonBox = styled.div`
  display: flex;
  gap: 1.4rem;
  margin-top: 3.2rem;
  margin-bottom: 19rem;
`;
