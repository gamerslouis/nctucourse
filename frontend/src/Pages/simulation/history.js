import React from "react";
import { Container, Typography, Link } from "@material-ui/core";
import useAxios from 'axios-hooks'

const HistoryLink = (props) => (
  <div style={{ marginTop: 5 }}>
    <Link
      style={{ textDecoration: "none" }}
      variant="body2"
      href={props.href}
    >
      {props.text}
    </Link>

  </div>
)

const toText = sem => {
  let s = sem[sem.length - 1]
  let mapp = { '1': '上學期', '2': '下學期', 'X': '暑期' }
  return`${sem}學年度${mapp[s]}`
}

const History = (props) => {
  let url = `/api/simulation/semesters/`
  const [{ data, loading, error }, refetch] = useAxios(url)

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        歷年課程
      </Typography>
      {
        data && (
          data.map(sem => (
            <HistoryLink text={toText(sem)} href={`/simulation?sem=${sem}`} />
          ))
        )
      }
    </Container>
  );
};

export default History;
