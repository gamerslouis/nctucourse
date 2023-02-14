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

const FormRow = ({ title, children, dense, fullWidth }) => {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: dense ? 5 : 20,
            }}
        >
            <span style={{ whiteSpace: "nowrap" }}>{title}</span>
            <div style={{ flexGrow: fullWidth ? 1 : 0 }}>{children}</div>
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
    enqueueSnack,
}) => {
    let url = `/api/simulation/semesters/`;
    const [{ data, loading, error }] = useAxios(url);
    const [selectSemester, setSelectSemester] = useState("");
    const [tableWidth, setTableWidth] = useState(414);
    const [tableHeight, setTableHeight] = useState(818);
    const [enableNotchFix, setEnableNotchFix] = useState(false);
    const [notchHeight, setNotchHeight] = useState(44);
    const [selectTheme, setSelectTheme] = useState(0);
    const [fontSize, setFontSize] = useState(14);
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
    const [userTheme, setUserTheme] = useState(themes[0]);
    const [invalidUserTheme, setInvalidUserTheme] = useState(false);

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
                fontSize: fontSize,
                tableTheme: theme,
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
        navigator.clipboard.writeText(userTheme);
        enqueueSnack("已複製到剪貼簿", { variant: "success" });
    }, [userTheme, enqueueSnack]);

    return (
        <div style={{ padding: 20 }}>
            <Typography variant="caption" color="textSecondary" component="div">
                無法處理重複選修，請先在模擬排課頁面處理好重複選修的課程
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
            <FormRow title="尺寸:">
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
                </div>
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
                        label="瀏海修正"
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
            </FormRow>
            <FormRow title="主題:">
                <Select
                    value={selectTheme}
                    onChange={(e) => setSelectTheme(e.target.value)}
                >
                    {themes.map((theme, i) => (
                        <MenuItem value={i} key={i}>{`主題${i + 1}`}</MenuItem>
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
                <Typography
                    variant="caption"
                    color="textSecondary"
                    component="div"
                >
                    最小值為 12。
                </Typography>
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
            <FormRow title="擴展課表:" dense>
                <FormGroup aria-label="position" row>
                    {["M", "N", "X", "Y", "I", "J", "K", "L", "六", "日"].map(
                        (code) => (
                            <ExtendedCheckbox
                                code={code}
                                values={extendTimetable}
                                setValues={setExtendTimetable}
                                useNewCode={!useOldTimeCode}
                            />
                        )
                    )}
                </FormGroup>
                <Typography variant="caption" color="textSecondary">
                    顯示擴展課表時，將會將課表寬度拉大，以顯示更多課程。
                    完整時間表為 {(useOldTimeCode ? secs : newSecs).join(",")}
                </Typography>
            </FormRow>
            <FormRow title="使用舊版時間代碼:" dense>
                <Checkbox
                    checked={useOldTimeCode}
                    onChange={() => setUseOldTimeCode(!useOldTimeCode)}
                />
            </FormRow>

            <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                    variant="contained"
                    color="primary"
                    style={{ width: "8rem" }}
                    onClick={() =>
                        DownloadAsImage(document.getElementById("table"))
                    }
                >
                    匯出
                </Button>
            </div>
        </div>
    );
};

export default withSnackbar(Setting);
