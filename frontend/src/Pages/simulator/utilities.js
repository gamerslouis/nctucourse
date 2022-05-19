import { pre_13 } from "./data_default"

export const migrateData = (data_old) => {
    const data_new = { version: 2 }
    const version = data_old.version ?? 1
    if (version === 1) {
        const { categories, controlFlag, data, targets } = data_old
        const parse_target = target => {
            try {
                const [sa, sb] = target.split(";")
                const a = parseInt(sa)
                const b = parseInt(sb)
                return [a === 0 ? null : a, b === 0 ? null : b]
            } catch { };
            return [null, null]
        }
        const migrateItemId = itemId_old => {
            const match = itemId_old.match(/^@?([\d_]+)(\$\d+)?$/)
            const itemId_raw = match[1]
            const isClone = itemId_old.startsWith("@")
            const mod_credit_str = match[2]
            const mod_credit = mod_credit_str ? parseInt(mod_credit_str.slice(1)) : null
            return generateItemId(itemId_raw, isClone, mod_credit)
        }

        data_new.options = {
            show_pending: (controlFlag & 0b0001) !== 0,
            show_zero: (controlFlag & 0b0010) !== 0,
            show_details: (controlFlag & 0b1000) !== 0,
        }

        const categories_map = {}
        data_new.categories = {}
        data_new.cat_names = {}
        data_new.layout = []
        data_new.content = {}
        data_new.targets = {}
        categories.forEach((cat, catidx) => {
            const catid = `cat_${catidx}`
            categories_map[cat] = catid

            data_new.layout.push(catid)
            data_new.categories[catid] = true
            data_new.cat_names[catid] = cat
            data_new.content[catid] = data[cat].map(migrateItemId)
            data_new.targets[catid] = parse_target(targets[cat])
        })
        data_new.content["unused"] = data["unused"]


        data_new.groups = {}
        data_new.groups.gcat_0 = [
            categories_map["通識 ─ 核心人文"],
            categories_map["通識 ─ 核心社會"],
            categories_map["通識 ─ 核心自然"]
        ]
        data_new.groups.gcat_1 = [
            "gcat_0",
            categories_map["通識 ─ 跨院"],
            categories_map["通識 ─ 校基本"]
        ]
        data_new.cat_names.gcat_0 = "通識 ─ 核心"
        data_new.cat_names.gcat_1 = "通識"
        data_new.targets.gcat_0 = parse_target(targets["通識_core"])
        data_new.targets.gcat_1 = parse_target(targets["通識_total"])
        data_new.layout.push("gcat_1")
        data_new.layout.push("gcat_0")

        data_new.targets.total = parse_target(targets["total"])
    }
    return data_new
}

export const updateData = (courses, data, imported) => {
    let data_new = { ...data }
    let imported_new = [...imported]

    if (Object.keys(data_new).length === 0) {
        // ! 13後的通識格式？
        data_new = copyData(pre_13)
    }

    // value - key table
    const cat_names = {}
    for (let catid in data_new.cat_names)
        cat_names[data_new.cat_names[catid]] = catid

    // Add 軍訓 if presented in data
    if (!cat_names.hasOwnProperty("軍訓") && courses.filter(item => (item.type === '軍訓')).length !== 0) {
        const new_catid = "cat_" + ((Object.keys(data_new.categories)
            .map(catid => parseInt(catid.match(/^cat_(\d+)$/)[1]))
            .sort((a, b) => (b - a))[0] ?? 0) + 1)
        data_new.categories[new_catid] = true
        data_new.cat_names[new_catid] = "軍訓"
        cat_names["軍訓"] = new_catid
        data_new.content[new_catid] = []
        data_new.targets[new_catid] = [null, 5]
    }

    const historyIds = courses.map(item => (item.sem + '_' + item.id))
    const absentImported = imported_new.filter(id => historyIds.indexOf(id) === -1)
    for (let catid in data_new.content) {
        data_new.content[catid] = data_new.content[catid]
            .filter(itemId => absentImported.indexOf(getRawCourseId(itemId)) === -1)
    }
    imported_new = imported_new.filter(itemId => historyIds.indexOf(itemId) !== -1)

    for (let item of courses) {
        const itemId = item.sem + '_' + item.id

        if (imported_new.indexOf(itemId) !== -1)
            continue
        imported_new.push(itemId)

        if (item.cos_cname.startsWith("服務學習") && cat_names["服務學習"]) {
            data_new.content[cat_names["服務學習"]].push(itemId)
        }
        else if (item.dimension === "藝文賞析" && cat_names["藝文賞析"]) {
            data_new.content[cat_names["藝文賞析"]].push(itemId)
        }
        else if (item.type === "通識" && item.dimension === "核心-人文" && cat_names["通識 ─ 核心人文"]) {
            data_new.content[cat_names["通識 ─ 核心人文"]].push(itemId)
        }
        else if (item.type === "通識" && item.dimension === "核心-社會" && cat_names["通識 ─ 核心社會"]) {
            data_new.content[cat_names["通識 ─ 核心社會"]].push(itemId)
        }
        else if (item.type === "通識" && item.dimension === "核心-自然" && cat_names["通識 ─ 核心自然"]) {
            data_new.content[cat_names["通識 ─ 核心自然"]].push(itemId)
        }
        else if (item.type === "通識" && item.dimension === "跨院基本素養" && cat_names["通識 ─ 跨院"]) {
            data_new.content[cat_names["通識 ─ 跨院"]].push(itemId)
        }
        else if (item.type === "通識" && item.dimension === "校基本素養" && cat_names["通識 ─ 校基本"]) {
            data_new.content[cat_names["通識 ─ 校基本"]].push(itemId)
        }
        // ! 13後的通識匯入？
        else if (cat_names[item.type]) {
            data_new.content[cat_names[item.type]].push(itemId)
        }
        else {
            data_new.content.unused.push(itemId)
        }
    }

    return [data_new, imported_new]
}

export const copyData = data => JSON.parse(JSON.stringify(data))

export const getRawCourseId = courseId => courseId.match(/^[\w_]+/)[0]

export const generateItemId = (courseId, clone, credits = null) => {
    const itemId_raw = getRawCourseId(courseId)
    if (!clone)
        return itemId_raw
    const uid = (() => {
        let d = Date.now()
        if (typeof performance !== 'undefined') {
            d += performance?.now()
        }
        return 'xxxx'.replace(/[xy]/g, c => {
            let r = (d + Math.random() * 16) % 16 | 0
            d = Math.floor(d / 16)
            return (c === 'x' ? r : ((r & 0x3) | 0x8)).toString(16)
        })
    })()
    if (credits)
        return itemId_raw + "@" + uid + "$" + credits
    return itemId_raw + "@" + uid
}

export const visibilityFilter = (course, show_zero, show_pending) => {
    return (show_zero || course.cos_credit !== 0) &&
        (show_pending || course.levelScore !== "")
}