import { template_107, template_110 } from "./default_templates"

export const migrateData = data_old => {
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
        data_new.cat_names = {}
        data_new.layout = []
        data_new.content = {}
        data_new.targets = {}
        categories.forEach((cat, catidx) => {
            const catid = `cat_${catidx}`
            categories_map[cat] = catid

            data_new.layout.push(catid)
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

export const generateEmptyDataFromTemplate = template => {
    const data = { version: 2 }
    data.cat_names = {}
    data.content = { unused: [] }
    data.groups = {}
    data.layout = []
    data.options = {
        show_zero: true,
        show_details: false,
        show_pending: true,
        dnd_vibrate: true
    }
    data.targets = {}

    const catids = {}
    template.categories.forEach((cat, idx) => catids[cat] = `cat_${idx}`)
    Object.keys(template.groups).forEach((cat, idx) => catids[cat] = `gcat_${idx}`)
    for (const cat of template.categories) {
        const catid = catids[cat]
        data.cat_names[catid] = cat
        data.content[catid] = []
        data.layout.push(catid)
        if (template.targets[cat]) {
            const c = template.targets[cat][0] === null ? null : parseInt(template.targets[cat][0])
            const a = template.targets[cat][1] === null ? null : parseInt(template.targets[cat][1])
            data.targets[catid] = [c, a]
        }
        else
            data.targets[catid] = [null, null]
    }
    if (template.target_total) {
        const c = template.target_total[0] === null ? null : parseInt(template.target_total[0])
        const a = template.target_total[1] === null ? null : parseInt(template.target_total[1])
        data.targets.total = [c, a]
    }
    else
        data.targets.total = [null, null]

    for (const gcat in template.groups) {
        const catid = catids[gcat]
        data.cat_names[catid] = gcat
        data.groups[catid] = template.groups[gcat].map(cat => catids[cat])
        data.layout.push(catid)
        if (template.targets[gcat]) {
            const c = template.targets[gcat][0] === null ? null : parseInt(template.targets[gcat][0])
            const a = template.targets[gcat][1] === null ? null : parseInt(template.targets[gcat][1])
            data.targets[catid] = [c, a]
        }
        else
            data.targets[catid] = [null, null]
    }

    return data
}

export const updateData = (courses, data, imported, template = null) => {
    let data_new = { ...data }
    let imported_new = [...imported]

    if (template)
        data_new = generateEmptyDataFromTemplate(template)
    else if (Object.keys(data_new).length === 0) {
        let generated = false
        for (const course of courses) {
            if (course.type === "通識") {
                data_new = generateEmptyDataFromTemplate(template_107)
                generated = true
                break
            }
            else if (course.dimension.startsWith("基本素養") || course.dimension.startsWith("領域課程")) {
                data_new = generateEmptyDataFromTemplate(template_110)
                generated = true
                break
            }
        }
        if (!generated)
            data_new = generateEmptyDataFromTemplate(template_110)
    }

    // value - key table
    const cat_names = {}
    for (let catid in data_new.cat_names)
        cat_names[data_new.cat_names[catid]] = catid

    // Add 軍訓 if presented in data
    if (!cat_names.hasOwnProperty("軍訓") && courses.filter(item => (item.type === "軍訓")).length !== 0) {
        const new_catid = "cat_" + ((data_new.layout.filter(catid => !catid.startsWith("g"))
            .map(catid => parseInt(catid.match(/^cat_(\d+)$/)[1]))
            .sort((a, b) => (b - a))[0] ?? 0) + 1)
        data_new.cat_names[new_catid] = "軍訓"
        cat_names["軍訓"] = new_catid
        data_new.content[new_catid] = []
        data_new.layout.push(new_catid)
        data_new.targets[new_catid] = [null, 5]
    }

    const historyIds = courses.map(item => (item.sem + "_" + item.id))
    const absentImported = imported_new.filter(id => historyIds.indexOf(id) === -1)
    for (let catid in data_new.content) {
        data_new.content[catid] = data_new.content[catid]
            .filter(itemId => absentImported.indexOf(getRawCourseId(itemId)) === -1)
    }
    imported_new = imported_new.filter(itemId => historyIds.indexOf(itemId) !== -1)

    for (const item of courses) {
        const itemId = item.sem + "_" + item.id

        if (imported_new.indexOf(itemId) !== -1)
            continue
        imported_new.push(itemId)

        if (item.cos_cname.startsWith("服務學習") && cat_names["服務學習"]) {
            data_new.content[cat_names["服務學習"]].push(itemId)
        }
        else if (item.dimension === "藝文賞析" && cat_names["藝文賞析"]) {
            data_new.content[cat_names["藝文賞析"]].push(itemId)
        }
        // * 107通識
        else if (item.dimension === "核心-人文" && cat_names["通識 ─ 核心人文"]) {
            data_new.content[cat_names["通識 ─ 核心人文"]].push(itemId)
        }
        else if (item.dimension === "核心-社會" && cat_names["通識 ─ 核心社會"]) {
            data_new.content[cat_names["通識 ─ 核心社會"]].push(itemId)
        }
        else if (item.dimension === "核心-自然" && cat_names["通識 ─ 核心自然"]) {
            data_new.content[cat_names["通識 ─ 核心自然"]].push(itemId)
        }
        else if (item.dimension === "跨院基本素養" && cat_names["通識 ─ 跨院"]) {
            data_new.content[cat_names["通識 ─ 跨院"]].push(itemId)
        }
        else if (item.dimension === "校基本素養" && cat_names["通識 ─ 校基本"]) {
            data_new.content[cat_names["通識 ─ 校基本"]].push(itemId)
        }
        // * 110通識
        else if (item.dimension === "基本素養-批判思考" && cat_names["基本-批判思考"]) {
            data_new.content[cat_names["基本-批判思考"]].push(itemId)
        }
        else if (item.dimension === "基本素養-量性推理" && cat_names["基本-量性推理"]) {
            data_new.content[cat_names["基本-量性推理"]].push(itemId)
        }
        else if (item.dimension === "基本素養-組織管理" && cat_names["基本-組織管理"]) {
            data_new.content[cat_names["基本-組織管理"]].push(itemId)
        }
        else if (item.dimension === "基本素養-生命及品格教育" && cat_names["基本-生命及品格教育"]) {
            data_new.content[cat_names["基本-生命及品格教育"]].push(itemId)
        }
        else if (item.dimension === "領域課程-人文與美學" && cat_names["領域-人文與美學"]) {
            data_new.content[cat_names["領域-人文與美學"]].push(itemId)
        }
        else if (item.dimension === "領域課程-個人、社會與文化" && cat_names["領域-個人社會與文化"]) {
            data_new.content[cat_names["領域-個人社會與文化"]].push(itemId)
        }
        else if (item.dimension === "領域課程-公民與倫理思考" && cat_names["領域-公民與倫理"]) {
            data_new.content[cat_names["領域-公民與倫理"]].push(itemId)
        }
        else if (item.dimension === "領域課程-社會中的科技與自然" && cat_names["領域-科技與自然"]) {
            data_new.content[cat_names["領域-科技與自然"]].push(itemId)
        }
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
        if (typeof performance !== "undefined") {
            d += performance?.now()
        }
        return "xxxx".replace(/[xy]/g, c => {
            let r = (d + Math.random() * 16) % 16 | 0
            d = Math.floor(d / 16)
            return (c === "x" ? r : ((r & 0x3) | 0x8)).toString(16)
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

export const dumpTemplate = context => {
    const template = {}
    template.version = 2
    template.categories = []
    template.groups = {}
    template.targets = {}
    for (const catid in context.cat_names) {
        if (context.cat_names[catid] === "軍訓")
            continue
        if (catid.startsWith("g")) {
            template.groups[context.cat_names[catid]] = context.groups[catid].map(catid => context.cat_names[catid])
        }
        else {
            template.categories.push(context.cat_names[catid])
        }
        if (context.targets[catid][0] || context.targets[catid][1])
            template.targets[context.cat_names[catid]] = context.targets[catid].slice()
    }
    if (context.targets.total[0] || context.targets.total[1])
        template.target_total = context.targets.total.slice()
    return template
}

export const templateSanityCheck = templateString => {
    try {
        const template = JSON.parse(templateString)
        // Data version
        if (template.version !== 2)
            return false
        // Check fields
        if (!template.hasOwnProperty("categories") || !template.hasOwnProperty("groups") || !template.hasOwnProperty("targets"))
            return false
        // Check dups
        const cats_list = template.categories.concat(Object.keys(template.groups))
        const cats_set = new Set(cats_list)
        if ([...cats_set].length !== cats_list.length)
            return false
        // Check groups
        for (const gcat in template.groups) {
            let cats = template.groups[gcat]
            while (true) {
                let cats_new = []
                for (const cat of cats) {
                    // Ban circular dependency
                    if (cat === gcat)
                        return false
                    if (template.groups[cat])
                        cats_new = cats_new.concat(template.groups[cat])
                    // Ban non-exist category dependency
                    else if (template.categories.indexOf(cat) === -1)
                        return false
                }
                if (cats_new.length === 0)
                    break
                cats = cats_new
            }
        }
        // Check targets
        for (const cat in template.targets) {
            // Ban non-exist category targets
            if (!cats_set.has(cat))
                return false
            // Ban illegal values
            if (template.targets[cat][0] !== null) {
                const val = parseInt(template.targets[cat][0])
                if (isNaN(val) || val <= 0)
                    return false
            }
            if (template.targets[cat][1] !== null) {
                const val = parseInt(template.targets[cat][1])
                if (isNaN(val) || val <= 0)
                    return false
            }
        }
        // Check total target
        if (template.target_total) {
            if (template.target_total[0] !== null) {
                const val = parseInt(template.target_total[0])
                if (isNaN(val) || val <= 0)
                    return false
            }
            if (template.target_total[1] !== null) {
                const val = parseInt(template.target_total[1])
                if (isNaN(val) || val <= 0)
                    return false
            }
        }
    } catch {
        return false
    }
    return true
}