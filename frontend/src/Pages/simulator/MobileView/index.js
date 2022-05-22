import { BottomNavigationAction, Button, IconButton, Slide } from "@material-ui/core"
import { Apps, BarChart, Cancel, List, Settings } from "@material-ui/icons"
import { useSnackbar } from "notistack"
import React, { useEffect, useState } from "react"
import CategoryPanel from "../Components/CategoryPanel"
import MainPanel from "../Components/MainPanel"
import StatisticsPanel from "../Components/StatisticsPanel"
import UnusedItems from "../Components/UnusedItems"
import { Base, BottomNavigation, PanelContainer } from "./style"

const SimulatorMobileView = ({ dirty, importSuccess, onDirtyClose, onImportSuccessClose, handleOptionsOpen }) => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    useEffect(() => {
        if (dirty) {
            enqueueSnackbar("有未儲存的變更", {
                variant: "warning",
                persist: true,
                action: key => (
                    <Button color="inherit" onClick={() => {
                        closeSnackbar(key)
                        onDirtyClose()
                    }}>儲存</Button>
                ),
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "center",
                },
                TransitionComponent: Slide
            })
        }
        if (importSuccess) {
            enqueueSnackbar("成功匯入新資料！", {
                variant: "info",
                persist: true,
                action: key => (
                    <IconButton color="primary" onClick={() => {
                        closeSnackbar(key)
                        onImportSuccessClose()
                    }}><Cancel /></IconButton>
                ),
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "center",
                },
                TransitionComponent: Slide
            })
        }
    }, [closeSnackbar, dirty, enqueueSnackbar, importSuccess, onDirtyClose, onImportSuccessClose])

    const [tabIndex, setTabIndex] = useState(0)
    const handleTabIndexChange = (_, value) => {
        if (value !== 3)
            setTabIndex(value)
    }

    return (
        <Base>
            {
                tabIndex === 0 &&
                <PanelContainer style={{ paddingLeft: 8, paddingRight: 8 }}>
                    <MainPanel />
                    <UnusedItems mobile />
                </PanelContainer>
            }
            {
                tabIndex === 1 &&
                <PanelContainer style={{ paddingLeft: 24, paddingRight: 8 }}>
                    <StatisticsPanel />
                </PanelContainer>
            }
            {
                tabIndex === 2 &&
                <PanelContainer style={{ paddingLeft: 16, paddingRight: 16 }}>
                    <CategoryPanel />
                </PanelContainer>
            }
            <BottomNavigation showLabels value={tabIndex} onChange={handleTabIndexChange}>
                <BottomNavigationAction label="操作" icon={<Apps />} />
                <BottomNavigationAction label="統計" icon={<BarChart />} />
                <BottomNavigationAction label="類別" icon={<List />} />
                <BottomNavigationAction label="設定" icon={<Settings />} onClick={handleOptionsOpen} />
            </BottomNavigation>
        </Base>
    )
}

export default React.memo(SimulatorMobileView)