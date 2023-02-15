import {
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    IconButton,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@material-ui/core";
import useAxios from "axios-hooks";
import React, { useCallback, useEffect, useState } from "react";
import { getCourseTimesAndRooms } from "../../../Util/dataUtil/course";
import { DownloadAsImage } from "../../../Util/dataUtil/imageExport";
import { ConvertToNewCode, newSecs, secs, timeCode } from "../../../Util/style";
import { themes } from "./theme";
import { FileCopy } from "@material-ui/icons";
import { withSnackbar } from "notistack";
import axios from "axios";
import { copyToClipboard } from "../../../Util/utils";

const toText = (sem) => {
    let s = sem[sem.length - 1];
    let mapp = { 1: "上學期", 2: "下學期", X: "暑期" };
    return `${sem.substr(0, 3)}學年度${mapp[s]}`;
};

function detectMob() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i,
    ];

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

const FormRow = ({ title, children, dense, fullWidth, caption }) => {
    return (
        <div style={{ marginBottom: dense ? 5 : 20 }}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                }}
            >
                <span style={{ whiteSpace: "nowrap" }}>{title}</span>
                <div style={{ flexGrow: fullWidth ? 1 : 0 }}>{children}</div>
            </div>
            {caption && (
                <Typography
                    variant="caption"
                    color="textSecondary"
                    component="div"
                >
                    {caption}
                </Typography>
            )}
        </div>
    );
};

const PositiveValidatedTextField = ({ value, onChange, ...props }) => {
    const [localValue, setLocalValue] = useState(value);
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const [errorMessage, setErrorMessage] = React.useState("");
    const handleChange = useCallback(
        (e) => {
            setLocalValue(e.target.value);
            if (/^\d+$/.test(e.target.value)) {
                onChange(Number(e.target.value));
                setErrorMessage("");
            } else {
                setErrorMessage("無效數值");
            }
        },
        [setLocalValue, onChange, setErrorMessage]
    );

    return (
        <TextField
            {...props}
            value={localValue}
            onChange={handleChange}
            error={errorMessage !== ""}
            helperText={errorMessage}
        />
    );
};

const ExtendedCheckbox = ({ code, values, useNewCode, setValues }) => {
    return (
        <FormControlLabel
            control={
                <Checkbox
                    checked={values[code]}
                    onChange={(e) => {
                        setValues({
                            ...values,
                            [code]: e.target.checked,
                        });
                    }}
                />
            }
            label={useNewCode ? ConvertToNewCode(code) : code}
            labelPlacement="end"
        />
    );
};

let lastAppliedTheme = null;

const Setting = ({
    handleConfigChange,
    allCourses,
    courseIds,
    enqueueSnackbar,
}) => {
    let url = `/api/simulation/semesters/`;
    const [{ data, loading, error }] = useAxios(url);
    const [selectSemester, setSelectSemester] = useState("");
    const [tableWidth, setTableWidth] = useState(414);
    const [tableHeight, setTableHeight] = useState(818);
    const [enableNotchFix, setEnableNotchFix] = useState(false);
    const [notchHeight, setNotchHeight] = useState(44);
    const [selectTheme, setSelectTheme] = useState(0);
    const [fontSize, setFontSize] = useState(12);
    const [showTeacher, setShowTeacher] = useState(false);
    const [showRoom, setShowRoom] = useState(true);
    const [showRoomCode, setShowRoomCode] = useState(false);
    const [useOldTimeCode, setUseOldTimeCode] = useState(false);
    const [extendTimetable, setExtendTimetable] = useState({
        M: false,
        N: false,
        X: false,
        Y: false,
        I: false,
        J: false,
        K: false,
        L: false,
        六: false,
        日: false,
    });
    const [showThemeConfig, setShowThemeConfig] = useState(false);
    const [userTheme, setUserTheme] = useState(
        JSON.stringify(themes[0], null, 4)
    );
    const [invalidUserTheme, setInvalidUserTheme] = useState(false);
    const [allowShareUserTheme, setAllowShareUserTheme] = useState(true);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        if (!loading && !error) {
            setSelectSemester(data[data.length - 1]);
        }
    }, [loading, error, data]);

    const handleSetScreenSizeClick = useCallback(() => {
        setTableWidth(window.screen.width);
        setTableHeight(window.screen.height);
    }, [setTableWidth, setTableHeight]);

    useEffect(() => {
        if (detectMob()) {
            handleSetScreenSizeClick();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (selectSemester !== "") {
            let theme;
            if (selectTheme === -1) {
                try {
                    theme = JSON.parse(userTheme);
                    theme = {
                        ...themes[0],
                        ...theme,
                        courseBackgroundColor: {
                            ...themes[0].courseBackgroundColor,
                            ...theme?.courseBackgroundColor,
                        },
                    };
                    setInvalidUserTheme(false);
                } catch (e) {
                    theme = lastAppliedTheme;
                    setInvalidUserTheme(true);
                }
            } else {
                setInvalidUserTheme(false);
                theme = themes[selectTheme];
            }
            lastAppliedTheme = theme;

            handleConfigChange({
                semester: selectSemester,
                tableWidth: tableWidth,
                tableHeight: tableHeight,
                notchHeight: enableNotchFix ? notchHeight : 0,
                showTeacher: showTeacher,
                showRoom: showRoom,
                showRoomCode: showRoomCode,
                newTimeCode: !useOldTimeCode,
                extendTimetable: extendTimetable,
                fontSize: fontSize + 11,
                tableTheme: theme,
                exporting: exporting,
            });
        }
    }, [
        handleConfigChange,
        selectSemester,
        tableWidth,
        tableHeight,
        enableNotchFix,
        notchHeight,
        selectTheme,
        showTeacher,
        showRoom,
        showRoomCode,
        useOldTimeCode,
        extendTimetable,
        fontSize,
        userTheme,
        exporting,
    ]);

    useEffect(() => {
        if (courseIds && courseIds.size > 0 && selectSemester !== "") {
            const requiredTimes = {};
            for (let course of Array.from(courseIds).map(
                (id) => allCourses[id]
            )) {
                let times = getCourseTimesAndRooms(course);
                for (let time of times) {
                    const exKeys = Object.keys(extendTimetable);
                    if (exKeys.indexOf(timeCode[time[0] - 1]) !== -1) {
                        requiredTimes[timeCode[time[0] - 1]] = true;
                    }
                    if (exKeys.indexOf(time[1]) !== -1) {
                        requiredTimes[time[1]] = true;
                    }
                }
            }
            setExtendTimetable({
                ...extendTimetable,
                ...requiredTimes,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allCourses, courseIds, selectSemester]);

    const handleUserThemeChange = useCallback(
        (event) => {
            setSelectTheme(-1);
            setUserTheme(event.target.value);
        },
        [setSelectTheme, setUserTheme]
    );

    const handleCopyClick = useCallback(() => {
        copyToClipboard(userTheme);
        enqueueSnackbar("已複製到剪貼簿", { variant: "success" });
    }, [userTheme, enqueueSnackbar]);

    return (
        <div style={{ padding: 20 }}>
            <Typography variant="caption" color="textSecondary" component="div">
                無法處理重複選修，請先在模擬排課頁面處理好重複選修的課程
                <br />
                目前尚無法保存設定，重新整理後設定會消失
            </Typography>
            <FormRow title="學期:">
                <Select
                    value={selectSemester}
                    onChange={(e) => setSelectSemester(e.target.value)}
                >
                    {data &&
                        data.map((sem) => (
                            <MenuItem value={sem} key={sem}>
                                {toText(sem)}
                            </MenuItem>
                        ))}
                </Select>
            </FormRow>
            <FormRow
                title="尺寸:"
                caption={
                    '"使用當前設備大小"可以直接將課表大小設置為手機螢幕大小，可以直接用於手機桌布。'
                }
            >
                <div
                    style={{
                        display: "flex",
                        gap: "5px",
                        flexWrap: "wrap",
                        marginBottom: 10,
                    }}
                >
                    <PositiveValidatedTextField
                        style={{ width: "6rem" }}
                        variant="outlined"
                        label="寬"
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                        size="small"
                        value={tableWidth}
                        onChange={setTableWidth}
                    />
                    <PositiveValidatedTextField
                        style={{ width: "6rem" }}
                        variant="outlined"
                        label="高"
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                        size="small"
                        value={tableHeight}
                        onChange={setTableHeight}
                    />
                    <Button
                        variant="outlined"
                        style={{ whiteSpace: "nowrap" }}
                        size="small"
                        onClick={handleSetScreenSizeClick}
                    >
                        使用當前設備大小
                    </Button>
                    <Typography
                        variant="caption"
                        color="textSecondary"
                    ></Typography>
                </div>
            </FormRow>
            <FormRow
                title="瀏海修正:"
                caption="避免匯出的課表被iPhone等手機的挖孔螢幕遮住"
            >
                <div>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={enableNotchFix}
                                onChange={() =>
                                    setEnableNotchFix(!enableNotchFix)
                                }
                            />
                        }
                    />
                    <PositiveValidatedTextField
                        style={{ width: "6rem" }}
                        variant="outlined"
                        label="瀏海高度"
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                        size="small"
                        disabled={!enableNotchFix}
                        value={notchHeight}
                        onChange={setNotchHeight}
                    />
                </div>
                <Typography
                    variant="caption"
                    color="textSecondary"
                ></Typography>
            </FormRow>
            <FormRow title="主題:">
                <Select
                    value={selectTheme}
                    onChange={(e) => {
                        setSelectTheme(e.target.value);
                        if (e.target.value === -1) {
                            setShowThemeConfig(true);
                        }
                    }}
                >
                    {themes.map((theme, i) => (
                        <MenuItem value={i} key={i}>
                            {theme.name}
                        </MenuItem>
                    ))}
                    <MenuItem value={-1} key="自訂主題">
                        自訂主題
                    </MenuItem>
                </Select>
            </FormRow>
            <FormRow title="顯示主題配置:" dense>
                <Checkbox
                    checked={showThemeConfig}
                    onChange={() => setShowThemeConfig(!showThemeConfig)}
                />
                {showThemeConfig && (
                    <IconButton onClick={handleCopyClick}>
                        <FileCopy />
                    </IconButton>
                )}
            </FormRow>
            {showThemeConfig && (
                <FormRow fullWidth>
                    <TextField
                        error={invalidUserTheme}
                        helperText={
                            invalidUserTheme ? "無效的主題格式" : undefined
                        }
                        multiline
                        rows={15}
                        variant="outlined"
                        fullWidth
                        onChange={handleUserThemeChange}
                        value={
                            selectTheme === -1
                                ? userTheme
                                : JSON.stringify(themes[selectTheme], null, 4)
                        }
                    />
                </FormRow>
            )}
            <FormRow title="字體大小:" dense>
                <PositiveValidatedTextField
                    style={{ width: "6rem" }}
                    variant="outlined"
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    size="small"
                    value={fontSize}
                    onChange={setFontSize}
                />
            </FormRow>
            <FormRow title="顯示授課教師:" dense>
                <Checkbox
                    checked={showTeacher}
                    onChange={() => setShowTeacher(!showTeacher)}
                />
            </FormRow>
            <FormRow title="顯示教室:" dense>
                <Checkbox
                    checked={showRoom}
                    onChange={() => setShowRoom(!showRoom)}
                />
            </FormRow>
            <FormRow title="顯示教室代碼:" dense>
                <Checkbox
                    checked={showRoomCode}
                    onChange={() => setShowRoomCode(!showRoomCode)}
                />
            </FormRow>
            <FormRow
                title="擴展課表:"
                caption={`為了整體課表美觀，部分不常用的時間段如午餐時間已經隱藏，可以透過該項設定顯示特定時間段。
                    完整時間表為 ${(useOldTimeCode ? secs : newSecs).join(
                        ","
                    )}`}
            >
                <FormGroup aria-label="position" row>
                    {["M", "N", "X", "Y", "I", "J", "K", "L", "六", "日"].map(
                        (code) => (
                            <ExtendedCheckbox
                                key={code}
                                code={code}
                                values={extendTimetable}
                                setValues={setExtendTimetable}
                                useNewCode={!useOldTimeCode}
                            />
                        )
                    )}
                </FormGroup>
                <Typography
                    variant="caption"
                    color="textSecondary"
                ></Typography>
            </FormRow>
            <FormRow title="使用舊版時間代碼:" dense>
                <Checkbox
                    checked={useOldTimeCode}
                    onChange={() => setUseOldTimeCode(!useOldTimeCode)}
                />
            </FormRow>
            {selectTheme === -1 && (
                <FormRow
                    title="允許匯出時分享該自定義:"
                    caption="允許課程助理系統保存該自定義主題，並可能將其作為預設主題，以供其他人使用。"
                >
                    <div>
                        <Checkbox
                            checked={allowShareUserTheme}
                            onChange={() =>
                                setAllowShareUserTheme(!allowShareUserTheme)
                            }
                        />
                    </div>
                </FormRow>
            )}
            <FormRow fullWidth>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ width: "8rem" }}
                        onClick={() => {
                            if (invalidUserTheme) {
                                enqueueSnackbar("無效的主題格式", "error");
                            } else {
                                setExporting(true);
                                axios.post(
                                    "/api/simulation/export/collect_theme/",
                                    {
                                        theme:
                                            selectTheme === -1
                                                ? allowShareUserTheme
                                                    ? JSON.stringify(
                                                          JSON.parse(userTheme)
                                                      )
                                                    : "private"
                                                : selectTheme.toString(),
                                    }
                                );
                                setTimeout(() => {
                                    DownloadAsImage(
                                        document.getElementById("table"),
                                        () => setExporting(false),
                                        ()=>{enqueueSnackbar("IOS匯出失敗，請稍後或重新整理後再嘗試。", "error")}
                                    );
                                }, 500);
                            }
                        }}
                    >
                        匯出
                    </Button>
                </div>
            </FormRow>
            <Typography variant="caption" color="textSecondary">
                目前該服務正處於測試階段，匯出的圖片可能會有跑板等問題，歡迎透過右下角"意見回饋"按鈕回報。
                <br />
                在iPhone等手機，以及firefox等部分瀏覽器中，如果匯出的圖片跑板，請嘗試將設定參數於電腦的Chrome或Edge瀏覽器匯出，可能可以得到正常的結果。
            </Typography>
        </div>
    );
};

export default withSnackbar(Setting);
