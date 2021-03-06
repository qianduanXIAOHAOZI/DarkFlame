'bpo enable';
// forked it from See3D math.js

/** todo 为String类型添加方法 */
!function () {
    String.prototype.last = function () {
        return this[this.length - 1];
    };
}();

!function (DarkFlame) {
    let module = new DarkFlame.Module("math");// 新建包

    const smallest = 1e-5;
    const smallestLen = 5;

    function probably(n) {
        return Number(n.toFixed(smallestLen));
    }

    /** todo 枚举类型 */
    class Enum extends DarkFlame.Module.ModuleClass {
        /*
        * 使用方法:
        * let colors = new Enum(["RED", "WHITE", "BLACK"])
        */
        constructor(enums) {
            super("enum");
            let n = 0;
            for (let i in enums) {
                let v = enums[i];
                if (typeof v === "object") {
                    n = v[1];
                    v = v[0];
                }
                this[v] = n;
                this["$" + n] = v;
                n++;
            }
        }

        get(n) {
            return this["$" + n];
        }
    }

    /** todo 提供数学意义上的集合类 */
        // {(token) | expr}
    class MathSet extends DarkFlame.Module.ModuleClass {
        constructor(token, expr) {
            super("set");
            if (arguments.length == 1) {// 只有一个参数
                let str = token;
                str = str.trim();
                if (
                    str.length <= 2 ||
                    str[0] != "{" || str.last() != "}" // 不以'{'开头或不以'}'结尾
                ) {
                    console.error(new DarkFlame.DarkFlameError("math", "Error 104: Illegal set string '" + str + "'"));
                    return;
                }
                str = str.substring(1, str.length - 1);
                token = "";

                let splitIndex = str.search(/\|/);
                if (splitIndex < 0) {
                    console.error(new DarkFlame.DarkFlameError("math", "Error 104: Illegal set string '" + str + "'"));
                    return;
                }

                // 获取token
                for (let i = 0; i < splitIndex; i++) {
                    token += str[i];
                }
                token = token.trim();

                expr = "";
                // 获取expr
                for (let i = splitIndex + 1; i < str.length; i++) {
                    expr += str[i];
                }
            }
            this.token = token;
            this.expr = expr;
        }
        have(n) {
            let expr = this.expr.replace(new RegExp("([^a-zA-Z_])" + this.token + "([^a-zA-Z_])", "g"), "$1" + n + "$2");
            return Boolean(eval(expr));
        }
    }

    /** todo 提供区间类 */
    class Interval extends MathSet {
        constructor(type, s, e) {
            // super("Interval");
            let st, et;// 存储是开还是闭
            const token = "n";// 变量名, {x | a < x < b}
            let expr = "";
            let firstOp, lastOp;
            if (arguments.length == 1) {// 只有一个参数
                let str = type;
                str = str.trim();
                st = str[0];
                et = str.last();

                // 检查类型
                if (st != "[" && st != "(") {
                    console.error(new DarkFlame.DarkFlameError("math", "Error 103: Illegal interval identifier '" + st + "'"));
                    return;
                }
                if (et != "]" && et != ")") {
                    console.error(new DarkFlame.DarkFlameError("math", "Error 103: Illegal interval identifier '" + et + "'"));
                    return;
                }
                str = str.substring(1, str.length - 1);
                let numbers = str.split(",");
                if (numbers.length < 2) str.split(/\s+/g);
                if (st == "[") firstOp = "<=";
                if (st == "(") firstOp = "<";
                if (et == "]") lastOp = "<=";
                if (et == ")") lastOp = "<";
                s = numbers[0];
                e = numbers[1];
                expr = s + firstOp + token + " && " + token + lastOp + e;
                // this.st = st;
                // this.et = et;
                // this.s = numbers[0];// 区间的第一个数
                // this.e = numbers[1];// 区间的第二个数
            } else {
                st = type[0];
                et = type[1];
                // 检查类型
                if (st != "[" && st != "(") {
                    console.error(new DarkFlame.DarkFlameError("math", "Error 103: Illegal interval identifier '" + st + "'"));
                    return;
                }
                if (et != "]" && et != ")") {
                    console.error(new DarkFlame.DarkFlameError("math", "Error 103: Illegal interval identifier '" + et + "'"));
                    return;
                }
                if (st == "[") firstOp = "<=";
                if (st == "(") firstOp = "<";
                if (et == "]") lastOp = "<=";
                if (et == ")") lastOp = "<";
                // console.log(firstOp, lastOp, s, e);
                expr = String(s) + firstOp + token + " && " + token + lastOp + String(e);
            }
            super(token, expr);
        }
    }

    /** todo 向量类 */
    // WARNING: %代表点积, *代表叉乘
    class Vector extends DarkFlame.Module.ModuleClass {
        constructor(arr) {
            super("Vector");
            this.array = [];
            if (arr.type && arr.type == "Vector") for (let i of arr.array) this.array.push(i);
            else for (let i of arr) this.array.push(i);
        }
        push(val) {
            this.array.push(val);
        }
        set(index, val) {
            this.array[index] = val;
            return this;
        }
        get(index) {
            return this.array[index];
        }
        mod() {
            let sum = 0;
            for (let i of this.array) {
                sum += i ** 2;
            }
            return Math.sqrt(sum);
        }
        get length() {
            return this.array.length;
        }
        get x() {
            return this.get(0);
        }
        set x(n) {
            this.set(0, n);
            return n;
        }
        get y() {
            return this.get(1);
        }
        set y(n) {
            this.set(1, n);
            return n;
        }
        get z() {
            return this.get(2);
        }
        set z(n) {
            this.set(2, n);
            return n;
        }
        get w() {
            return this.get(3);
        }
        set w(n) {
            this.set(3, n);
            return n;
        }
        // 点积
        dot(b) {
            if (typeof b === "number") {
                console.error(new DarkFlame.DarkFlameError("math", "Error 102: Do not support scalar and vector for dot product operations"));
                return null;
            }
            if (b.type === "Vector") {
                if (b.length != this.length) {
                    console.error(new DarkFlame.DarkFlameError("math", "Error 100: Vector size does not match"));
                    return null;
                }
                let sum = 0;
                for (let i in this.array) {
                    sum += this.array[i] * b.array[i];
                }
                return sum;
            }
        }
        add(b) {
            if (typeof b === "number") {
                let tmp = new Vector([]);
                tmp.array = tmp.array.concat(this.array);
                for (let i in this.array) {
                    tmp.array[i] += b;
                }
                return tmp;
            } else {
                if (b.type === "Vector") {
                    if (b.length != this.length) {
                        console.error(new DarkFlame.DarkFlameError("math", "Error 100: Vector size does not match"));
                        return null;
                    }
                    let v = [];
                    for (let i in this.array) {
                        v.push(this.array[i] + b.array[i]);
                    }
                    return new Vector(v);
                }
            }
        }
        sub(b) {
            if (typeof b === "number") {
                let tmp = new Vector([]);
                tmp.array = tmp.array.concat(this.array);
                for (let i in this.array) {
                    tmp.array[i] -= b;
                }
                return tmp;
            } else {
                if (b.type === "Vector") {
                    if (b.length != this.length) {
                        console.error(new DarkFlame.DarkFlameError("math", "Error 100: Vector size does not match"));
                        return null;
                    }
                    let v = [];
                    for (let i in this.array) {
                        v.push(this.array[i] - b.array[i]);
                    }
                    return new Vector(v);
                }
            }
        }
        div(b) {
            if (typeof b === "number") {
                let tmp = new Vector([]);
                tmp.array = tmp.array.concat(this.array);
                for (let i in this.array) {
                    tmp.array[i] /= b;
                }
                return tmp;
            } else {
                console.error(new DarkFlame.DarkFlameError("math", "Error 102: Do not support scalar and vector for dot div operations"));
                return null;
            }
        }
        mul(b) {
            if (typeof b === "number") {
                let tmp = new Vector([]);
                tmp.array = tmp.array.concat(this.array);
                for (let i in this.array) {
                    tmp.array[i] *= b;
                }
                return tmp;
            } else {
                // 叉乘
                if (b.type == "Vector") {
                    let a = new Matrix(this.length, 1, [this.array]);
                    let arr = [];
                    for (let i = 0; i < b.length; i++) {
                        arr.push([b.array[i]]);
                    }
                    b = new Matrix(1, b.length, arr);
                    // console.log(a);
                    // console.log(b);
                    return a.mul(b);
                }
                if (b.type == "Matrix") {
                    let selfMatrix = new Matrix(this.length, 1, [this.array]);
                    // console.log(selfMatrix, b);
                    let res = selfMatrix.mul(b);
                    return new Vector(res.array[0]);
                }
            }
        }
        trans(type) {
            if (type.search(/vector/i)) {
                if (this.length == 2) return new Vector2(...this.array);
                if (this.length == 3) return new Vector3(...this.array);
                if (this.length == 4) return new Vector4(...this.array);
                return new Vector(this.array);
            }
        }
        norm() {
            return this.div(this.mod());
        }
        proj(u) {// 投影
            let v = this.norm();
            let n = v.mul(u.dot(v));
            return n / (v.mod() * v.mod());
        }
        operatorEqual(b) {
            if (b.length != this.length) {
                console.error(new DarkFlame.DarkFlameError("math", "Error 100: Vector size does not match"));
                return null;
            }
            for (let i = 0; i < this.length; i++) {
                if (b.array[i] != this.array[i]) return false;
            }
            return true;
        }
    }
    class Vector2 extends Vector {
        constructor(x = 0, y = 0) {
            if (x.type && x.type == "Vector") super(x);
            else super([x, y]);
        }
        get x() {
            return this.get(0);
        }
        set x(n) {
            this.set(0, n);
            return n;
        }
        get y() {
            return this.get(1);
        }
        set y(n) {
            this.set(1, n);
            return n;
        }
        static Zero() {
            return new Vector2();
        }
    }
    class Vector3 extends Vector {
        constructor(x = 0, y = 0, z = 0) {
            if (x.type && x.type == "Vector") super(x);
            else super([x, y, z]);
        }
        get x() {
            return this.get(0);
        }
        set x(n) {
            this.set(0, n);
            return n;
        }
        get y() {
            return this.get(1);
        }
        set y(n) {
            this.set(1, n);
            return n;
        }
        get z() {
            return this.get(2);
        }
        set z(n) {
            this.set(2, n);
            return n;
        }
        static Zero() {
            return new Vector3();
        }
    }
    class Vector4 extends Vector {
        constructor(x = 0, y = 0, z = 0, w = 1) {
            if (x.type && x.type == "Vector") super(x);
            else super([x, y, z, w]);
        }
        get x() {
            return this.get(0) / this.w;
        }
        set x(n) {
            this.set(0, n);
            return n;
        }
        get y() {
            return this.get(1) / this.w;
        }
        set y(n) {
            this.set(1, n);
            return n;
        }
        get z() {
            return this.get(2) / this.w;
        }
        set z(n) {
            this.set(2, n);
            return n;
        }
        get w() {
            return this.get(3);
        }
        set w(n) {
            this.set(3, n);
            return n;
        }
        static Zero() {
            return new Vector4();
        }
    }

    /** todo 矩阵类 */
    class Matrix extends DarkFlame.Module.ModuleClass {
        constructor(w, h, fill = 0) {
            super("Matrix");
            this.array = [];
            if (w.type && w.type == "Matrix") {// 复制构造函数
                this.__w = w.w;
                this.__h = w.h;
                for (let i = 0; i < this.__h; i++) {
                    this.array.push([]);
                    for (let j = 0; j < this.__w; j++) {
                        this.array[i].push(w.array[i][j]);
                    }
                }
            } else {
                this.__w = w;
                this.__h = h;
                for (let i = 0 ;i < h; i++) {
                    this.array.push([]);
                    for (let j = 0; j < w; j++) {
                        if (typeof fill === "number")
                            this.array[i].push(fill);
                        else
                            this.array[i].push(fill[i][j]);
                    }
                }
            }
        }
        get w() {
            return this.__w;
        }
        get h() {
            return this.__h;
        }
        T() {
            let matrix = new Matrix(this.__h, this.__w);
            for (let i = 0 ;i < this.__w; i++) {
                for (let j = 0; j < this.__h; j++) {
                    matrix.array[i][j] = this.array[j][i];
                }
            }
            return matrix;
        }
        size() {
            return new Vector2(this.__w, this.__h);
        }
        get(i, j) {
            return this.array[i][j];
        }
        set(i, j, v) {
            this.array[i][j] = v;
            return this;
        }
        add(b) {
            // console.log(this.size() == b.size());
            if (this.size() != b.size()) {
                console.error(new DarkFlame.DarkFlameError("math", "Error 100: Matrix size does not match"));
                return null;
            }
            let c = new Matrix(this.w, this.h, this.array);
            for (let i = 0; i < this.h; i++) {
                for (let j = 0; j < this.w; j++) {
                    c.array[i][j] += b.array[i][j];
                }
            }
            return c;
        }
        sub(b) {
            // console.log(this.size() == b.size());
            if (this.size() != b.size()) {
                console.error(new DarkFlame.DarkFlameError("math", "Error 100: Matrix size does not match"));
                return null;
            }
            let c = new Matrix(this.w, this.h, this.array);
            for (let i = 0; i < this.h; i++) {
                for (let j = 0; j < this.w; j++) {
                    c.array[i][j] -= b.array[i][j];
                }
            }
            return c;
        }
        mul(b) {
            // console.log(this.size() == b.size());
            // console.log("mul: ", b);
            if (typeof b == "object") {
                if (b.type == "Matrix") {
                    if (this.w != b.h) {
                        console.error(new DarkFlame.DarkFlameError("math", "Error 100: Matrix size does not match"));
                        return null;
                    }
                    let n = this.w;
                    let c = new Matrix(this.h, b.w, 0);
                    for (let i = 0; i < this.h; i++) {
                        for (let j = 0; j < b.w; j++) {
                            let sum = 0;
                            for (let k = 0; k < n; k++) {
                                sum += this.array[i][k] * b.array[k][j];
                            }
                            c.array[i][j] = sum;
                        }
                    }
                    // console.log("mul", c);
                    return c;
                }
                // if (b.type == "Vector") {
                //
                // }
            } else {
                let c = new Matrix(this.w, this.h, [].concat(this.array));
                for (let i = 0; i < this.h; i++) {
                    for (let j = 0; j < this.w; j++) {
                        c.array[i][j] *= b;
                    }
                }
                return c;
            }
        }
        static identity(s) {
            let matrix = new Matrix(s, s);
            for (let i = 0; i < s; i++) {
                matrix.array[i][i] = 1;
            }
            return matrix;
        }
        static Zero(w, h) {
            return new Matrix(w, h);
        }
        static TransMove(d) {
            return new Matrix(4, 4, [
                [1,   0,   0,   0],
                [0,   1,   0,   0],
                [0,   0,   1,   0],
                [d.x, d.y, d.z, 0],
            ]);
        }
        static TransMoveInverse(d) {
            return new Matrix(4, 4, [
                [1,    0,    0,    0],
                [0,    1,    0,    0],
                [0,    0,    1,    0],
                [-d.x, -d.y, -d.z, 0],
            ]);
        }
        static TransScale(s) {
            return new Matrix(4, 4, [
                [s.x, 0,   0,   0],
                [0,   s.y, 0,   0],
                [0,   0,   s.z, 0],
                [0,   0,   0,   1],
            ]);
        }
        static TransScaleInverse(s) {
            return new Matrix(4, 4, [
                [1 / s.x, 0,       0,       0],
                [0,       1 / s.y, 0,       0],
                [0,       0,       1 / s.z, 0],
                [0,       0,       0,       1],
            ]);
        }
        static TransRotate(s) {
            let Mx = new Matrix(4, 4, [
                [1, 0,              0,             0],
                [0, Math.cos(s.x),  Math.sin(s.x), 0],
                [0, -Math.sin(s.x), Math.cos(s.x), 0],
                [0, 0,              0,             1],
            ]);
            let My = new Matrix(4, 4, [
                [Math.cos(s.y), 0, -Math.sin(s.y), 0],
                [0,             1, 0,              0],
                [Math.sin(s.y), 0, Math.cos(s.y),  0],
                [0,             0, 0,              1],
            ]);
            let Mz = new Matrix(4, 4, [
                [Math.cos(s.z),  Math.sin(s.z), 0, 0],
                [-Math.sin(s.z), Math.cos(s.z), 0, 0],
                [0,              0            , 1, 0],
                [0,              0            , 0, 1],
            ]);
            // console.log(Mx.operatorMul);
            return Mx.mul(My).mul(Mz);
        }
        static TransRotateInverse(s) {
            let Mx = new Matrix(4, 4, [
                [1, 0,              0,              0],
                [0, Math.cos(s.x),  -Math.sin(s.x), 0],
                [0, Math.sin(s.x),  Math.cos(s.x),  0],
                [0, 0,              0,              1],
            ]);
            let My = new Matrix(4, 4, [
                [Math.cos(s.y), 0, Math.sin(s.y),   0],
                [0,             1, 0,               0],
                [-Math.sin(s.y), 0, Math.cos(s.y),  0],
                [0,             0, 0,               1],
            ]);
            let Mz = new Matrix(4, 4, [
                [Math.cos(s.z),  -Math.sin(s.z), 0, 0],
                [Math.sin(s.z), Math.cos(s.z),   0, 0],
                [0,              0,              1, 0],
                [0,              0,              0, 1],
            ]);
            return Mx.mul(My).mul(Mz);
        }
    }
    class Matrix2x2 extends Matrix {
        constructor(fill) {
            super(2, 2, fill);
        }
        inverse() {
            let tmp = 1 / this.det();
            let c = new Matrix2x2([[this.array[1][1], -this.array[0][1]], [-this.array[1][0], this.array[0][0]]]);
            c = c * tmp;
            return c;
        }
        det() {
            return this.array[0][0] * this.array[1][1] + this.array[0][1] * this.array[1][0];
        }
    }

    /** todo 直线类 */
        // 表示方法: 参数化直线
        // 即: 起点, 终点, 方向
        // p(x, y, z) = p0 + v_ * t
        // t ∈ [-∞, +∞]
    class Parmline2D extends DarkFlame.Module.ModuleClass {
        constructor(v0, v1) {
            super("Parmline2D");
            this.p0 = new Vector2(v0);
            this.p1 = new Vector2(v1);
            this.v = new Vector2(v1 - v0);
            this.v_ = this.v.norm();
        }
    }
    class Parmline3D extends DarkFlame.Module.ModuleClass {
        constructor(v0, v1) {
            super("Parmline3D");
            this.p0 = new Vector3(v0);
            this.p1 = new Vector3(v1);
            this.v = new Vector3(v1 - v0);
            this.v_ = this.v.norm();
        }
    }

    /** todo 平面类 */
        // 表示方法: 点-法线形式
        // a * (x - x0) + b * (y - y0) + c * (z - z0) = 0
        // 或
        // a * x + b * y + c * z + (-a * x0 - b * y0 - c * z0) = 0
    class Plane3D extends DarkFlame.Module.ModuleClass {
        constructor(n, p0) {
            super("Plane3D");
            if (arguments.length < 2) {
                let p = n;
                this.n = new Vector3(p.n);
                this.p0 = new Vector3(p.p0);
            } else {
                this.n = new Vector3(n);// 法线向量
                this.p0 = new Vector3(p0);// 平面上一点
            }
        }
    }


    /** todo 平面分割3D空间, 判断点位于哪个半空间中, -1为负半空间, 0为平面上, 1为正半空间 */
    function PointPositionWithPlane(point, plane) {
        let a = plane.n.x, b = plane.n.y, c = plane.n.z;
        let hs = a * (point.x - plane.p0.x) + b * (point.y - plane.p0.y) + c * (point.z - plane.p0.z);
        if (hs > 0) return 1;
        if (hs < 0) return -1;
        return 0;
    }


    /** todo 计算两参数化2D线段的交点 */
    function intersParmlines2D(pl1, pl2) {
        let p0 = pl1.p0;
        let p2 = pl2.p0;
        let a = p0.x, b = p0.y, c = p2.x, d = p2.y;
        let p0v = pl1.v;
        let p2v = pl2.v;
        let e = p0v.x, f = p0v.y, g = p2v.x, h = p2v.y;
        // console.log(a, b, c, d, e, f, g, h);
        let t1 =
            (h * (c - a) - g * (d - b))
            /
            (h * e - g * f)
        ;
        // let t2 =
        //     (-c + a + e * t1)
        //     /
        //     g
        // ;
        let x = a + e * t1;
        let y = b + f * t1;
        return new Vector2(x, y);
    }
    /** todo 计算两参数化3D线段的交点 */
    function intersParmlines3D(pl1, pl2) {
        let p0 = pl1.p0;
        let p2 = pl2.p0;
        let a = p0.x, b = p0.y, c = p2.x, d = p2.y;
        let p0v = pl1.v;
        let p2v = pl2.v;
        let e = p0v.x, f = p0v.y, g = p2v.x, h = p2v.y;
        // console.log(a, b, c, d, e, f, g, h);
        let t1 =
            (h * (c - a) - g * (d - b))
            /
            (h * e - g * f)
        ;
        // let t2 =
        //     (-c + a + e * t1)
        //     /
        //     g
        // ;
        let x = a + e * t1;
        let y = b + f * t1;
        let z = p0.z + p0v.z * t1;
        return new Vector3(x, y, z);
    }

    const tInterval = new Interval("[0, 1]");

    /** todo 计算参数化直线与平面的交点 */
    function intersParmlinePlane(plane, parmline) {
        // console.log(parmline);
        let {x: x0, y: y0, z: z0} = parmline.p0;
        let {x: vx, y: vy, z: vz} = parmline.v;
        let {x: a, y: b, z: c} = plane.n;
        let d = -a * x0 - b * y0 - c * z0;
        let t =
            -(a * x0 + b * y0 + c * z0 + d)
            /
            (a * vx + b * vy + c * vz)
        ;
        // console.log(-(a * x0 + b * y0 + c * z0 + d));
        let x = x0 * vx * t;
        let y = y0 * vy * t;
        let z = z0 * vz * t;
        return new Vector3(x, y, z);
    }
    /** todo 计算参数化线段与平面的交点 */
    function intersSegmentPlane(parmline, plane) {
        let {x: x0, y: y0, z: z0} = parmline.p0;
        let {x: vx, y: vy, z: vz} = parmline.v;
        let {x: a, y: b, z: c} = plane.n;
        let d = -a * x0 - b * y0 - c * z0;
        let t =
            -(a * x0 + b * y0 + c * z0 + d)
            /
            (a * vx + b * vy + c * vz)
        ;
        if (!tInterval.have(t)) return null;
        let x = x0 * vx * t;
        let y = y0 * vy * t;
        let z = z0 * vz * t;
        return new Vector3(x, y, z);
    }


    /** todo 提供2D极坐标类 */
        // 2D极坐标: x 代表 r, y 代表 theta
    class Polar2D extends Vector2 {
        constructor(r = 0, theta = 0) {
            super(r ,theta);
        }
        get r() {
            return this.get(0);
        }
        get theta() {
            return this.get(1);
        }
        set r(n) {
            this.set(0, n);
            return n;
        }
        set theta(n) {
            this.set(1, n);
            return n;
        }
    }

    /** todo 提供3D柱面坐标类 */
        // 3D柱面坐标: x 代表 r, y 代表 theta, z 代表 z
    class Cylindrical3D extends Vector3 {
        constructor(r = 0, theta = 0, z = 0) {
            super(r ,theta, z);
        }
        get r() {
            return this.get(0);
        }
        get theta() {
            return this.get(1);
        }
        set r(n) {
            this.set(0, n);
            return n;
        }
        set theta(n) {
            this.set(1, n);
            return n;
        }
    }
    /** todo 提供3D球面坐标类 */
        // 3D球面坐标: x 代表 rho, y 代表 phi, z 代表 theta
    class Spherical3D extends Vector3 {
        constructor(rho = 0, phi = 0, theta = 0) {
            super(rho ,phi, theta);
        }
        get rho() {
            return this.get(0);
        }
        get phi() {
            return this.get(1);
        }
        get theta() {
            return this.get(2);
        }
        set rho(n) {
            this.set(0, n);
            return n;
        }
        set phi(n) {
            this.set(1, n);
            return n;
        }
        set theta(n) {
            this.set(2, n);
            return n;
        }
    }

    // 坐标转换
    /** todo 2D极坐标转2D笛卡尔坐标 */
    function polar2DToRect2D(polar) {
        return new Vector2(polar.r * Math.cos(polar.theta), polar.r * Math.sin(polar.theta));
    }
    /** todo 2D笛卡尔坐标转2D极坐标 */
    function rect2DToPolar2D(point) {
        let d = (Math.atan(point.y / point.x));
        return new Polar2D(Math.sqrt(point.x * point.x + point.y * point.y), String(d) === "NaN" ? 0 : d);
    }
    /** todo 3D柱面坐标转3D笛卡尔坐标 */
    function cylindrical3DToRect3D(cylindrical) {
        return new Vector3(cylindrical.r * Math.cos(cylindrical.theta), cylindrical.r * Math.sin(cylindrical.theta), cylindrical.z);
    }
    /** todo 3D笛卡尔坐标转3D柱面坐标 */
    function rect3DToCylindrical3D(point) {
        let d = (Math.atan(point.y / point.x));
        return new Cylindrical3D(Math.sqrt(point.x * point.x + point.y * point.y), String(d) === "NaN" ? 0 : d, point.z);
    }
    /** todo 3D球面坐标转3D笛卡尔坐标 */
    function spherical3DToRect3D(spherical) {
        return new Vector3(
            spherical.rho * Math.sin(spherical.phi) * Math.cos(spherical.theta),
            spherical.rho * Math.sin(spherical.phi) * Math.sin(spherical.theta),
            spherical.rho * Math.cos(spherical.phi)
        );
    }
    /** todo 3D笛卡尔坐标转3D1球面坐标 */
    function rect3DToSpherical3D(point) {
        let d1 = (Math.atan(point.y / point.x));
        let rho = Math.sqrt(point.x * point.x + point.y * point.y + point.z * point.z);
        let d2 = (Math.acos(point.z / rho));
        return new Spherical3D(
            rho,
            String(d1) === "NaN" ? 0 : d1,
            String(d2) === "NaN" ? 0 : d2,
        );
    }

    // 随机数函数
    function rand(s, e) {
        return (Math.random() * (e - s) + s);
    }
    function randint(s, e) {
        return parseInt(rand(s, e));
    }

    module.define("smallest", smallest);
    module.define("smallestLen", smallestLen);
    module.define("probably", probably);

    module.define("Enum", Enum);
    module.define("MathSet", MathSet);
    module.define("Interval", Interval);

    module.define("Vector", Vector);
    module.define("Vector2", Vector2);
    module.define("Polar2D", Polar2D);
    module.define("Vector3", Vector3);
    module.define("Vector4", Vector4);

    module.define("Matrix", Matrix);
    module.define("Matrix2x2", Matrix2x2);

    module.define("Parmline2D", Parmline2D);
    module.define("Parmline3D", Parmline3D);
    module.define("Plane3D", Plane3D);
    module.define("PointPositionWithPlane", PointPositionWithPlane);
    module.define("intersParmlines2D", intersParmlines2D);
    module.define("intersParmlines3D", intersParmlines3D);
    module.define("intersParmlinePlane", intersParmlinePlane);
    module.define("intersSegmentPlane", intersSegmentPlane);


    module.define("Polar2D", Polar2D);
    module.define("Cylindrical3D", Cylindrical3D);
    module.define("Spherical3D", Spherical3D);

    module.define("polar2DToRect2D", polar2DToRect2D);
    module.define("rect2DToPolar2D", rect2DToPolar2D);
    module.define("cylindrical3DToRect3D", cylindrical3DToRect3D);
    module.define("rect3DToCylindrical3D", rect3DToCylindrical3D);
    module.define("spherical3DToRect3D", spherical3DToRect3D);
    module.define("rect3DToSpherical3D", rect3DToSpherical3D);

    module.define("rand", rand);
    module.define("randint", randint);


    module.bind();// 将包加入DarkFlame static member中
}(DarkFlame);