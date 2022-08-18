import styled from 'styled-components';
import { Box } from '@strapi/design-system/Box';
import { Flex } from '@strapi/design-system/Flex';

export const RelativeBox = styled(Box)`
  position: relative;
`;

export const Wrapper = styled.div`
  position: relative;
  text-align: center;
  background: repeating-conic-gradient(
      ${({ theme }) => theme.colors.neutral100} 0% 25%,
      transparent 0% 50%
    )
    50% / 20px 20px;

  svg {
    font-size: 3rem;
    height: ${264 / 16}rem;
  }

  img,
  video {
    margin: 0;
    padding: 0;
    min-width: 120px;
    min-height: 120px;
    max-height: ${264 / 16}rem;
    max-width: 100%;
  }
`;

export const ActionRow = styled(Flex)`
  height: ${52 / 16}rem;
  background-color: ${({ blurry }) => (blurry ? `rgba(33, 33, 52, 0.4)` : undefined)};
`;
