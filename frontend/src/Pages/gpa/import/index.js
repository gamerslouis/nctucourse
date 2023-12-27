import React, { useState, useRef, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import { parse } from "../../../Util/dataUtil/gpa";
import {
  Container,
  Paper,
  Typography,
  useTheme,
  Link,
  Box,
  FormControlLabel,
  Switch,
} from "@material-ui/core";
import { useSnackbar } from "notistack";
import gpa_teach1 from "../../../Resources/gpa_teach1.png";
import gpa_teach2 from "../../../Resources/gpa_teach2.png";
import FullLoading from "../../../Components/FullLoading";
import CourseTable from "./CourseTable";
import useAxios from "axios-hooks";
import { makeKey, shouldMerge } from "./utils";
import axios from "axios";

const convertCourseToMap = (courses) => {
  const dict = {};
  courses.forEach((course) => {
    dict[makeKey(course)] = course;
  });
  return dict;
};

export default (props) => {
  const myRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [parsedCourses, setParsedCources] = useState(null);
  const [toRemoveCourses, setToRemoveCourses] = useState(null);
  const [mergeOldData, setMergeOldData] = useState(true);
  const [{ data: respData, loading: fetching, error }] = useAxios(
    "/api/accounts/courses_history/"
  );
  useEffect(() => {
    if (!fetching && error) {
      enqueueSnackbar("載入舊資料失敗!(網路錯誤)", { variant: "error" });
    }
  }, [fetching, error, enqueueSnackbar]);

  if (fetching) {
    return <FullLoading />;
  }
  if (error) {
    return <></>;
  }
  const oldCourses = convertCourseToMap(JSON.parse(respData.data));
  return (
    <Container>
      {loading && <FullLoading />}
      <Paper style={{ padding: theme.spacing(5) }}>
        <div style={{ marginBottom: theme.spacing(3) }}>
          <Typography variant="h5" gutterBottom>
            匯入歷年課程
          </Typography>
          <Typography>
            1. 登入交大註冊組{" "}
            <Link href="https://regist.nycu.edu.tw/" target="_blank">
              學籍成績系統
            </Link>
            <br />
            2. 點選「歷年成績查詢」按鈕 (
            <Link href={gpa_teach1} target="_blank">
              範例
            </Link>
            )<br />
            3. 全選 (ctrl+a) 成績內容，並複製貼至下方表單 (
            <Link href={gpa_teach2} target="_blank">
              範例
            </Link>
            )<br />
          </Typography>
          <Typography variant="caption">
            註:學校新制度下，不公告各科目具體成績，僅公告等第制成績。在系統內將以"無資料"標記。
          </Typography>
          <br />
          <Typography variant="caption">
            註:建議使用 Chrome 或 FireFox，如用 IE
            會複製到其他字元造成匯入失敗。
          </Typography>
        </div>
        <div style={{ marginBottom: theme.spacing(1) }}>
          <FormControl fullWidth>
            <TextField
              multiline
              variant="outlined"
              rows={12}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </FormControl>
        </div>
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              let data;
              try {
                if (text === "") throw Error;
                data = parse(text);
                if (data.length === 0) throw Error;
              } catch (e) {
                enqueueSnackbar("無效的成績紀錄!", { variant: "error" });
                return;
              }
              setParsedCources(data);
              const keys = data.map(makeKey);
              setToRemoveCourses(
                JSON.parse(respData.data).filter((record) =>
                  !keys.includes(makeKey(record))
                )
              );

              setTimeout(
                () =>
                  myRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  }),
                0
              );
            }}
          >
            解析
          </Button>
        </div>
      </Paper>
      {parsedCourses !== null && (
        <Paper
          ref={myRef}
          style={{ marginTop: theme.spacing(3), padding: theme.spacing(5) }}
          id="anchor"
        >
          <Typography variant="h5" gutterBottom>
            即將匯入
          </Typography>
          {Object.keys(oldCourses).length > 0 && (
            <FormControlLabel
              control={
                <Switch
                  name="checkedA"
                  checked={mergeOldData}
                  onChange={(event, value) => setMergeOldData(value)}
                />
              }
              label="合併已匯入分數資料(若不合併，舊有分數資料將直接被刪除覆蓋)"
            />
          )}
          <CourseTable
            courses={parsedCourses}
            oldCourses={oldCourses}
            merge={Object.keys(oldCourses).length > 0 && mergeOldData}
          ></CourseTable>
          <Box marginTop={3}>
            <Typography variant="h5" gutterBottom>
              即將移除
            </Typography>
            <CourseTable courses={toRemoveCourses}></CourseTable>
          </Box>
          <Box marginTop={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                if (
                  !window.confirm("本平台提供之結果僅供參考，不保證其正確性。")
                )
                  return;
                setLoading(true);
                let uploadData = [];
                if (Object.keys(oldCourses).length > 0 && mergeOldData) {
                  uploadData = parsedCourses.map((course) => ({
                    ...course,
                    score: shouldMerge(course, oldCourses)
                      ? oldCourses[makeKey(course)].score
                      : course.score,
                    scoreType: shouldMerge(course, oldCourses)
                      ? oldCourses[makeKey(course)].scoreType
                      : course.scoreType,
                  }));
                } else {
                  uploadData = [...parsedCourses];
                }
                setLoading(false);
                axios
                  .post("/api/accounts/courses_history/", {
                    data: JSON.stringify(uploadData),
                  })
                  .then((res) => {
                    enqueueSnackbar("上傳成功", { variant: "success" });
                    const redir = new URLSearchParams(
                      window.location.search
                    ).get("redir");
                    if (redir) window.location.href = `/${redir}`;
                    else window.location.href = "/";
                  })
                  .catch((err) => {
                    setLoading(false);
                    enqueueSnackbar("上傳失敗", { variant: "error" });
                  });
              }}
            >
              送出
            </Button>
          </Box>
        </Paper>
      )}
    </Container>
  );
};
