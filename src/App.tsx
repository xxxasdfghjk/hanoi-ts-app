import { EventHandler, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { Box, Button, LinearProgress, TextField, styled } from "@mui/material";
import HanoiSolver from "./lib/HanoiSolver";
type Disk = number;
type TowerProps = {
    array: Disk[];
    maxSize: number;
};
const SBox = styled(Box, { shouldForwardProp: (prop) => prop !== "maxTowerLength" && prop !== "width" })(
    ({ width, maxTowerLength }: { width: number; maxTowerLength: number }) => {
        return {
            width: `${(100 * width) / maxTowerLength}%`,
            height: "10px",
            background: "black",
            margin: "0 auto",
        };
    }
);

const STower = styled(Box)({
    width: "30%",
});

const Tower = (props: TowerProps) => {
    return (
        <STower>
            {props.array.map((e, i) => (
                <SBox key={i} width={e} maxTowerLength={props.maxSize}></SBox>
            ))}
        </STower>
    );
};
const STowerWrapper = styled(Box)(({ height }: { height: number }) => ({
    width: "600px",
    display: "flex",
    justifyContent: "center",
    alignItems: "end",
    height: height,
    overflow: "scroll",
    margin: "0 auto",
}));

const SForm = styled("form")({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 6,
});

function App() {
    const [height, setHeight] = useState<number>(1024);
    const [hanoiArray, setHanoiArray] = useState<Disk[][]>([[], [], []]);
    const [towerSize, setTowerSize] = useState<number>(5);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const [count, setCount] = useState<number>(0);
    const countUp = () => {
        setCount((prev) => {
            return prev + 1;
        });
    };
    const totalCount = useMemo(() => {
        return Math.pow(2, towerSize) - 1;
    }, [towerSize]);

    const solve = (size: number) => {
        const hanoiSolver = new HanoiSolver(size);
        setHeight(size * 10);
        setCount(0);

        setHanoiArray([new Array(size).fill(size).map((_, i) => i + 1), [], []]);
        const g = hanoiSolver.solve();
        const timer = setInterval(() => {
            const res = g.next();
            if (res.value) {
                countUp();
                setHanoiArray(hanoiSolver.getTowers());
            } else {
                setIsProcessing(false);
                setCount(totalCount);
                clearInterval(timer);
            }
        }, 100);
    };
    useEffect(() => {
        setHeight(window?.document.documentElement.clientHeight * 0.7 ?? 800);
    }, []);
    return (
        <>
            <SForm
                onSubmit={(e) => {
                    e.preventDefault();
                    if (isProcessing) {
                        return;
                    }
                    const towerSize = parseInt(inputRef?.current?.querySelector("input")?.value ?? "5", 10);
                    setTowerSize(towerSize);

                    setIsProcessing(true);
                    solve(towerSize);
                }}
            >
                <TextField
                    sx={{ margin: "8px" }}
                    type="number"
                    label={"input tower size"}
                    disabled={isProcessing}
                    ref={inputRef}
                ></TextField>
                <Button type={"submit"} variant="outlined" disabled={isProcessing}>
                    SUBMIT
                </Button>
            </SForm>
            <LinearProgress variant="determinate" value={isProcessing ? (count / totalCount) * 100 : 100} />
            <STowerWrapper height={height}>
                <Tower array={hanoiArray[0]} maxSize={towerSize}></Tower>
                <Tower array={hanoiArray[1]} maxSize={towerSize}></Tower>
                <Tower array={hanoiArray[2]} maxSize={towerSize}></Tower>
            </STowerWrapper>
        </>
    );
}

export default App;
