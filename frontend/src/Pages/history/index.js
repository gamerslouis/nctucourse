import React from "react";
import { Container, Typography, Link } from "@material-ui/core";
import semesterMap from '../../Util/semesterMap'

const HistoryLink = (props) => (
  <div style={{marginTop:5}}>
    <Link
      style={{textDecoration:"none"}}
      variant="body2"
      href={props.href}
    >
      {props.text}
    </Link>

  </div>
)

const History = (props) => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        歷年課程
      </Typography>
      <HistoryLink text={semesterMap['1091']} href="/simulation?sem=1091" />
    </Container>
  );
};

export default History;
