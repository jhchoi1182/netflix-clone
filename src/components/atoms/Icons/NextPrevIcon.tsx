import styled from "styled-components";

export interface ArrowProps {
  direction: "prev" | "next";
  isHovered?: boolean;
}

const nextArrow = "\u276F"; /** ❯ */
const prevArrow = "\u276E"; /** ❮ */

const Arrow: React.FC<ArrowProps> = ({ direction, isHovered }) => {
  const arrow = direction === "next" ? nextArrow : prevArrow;

  return <ArrowStyle className={isHovered ? "slide-hover" : "pagination-item"}>{arrow}</ArrowStyle>;
};

export default Arrow;

const ArrowStyle = styled.div`
  font-size: 3rem;
  color: ${(props) => props.theme.white.lighter};
  &:hover {
    font-size: 4rem;
  }
`;
