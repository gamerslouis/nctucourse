export const CourseTypeColorMap = {
    必修: "#ff7675",
    體育: "#ffeaa7",
    軍訓: "#74b9ff",
    外語: "#55efc4",
    通識: "#a29bfe",
    選修: "#81ecec",
};

export const ConvertCourseType2StyleType = (courseType) => {
    if (courseType === "必修") return "必修";

    if (courseType === "體育") return "體育";

    if (courseType === "軍訓") return "軍訓";

    if (courseType === "語言溝通") return "外語";
    if (courseType === "外語") return "外語";

    if (courseType === "通識") return "通識";
    if (courseType === "核心") return "通識";

    if (courseType === "選修") return "選修";
    return "選修";
};

export const secs = [
    "M",
    "N",
    "A",
    "B",
    "C",
    "D",
    "X",
    "E",
    "F",
    "G",
    "H",
    "Y",
    "I",
    "J",
    "K",
    "L",
];

export const newSecs = [
    "y",
    "z",
    "1",
    "2",
    "3",
    "4",
    "n",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
];

export const timeCode =["一", "二", "三", "四", "五", "六", "日"];
export const newTimeCode = ["M", "T", "W", "R", "F", "S", "U"];

export const ConvertToNewCode = (code) => {
    if (secs.includes(code)) {
        return newSecs[secs.indexOf(code)];
    }
    if (timeCode.includes(code)) {
        return newTimeCode[timeCode.indexOf(code)];
    }
    return code;
};
