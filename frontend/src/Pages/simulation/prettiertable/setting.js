import {
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    FormGroup,
    IconButton,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import {
    ConvertCourseType2StyleType,
    ConvertToNewCode,
    ConvertToNewCodeStr,
    ConvertToOldCodeStr,
    newSecs,
    secs,
} from "../../../Util/style";
import { themes } from "./theme";
import { Add, FileCopy } from "@material-ui/icons";
import { withSnackbar } from "notistack";
import { copyToClipboard } from "../../../Util/utils";
import { initTableOptions } from "./constants";
import { pick } from "lodash";

const toSemesterText = (sem) => {
    let s = sem[sem.length - 1];
    let mapp = { 1: "上學期", 2: "下學期", X: "暑期" };
    return `${sem.substr(0, 3)}學年度${mapp[s]}`;
};

function detectMobile() {
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

const CourseTypeEditor = ({
    allCourses,
    courseIds,
    courseTypeConfig,
    setCourseTypeConfig,
}) => {
    return (
        <Table style={{ width: "100%" }}>
            <TableHead>
                <TableRow>
                    <TableCell>課名</TableCell>
                    <TableCell style={{ width: "6rem" }}>預設類別</TableCell>
                    <TableCell>類別</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {Array.from(courseIds).map((courseId) => (
                    <TableRow key={courseId}>
                        <TableCell>{allCourses[courseId].cos_cname}</TableCell>
                        <TableCell>
                            {ConvertCourseType2StyleType(
                                allCourses[courseId].cos_type
                            )}
                        </TableCell>
                        <TableCell>
                            <Select
                                value={
                                    courseTypeConfig[courseId]
                                        ? courseTypeConfig[courseId]
                                        : ConvertCourseType2StyleType(
                                              allCourses[courseId].cos_type
                                          )
                                }
                                onChange={(e) => {
                                    if (
                                        e.target.value ===
                                        ConvertCourseType2StyleType(
                                            allCourses[courseId].cos_type
                                        )
                                    ) {
                                        let newC = { ...courseTypeConfig };
                                        delete newC[courseId];
                                        setCourseTypeConfig(newC);
                                    } else {
                                        setCourseTypeConfig({
                                            ...courseTypeConfig,
                                            [courseId]: e.target.value,
                                        });
                                    }
                                }}
                            >
                                {[
                                    "必修",
                                    "選修",
                                    "體育",
                                    "通識",
                                    "外語",
                                    "軍訓",
                                ].map((v) => (
                                    <MenuItem value={v} key={v}>
                                        {v}
                                    </MenuItem>
                                ))}
                            </Select>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

const UserAddCourseEditor = React.memo(
    ({ userAddCourseConfig, setUserAddCourseConfig }) => {
        return (
            <Table style={{ width: "100%" }}>
                <TableHead>
                    <TableRow>
                        <TableCell>項目說明</TableCell>
                        <TableCell>時間</TableCell>
                        <TableCell>動作</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {userAddCourseConfig.map((v, i) => (
                        <TableRow key={v.cos_id}>
                            <TableCell>
                                <TextField
                                    multiline
                                    value={v.cos_cname}
                                    onChange={(e) => {
                                        let newConfig = [
                                            ...userAddCourseConfig,
                                        ];
                                        newConfig[i].cos_cname = e.target.value;
                                        setUserAddCourseConfig(newConfig);
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    value={ConvertToNewCodeStr(v.cos_time)}
                                    onChange={(e) => {
                                        let newConfig = [
                                            ...userAddCourseConfig,
                                        ];
                                        newConfig[i].cos_time =
                                            ConvertToOldCodeStr(e.target.value);
                                        setUserAddCourseConfig(newConfig);
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <Button
                                    onClick={(e) => {
                                        let newConfig = [
                                            ...userAddCourseConfig,
                                        ];
                                        newConfig.splice(i, 1);
                                        setUserAddCourseConfig(newConfig);
                                    }}
                                >
                                    刪除
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }
);

let lastAppliedTheme = null;

const Setting = ({
    semesters,
    semester,
    handleSemesterChange,
    handleExport,
    courseOptions,
    setCourseOptions,
    tableOptions,
    setTableOptions,
    setTheme,
    courseIds,
    allCourses,
    enqueueSnackbar,
}) => {
    const [showThemeConfig, setShowThemeConfig] = useState(false);
    const [showCourseTypeConfig, setShowCourseTypeConfig] = useState(false);
    const [showExtraCourceConfig, setShowExtraCourceConfig] = useState(false);
    const [allowShareUserTheme, setAllowShareUserTheme] = useState(true);
    const [selectTheme, setSelectTheme] = useState(0);
    const [userTheme, setUserTheme] = useState(
        JSON.stringify(themes[0], null, 4)
    );
    const [invalidUserTheme, setInvalidUserTheme] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [exportBgImage, setExportBgImage] = useState(false);

    const updateTableOptions = useCallback(
        (key, val) => {
            setTableOptions((prev) => ({
                ...prev,
                [key]: val,
            }));
        },
        [setTableOptions]
    );
    const toggleTableOptions = useCallback(
        (key) => {
            setTableOptions((prev) => ({
                ...prev,
                [key]: !prev[key],
            }));
        },
        [setTableOptions]
    );

    const setTableToScreenSize = useCallback(() => {
        updateTableOptions("tableWidth", window.screen.width);
        updateTableOptions("tableHeight", window.screen.height);
    }, [updateTableOptions]);

    useEffect(() => {
        if (detectMobile()) {
            setTableToScreenSize();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
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

        setTheme(theme);
    }, [setTheme, selectTheme, userTheme, tableOptions, courseOptions]);

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

    const handleAddUserAddCource = useCallback(() => {
        setCourseOptions((prev) => ({
            ...prev,
            userAddCourseConfig: [
                ...prev.userAddCourseConfig,
                {
                    cos_id: Math.random().toString(36).substring(2),
                    cos_cname: "",
                    cos_type: "自訂",
                    cos_time: "",
                },
            ],
        }));
    }, [setCourseOptions]);

    const handleFileChange = useCallback(
        (e) => {
            if (e.target.files === undefined) {
                updateTableOptions("backgroundImage", "");
            } else {
                const file = e.target.files[0];
                if (file) {
                    // const imageUrl = URL.createObjectURL(file);
                    // updateTableOptions("backgroundImage", imageUrl);
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () =>
                        updateTableOptions("backgroundImage", reader.result);
                }
            }
        },
        [updateTableOptions]
    );

    const exportAppearanceConfig = useCallback(() => {
        const data = {
            tableOptions,
            theme: lastAppliedTheme,
        };

        if (!exportBgImage) {
            delete data.tableOptions.backgroundImage;
        }

        const blob = new Blob([JSON.stringify(data, null, 4)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "appearanceConfig.json";
        a.click();
        URL.revokeObjectURL(url);
    }, [tableOptions, exportBgImage]);

    const importAppearanceConfig = useCallback(() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.readAsText(file);
                reader.onload = () => {
                    try {
                        const data = JSON.parse(reader.result);
                        if (data.tableOptions) {
                            setTableOptions({
                                ...initTableOptions,
                                ...pick(
                                    data.tableOptions,
                                    Object.keys(initTableOptions)
                                ),
                            });
                        }
                        if (data.theme) {
                            setSelectTheme(-1);
                            setUserTheme(JSON.stringify({
                                ...themes[0],
                                ...data.theme,
                                courseBackgroundColor: {
                                    ...themes[0].courseBackgroundColor,
                                    ...data.theme.courseBackgroundColor,
                                },
                            }));
                        }
                    } catch (error) {
                        enqueueSnackbar("無效的配置文件", { variant: "error" });
                    }
                };
            }
        };
        input.click();
    }, [setTableOptions, setSelectTheme, setUserTheme, enqueueSnackbar]);

    return (
        <div style={{ padding: 20 }}>
            <Typography variant="caption" color="textSecondary" component="div">
                無法處理重複選修，請先在模擬排課頁面處理好重複選修的課程
                <br />
                目前尚無法保存設定，重新整理後設定會消失
            </Typography>
            <Typography variant="h6" style={{ marginBottom: 5 }}>課程設定</Typography>
            <FormRow title="學期:">
                <Select
                    value={semester}
                    onChange={(e) => handleSemesterChange(e.target.value)}
                >
                    {semesters.map((sem) => (
                        <MenuItem value={sem} key={sem}>
                            {toSemesterText(sem)}
                        </MenuItem>
                    ))}
                </Select>
            </FormRow>
            <FormRow title="顯示課程類別設定" dense>
                <Checkbox
                    checked={showCourseTypeConfig}
                    onChange={() =>
                        setShowCourseTypeConfig(!showCourseTypeConfig)
                    }
                />
            </FormRow>
            {showCourseTypeConfig && (
                <FormRow fullWidth>
                    <CourseTypeEditor
                        allCourses={allCourses}
                        courseIds={courseIds}
                        courseTypeConfig={courseOptions.courseTypeConfig}
                        setCourseTypeConfig={(c) =>
                            setCourseOptions({
                                ...courseOptions,
                                courseTypeConfig: c,
                            })
                        }
                    />
                </FormRow>
            )}
            <FormRow title="顯示手動添加課程設定" dense>
                <Checkbox
                    checked={showExtraCourceConfig}
                    onChange={() =>
                        setShowExtraCourceConfig(!showExtraCourceConfig)
                    }
                />
                {showExtraCourceConfig && (
                    <IconButton onClick={handleAddUserAddCource}>
                        <Add />
                    </IconButton>
                )}
            </FormRow>
            {showExtraCourceConfig && (
                <FormRow
                    fullWidth
                    caption="僅支援使用新版時間代碼。Ex. W1256,R8y。完整時間表為 y,z,1,2,3,4,n,5,6,7,8,9,a,b,c,d。星期為M,T,W,R,F,S,U"
                >
                    <UserAddCourseEditor
                        userAddCourseConfig={courseOptions.userAddCourseConfig}
                        setUserAddCourseConfig={(c) =>
                            setCourseOptions({
                                ...courseOptions,
                                userAddCourseConfig: c,
                            })
                        }
                    />
                </FormRow>
            )}
            <FormRow title="顯示授課教師:" dense>
                <Checkbox
                    checked={tableOptions.showTeacher}
                    onChange={() => toggleTableOptions("showTeacher")}
                />
            </FormRow>
            <FormRow title="顯示教室:" dense>
                <Checkbox
                    checked={tableOptions.showRoom}
                    onChange={() => toggleTableOptions("showRoom")}
                />
            </FormRow>
            <FormRow title="僅顯示教室代碼:" dense>
                <Checkbox
                    checked={tableOptions.showRoomCode}
                    onChange={() => toggleTableOptions("showRoomCode")}
                />
            </FormRow>
            <FormRow
                title="擴展課表:"
                caption={`為了整體課表美觀，部分不常用的時間段如午餐時間已經隱藏，可以透過該項設定顯示特定時間段。
                    完整時間表為 ${(courseOptions.useNewTimeCode
                        ? newSecs
                        : secs
                    ).join(",")}`}
            >
                <FormGroup aria-label="position" row>
                    {["M", "N", "X", "Y", "I", "J", "K", "L", "六", "日"].map(
                        (code) => (
                            <ExtendedCheckbox
                                key={code}
                                code={code}
                                values={courseOptions.extendTimetable}
                                setValues={(v) =>
                                    setCourseOptions({
                                        ...courseOptions,
                                        extendTimetable: v,
                                    })
                                }
                                useNewCode={!courseOptions.useNewTimeCode}
                            />
                        )
                    )}
                </FormGroup>
                <Typography
                    variant="caption"
                    color="textSecondary"
                ></Typography>
            </FormRow>
            <FormRow title="顯示舊版時間代碼:">
                <Checkbox
                    checked={!courseOptions.useNewTimeCode}
                    onChange={() =>
                        setCourseOptions({
                            ...courseOptions,
                            useNewTimeCode: !courseOptions.useNewTimeCode,
                        })
                    }
                />
            </FormRow>
            <Divider style={{ marginBottom: 5 }} />
            <Typography variant="h6" style={{ marginBottom: 15 }} >外觀設定</Typography>
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
                        value={tableOptions.tableWidth}
                        onChange={(e) => updateTableOptions("tableWidth", e)}
                    />
                    <PositiveValidatedTextField
                        style={{ width: "6rem" }}
                        variant="outlined"
                        label="高"
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                        size="small"
                        value={tableOptions.tableHeight}
                        onChange={(e) => updateTableOptions("tableHeight", e)}
                    />
                    <Button
                        variant="outlined"
                        style={{ whiteSpace: "nowrap" }}
                        size="small"
                        onClick={setTableToScreenSize}
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
                                checked={tableOptions.enableNotchFix}
                                onChange={() =>
                                    toggleTableOptions("enableNotchFix")
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
                        disabled={!tableOptions.enableNotchFix}
                        value={tableOptions.notchHeight}
                        onChange={(e) => updateTableOptions("notchHeight", e)}
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
                <FormRow
                    fullWidth
                    caption="可以使用 #rrggbbaa 來將顏色設置為半透明"
                >
                    <TextField
                        error={invalidUserTheme}
                        helperText={
                            invalidUserTheme ? "無效的主題格式" : undefined
                        }
                        multiline
                        minRows={15}
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
                    value={tableOptions.courseFontSize}
                    onChange={(e) => updateTableOptions("courseFontSize", e)}
                />
            </FormRow>
            <FormRow title="扁平化:" dense>
                <Checkbox
                    checked={tableOptions.enableFlatStyle}
                    onChange={() => toggleTableOptions("enableFlatStyle")}
                />
            </FormRow>
            <FormRow title="顯示格線:" dense>
                <Checkbox
                    checked={tableOptions.enableGrid}
                    onChange={() => toggleTableOptions("enableGrid")}
                />
            </FormRow>
            <FormRow
                dense
                title="背景圖片:"
                caption="目前不提供圖片裁切功能，請將圖片調整成合適比例後上傳"
            >
                <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="button-background-file"
                    type="file"
                    onChange={handleFileChange}
                />
                <label htmlFor="button-background-file">
                    <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        component="span"
                        style={{ marginRight: 5 }}
                    >
                        上傳
                    </Button>
                </label>
                {tableOptions.backgroundImage && (
                    <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        component="span"
                        onClick={handleFileChange}
                    >
                        取消
                    </Button>
                )}
            </FormRow>
            <FormRow title="課程文字置中:" dense>
                <Checkbox
                    checked={tableOptions.alignCourseTextCenter}
                    onChange={() => toggleTableOptions("alignCourseTextCenter")}
                />
            </FormRow>
            <FormRow title="更多選項:" dense>
                <Checkbox
                    checked={showMore}
                    onChange={() => setShowMore(!showMore)}
                />
            </FormRow>
            {showMore && (
                <>
                    <FormRow title="標頭字體大小:" dense>
                        <PositiveValidatedTextField
                            style={{ width: "6rem" }}
                            variant="outlined"
                            inputProps={{
                                inputMode: "numeric",
                                pattern: "[0-9]*",
                            }}
                            size="small"
                            value={tableOptions.headerFontSize}
                            onChange={(e) =>
                                updateTableOptions("headerFontSize", e)
                            }
                        />
                    </FormRow>
                    <FormRow title="索引字體大小:" dense>
                        <PositiveValidatedTextField
                            style={{ width: "6rem" }}
                            variant="outlined"
                            inputProps={{
                                inputMode: "numeric",
                                pattern: "[0-9]*",
                            }}
                            size="small"
                            value={tableOptions.indexFontSize}
                            onChange={(e) =>
                                updateTableOptions("indexFontSize", e)
                            }
                        />
                    </FormRow>
                    <FormRow title="索引欄位寬度:" dense>
                        <PositiveValidatedTextField
                            style={{ width: "6rem" }}
                            variant="outlined"
                            inputProps={{
                                inputMode: "numeric",
                                pattern: "[0-9]*",
                            }}
                            size="small"
                            value={tableOptions.indexColumnWidth}
                            onChange={(e) =>
                                updateTableOptions("indexColumnWidth", e)
                            }
                        />
                    </FormRow>
                    <FormRow title="課程文字內距:" dense>
                        <PositiveValidatedTextField
                            style={{ width: "6rem" }}
                            variant="outlined"
                            inputProps={{
                                inputMode: "numeric",
                                pattern: "[0-9]*",
                            }}
                            size="small"
                            value={tableOptions.coursePaddingX}
                            onChange={(e) =>
                                updateTableOptions("coursePaddingX", e)
                            }
                        />
                    </FormRow>
                </>
            )}

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
            <div
                style={{
                    display: "flex",
                    gap: "5px",
                    flexWrap: "wrap",
                    marginBottom: 10,
                }}
            >
                {tableOptions.backgroundImage && (
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={tableOptions.includeBackgroundImage}
                                onChange={() =>
                                    setExportBgImage(!exportBgImage)
                                }
                            />
                        }
                        label="包含背景圖片"
                    />
                )}
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button 
                        variant="contained"
                        style={{ width: "8rem" }}
                        onClick={exportAppearanceConfig}
                    >
                        匯出外觀設置
                    </Button>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button
                        variant="contained"
                        style={{ width: "8rem" }}
                        onClick={importAppearanceConfig}
                    >
                        載入外觀設置
                    </Button>
                </div>
            </div>
            <Divider style={{ marginBottom: 10 }} />
            <FormRow fullWidth>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ width: "8rem" }}
                        onClick={() =>
                            handleExport({ allowShareUserTheme, selectTheme })
                        }
                    >
                        匯出課表
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
