type Disk = number;
type Space = "left" | "right" | "mid";
class HanoiSolver {
    private left: Disk[] = [];
    private mid: Disk[] = [];
    private right: Disk[] = [];
    constructor(private n: number) {
        for (let i = 1; i <= n; i++) {
            this.left.push(i);
        }
    }

    print() {
        console.log("/**==============**/");
        console.log("left:", this.left);
        console.log("mid:", this.mid);
        console.log("right:", this.right);
    }

    getSpace(space: Space) {
        switch (space) {
            case "left":
                return this.left;
            case "right":
                return this.right;
            case "mid":
                return this.mid;
        }
    }

    moveDisk(from: Space, dest: Space) {
        const fromSpace = this.getSpace(from);
        const destSpace = this.getSpace(dest);
        const disk = fromSpace[0];
        fromSpace.shift();
        destSpace.unshift(disk);
    }

    getTowers() {
        return [this.left, this.mid, this.right];
    }

    *solveRecursive(n: number, from: Space, work: Space, dest: Space): Generator<[Space, Space]> {
        if (n === 1) {
            this.moveDisk(from, dest);
            yield [from, dest];
        } else {
            const g1 = this.solveRecursive(n - 1, from, dest, work);
            for (const hand of g1) {
                yield hand;
            }
            this.moveDisk(from, dest);
            yield [from, dest];
            const g2 = this.solveRecursive(n - 1, work, from, dest);
            for (const hand of g2) {
                yield hand;
            }
        }
    }

    *solve() {
        const g = this.solveRecursive(this.n, "left", "mid", "right");
        for (const hand of g) {
            yield hand;
        }
    }
}

export default HanoiSolver;
