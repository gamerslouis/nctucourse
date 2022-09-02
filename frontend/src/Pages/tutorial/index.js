import React from "react";
import { Container, Paper, Typography, useTheme } from "@material-ui/core";
import styled from "styled-components";

import p1 from "./p1.PNG";
import p2 from "./p2.PNG";
import p3 from "./p3.PNG";
import p4 from "./p4.PNG";
import p5 from "./p5.PNG";
import p6 from "./p6.PNG";
import p7 from "./p7.PNG";
import p8 from "./p8.png";

const Image = styled.img`
  max-width: 100%;
`;

const Divider = styled.div`
  width: 100%;
  height: 100px;
`;

const TutorialPage = () => {
  const theme = useTheme();
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        使用介紹
      </Typography>
      <Paper style={{ padding: theme.spacing(2) }}>
        <Typography variant="h5" gutterBottom>
          登入
        </Typography>
        <Image src={p1} />
        <Image src={p2} />
        <Divider />
        <Typography variant="h5" gutterBottom>
          模擬排課
        </Typography>
        <Image src={p3} />
        <Image src={p4} />
        <Divider />
        <Typography variant="h5" gutterBottom>
          修課紀錄、GPA計算機
        </Typography>
        <Image src={p5} />
        <Image src={p6} />
        <Image src={p7} />
        <Divider />
        <Typography variant="h5" gutterBottom>
          學分模擬器
        </Typography>
        <Image src={p8} />
      </Paper>
    </Container>
  );
};

export default TutorialPage;
