import HanoiSolver from "../HanoiSolver.ts";

const hanoiSolver = new HanoiSolver(3);
const g = hanoiSolver.solve();
for (const i of g) {
    console.log(i);
}
