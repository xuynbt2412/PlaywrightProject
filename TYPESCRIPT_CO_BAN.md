# Sổ tay TypeScript cơ bản

Tài liệu tra cứu dành cho người mới học: giải thích, cú pháp, ví dụ và lỗi thường gặp. Nội dung tập trung vào cách đọc và viết TypeScript trong công việc hằng ngày.

**Cách đọc:** học theo thứ tự từ mục 1 đến mục 10, sau đó đọc phần bổ sung và thực hành. Các khối code là ví dụ độc lập; không ghép tất cả vào một file vì một số ví dụ dùng lại tên biến. Những dòng được chú thích “lỗi” dùng để giải thích, không nên bỏ chú thích khi chạy.

**Cách xem:** mở file này bằng trình soạn thảo bất kỳ. Trong VS Code, nhấn `Ctrl + Shift + V` để xem Markdown có định dạng. Dùng `Ctrl + F` để tìm tên phương thức hoặc từ khóa.

## Mục lục

1. [TypeScript là gì?](#01-typescript)
2. [Comment](#02-comment)
3. [Variable và constant](#03-variable)
4. [Kiểu dữ liệu và object](#04-types)
5. [Array](#05-array)
6. [Điều kiện và loop](#06-loop)
7. [Function](#07-function)
8. [Xử lý string](#08-string)
9. [Xử lý array](#09-array-utils)
10. [Class](#10-class)
11. [Module, xử lý lỗi và bất đồng bộ](#11-extra)
12. [Ví dụ tổng hợp](#12-example)
13. [Lỗi thường gặp và bảng tra nhanh](#13-reference)
14. [Bài tập và lời giải gợi ý](#14-practice)

<a id="01-typescript"></a>

## 1. TypeScript là gì?

TypeScript bổ sung hệ thống kiểu dữ liệu cho JavaScript. Bạn vẫn sử dụng các cú pháp JavaScript quen thuộc như `if`, `for`, `function`, `class`, đồng thời có thể khai báo kiểu để phát hiện nhiều lỗi trước khi chạy chương trình.

```ts
const userName: string = "An";
const age: number = 25;

function greet(name: string): string {
  return `Xin chào ${name}`;
}

console.log(greet(userName)); // Xin chào An
// greet(age); // Lỗi kiểu: number không phù hợp với tham số string.
```

Các điểm cần nhớ:

- File TypeScript thường có đuôi `.ts`.
- Phần khai báo kiểu thường được loại bỏ khi chuyển sang JavaScript để thực thi.
- Kiểm tra kiểu không thay thế việc kiểm tra dữ liệu lúc chạy. Dữ liệu từ API, file hoặc người dùng vẫn cần được xác thực.
- Các phương thức như `map()`, `filter()`, `trim()` là API của JavaScript, dùng được trong TypeScript.
- Ví dụ trong tài liệu ưu tiên chế độ `strict` để việc kiểm tra kiểu chặt chẽ hơn.

### Kiểm tra kiểu bằng compiler

Nếu muốn tạo một môi trường thực hành riêng, có thể cài TypeScript trong thư mục đó:

```bash
npm install --save-dev typescript
npx tsc --init
```

Sau khi cấu hình dự án, dùng:

```bash
npx tsc --noEmit
```

Lệnh trên kiểm tra kiểu theo `tsconfig.json` mà không xuất file JavaScript. Nếu có chủ động bật `noCheck`, cần tắt tùy chọn đó để kiểm tra kiểu đầy đủ. `tsc` là công cụ kiểm tra/biên dịch, không phải lệnh chạy chương trình.

<a id="02-comment"></a>

## 2. Comment — chú thích

Comment dùng để giải thích ý nghĩa, lý do hoặc cách sử dụng code. Comment thông thường không được thực thi.

### 2.1. Comment một dòng

```ts
// Số lần thử lại tối đa khi kết nối thất bại.
const maxRetries = 3;

const price = 100_000; // Đơn vị: VND.
```

### 2.2. Comment nhiều dòng

```ts
/*
  Chuẩn hóa tên trước khi lưu:
  - Xóa khoảng trắng đầu/cuối.
  - Giữ nguyên chữ hoa/chữ thường.
*/
const fullName = "  Nguyễn An  ".trim();
```

### 2.3. Comment tài liệu cho hàm

```ts
/**
 * Tính thành tiền trước khi áp dụng giảm giá.
 * @param price Giá của một sản phẩm.
 * @param quantity Số lượng sản phẩm.
 * @returns Tổng tiền.
 */
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}
```

**Nên làm:** giải thích lý do hoặc quy tắc nghiệp vụ khó suy ra từ code. Không cần ghi comment lặp lại từng phép gán đơn giản.

<a id="03-variable"></a>

## 3. Variable và constant — biến và hằng

### 3.1. Cú pháp khai báo

```ts
// Từ khóa + tên biến + kiểu dữ liệu + giá trị.
let quantity: number = 2;
const shopName: string = "My Shop";

quantity = 3; // Hợp lệ: let cho phép gán lại.
// shopName = "Other Shop"; // Lỗi: const không cho phép gán lại.
```

| Từ khóa | Gán lại được? | Phạm vi | Cách sử dụng |
|---|---|---|---|
| `let` | Có | Block `{ ... }` | Khi giá trị cần được gán lại |
| `const` | Không | Block `{ ... }` | Khi không cần gán lại biến |
| `var` | Có | Function hoặc phạm vi ngoài function | Cần hiểu để đọc code cũ; ưu tiên `let`/`const` khi viết mới |

`const` phải được khởi tạo khi khai báo. `var` có hành vi hoisting và cho phép khai báo lại trong cùng phạm vi; điều này dễ gây nhầm lẫn. `let` và `const` không thể được truy cập trước dòng khai báo trong phạm vi của chúng.

### 3.2. Type annotation và type inference

**Type annotation:** tự ghi kiểu. **Type inference:** TypeScript suy ra kiểu từ giá trị và ngữ cảnh.

```ts
let score: number = 10; // Khai báo kiểu rõ ràng.
let total = 100;        // TypeScript suy ra number.
const title = "Home";  // Suy ra literal type "Home" cho biến const này.

// total = "100"; // Lỗi: biến total có kiểu number.
```

Với dữ liệu đơn giản, không cần viết kiểu lặp lại nếu TypeScript đã suy ra đúng. Với tham số hàm hoặc cấu trúc dữ liệu dùng chung, khai báo kiểu giúp code dễ hiểu hơn.

### 3.3. Scope — phạm vi biến

```ts
const outside = "Có thể dùng trong block bên dưới";

if (true) {
  const inside = "Chỉ dùng được trong block này";
  console.log(outside, inside);
}

// console.log(inside); // Lỗi: không tìm thấy inside ở phạm vi này.
```

### 3.4. `const` không làm object hoặc array bất biến

```ts
const user = { name: "An", age: 20 };
user.age = 21; // Hợp lệ: sửa thuộc tính.

const numbers = [1, 2];
numbers.push(3); // Hợp lệ: sửa nội dung mảng.

// user = { name: "Bình", age: 22 }; // Lỗi: gán lại biến const.
// numbers = [4, 5];                 // Lỗi: gán lại biến const.
```

### 3.5. Quy tắc đặt tên

- Biến và hàm thường dùng `camelCase`: `userName`, `calculateTotal`.
- Type, interface và class thường dùng `PascalCase`: `User`, `ProductService`.
- Hằng cấu hình có thể dùng `UPPER_SNAKE_CASE`: `MAX_RETRIES`.
- Tên nên diễn đạt ý nghĩa: `totalPrice` rõ hơn `tp`.

<a id="04-types"></a>

## 4. Kiểu dữ liệu và object

### 4.1. Các kiểu cơ bản

| Kiểu | Ý nghĩa | Ví dụ |
|---|---|---|
| `string` | Chuỗi ký tự | `"hello"` |
| `number` | Số nguyên và số thập phân | `10`, `3.14` |
| `boolean` | Đúng/sai | `true`, `false` |
| `null` | Giá trị rỗng được đặt chủ động | `null` |
| `undefined` | Giá trị chưa được cung cấp | `undefined` |
| `bigint` | Số nguyên lớn, cần runtime/target phù hợp | `123n` |
| `symbol` | Giá trị định danh duy nhất | `Symbol("id")` |

```ts
const name: string = "An";
const age: number = 25;
const isActive: boolean = true;
let selectedId: number | null = null;
let optionalName: string | undefined = undefined;
```

Sử dụng `string`, `number`, `boolean` thay vì các kiểu wrapper `String`, `Number`, `Boolean` trong khai báo thông thường.

### 4.2. `any`, `unknown`, `void`, `never`

| Kiểu | Công dụng | Điểm cần nhớ |
|---|---|---|
| `any` | Bỏ qua phần lớn kiểm tra kiểu đối với giá trị đó | Dễ làm mất khả năng phát hiện lỗi |
| `unknown` | Biểu diễn dữ liệu chưa biết kiểu | Phải kiểm tra/thu hẹp kiểu trước khi thao tác |
| `void` | Hàm không cung cấp giá trị trả về để sử dụng | Thường gặp ở hàm chỉ thực hiện hành động |
| `never` | Giá trị không thể xuất hiện; hàm không bao giờ kết thúc bình thường | Ví dụ hàm luôn ném lỗi |

```ts
function printMessage(message: string): void {
  console.log(message);
}

function fail(message: string): never {
  throw new Error(message);
}

function printUnknown(value: unknown): void {
  if (typeof value === "string") {
    console.log(value.toUpperCase()); // Đã xác định value là string.
  }
}
```

### 4.3. Union type, literal type và narrowing

Union cho phép một giá trị thuộc một trong nhiều kiểu. Literal type giới hạn giá trị cụ thể. Narrowing là thu hẹp kiểu dựa trên điều kiện kiểm tra.

```ts
let id: string | number = 123;
id = "USER-123";

type Status = "pending" | "success" | "failed";
const status: Status = "pending";
// const invalid: Status = "done"; // Lỗi: không thuộc các giá trị cho phép.

function formatId(value: string | number): string {
  if (typeof value === "number") {
    return value.toFixed(0);
  }

  return value.trim(); // Ở đây value là string.
}
```

### 4.4. Object và khai báo cấu trúc

Object chứa các cặp thuộc tính và giá trị. Dùng `type` hoặc `interface` để mô tả dữ liệu thay vì chỉ khai báo kiểu `object` chung chung.

```ts
type User = {
  readonly id: number;
  name: string;
  age: number;
  email?: string; // Có thể không xuất hiện.
};

const user: User = {
  id: 1,
  name: "An",
  age: 25,
};

console.log(user.name);    // An
console.log(user["age"]); // 25
user.name = "Bình";
user.email = "binh@example.com";
// user.id = 2; // Lỗi kiểu: id là readonly.
```

`readonly` ngăn việc gán qua thuộc tính đó khi TypeScript kiểm tra kiểu. Nó không tự đóng băng object lúc chạy và không mặc định làm mọi object lồng bên trong trở thành bất biến.

### 4.5. `interface` và `type`

```ts
interface Person {
  name: string;
}

interface Employee extends Person {
  employeeId: number;
}

type Identifier = string | number;
type Admin = Person & { role: "admin" };
```

- Cả hai đều có thể mô tả cấu trúc object.
- `interface` hỗ trợ mở rộng bằng `extends` và gộp khai báo cùng tên trong những ngữ cảnh phù hợp.
- `type` còn đặt tên cho union, tuple và các tổ hợp kiểu khác; dùng `&` để kết hợp kiểu.
- Với object đơn giản, chọn cách nhất quán trong dự án.

### 4.6. Optional chaining `?.` và nullish coalescing `??`

```ts
type Profile = {
  address?: {
    city?: string;
  };
};

function getCity(profile: Profile | null): string {
  return profile?.address?.city ?? "Chưa cập nhật";
}

console.log(getCity(null)); // Chưa cập nhật
console.log(getCity({ address: { city: "Đà Nẵng" } })); // Đà Nẵng

const count = 0;
console.log(count || 10); // 10
console.log(count ?? 10); // 0
```

- `?.` dừng truy cập và trả về `undefined` nếu phần được kiểm tra là `null` hoặc `undefined`.
- `??` dùng giá trị dự phòng chỉ khi vế trái là `null` hoặc `undefined`.
- `||` dùng giá trị dự phòng với mọi giá trị falsy như `0`, `""`, `false`, `NaN`, `null`, `undefined`.

### 4.7. Destructuring và spread với object

```ts
const user = { id: 1, name: "An", age: 25 };

const { name, age } = user;
const { name: displayName } = user; // Đổi tên biến khi lấy thuộc tính.
const updatedUser = { ...user, age: 26 }; // Ghi đè age sau khi copy.

console.log(name, age, displayName); // An 25 An
console.log(user.age);              // 25
console.log(updatedUser.age);       // 26
```

Spread chỉ tạo bản sao nông: object/array lồng bên trong vẫn được chia sẻ tham chiếu.

### 4.8. Type assertion `as` không chuyển đổi dữ liệu

```ts
const input = "123";
const value = Number(input); // Chuyển đổi dữ liệu thật: string thành number.

const raw: unknown = "hello";
const text = raw as string; // Chỉ báo cho compiler coi raw là string.

console.log(value + 1); // 124
console.log(text.toUpperCase()); // HELLO
```

`as` không xác minh dữ liệu lúc chạy. Không dùng `as` để che lỗi khi chưa biết chắc cấu trúc dữ liệu. Tương tự, dấu `!` sau biến có thể bỏ `null`/`undefined` khỏi kiểu nhưng không kiểm tra giá trị thực tế.

### 4.9. Một số utility type hữu ích

```ts
type User = { id: number; name: string; email: string };

type UserPatch = Partial<User>;                // Mọi thuộc tính thành tùy chọn.
type UserPreview = Pick<User, "id" | "name">; // Chỉ lấy id và name.
type NewUser = Omit<User, "id">;               // Bỏ id.
type ReadonlyUser = Readonly<User>;            // Thuộc tính thành readonly.

const scores: Record<string, number> = {
  math: 9,
  english: 8,
};
```

Các utility type chỉ biến đổi kiểu, không tự xóa, thêm hoặc đóng băng thuộc tính của object lúc chạy. Với key chưa chắc tồn tại trong `Record`, vẫn cần xử lý khả năng thiếu giá trị; tùy chọn `noUncheckedIndexedAccess` giúp phát hiện trường hợp này.

<a id="05-array"></a>

## 5. Array — mảng

### 5.1. Khai báo và truy cập

```ts
const numbers: number[] = [10, 20, 30];
const names: Array<string> = ["An", "Bình"];
const mixed: (string | number)[] = [1, "A", 2, "B"];

console.log(numbers[0]);     // 10: index bắt đầu từ 0.
console.log(numbers.length); // 3
numbers[1] = 99;
console.log(numbers);        // [10, 99, 30]
```

Truy cập index không tồn tại trả về `undefined` lúc chạy. Bật `noUncheckedIndexedAccess` để TypeScript phản ánh rủi ro này rõ hơn trong kiểu khi truy cập mảng.

### 5.2. Mảng object

```ts
type Product = {
  id: number;
  name: string;
  price: number;
};

const products: Product[] = [
  { id: 1, name: "Bút", price: 5_000 },
  { id: 2, name: "Vở", price: 12_000 },
];

console.log(products[0]?.name); // Bút
```

### 5.3. Tuple — kiểu của từng vị trí

```ts
const coordinate: [number, number] = [10, 20];
const result: [boolean, string] = [true, "Thành công"];

const [success, message] = result;
console.log(success, message); // true Thành công
```

Tuple phù hợp khi vị trí có ý nghĩa rõ ràng và cấu trúc được biết trước. Tuple vẫn là array ở runtime; tuple có thể thay đổi nếu không khai báo `readonly`.

### 5.4. Destructuring, rest và spread

```ts
const numbers = [1, 2, 3, 4];
const [first, second, ...remaining] = numbers;

console.log(first);     // 1
console.log(second);    // 2
console.log(remaining); // [3, 4]

const copied = [...numbers];
const combined = [...numbers, 5, 6];
```

`...remaining` gom phần còn lại khi destructuring. `...numbers` trải các phần tử khi tạo mảng mới. Spread array cũng là sao chép nông.

### 5.5. Mảng chỉ đọc và `as const`

```ts
const values: readonly number[] = [1, 2, 3];
// values.push(4); // Lỗi kiểu: mảng chỉ đọc.

const statuses = ["pending", "done"] as const;
// Suy ra readonly tuple ["pending", "done"].
type Status = typeof statuses[number]; // "pending" | "done"
```

`as const` giữ các literal type và tạo thuộc tính/tuple chỉ đọc ở cấp kiểm tra kiểu theo biểu thức được áp dụng. Nó không gọi `Object.freeze()` và không tạo cơ chế đóng băng dữ liệu lúc chạy.

<a id="06-loop"></a>

## 6. Điều kiện và loop — vòng lặp

### 6.1. Các toán tử thường dùng

| Nhóm | Toán tử | Ý nghĩa |
|---|---|---|
| Số học | `+`, `-`, `*`, `/`, `%`, `**` | Cộng, trừ, nhân, chia, chia lấy dư, lũy thừa |
| Gán | `=`, `+=`, `-=`, `*=`, `/=` | Gán hoặc cập nhật biến |
| So sánh | `===`, `!==`, `>`, `<`, `>=`, `<=` | So sánh giá trị |
| Logic | `&&`, `\|\|`, `!` | Và, hoặc, phủ định |
| Tăng/giảm | `++`, `--` | Tăng/giảm một đơn vị |

Ưu tiên `===` và `!==` để tránh chuyển kiểu ngầm khi so sánh. `&&` và `||` có cơ chế dừng sớm và có thể trả về chính toán hạng, không phải lúc nào cũng trả về boolean.

### 6.2. `if`, `else if`, `else`

```ts
const score = 8;

if (score >= 8) {
  console.log("Giỏi");
} else if (score >= 5) {
  console.log("Đạt");
} else {
  console.log("Chưa đạt");
}
```

### 6.3. Toán tử ba ngôi

```ts
const age = 20;
const label = age >= 18 ? "Người lớn" : "Chưa đủ 18 tuổi";
```

Cú pháp: `điều_kiện ? giá_trị_khi_đúng : giá_trị_khi_sai`. Dùng khi biểu thức ngắn; tránh lồng nhiều tầng khó đọc.

### 6.4. `switch`

```ts
function getRoleLabel(role: string): string {
  switch (role) {
    case "admin":
      return "Quản trị viên";
    case "editor":
      return "Biên tập viên";
    default:
      return "Người dùng";
  }
}
```

Ở ví dụ này, `return` kết thúc hàm nên không cần `break`. Nếu mỗi nhánh chỉ thực hiện hành động, thường cần `break` để tránh chạy tiếp xuống nhánh bên dưới.

### 6.5. `for` — khi cần index hoặc số lần lặp

```ts
// Khởi tạo; điều kiện tiếp tục; cập nhật sau mỗi lượt.
for (let i = 0; i < 3; i++) {
  console.log(i); // Lần lượt: 0, 1, 2.
}
```

### 6.6. `for...of` — duyệt giá trị

```ts
const names = ["An", "Bình", "Chi"];

for (const name of names) {
  console.log(name);
}

for (const [index, name] of names.entries()) {
  console.log(index, name); // Có cả index và giá trị.
}
```

### 6.7. `for...in` — duyệt key

```ts
const scores: Record<string, number> = { math: 9, english: 8 };

for (const key in scores) {
  if (Object.prototype.hasOwnProperty.call(scores, key)) {
    console.log(key, scores[key]);
  }
}

// Cách thuận tiện để lấy các thuộc tính riêng có thể liệt kê của object:
for (const [subject, score] of Object.entries(scores)) {
  console.log(subject, score);
}
```

`for...in` duyệt key chuỗi có thể liệt kê, kể cả thuộc tính kế thừa có thể liệt kê. Với array, dùng `for...of` để lấy giá trị; `for...in` không phải lựa chọn thông thường để duyệt phần tử.

### 6.8. `while` và `do...while`

```ts
let count = 0;

while (count < 3) {
  console.log(count);
  count++;
}

let attempt = 0;

do {
  attempt++;
  console.log(`Lần thử ${attempt}`);
} while (attempt < 2);
```

- `while`: kiểm tra điều kiện trước, có thể không chạy lần nào.
- `do...while`: chạy thân vòng lặp ít nhất một lần, sau đó mới kiểm tra.
- Cần có cách tiến tới điều kiện dừng để tránh vòng lặp vô hạn.

### 6.9. `break` và `continue`

```ts
for (const value of [1, 2, 3, 4, 5]) {
  if (value === 2) continue; // Bỏ qua phần còn lại của lượt này.
  if (value === 4) break;    // Kết thúc vòng lặp.
  console.log(value);       // In 1 và 3.
}
```

<a id="07-function"></a>

## 7. Function — hàm

Hàm đóng gói một tác vụ để tái sử dụng. **Parameter** là tham số trong khai báo hàm; **argument** là giá trị truyền vào khi gọi.

### 7.1. Function declaration

```ts
function add(a: number, b: number): number {
  return a + b;
}

const total = add(2, 3); // 5
```

`a`, `b` là parameter; `2`, `3` là argument. `: number` sau dấu `)` là kiểu trả về. TypeScript cũng có thể suy ra kiểu trả về trong nhiều trường hợp.

### 7.2. Function expression và arrow function

```ts
const subtract = function (a: number, b: number): number {
  return a - b;
};

const multiply = (a: number, b: number): number => a * b;

// Trả về object bằng arrow function dạng ngắn: bọc object trong ().
const createUser = (name: string) => ({ name, active: true });
```

Arrow function không tạo `this` riêng mà lấy `this` từ phạm vi bao quanh. Khác biệt này quan trọng khi viết phương thức hoặc callback liên quan đến class/object.

### 7.3. Tham số tùy chọn và giá trị mặc định

```ts
function greet(name: string, title?: string): string {
  return title ? `Xin chào ${title} ${name}` : `Xin chào ${name}`;
}

function calculatePrice(price: number, quantity: number = 1): number {
  return price * quantity;
}

console.log(greet("An"));          // Xin chào An
console.log(calculatePrice(100));   // 100
console.log(calculatePrice(100, 3)); // 300
```

Tham số `?` thường đứng sau các tham số bắt buộc. Giá trị mặc định được dùng khi đối số bị bỏ qua hoặc là `undefined`; không được dùng chỉ vì đối số là `0`, `false` hoặc `null`.

### 7.4. Rest parameters

```ts
function sum(...numbers: number[]): number {
  return numbers.reduce((total, value) => total + value, 0);
}

console.log(sum(1, 2, 3)); // 6
console.log(sum());        // 0
```

Rest parameter gom các đối số còn lại thành array và phải đứng cuối danh sách tham số.

### 7.5. Callback và kiểu của hàm

Callback là hàm được truyền vào hàm khác để thực hiện một phần công việc.

```ts
type NumberOperation = (value: number) => number;

function transform(value: number, operation: NumberOperation): number {
  return operation(value);
}

const result = transform(5, (value) => value * 2);
console.log(result); // 10
```

### 7.6. Generic cơ bản

Generic giữ mối liên hệ giữa các kiểu khi tái sử dụng hàm cho nhiều loại dữ liệu.

```ts
function first<T>(items: readonly T[]): T | undefined {
  return items[0];
}

const firstNumber = first([10, 20]); // number | undefined
const firstName = first(["An", "Bình"]); // string | undefined
const emptyResult = first<string>([]); // undefined ở runtime
```

`T` là tham số kiểu. Khác với `any`, generic vẫn giữ thông tin kiểu của dữ liệu truyền vào và kết quả trả về.

### 7.7. Phân biệt `return` và `console.log`

```ts
function getTotal(a: number, b: number): number {
  return a + b; // Đưa kết quả cho nơi gọi.
}

function printTotal(a: number, b: number): void {
  console.log(a + b); // Chỉ hiển thị kết quả.
}

const value = getTotal(2, 3); // value là 5.
printTotal(2, 3);             // In 5; không trả về tổng để sử dụng.
```

<a id="08-string"></a>

## 8. Hàm và phương thức xử lý string

String là bất biến. Các phương thức tạo chuỗi mới không sửa chuỗi ban đầu; cần gán hoặc sử dụng kết quả trả về.

### 8.1. Bảng tra nhanh

| Nhu cầu | Cú pháp | Kết quả |
|---|---|---|
| Lấy độ dài | `text.length` | Số đơn vị mã UTF-16 |
| Xóa khoảng trắng đầu/cuối | `text.trim()` | Chuỗi mới |
| Xóa khoảng trắng đầu hoặc cuối | `text.trimStart()`, `text.trimEnd()` | Chuỗi mới |
| Đổi hoa/thường | `text.toUpperCase()`, `text.toLowerCase()` | Chuỗi mới |
| Kiểm tra chuỗi con | `text.includes(value)` | `boolean` |
| Kiểm tra đầu/cuối | `text.startsWith(value)`, `text.endsWith(value)` | `boolean` |
| Tìm vị trí đầu/cuối | `text.indexOf(value)`, `text.lastIndexOf(value)` | Index hoặc `-1` |
| Lấy một đoạn | `text.slice(start, end)` | Không bao gồm vị trí `end` |
| Lấy một đoạn khác | `text.substring(start, end)` | Không hỗ trợ index âm như `slice` |
| Thay thế | `text.replace(search, replacement)` | Chuỗi mới |
| Thay thế tất cả | `text.replaceAll(search, replacement)` | Chuỗi mới |
| Tách chuỗi | `text.split(separator)` | `string[]` |
| Bổ sung ký tự | `text.padStart(length, fill)`, `text.padEnd(length, fill)` | Chuỗi mới |
| Lặp lại chuỗi | `text.repeat(count)` | Chuỗi mới |

### 8.2. Chuẩn hóa và kiểm tra nội dung

```ts
const raw = "  Hello TypeScript  ";
const clean = raw.trim();

console.log(clean);                       // "Hello TypeScript"
console.log(clean.toLowerCase());         // "hello typescript"
console.log(clean.toUpperCase());         // "HELLO TYPESCRIPT"
console.log(clean.includes("Type"));      // true
console.log(clean.startsWith("Hello"));   // true
console.log(clean.endsWith("Script"));    // true
console.log(clean.includes("typescript")); // false: phân biệt hoa/thường.
console.log(raw);                         // Vẫn có khoảng trắng đầu/cuối.
```

### 8.3. Tìm vị trí và cắt chuỗi

```ts
const text = "TypeScript";

console.log(text.indexOf("Script")); // 4
console.log(text.indexOf("Java"));   // -1
console.log(text.slice(0, 4));       // "Type"
console.log(text.slice(4));          // "Script"
console.log(text.slice(-6));         // "Script": lấy từ cuối.
console.log(text.substring(0, 4));   // "Type"
```

`substring()` coi index âm là `0` và hoán đổi hai mốc nếu mốc đầu lớn hơn mốc cuối. `slice()` hỗ trợ index âm và không hoán đổi hai mốc theo cách đó.

### 8.4. Thay thế, tách và ghép

```ts
const text = "apple apple";

console.log(text.replace("apple", "orange"));    // "orange apple"
console.log(text.replaceAll("apple", "orange")); // "orange orange"
console.log(text.replace(/apple/g, "orange"));   // "orange orange"

const tags = "typescript,playwright,testing".split(",");
console.log(tags);           // ["typescript", "playwright", "testing"]
console.log(tags.join(" | ")); // "typescript | playwright | testing"
```

`replace()` với chuỗi tìm kiếm chỉ thay lần xuất hiện đầu tiên. Với regex, cờ `g` cho phép thay tất cả. Nếu truyền regex vào `replaceAll()`, regex phải có cờ `g`.

### 8.5. Template literal và chuyển đổi kiểu

```ts
const name = "An";
const count = 3;
console.log(`${name} có ${count} thông báo.`);

console.log(String(123));              // "123"
console.log(Number("123"));           // 123
console.log(Number("abc"));           // NaN
console.log(Number(""));              // 0: cần lưu ý với dữ liệu nhập.
console.log(Number.parseInt("42px", 10)); // 42
console.log(Number.parseFloat("3.14kg")); // 3.14
```

`parseInt()` và `parseFloat()` có thể đọc phần đầu hợp lệ rồi bỏ phần đuôi. Nếu cần xác thực toàn bộ chuỗi là một số, không chỉ dựa vào các hàm này. Dùng `Number.isNaN()` hoặc `Number.isFinite()` để kiểm tra kết quả phù hợp với yêu cầu.

### 8.6. Viết utility function cho string

```ts
function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function containsIgnoreCase(text: string, keyword: string): boolean {
  return text.toLowerCase().includes(keyword.toLowerCase());
}

console.log(normalizeWhitespace("  Nguyễn   Văn  An  ")); // "Nguyễn Văn An"
console.log(containsIgnoreCase("TypeScript", "script")); // true
console.log("7".padStart(3, "0")); // "007"
```

Regex `/\s+/g` tìm mọi nhóm gồm một hoặc nhiều ký tự khoảng trắng. Hàm `containsIgnoreCase()` phù hợp với nhu cầu đơn giản, không tự bỏ dấu tiếng Việt hay xử lý mọi quy tắc ngôn ngữ.

**Lưu ý Unicode:** `"😊".length` là `2` vì `length` đếm đơn vị mã UTF-16. Một ký tự hiển thị có thể gồm nhiều đơn vị mã hoặc nhiều code point; không mặc định coi `length` là số ký tự người dùng nhìn thấy.

<a id="09-array-utils"></a>

## 9. Hàm và phương thức xử lý array

### 9.1. Bảng tra nhanh

| Phương thức | Công dụng | Giá trị trả về | Tự sửa mảng gốc? |
|---|---|---|---|
| `push(x)` | Thêm cuối | Độ dài mới | Có |
| `pop()` | Xóa cuối | Phần tử bị xóa hoặc `undefined` | Có |
| `unshift(x)` | Thêm đầu | Độ dài mới | Có |
| `shift()` | Xóa đầu | Phần tử bị xóa hoặc `undefined` | Có |
| `splice(start, count, ...items)` | Xóa/chèn/thay tại vị trí | Mảng các phần tử bị xóa | Có |
| `slice(start, end)` | Lấy một đoạn | Mảng mới | Không |
| `concat(other)` | Ghép mảng | Mảng mới | Không |
| `forEach(callback)` | Thực hiện hành động cho từng phần tử | `undefined` | Không* |
| `map(callback)` | Biến đổi từng phần tử | Mảng mới | Không* |
| `filter(callback)` | Lấy mọi phần tử thỏa điều kiện | Mảng mới | Không* |
| `find(callback)` | Lấy phần tử đầu tiên thỏa điều kiện | Phần tử hoặc `undefined` | Không* |
| `findIndex(callback)` | Tìm index đầu tiên thỏa điều kiện | Index hoặc `-1` | Không* |
| `includes(x)` | Kiểm tra có giá trị | `boolean` | Không |
| `indexOf(x)` | Tìm index của giá trị | Index hoặc `-1` | Không |
| `some(callback)` | Ít nhất một phần tử thỏa điều kiện | `boolean` | Không* |
| `every(callback)` | Tất cả phần tử thỏa điều kiện | `boolean` | Không* |
| `reduce(callback, initial)` | Tổng hợp dữ liệu | Giá trị tích lũy cuối cùng | Không* |
| `sort(compareFn)` | Sắp xếp | Chính mảng sau khi sắp xếp | Có |
| `reverse()` | Đảo thứ tự | Chính mảng sau khi đảo | Có |
| `toSorted(compareFn)` | Sắp xếp trên bản sao | Mảng mới | Không* |
| `toReversed()` | Đảo thứ tự trên bản sao | Mảng mới | Không |
| `join(separator)` | Ghép phần tử thành chuỗi | `string` | Không |
| `flat(depth)` | Làm phẳng mảng lồng nhau | Mảng mới | Không |

\* Bản thân phương thức không tự sửa nội dung mảng gốc, nhưng code bạn viết trong callback vẫn có thể sửa dữ liệu. Mảng mới có thể giữ tham chiếu đến các object của mảng cũ.

### 9.2. Thêm và xóa

```ts
const values = [2, 3];

values.push(4);    // values: [2, 3, 4]
values.unshift(1); // values: [1, 2, 3, 4]

const last = values.pop();   // last: 4; values: [1, 2, 3]
const first = values.shift(); // first: 1; values: [2, 3]
```

### 9.3. `slice()` khác `splice()`

```ts
const letters = ["a", "b", "c", "d"];

const part = letters.slice(1, 3);
console.log(part);    // ["b", "c"]
console.log(letters); // ["a", "b", "c", "d"]

const removed = letters.splice(1, 2, "x");
console.log(removed); // ["b", "c"]
console.log(letters); // ["a", "x", "d"]
```

- `slice(1, 3)`: lấy từ index `1` đến trước index `3`, không sửa mảng gốc.
- `splice(1, 2, "x")`: từ index `1`, xóa `2` phần tử rồi chèn `"x"`.
- `splice(index, 0, item)`: chèn mà không xóa.

### 9.4. `map()`, `filter()`, `find()`

```ts
type Product = { id: number; name: string; price: number };

const products: Product[] = [
  { id: 1, name: "Bút", price: 5_000 },
  { id: 2, name: "Vở", price: 12_000 },
  { id: 3, name: "Thước", price: 8_000 },
];

const names = products.map((product) => product.name);
// ["Bút", "Vở", "Thước"]

const affordable = products.filter((product) => product.price <= 8_000);
// Mảng chứa object Bút và Thước.

const selected = products.find((product) => product.id === 2);
console.log(selected?.name ?? "Không tìm thấy"); // Vở

const selectedIndex = products.findIndex((product) => product.id === 99);
console.log(selectedIndex); // -1
```

**Cách chọn:** cần biến đổi → `map`; cần nhiều kết quả phù hợp → `filter`; cần một kết quả đầu tiên → `find`.

### 9.5. `some()`, `every()`, `includes()`

```ts
const scores = [6, 8, 9];

console.log(scores.some((score) => score >= 9));  // true
console.log(scores.every((score) => score >= 5)); // true
console.log(scores.includes(8));                 // true

const empty: number[] = [];
console.log(empty.some((value) => value > 0));  // false
console.log(empty.every((value) => value > 0)); // true
```

Nếu yêu cầu “phải có dữ liệu và tất cả đều hợp lệ”, kiểm tra `items.length > 0 && items.every(...)`.

### 9.6. `reduce()` — tính tổng hoặc gom dữ liệu

```ts
const numbers = [10, 20, 30];

const total = numbers.reduce((accumulator, current) => {
  return accumulator + current;
}, 0);

console.log(total); // 60
```

Ở ví dụ trên, accumulator bắt đầu từ `0`, lần lượt trở thành `10`, `30`, `60`. Nên truyền giá trị khởi tạo để hành vi rõ ràng và xử lý mảng rỗng. `reduce()` trên mảng rỗng mà không có giá trị khởi tạo sẽ ném lỗi.

### 9.7. Sắp xếp số và chuỗi

```ts
const numbers = [10, 2, 30];

console.log([...numbers].sort());             // [10, 2, 30]: so sánh dạng chuỗi.
console.log([...numbers].sort((a, b) => a - b)); // [2, 10, 30]
console.log([...numbers].sort((a, b) => b - a)); // [30, 10, 2]
console.log(numbers);                         // [10, 2, 30]: chưa bị sửa.

const names = ["Chi", "An", "Bình"];
const sortedNames = [...names].sort((a, b) => a.localeCompare(b, "vi"));
console.log(sortedNames); // ["An", "Bình", "Chi"]
```

Comparator trả số âm để đặt `a` trước `b`, số dương để đặt `a` sau `b`, và `0` nếu xem là bằng nhau trong phép so sánh. Với `number[]` thông thường, dùng `a - b` để tăng dần; nếu dữ liệu có `NaN`, cần xử lý riêng theo yêu cầu.

### 9.8. Phương thức tạo bản sao và yêu cầu môi trường

```ts
const numbers = [3, 1, 2];
const ascending = numbers.toSorted((a, b) => a - b); // [1, 2, 3]
const reversed = numbers.toReversed();              // [2, 1, 3]
```

`toSorted()` và `toReversed()` là API ES2023; `replaceAll()` là API ES2021. Cần runtime và cấu hình thư viện kiểu phù hợp. Đổi `target` hoặc `lib` không tự cài polyfill cho runtime thiếu các API này. Nếu không có `toSorted()`, dùng `[...numbers].sort(...)`.

### 9.9. `forEach()` khác `map()`

```ts
const numbers = [1, 2, 3];

numbers.forEach((value, index) => {
  console.log(index, value); // Thực hiện hành động.
});

const doubled = numbers.map((value) => value * 2); // Tạo dữ liệu mới.
console.log(doubled); // [2, 4, 6]
```

Không dùng `map()` chỉ để in log nếu không cần mảng kết quả. `forEach()` không hỗ trợ `break`/`continue` của vòng lặp và không chờ Promise do callback trả về.

### 9.10. Utility function cho array

```ts
function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

function sumNumbers(items: readonly number[]): number {
  return items.reduce((total, value) => total + value, 0);
}

function removeById<T extends { id: number }>(items: readonly T[], id: number): T[] {
  return items.filter((item) => item.id !== id);
}

console.log(unique([1, 1, 2, 3, 3])); // [1, 2, 3]
console.log(sumNumbers([10, 20]));    // 30
console.log(removeById([{ id: 1 }, { id: 2 }], 1)); // [{ id: 2 }]
```

`Set` loại trùng theo giá trị nguyên thủy hoặc tham chiếu object. Hai object `{ id: 1 }` được tạo riêng vẫn là hai phần tử khác nhau. Muốn loại trùng object theo `id`, cần quy tắc riêng, chẳng hạn dùng `Map` với key là `id`.

<a id="10-class"></a>

## 10. Class — lớp

Class mô tả thuộc tính và hành vi của một nhóm đối tượng. `new` tạo một instance; `constructor` khởi tạo dữ liệu; `this` chỉ instance khi phương thức được gọi thông thường qua instance đó.

### 10.1. Class cơ bản

```ts
class User {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  introduce(): string {
    return `Tôi là ${this.name}, ${this.age} tuổi.`;
  }
}

const user = new User("An", 25);
console.log(user.name);        // An
console.log(user.introduce()); // Tôi là An, 25 tuổi.
```

### 10.2. Access modifier, `readonly`, `static`

| Từ khóa | Ý nghĩa |
|---|---|
| `public` | Truy cập được từ bên ngoài; mặc định nếu không ghi modifier |
| `private` | Chỉ được truy cập trong class khai báo theo kiểm tra kiểu của TypeScript |
| `protected` | Class hiện tại và class con được truy cập |
| `readonly` | Chỉ gán tại khai báo hoặc trong constructor của class khai báo thuộc tính đó |
| `static` | Thành viên thuộc class, gọi qua tên class |

```ts
class BankAccount {
  static bankName = "Demo Bank";
  readonly accountId: string;
  private balance: number;

  constructor(accountId: string) {
    this.accountId = accountId;
    this.balance = 0;
  }

  deposit(amount: number): void {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Số tiền phải là số hữu hạn lớn hơn 0");
    }
    this.balance += amount;
  }

  getBalance(): number {
    return this.balance;
  }
}

const account = new BankAccount("ACC-001");
account.deposit(100);
console.log(account.getBalance()); // 100
console.log(BankAccount.bankName);  // Demo Bank
// account.balance; // Lỗi kiểu: balance là private.
```

Đây là ví dụ về đóng gói dữ liệu, chưa phải thiết kế xử lý tiền tệ thực tế. `number` dùng số thực dấu phẩy động nên có thể có sai số thập phân.

`private` của TypeScript chủ yếu được bảo vệ khi kiểm tra kiểu. Trường JavaScript dạng `#balance` có cơ chế riêng tư ở runtime; hai cú pháp không hoàn toàn tương đương.

### 10.3. Parameter properties — cú pháp rút gọn

```ts
class Product {
  constructor(
    public readonly id: number,
    public name: string,
    private price: number,
  ) {}

  getPrice(): number {
    return this.price;
  }
}
```

Khi có modifier trong tham số constructor, TypeScript có thể tạo và khởi tạo thuộc tính tương ứng. Cú pháp này cần công cụ thực thi/biên dịch hỗ trợ biến đổi TypeScript; một môi trường chỉ xóa annotation có thể không hỗ trợ nó.

### 10.4. Getter và setter

```ts
class Temperature {
  private _celsius = 0;

  get celsius(): number {
    return this._celsius;
  }

  set celsius(value: number) {
    if (!Number.isFinite(value) || value < -273.15) {
      throw new Error("Nhiệt độ không hợp lệ");
    }
    this._celsius = value;
  }
}

const temperature = new Temperature();
temperature.celsius = 30;          // Gọi setter.
console.log(temperature.celsius);  // Gọi getter, trả về 30.
```

Getter/setter được sử dụng như thuộc tính, không gọi bằng `celsius()`.

### 10.5. Kế thừa: `extends`, `super`, `override`

```ts
class Animal {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  speak(): string {
    return `${this.name} tạo ra âm thanh`;
  }
}

class Dog extends Animal {
  constructor(name: string) {
    super(name); // Gọi constructor class cha trước khi dùng this.
  }

  override speak(): string {
    return `${this.name}: Gâu gâu!`;
  }
}

console.log(new Dog("Milu").speak()); // Milu: Gâu gâu!
```

### 10.6. Interface và `implements`

```ts
interface Printable {
  print(): string;
}

class Invoice implements Printable {
  print(): string {
    return "Nội dung hóa đơn";
  }
}
```

`implements` yêu cầu class đáp ứng cấu trúc interface. Nó không tự sinh code và không kế thừa phần triển khai như `extends`.

### 10.7. Abstract class

```ts
abstract class Shape {
  abstract area(): number;

  describe(): string {
    return `Diện tích: ${this.area()}`;
  }
}

class Square extends Shape {
  constructor(private side: number) {
    super();
  }

  override area(): number {
    return this.side * this.side;
  }
}

const square = new Square(4);
console.log(square.describe()); // Diện tích: 16
// new Shape(); // Lỗi kiểu: không khởi tạo trực tiếp abstract class.
```

Class con không abstract phải triển khai các thành viên abstract còn thiếu. Abstract class có thể chứa cả phương thức đã triển khai và phương thức chưa triển khai.

<a id="11-extra"></a>

## 11. Kiến thức bổ sung để dùng trong dự án

### 11.1. Module: `export` và `import`

```ts
// File math.ts
export function add(a: number, b: number): number {
  return a + b;
}

export type Point = { x: number; y: number };
```

```ts
// File main.ts — ví dụ với công cụ hỗ trợ import không có đuôi file.
import { add } from "./math";
import type { Point } from "./math";

const point: Point = { x: 1, y: 2 };
console.log(add(point.x, point.y)); // 3
```

`export` công khai phần cần dùng từ file khác. `import type` chỉ nhập kiểu. Cách ghi đuôi file trong đường dẫn phụ thuộc cấu hình module và công cụ chạy; một dự án Node ESM biên dịch sang JavaScript thường dùng đường dẫn như `./math.js` trong source TypeScript.

### 11.2. Xử lý lỗi: `try`, `catch`, `finally`, `throw`

```ts
function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Không thể chia cho 0");
  }
  return a / b;
}

try {
  console.log(divide(10, 0));
} catch (error: unknown) {
  if (error instanceof Error) {
    console.log(error.message); // Không thể chia cho 0
  } else {
    console.log("Có lỗi không xác định");
  }
} finally {
  console.log("Kết thúc xử lý");
}
```

`throw` phát sinh lỗi; `catch` xử lý lỗi; `finally` chạy khi thoát khỏi khối `try`/`catch` trong luồng thực thi thông thường, thường dùng để giải phóng tài nguyên. Không nên bắt lỗi rồi âm thầm bỏ qua khi nơi gọi cần biết tác vụ đã thất bại.

### 11.3. `Promise`, `async`, `await`

Promise biểu diễn kết quả của tác vụ bất đồng bộ. Hàm `async` luôn trả về Promise. `await` đợi Promise hoàn thành trong luồng của hàm async và lấy giá trị thành công; nếu Promise bị từ chối, lỗi được ném tại điểm `await`.

```ts
type User = { id: number; name: string };

// Dữ liệu giả lập để tập cú pháp; không gọi API thật.
async function getUser(id: number): Promise<User> {
  if (id <= 0) {
    throw new Error("ID phải lớn hơn 0");
  }
  return { id, name: "An" };
}

async function main(): Promise<void> {
  const user = await getUser(1);
  console.log(user.name); // An
}

main().catch((error: unknown) => {
  console.error(error);
});
```

`await` không chặn toàn bộ chương trình như một vòng lặp tính toán đồng bộ; nó tạm dừng phần tiếp theo của hàm async đang chờ. Việc ghi kiểu `Promise<User>` không tự xác thực response từ một API thật.

### 11.4. Lặp bất đồng bộ: tuần tự và đồng thời

```ts
async function processItem(id: number): Promise<number> {
  return id * 2; // Mô phỏng một tác vụ async.
}

async function run(): Promise<void> {
  const ids = [1, 2, 3];

  // Tuần tự: đợi xong từng tác vụ trước khi bắt đầu tác vụ tiếp theo.
  for (const id of ids) {
    const result = await processItem(id);
    console.log(result);
  }

  // Khởi tạo các tác vụ rồi đợi tất cả; phù hợp khi chúng độc lập.
  const results = await Promise.all(ids.map((id) => processItem(id)));
  console.log(results); // [2, 4, 6], giữ thứ tự đầu vào.
}

run().catch(console.error);
```

Không dùng `await items.forEach(async (...) => ...)` để chờ xử lý xong cả mảng: `forEach()` trả về `undefined`. `Promise.all()` bị từ chối khi một Promise đầu vào bị từ chối, nhưng không tự hủy các tác vụ còn lại. Với số lượng tác vụ lớn, cần cân nhắc giới hạn số tác vụ chạy đồng thời.

### 11.5. Các tùy chọn TypeScript nên hiểu

Ví dụ một phần cấu hình dùng để học trong môi trường có các API ES2023:

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noEmit": true
  }
}
```

| Tùy chọn | Tác dụng |
|---|---|
| `target` | Mức cú pháp JavaScript đầu ra khi biên dịch; cũng ảnh hưởng thư viện kiểu mặc định |
| `lib` | Các bộ khai báo API mà compiler được biết, nếu cấu hình rõ |
| `strict` | Bật nhóm kiểm tra kiểu chặt chẽ, gồm kiểm tra null và implicit any |
| `noUncheckedIndexedAccess` | Thêm khả năng `undefined` cho những truy cập index không chắc tồn tại |
| `noImplicitOverride` | Yêu cầu ghi `override` khi ghi đè thành viên của lớp cha |
| `noEmit` | Chỉ kiểm tra, không xuất file biên dịch |
| `module`, `moduleResolution` | Cách phát sinh và phân giải module, cần khớp môi trường dự án |

Đây là cấu hình minh họa, không phải cấu hình đầy đủ áp dụng cho mọi dự án. Không ghi đè cấu hình dự án hiện có chỉ để chạy một ví dụ.

<a id="12-example"></a>

## 12. Ví dụ tổng hợp: xử lý giỏ hàng

Ví dụ kết hợp comment, `const`, object, array, function, string utility, `filter`, `map`, `reduce` và `for...of`.

```ts
type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

function normalizeName(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function isValidItem(item: CartItem): boolean {
  return (
    normalizeName(item.name).length > 0 &&
    Number.isFinite(item.price) &&
    item.price >= 0 &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
}

function calculateCartTotal(items: readonly CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

const cart: CartItem[] = [
  { id: 1, name: "  Bút bi  ", price: 5_000, quantity: 2 },
  { id: 2, name: "Vở   ô ly", price: 12_000, quantity: 3 },
  { id: 3, name: "Thước", price: 8_000, quantity: 0 },
];

// Bài tập này chọn bỏ các dòng không hợp lệ.
const validItems = cart
  .filter(isValidItem)
  .map((item) => ({ ...item, name: normalizeName(item.name) }));

for (const item of validItems) {
  console.log(`${item.name}: ${item.quantity} x ${item.price}`);
}

console.log(`Tổng tiền: ${calculateCartTotal(validItems)}`);

// Kết quả:
// Bút bi: 2 x 5000
// Vở ô ly: 3 x 12000
// Tổng tiền: 46000
```

Trong ví dụ này, `map()` tạo object mới bằng spread nên việc chuẩn hóa `name` không sửa các object trong `cart`. Trong sản phẩm thật, bạn cần quyết định rõ khi nào loại bỏ dữ liệu sai và khi nào báo lỗi cho người dùng.

<a id="13-reference"></a>

## 13. Lỗi thường gặp và bảng tra nhanh

### 13.1. Những lỗi cần nhớ

| Lỗi/hiểu nhầm | Cách xử lý |
|---|---|
| Nghĩ rằng `const` làm object bất biến | Phân biệt gán lại biến và sửa nội dung object |
| Dùng `any` ở mọi nơi | Dùng kiểu cụ thể; với dữ liệu chưa biết, dùng `unknown` và kiểm tra |
| Dùng `as User` để xác thực JSON | `as` không kiểm tra runtime; cần kiểm tra cấu trúc dữ liệu |
| Gọi `.name` ngay sau `find()` | Xử lý `undefined` bằng điều kiện, `?.`, `??` hoặc báo lỗi |
| Dùng `if (index)` với kết quả `findIndex()` | Kiểm tra `index !== -1`; index `0` là hợp lệ |
| Gọi `splice(-1, 1)` do không tìm thấy phần tử | Kiểm tra index trước; `-1` sẽ tác động phần tử cuối |
| Gọi `sort()` trực tiếp làm đổi dữ liệu gốc | Sao chép trước hoặc dùng `toSorted()` |
| Sắp xếp số bằng `sort()` không có comparator | Dùng `(a, b) => a - b` hoặc ngược lại |
| Arrow function có `{}` nhưng quên `return` | Viết `return` hoặc dùng biểu thức ngắn không có block |
| Dùng `for...in` để lấy giá trị array | Dùng `for...of` |
| Nghĩ `forEach(async ...)` chờ xong mọi tác vụ | Dùng `for...of` với `await`, hoặc `Promise.all()` |
| Nghĩ spread sao chép sâu | Các object lồng nhau vẫn có thể dùng chung tham chiếu |
| Dùng `||` khi muốn giữ `0`, `false`, `""` | Cân nhắc `??` |
| Dùng `number` với kỳ vọng thập phân luôn chính xác | Nhớ `0.1 + 0.2` có thể không bằng đúng `0.3` |
| Dùng kiểu đã khai báo để kết luận dữ liệu API chắc chắn đúng | Xác thực dữ liệu tại điểm nhận vào |

### 13.2. Quên `return` trong callback

```ts
const numbers = [1, 2, 3];

const wrong = numbers.map((value) => {
  value * 2; // Không return: mảng kết quả chứa undefined.
});

const correct = numbers.map((value) => value * 2);

const alsoCorrect = numbers.map((value) => {
  return value * 2;
});
```

### 13.3. So sánh object là so sánh tham chiếu

```ts
const first = { id: 1 };
const second = { id: 1 };
const sameReference = first;

console.log(first === second);        // false
console.log(first === sameReference); // true
console.log([first].includes(second)); // false
```

Muốn kiểm tra cùng một thực thể theo nghiệp vụ, có thể so sánh `id`. Muốn kiểm tra toàn bộ cấu trúc bằng nhau, cần định nghĩa quy tắc so sánh riêng.

### 13.4. Chọn công cụ theo mục đích

| Tôi muốn… | Dùng… |
|---|---|
| Khai báo biến không gán lại | `const` |
| Cập nhật giá trị biến nhiều lần | `let` |
| Một trong vài giá trị cho phép | Literal union: `"open" \| "closed"` |
| Mô tả dữ liệu có thuộc tính | `type` hoặc `interface` |
| Duyệt array và có thể dừng sớm | `for...of` + `break` |
| Chuyển array thành array khác | `map()` |
| Lấy tất cả phần tử phù hợp | `filter()` |
| Lấy phần tử phù hợp đầu tiên | `find()` |
| Biết có ít nhất một phần tử phù hợp | `some()` |
| Kiểm tra tất cả phần tử | `every()` |
| Gom array thành một kết quả | `reduce()` |
| Kiểm tra cấu trúc trước khi dùng dữ liệu chưa biết | `unknown` + narrowing/validation |
| Gom dữ liệu và hành vi thành đối tượng | `class` |
| Đợi tác vụ bất đồng bộ | `await` trong hàm `async` |

<a id="14-practice"></a>

## 14. Bài tập và lời giải gợi ý

### Bài 1: Chuẩn hóa tên

Viết hàm nhận một chuỗi, xóa khoảng trắng đầu/cuối và thay các nhóm khoảng trắng bên trong bằng một dấu cách.

- Đầu vào: `"  Nguyễn   Văn   An  "`
- Kết quả: `"Nguyễn Văn An"`

### Bài 2: Lọc và tính tổng

Cho mảng `[1, 2, 3, 4, 5, 6]`. Lấy các số chẵn, nhân đôi chúng rồi tính tổng.

- Mảng số chẵn: `[2, 4, 6]`
- Mảng sau khi nhân đôi: `[4, 8, 12]`
- Tổng: `24`

### Bài 3: Tìm người dùng

Định nghĩa `User` có `id`, `name`, `active`. Viết hàm tìm người dùng theo `id`, trả về `User | undefined`. Thử cả trường hợp tìm thấy và không tìm thấy.

### Bài 4: Class quản lý công việc

Tạo class `TodoList` có các phương thức:

- `add(title)`: thêm công việc chưa hoàn thành, không cho phép tiêu đề rỗng.
- `complete(id)`: đánh dấu hoàn thành; trả về `false` nếu không tìm thấy.
- `listPending()`: trả về các công việc chưa hoàn thành.

### Lời giải gợi ý

```ts
// Bài 1.
function normalizeName(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

// Bài 2.
const numbers = [1, 2, 3, 4, 5, 6];
const total = numbers
  .filter((value) => value % 2 === 0)
  .map((value) => value * 2)
  .reduce((sum, value) => sum + value, 0);

console.log(total); // 24

// Bài 3.
type User = { id: number; name: string; active: boolean };

function findUser(users: readonly User[], id: number): User | undefined {
  return users.find((user) => user.id === id);
}

const users: User[] = [{ id: 1, name: "An", active: true }];
console.log(findUser(users, 1)?.name); // An
console.log(findUser(users, 99));     // undefined

// Bài 4.
type Todo = { id: number; title: string; completed: boolean };

class TodoList {
  private items: Todo[] = [];
  private nextId = 1;

  add(title: string): Todo {
    const cleanTitle = title.trim();
    if (cleanTitle.length === 0) {
      throw new Error("Tiêu đề không được rỗng");
    }

    const item: Todo = {
      id: this.nextId++,
      title: cleanTitle,
      completed: false,
    };

    this.items.push(item);
    return { ...item }; // Trả bản sao để bên ngoài không sửa object nội bộ.
  }

  complete(id: number): boolean {
    const item = this.items.find((todo) => todo.id === id);
    if (!item) return false;

    item.completed = true;
    return true;
  }

  listPending(): Todo[] {
    return this.items
      .filter((item) => !item.completed)
      .map((item) => ({ ...item }));
  }
}

const todos = new TodoList();
const first = todos.add("Học TypeScript");
todos.add("Luyện xử lý array");
todos.complete(first.id);

console.log(todos.listPending());
// [{ id: 2, title: "Luyện xử lý array", completed: false }]
```

Các bản sao nông trong `TodoList` đủ tách dữ liệu ở ví dụ này vì thuộc tính của `Todo` đều là giá trị nguyên thủy. Nếu thêm object lồng nhau, cần xem lại cách sao chép.

---

**Lộ trình ôn tập:** comment và biến → kiểu và object → array → điều kiện và loop → function → string/array utilities → class → module, lỗi và async → bài tập tổng hợp.
