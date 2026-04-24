import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

/**
 * Định nghĩa cấu trúc props cho component DateSelect
 * Để quy định các tham số đầu vào cần thiết khi tái sử dụng UI chọn thời gian
 */
interface DateSelectProps {
  name: string;
  nameTime?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  value: string;
  valueTime?: string;
  variant?: 'default' | 'staff';
}

/**
 * Định dạng chuỗi ngày (yyyy-mm-dd) sang dạng hiển thị (dd/mm/yyyy)
 * Để giao diện hiển thị thân thiện với người dùng Việt Nam
 */
function formatDisplayDate(value: string) {
  // Kiểm tra chuỗi rỗng và trả về rỗng nếu không có dữ liệu
  // Để tránh lỗi crash khi gọi hàm split
  if (!value) {
    return '';
  }

  // Tách chuỗi ngày thành mảng 3 phần tử năm, tháng, ngày
  // Để lấy dữ liệu rời rạc phục vụ cho việc đổi chỗ định dạng
  let [year, month, day] = value.split('-');
  
  // Kiểm tra tính hợp lệ của cả 3 phần tử
  // Để đảm bảo không trả về chuỗi nguyên gốc sai format
  if (!year || !month || !day) {
    return value;
  }

  // Ghép các thành phần theo thứ tự ngày/tháng/năm
  // Để tạo ra chuỗi format chuẩn Việt Nam hiển thị lên UI
  return `${day}/${month}/${year}`;
}

/**
 * Tạo sự kiện tổng hợp (Synthetic Event) chứa thông tin target
 * Để giả lập sự kiện từ input thật, giúp tương thích với các thư viện quản lý form
 */
function createSyntheticEvent(name: string, value: string) {
  // Trả về một object mô phỏng cấu trúc của ChangeEvent
  // Để hook Form gọi được event.target.name và event.target.value
  return {
    target: { name, value },
  } as ChangeEvent<HTMLInputElement>;
}

/**
 * Chuyển đổi chuỗi (yyyy-mm-dd) thành đối tượng Date
 * Để sử dụng các hàm API thao tác với thời gian của Javascript
 */
function parseDateValue(value: string) {
  // Trả về null nếu không có chuỗi giá trị
  // Để biểu thị trạng thái không có ngày được chọn
  if (!value) {
    return null;
  }

  // Tách chuỗi và ép kiểu các phần tử sang dạng số nguyên
  // Để có được các tham số số học khởi tạo đối tượng Date
  let [year, month, day] = value.split('-').map(Number);
  
  // Kiểm tra nếu có thành phần nào là NaN hoặc rỗng
  // Để tránh tạo ra một Date object không hợp lệ
  if (!year || !month || !day) {
    return null;
  }

  // Trả về đối tượng Date mới (trừ 1 ở tháng do index bắt đầu từ 0)
  // Để thu được object thời gian chính xác tương ứng
  return new Date(year, month - 1, day);
}

/**
 * Chuyển đối tượng Date thành chuỗi chuẩn định dạng yyyy-mm-dd
 * Để làm chuẩn đồng bộ dữ liệu gửi lên API hoặc gán vào input
 */
function formatDateValue(date: Date) {
  // Lấy ra phần năm gồm 4 chữ số
  // Để ghép vào đầu chuỗi kết quả
  let year = date.getFullYear();
  
  // Lấy ra phần tháng và bù số 0 nếu dưới 10
  // Để đảm bảo tháng luôn có 2 ký tự (VD: 01, 09, 12)
  let month = String(date.getMonth() + 1).padStart(2, '0');
  
  // Lấy ra phần ngày và bù số 0 nếu dưới 10
  // Để đảm bảo ngày luôn có 2 ký tự (VD: 01, 15)
  let day = String(date.getDate()).padStart(2, '0');
  
  // Ghép các biến lại bằng dấu gạch ngang
  // Để tạo ra chuỗi kết quả chuẩn định dạng ISO yyyy-mm-dd
  return `${year}-${month}-${day}`;
}

/**
 * Kiểm tra xem hai đối tượng Date có trùng ngày, tháng, năm hay không
 * Để so sánh chính xác ngày mà không bị lệch bởi thông tin giờ phút giây
 */
function isSameDate(left: Date | null, right: Date) {
  // Kiểm tra biến left tồn tại và so sánh tương đương cả năm, tháng, ngày
  // Để trả về kết quả boolean xác định trùng khớp
  return (
    left !== null &&
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

/**
 * Lấy ra mảng 42 ngày (6 tuần) liên tiếp bao phủ tháng hiện tại
 * Để tạo dữ liệu render ra lưới lịch gồm 7 cột và 6 dòng
 */
function getCalendarDays(visible_month: Date) {
  // Tạo đối tượng Date đại diện cho ngày mùng 1 của tháng
  // Để làm cột mốc tính toán các ngày khác
  let first_day = new Date(visible_month.getFullYear(), visible_month.getMonth(), 1);
  
  // Tính độ lệch số ngày cần lùi về trước (Thứ 2 = 0)
  // Để căn lề đúng ngày mùng 1 vào cột thứ tương ứng
  let start_offset = (first_day.getDay() + 6) % 7;
  
  // Sao chép ngày mùng 1 để tạo biến chứa ngày bắt đầu tính
  // Để bảo toàn giá trị của mốc ngày mùng 1
  let start_date = new Date(first_day);
  
  // Lùi thời gian lại bằng với độ lệch để ra ngày thứ 2 đầu tiên trên lưới
  // Để bắt đầu điền đầy vào ô trống ở các dòng đầu lịch
  start_date.setDate(first_day.getDate() - start_offset);

  // Tạo ra một mảng có 42 phần tử và lặp qua để sinh dữ liệu Date
  // Để lấy đủ dữ liệu ngày cho 42 ô của lịch
  return Array.from({ length: 42 }, (_, index) => {
    // Tạo bản sao cho từng mốc ngày
    // Để không bị tham chiếu làm đổi biến start_date gốc
    let date = new Date(start_date);
    
    // Tăng ngày lên một khoảng bằng với chỉ số của mảng
    // Để có được các ngày tịnh tiến liên tiếp nhau
    date.setDate(start_date.getDate() + index);
    
    // Trả về đối tượng Date
    // Để đưa vào kết quả mảng tổng
    return date;
  });
}

/**
 * Component hiển thị form chọn ngày và giờ (nếu cấu hình)
 * Để người dùng click vào popover và thực hiện chọn thời gian
 */
export default function DateSelect({
  name,
  nameTime: name_time,
  onChange: on_change,
  placeholder = 'Chọn ngày thực hiện',
  value,
  valueTime: value_time,
  variant = 'default',
}: DateSelectProps) {
  // Khai báo state quản lý cờ bật/tắt popup lịch
  // Để kiểm soát việc render panel lịch ra giao diện
  let [is_open, set_is_open] = useState(false);
  
  // Khai báo ref trỏ tới div bọc ngoài cùng component
  // Để lắng nghe và phát hiện thao tác click ra ngoài
  let container_ref = useRef<HTMLDivElement>(null);
  
  // Khai báo ref trỏ tới thẻ input nhập giờ
  // Để kích hoạt focus và mở bảng chọn giờ gốc của trình duyệt
  let time_input_ref = useRef<HTMLInputElement>(null);
  
  // Khai báo biến giữ object Date chuyển đổi từ value chuỗi
  // Để làm giá trị tính toán và so sánh UI hiển thị
  let selected_date = parseDateValue(value);
  
  // Khai báo state quản lý tháng đang được focus hiển thị trên lịch
  // Để hỗ trợ lùi tới các tháng khác nhau khi bấm nút
  let [visible_month, set_visible_month] = useState<Date>(selected_date ?? new Date());

  // Hook theo dõi biến đổi của value prop
  // Để đồng bộ tháng đang xem về đúng ngày mà prop truyền vào
  useEffect(() => {
    // Kiểm tra nếu tồn tại object ngày
    // Để tránh cập nhật null vào state tháng
    if (selected_date) {
      // Cập nhật lại tháng hiển thị
      // Để lịch trượt về hiển thị tháng chứa ngày vừa chọn
      set_visible_month(selected_date);
    }
  }, [value]);

  // Hook khởi tạo sự kiện lắng nghe thao tác chuột
  // Để xử lý việc tắt lịch tự động
  useEffect(() => {
    // Hàm thực thi khi có sự kiện click chuột
    // Để kiểm tra vùng được click
    let handle_click_outside = (event: MouseEvent) => {
      // Xác minh vùng bị click không nằm trong container component
      // Để xác định đây là hành động click outside
      if (!container_ref.current?.contains(event.target as Node)) {
        // Cập nhật state is_open về false
        // Để làm ẩn panel lịch đi
        set_is_open(false);
      }
    };

    // Đăng ký sự kiện mousedown vào document
    // Để ứng dụng bắt được mọi cú click toàn màn hình
    document.addEventListener('mousedown', handle_click_outside);
    
    // Trả về hàm cleanup xóa sự kiện
    // Để ngăn chặn rò rỉ bộ nhớ lúc component unmount
    return () => document.removeEventListener('mousedown', handle_click_outside);
  }, []);

  // Format tháng hiển thị ra chuỗi hiển thị tiếng Việt (VD: "tháng 4 năm 2026")
  // Để làm tiêu đề cho panel lịch
  let month_label = visible_month.toLocaleDateString('vi-VN', {
    month: 'long',
    year: 'numeric',
  });
  
  // Gọi hàm tạo danh sách 42 ngày cho lưới lịch
  // Để đổ vào giao diện vòng lặp render ô ngày
  let calendar_days = getCalendarDays(visible_month);
  
  /** Mảng danh sách các chữ cái viết tắt tên thứ trong tuần */
  const WEEKDAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  
  // Khai báo danh sách class quy định giao diện của nút kích hoạt lịch
  // Để phù hợp với trạng thái chọn và biến thể variant staff
  let trigger_class =
    variant === 'staff'
      ? is_open
        ? 'border-slate-400 ring-4 ring-slate-200/70'
        : 'border-slate-300 hover:border-slate-400'
      : is_open
        ? 'border-sky-400 ring-4 ring-sky-100'
        : 'border-slate-200 hover:border-sky-200';
        
  // Khai báo class quy định layout của panel nổi chứa lịch
  // Để hỗ trợ hiển thị đẹp trong các bố cục màn hình
  let panel_class =
    variant === 'staff'
      ? 'border-slate-200 bg-white shadow-lg shadow-slate-200/80 z-20 absolute mt-1 w-[280px]'
      : 'border-sky-100 bg-white shadow-lg shadow-sky-100/70 z-20 absolute mt-1 w-full max-w-[320px]';
      
  // Khai báo class quy định màu nền của ô ngày đang chọn
  // Để đồng nhất giao diện theo style quy định (sky hoặc staff slate)
  let selected_day_class = variant === 'staff' ? 'bg-slate-900 text-white' : 'bg-sky-600 text-white';
  
  // Kiểm tra cờ cho trạng thái đã chọn ngày
  // Để có dữ kiện quyết định thông báo cần điền tiếp hay không
  let has_date_selected = Boolean(value);
  
  // Kiểm tra cờ cho trạng thái đã chọn giờ
  // Để xác định phần giờ đã được thoả mãn
  let has_time_selected = Boolean(value_time);
  
  // Xác định điều kiện đã hoàn tất quá trình chọn hay chưa
  // Để ẩn cảnh báo thiếu thông tin trên giao diện
  let has_complete_selection = has_date_selected && (!name_time || has_time_selected);
  
  // Xác định trạng thái người dùng đang bỏ dở bước chọn giờ
  // Để hiển thị viền đỏ và text cảnh báo yêu cầu chú ý
  let needs_time_attention = Boolean(name_time && has_date_selected && !has_time_selected);

  /**
   * Đặt con trỏ vào ô chọn giờ và ép mở trình chọn gốc nếu có thể
   * Để hỗ trợ UX chuyển mượt mà từ thao tác click ngày sang nhập giờ
   */
  function focusTimeInput() {
    // Tham chiếu thẻ input html gốc
    // Để gọi các hàm native
    let input = time_input_ref.current;

    // Thoát ra sớm nếu thẻ chưa mount
    // Để tránh lỗi crash javascript
    if (!input) {
      return;
    }

    // Đẩy focus vào thẻ input
    // Để viền outline xanh lên cho người dùng biết
    input.focus();

    // Dùng check showPicker để hỗ trợ các trình duyệt đời mới
    // Để bật được popup chọn giờ native thay vì phải tự bấm
    if ('showPicker' in input && typeof input.showPicker === 'function') {
      try {
        // Thực thi mở popup
        // Để người dùng dễ dàng thao tác vuốt chọn trên điện thoại
        input.showPicker();
      } catch (e) {
        // Bỏ qua ngoại lệ nếu trình duyệt chặn tự mở (ví dụ Firefox)
        // Để code tiếp tục chạy ổn định
      }
    }
  }

  /**
   * Thay đổi trạng thái tháng hiển thị bằng cách tiến hoặc lùi
   * Để di chuyển thanh xem lịch (step = 1 là tiến, step = -1 là lùi)
   */
  function changeMonth(step: number) {
    // Dùng callback set state để tính lại giá trị tháng
    // Để an toàn với closure của state React
    set_visible_month((current) => new Date(current.getFullYear(), current.getMonth() + step, 1));
  }

  /**
   * Nhận thao tác click một ô ngày và cập nhật thông tin
   * Để lưu kết quả và định hướng luồng chọn tiếp theo (có giờ không)
   */
  function handleSelectDate(date: Date) {
    // Gửi sự kiện cập nhật giá trị ra prop onChange ngoài component
    // Để báo cho form lưu giá trị lại
    on_change(createSyntheticEvent(name, formatDateValue(date)));
    
    // Đồng bộ lại tháng vừa chọn vào state
    // Để lịch nhảy theo nếu bấm chọn một ngày ở rìa tháng khác
    set_visible_month(date);

    // Kiểm tra nếu cấu hình không yêu cầu tên ô input giờ
    // Để ngắt quy trình chọn ngay lúc này
    if (!name_time) {
      // Đóng panel
      // Để hoàn tất luồng
      set_is_open(false);
      
      // Thoát hàm
      // Để bỏ qua các dòng code phía dưới
      return;
    }

    // Đặt lệnh chạy bất đồng bộ vào cuối event loop
    // Để đảm bảo DOM đã render xong ô input giờ thì mới gọi focus
    window.setTimeout(() => {
      // Gọi hàm focus vào input
      // Để điều hướng người dùng nhập giờ
      focusTimeInput();
    }, 0);
  }

  /**
   * Ghi nhận thao tác thay đổi dữ liệu giờ của ô input time
   * Để đồng bộ dữ liệu ra bên ngoài như khi thay đổi ngày
   */
  function handleTimeChange(event: ChangeEvent<HTMLInputElement>) {
    // Uỷ quyền sự kiện qua callback được truyền vào từ form
    // Để component cha kiểm soát giá trị
    on_change(event);
  }

  /**
   * Trả về khối JSX mô tả kết quả đã chọn (được hiển thị trên button trigger)
   * Để người dùng biết họ đã làm xong việc hay còn thiếu gì
   */
  function renderSelectionSummary() {
    // Kiểm tra nếu hoàn toàn không có nhu cầu chọn giờ
    // Để ưu tiên layout tóm tắt một dòng gọn nhẹ
    if (!name_time) {
      // Trả về cụm thẻ mô tả ngày và trạng thái
      // Để hiển thị đơn giản
      return (
        <>
          <span className={`block truncate text-[14px] font-semibold ${value ? 'text-slate-800' : 'text-slate-400'}`}>
            {formatDisplayDate(value) || placeholder}
          </span>
          <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
            {value ? 'Đã chọn thời gian' : 'Chưa chọn đủ thông tin'}
          </p>
        </>
      );
    }

    // Trả về cụm thẻ chi tiết gồm cả badge nhỏ cho ngày và badge nhỏ cho giờ
    // Để giúp người dùng quan sát rõ các phần còn thiếu
    return (
      <>
        <div className="flex flex-wrap gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 text-[12px] font-bold ${
              has_date_selected
                ? 'border-sky-300 bg-sky-50 text-sky-700'
                : 'border-slate-200 bg-slate-50 text-slate-400'
            }`}
          >
            Ngày: {formatDisplayDate(value) || placeholder}
          </span>
          <span
            className={`rounded-full border px-2.5 py-1 text-[12px] font-bold ${
              has_time_selected
                ? 'border-sky-300 bg-sky-50 text-sky-700'
                : 'border-amber-300 bg-amber-50 text-amber-700'
            }`}
          >
            Giờ: {value_time || 'Chưa chọn'}
          </span>
        </div>
        <p
          className={`mt-1 text-[11px] font-bold uppercase tracking-[0.08em] ${
            has_complete_selection
              ? 'text-slate-400'
              : needs_time_attention
                ? 'text-amber-700'
                : 'text-slate-400'
          }`}
        >
          {has_complete_selection
            ? 'Đã chọn ngày và giờ'
            : needs_time_attention
              ? 'Đã chọn ngày, còn thiếu giờ'
              : 'Vui lòng chọn ngày và giờ'}
        </p>
      </>
    );
  }

  // Trả về cấu trúc giao diện chính của Component
  // Để React render HTML lên trình duyệt
  return (
    <div className="space-y-1.5 relative" ref={container_ref}>
      <button
        className={`flex min-h-10 w-full items-center justify-between rounded-xl border bg-white px-2.5 py-2 text-left transition-colors ${
          needs_time_attention && !is_open
            ? 'border-amber-400 ring-4 ring-amber-100'
            : trigger_class
        }`}
        onClick={() => set_is_open((current) => !current)}
        type="button"
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <Calendar className="h-4 w-4 shrink-0 text-sky-500" />
          <div className="min-w-0">
            {renderSelectionSummary()}
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${is_open ? 'rotate-180' : ''}`}
        />
      </button>

      {is_open ? (
        <div className={`rounded-2xl border p-3 ${panel_class}`}>
          <div className="space-y-2.5">
            {name_time && (
              <div className="rounded-xl border border-sky-100 bg-sky-50/60 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-slate-800">Chọn giờ</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-slate-500">
                      Chọn ngày trên lịch rồi chọn giờ ngay tại đây. Khi chọn xong, bấm Đóng để quay lại form.
                    </p>
                  </div>
                  {needs_time_attention ? (
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                      Còn thiếu giờ
                    </span>
                  ) : null}
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-sky-600">
                    <Clock className="h-4 w-4" />
                  </div>
                  <input
                    ref={time_input_ref}
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none transition-colors focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                    name={name_time}
                    onChange={handleTimeChange}
                    step="900"
                    type="time"
                    value={value_time || ''}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                onClick={() => changeMonth(-1)}
                type="button"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <p className="text-sm font-black capitalize text-slate-800">{month_label}</p>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                onClick={() => changeMonth(1)}
                type="button"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-black uppercase tracking-[0.08em] text-slate-400">
              {
                // Duyệt qua mảng danh sách tên thứ
                // Để render nhãn tiêu đề cho các cột của lịch
                WEEKDAY_LABELS.map((label) => (
                  <div key={label} className="py-1">
                    {label}
                  </div>
                ))
              }
            </div>

            <div className="grid grid-cols-7 gap-1">
              {
                // Duyệt qua mảng danh sách ngày
                // Để render từng ô ngày trong lưới
                calendar_days.map((date) => {
                  // Xác định xem ngày đang vẽ có thuộc tháng hiển thị không
                  // Để thay đổi style hiển thị cho ngày trong/ngoài tháng
                  let is_current_month = date.getMonth() === visible_month.getMonth();
                  
                  // Xác định xem ngày đang vẽ có phải là ngày được chọn không
                  // Để highlight nếu đúng
                  let is_selected = isSameDate(selected_date, date);

                  // Trả về nút bấm chọn ngày
                  // Để render lên lưới lịch
                  return (
                    <button
                      key={date.toISOString()}
                      className={`flex h-9 items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                        is_selected
                          ? selected_day_class
                          : is_current_month
                            ? 'text-slate-700 hover:bg-sky-50'
                            : 'text-slate-300 hover:bg-slate-50'
                      }`}
                      onClick={() => handleSelectDate(date)}
                      type="button"
                    >
                      {date.getDate()}
                    </button>
                  );
                })
              }
            </div>

            <div className="mt-2 flex items-center justify-end gap-2 border-t border-slate-100 pt-2">
              <button
                className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
                onClick={() => handleSelectDate(new Date())}
                type="button"
              >
                Hôm nay
              </button>
              <button
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800"
                onClick={() => set_is_open(false)}
                type="button"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
