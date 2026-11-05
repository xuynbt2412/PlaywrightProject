# PlaywrightProject

Bộ test Playwright + TypeScript cho Automation Exercise. Các test cần tài khoản dùng
tài khoản riêng, chạy độc lập và tự dọn dữ liệu. Giữ các đường dẫn `tests/Login.spec.ts`,
`tests/Logout.spec.ts`, `tests/Register.spec.ts` để tiếp tục chạy từ VS Code.
Test Contact Us nằm trong `tests/Contact.spec.ts` và không yêu cầu tài khoản.

## Cài đặt

Cần Node.js 24 trở lên và npm. Phiên bản dùng trong CI được ghi ở `.nvmrc`.

```powershell
npm ci
npx playwright install chromium
```

## Lệnh thường dùng

| Lệnh                   | Chức năng                                           |
| ---------------------- | --------------------------------------------------- |
| `npm test`             | Chạy toàn bộ test: UI và kiểm tra API helper cục bộ |
| `npm run test:e2e`     | Chỉ chạy các testcase UI trên website               |
| `npm run test:support` | Chạy kiểm tra API helper bằng HTTP server cục bộ    |
| `npm run test:ui`      | Mở Playwright UI                                    |
| `npm run test:headed`  | Chạy với cửa sổ trình duyệt                         |
| `npm run test:debug`   | Chạy từng bước bằng Inspector                       |
| `npm run check`        | TypeScript, ESLint và định dạng code                |
| `npm run format`       | Định dạng code                                      |
| `npm run report`       | Mở HTML report của lần chạy gần nhất                |

Chạy một file hoặc một testcase:

```powershell
npm test -- tests/Login.spec.ts
npm test -- tests/Logout.spec.ts --headed
npm test -- tests/Register.spec.ts --grep "existing email"
npm test -- tests/Contact.spec.ts --headed
```

Trong VS Code, dùng extension **Playwright Test for VSCode** của Microsoft.
Extension ESLint giúp báo lỗi thiếu `await` ngay khi viết code.

## Môi trường

Mặc định sử dụng `https://automationexercise.com`. Có thể tạo `.env` từ
`.env.example`, hoặc đặt biến môi trường trong terminal:

```powershell
$env:BASE_URL = 'https://automationexercise.com'
npm run test:e2e
```

Biến môi trường đã có sẽ được ưu tiên hơn `.env`. Môi trường thay thế cần có cùng
cấu trúc trang và các API tài khoản như Automation Exercise. Không cần điền email
hoặc password có sẵn. `.env` không được commit.

URL được cấu hình một lần trong `playwright.config.ts`; page và API dùng đường dẫn
tương đối. `getByTestId()` ánh xạ tới thuộc tính `data-qa` của website.

## Cấu trúc

```text
tests/
  Login.spec.ts
  Logout.spec.ts
  Register.spec.ts
  Contact.spec.ts
  support/account-api.spec.ts
fixture/
  test.fixture.ts          # Tạo Page Object và Header, không tự điều hướng
  signup.fixture.ts        # Dữ liệu mới, tài khoản có sẵn và cleanup
  login.fixture.ts         # Chuẩn bị trạng thái đã đăng nhập cho Logout
pages/
  home_page.ts
  login_page.ts
  register_page.ts
  contact_page.ts
  components/header.ts    # Các link điều hướng dùng chung, bao gồm Contact Us
data/user.factory.ts      # Kiểu dữ liệu và tài khoản ngẫu nhiên cho từng test
data/files/contact-message.txt  # File upload mẫu cho Contact Us
services/account.api.ts   # Tạo/xóa tài khoản và kiểm tra phản hồi API
.github/workflows/playwright.yml
```

## Chọn fixture đúng với mục đích test

| Fixture                                                          | Trạng thái khi thân test bắt đầu                          | Test sử dụng                     |
| ---------------------------------------------------------------- | --------------------------------------------------------- | -------------------------------- |
| `homePage`, `loginPage`, `registerPage`, `contactPage`, `header` | Chỉ có Page Object; chưa mở URL                           | Các thao tác UI                  |
| `userData`                                                       | Dữ liệu duy nhất, **chưa đăng ký**                        | Register thành công              |
| `registeredUser`                                                 | Tài khoản đã được tạo qua API; browser **chưa đăng nhập** | Login đúng, Register email trùng |
| `loggedInPage`                                                   | Tài khoản riêng đã được đăng nhập qua UI                  | Logout                           |

Chuỗi dependency:

```text
userData -> registeredUser (API create) -> loggedInPage (UI login)
```

Fixture chỉ chạy khi test yêu cầu hoặc một fixture khác phụ thuộc vào nó. Import
`signup.fixture` không có nghĩa mọi test trong file đều đăng ký tài khoản.

Ví dụ Login: import `test` từ `signup.fixture`, yêu cầu `registeredUser`, mở trang
chủ rồi điền `registeredUser.email` và `registeredUser.password`. Test đăng nhập sai
không yêu cầu tài khoản đã đăng ký, nên không tạo/xóa tài khoản qua API.

**Thay đổi so với phiên bản trước:** `registeredUser` tạo tài khoản bằng API, không
điền form Signup và Logout qua UI. `homePage` không còn tự mở URL trong phần setup
của fixture; test gọi `homePage.navigateToHomePage()` rõ ràng.

Register thành công vẫn kiểm tra toàn bộ UI; hai biến thể `Mr` và `Mrs` kiểm tra
đúng radio được chọn. Email chỉ đọc được kiểm tra bằng assertion, không truyền
vào hàm điền account details. Các field địa chỉ được truyền bằng object có kiểu.

## Test Contact Us

`tests/Contact.spec.ts` import fixture cơ bản từ `fixture/test.fixture.ts`, dùng
`homePage`, `header`, `contactPage` và `page`. Không dùng `registeredUser` hay
`loggedInPage`, nên không gọi API tạo/xóa tài khoản.

Luồng: mở trang chủ -> bấm Contact Us -> kiểm tra Get In Touch -> điền tên, email,
subject, message -> chọn file mẫu -> bấm Submit -> chấp nhận hộp thoại confirm ->
kiểm tra thông báo thành công -> bấm Home và kiểm tra URL/trang chủ.

File mẫu được lưu trong `data/files/contact-message.txt`; đường dẫn được resolve
từ vị trí file test, không phụ thuộc thư mục Downloads hay đường dẫn cá nhân.
Email liên hệ được sinh riêng cho từng lần chạy. `page.waitForEvent('dialog')`
được đăng ký trước thao tác Submit và `dialog.accept()` xử lý bước OK; test còn
kiểm tra loại hộp thoại và nội dung “Press OK to proceed!”.

Sau khi mở Contact Us, test chờ `domcontentloaded` để các script cuối trang gắn
handler Submit. Chỉ thấy form hiển thị chưa bảo đảm handler đã sẵn sàng; bấm quá
sớm có thể gây submit thông thường và tải lại trang mà không mở hộp thoại.

Form mẫu hiện xử lý thông báo thành công bằng JavaScript ngay trên trang. Test
kiểm tra file đã được chọn và hành vi giao diện; không khẳng định backend đã lưu
liên hệ hoặc nội dung file. Contact Us không có API cleanup liên hệ trong suite.

## Dữ liệu và cleanup

- Mỗi test/retry sinh UUID mới cho email. Không dùng chung tài khoản giữa các worker.
- `userData` sở hữu cleanup trong `finally`, cho cả đăng ký qua UI và qua API.
- Test Login/Register giữ bước Delete Account theo testcase mẫu của website.
  Cleanup chấp nhận API responseCode `404` khi tài khoản đã được xóa qua UI.
- HTTP lỗi, JSON không hợp lệ hoặc mã API ngoài dự kiến đều được báo lỗi.
- Nếu test đã thất bại, lỗi cleanup được đính kèm với tên `account-cleanup-error`,
  không thay thế lỗi test ban đầu. Nếu test đã pass nhưng cleanup thất bại, lần chạy
  vẫn được đánh dấu thất bại để tránh bỏ qua dữ liệu sót.
- Nếu tiến trình bị kill hoặc mất mạng, teardown không bảo đảm xóa được tài khoản.
  Trong hệ thống công ty nên bổ sung cơ chế dọn dữ liệu test hết hạn ở backend.

API sử dụng: `POST /api/createAccount` và `DELETE /api/deleteAccount`.
[Hợp đồng API của website](https://automationexercise.com/api_list).

Logout vẫn đăng nhập qua UI để giữ đúng testcase đang học. Với các tính năng khác
chỉ cần phiên đăng nhập sẵn, có thể bổ sung fixture `storageState` riêng khi cần;
không thay thế bước UI Login trong testcase kiểm tra Login.

## Quy ước

- Page Object chứa locator/thao tác; assertion nằm trong test hoặc fixture kiểm tra
  điều kiện setup. Navigation dùng chung đặt trong `Header`.
- Luôn `await` các thao tác async và `test.step()`. ESLint kiểm tra
  `no-floating-promises` và `missing-playwright-await`.
- Không dùng sleep cố định, `force: true`, hoặc phụ thuộc thứ tự test.
- Ưu tiên role/label và `data-qa`; tránh XPath theo cấu trúc DOM.
- Chạy `npm run check` trước khi commit. TypeScript bật strict và kiểm tra tham số
  không được sử dụng; compiler/linter được khóa phiên bản trong lockfile.
- `TYPESCRIPT_CO_BAN.md` là tài liệu học, không thuộc code thực thi hay format gate.

## CI và báo cáo

GitHub Actions chạy khi có pull request, push vào `main` hoặc chạy thủ công:
`npm ci` -> `npm run check` -> cài Chromium -> `npm test`.
Repository variable `BASE_URL` có thể chọn môi trường chạy.

CI dùng hai worker, retry hai lần; local mặc định không retry. Chromium là browser
hiện tại; thêm project Firefox/WebKit khi có yêu cầu hỗ trợ thực tế.

Test mặc định chạy headless. Khi thất bại, lưu trace và screenshot để xem trong
HTML report. JUnit được lưu ở `test-results/junit.xml`. CI upload report và
test-results ngay cả khi test thất bại; artifact lưu 14 ngày.

Website công cộng và tài nguyên bên thứ ba có thể gây biến động thời gian chạy.
Với dự án công ty, nên chạy trên staging do nhóm kiểm soát và theo dõi flake rate,
thay vì tăng timeout/retry để che lỗi.
