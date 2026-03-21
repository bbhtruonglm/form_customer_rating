import { useState } from 'react';
import type { ChangeEvent } from 'react';

import type {
  FeedbackFormData,
  FeedbackStep,
  FeedbackTextField,
  NestedStaffSectionKey,
  NestedStaffSubSectionMap,
  SimpleStaffSectionKey,
  StaffEntry,
} from '@/features/feedback/types';
import { generateLookupCode } from '@/features/feedback/services/lookup-code';
import { submitFeedbackToGoogleForm } from '@/features/feedback/services/google-form-submit';
import { MOCK_FORM_DATA, MOCK_FORM_DATA_2 } from '@/features/feedback/mocks/mock-form-data';
import {
  createInitialFormData,
  createStaffEntry,
  toggleSelection,
  validateCustomerForm,
} from '@/features/feedback/utils/feedback-form';

/** Định nghĩa kiểu dữ liệu cho sự kiện thay đổi input */
type InputChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

/** 
 * Hook quản lý toàn bộ trạng thái và logic của form phản hồi.
 * Tại sao: Tách biệt logic xử lý dữ liệu phức tạp (như lồng ghép nhân sự) khỏi UI components.
 */
export function useFeedbackForm() {
  /** Quản lý dữ liệu chính của form */
  const [FORM_DATA, SET_FORM_DATA] = useState<FeedbackFormData>(() => createInitialFormData());
  
  /** Quản lý bước hiện tại của quy trình */
  const [STEP, SET_STEP] = useState<FeedbackStep>('customer');
  
  /** Trạng thái đã xác nhận thông tin khách hàng hay chưa */
  const [IS_CUSTOMER_CONFIRMED, SET_IS_CUSTOMER_CONFIRMED] = useState(false);
  
  /** Trạng thái đang thực hiện tạo mã tra cứu */
  const [IS_GENERATING_LOOKUP_CODE, SET_IS_GENERATING_LOOKUP_CODE] = useState(false);
  
  /** Trạng thái đang gửi form lên hệ thống */
  const [IS_SUBMITTING_FORM, SET_IS_SUBMITTING_FORM] = useState(false);
  
  /** Thông báo lỗi khi tạo mã tra cứu */
  const [LOOKUP_CODE_ERROR, SET_LOOKUP_CODE_ERROR] = useState('');
  
  /** Thông báo lỗi khi gửi form thất bại */
  const [SUBMIT_ERROR, SET_SUBMIT_ERROR] = useState('');
  
  /** Thông báo thành công sau khi gửi form */
  const [SUBMIT_SUCCESS_MESSAGE, SET_SUBMIT_SUCCESS_MESSAGE] = useState('');
  
  /** Danh sách các lỗi validate hiển thị cho người dùng */
  const [ERROR_LIST, SET_ERROR_LIST] = useState<string[]>([]);

  /** 
   * Cập nhật giá trị cho một trường văn bản đơn giản.
   * Tại sao: Giảm bớt code lặp lại khi chỉ cần cập nhật 1 thuộc tính phẳng trong object form.
   */
  function updateTextField(field: FeedbackTextField, value: string) {
    SET_FORM_DATA((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  /** 
   * Xử lý sự kiện khi người dùng nhập liệu vào input.
   * Tại sao: Trích xuất thông tin name và value từ event để cập nhật state tương ứng.
   */
  function handleInputChange(event: InputChangeEvent) {
    /** Lấy thông tin name và value từ target của sự kiện */
    const { name, value } = event.target;
    // Đồng bộ giá trị vào state thông qua helper
    updateTextField(name as FeedbackTextField, value);
  }

  /** 
   * Thêm hoặc xóa một thiết bị khỏi danh sách lựa chọn.
   * Tại sao: Xử lý logic toggle đa lựa chọn trong mảng equipment.
   */
  function toggleEquipment(equipment_item: string) {
    SET_FORM_DATA((previous) => ({
      ...previous,
      equipment: toggleSelection(previous.equipment, equipment_item),
    }));
  }

  /** 
   * Cập nhật thông tin chi tiết cho một nhân sự trong nhóm lồng (Warehouse/Installation).
   * Tại sao: Cấu trúc dữ liệu nhân sự phức tạp yêu cầu truy cập chính xác vào Section -> SubSection -> ID.
   */
  function updateNestedStaffEntry<T extends NestedStaffSectionKey>(
    section: T,
    sub_section: NestedStaffSubSectionMap[T],
    id: string,
    field: keyof StaffEntry,
    value: StaffEntry[keyof StaffEntry],
  ) {
    SET_FORM_DATA((previous) => ({
      ...previous,
      [section]: {
        ...previous[section],
        [sub_section]: previous[section][sub_section].map((entry) =>
          entry.id === id ? { ...entry, [field]: value } : entry,
        ),
      },
    }));
  }

  /** 
   * Thêm một nhóm nhân sự mới vào các section lồng nhau.
   * Tại sao: Một lần nhấn nút 'Thêm nhóm' sẽ tạo mới đồng thời level1, level2 (và level3 nếu có) dùng chung ID.
   */
  function addNestedStaffGroup<T extends NestedStaffSectionKey>(section: T) {
    /** Tạo ID duy nhất cho nhóm nhân sự mới */
    const GROUP_ID = createStaffEntry().id;

    SET_FORM_DATA((previous) => ({
      ...previous,
      [section]: {
        ...previous[section],
        ...(section === 'warehousePrep'
          ? {
              level1: [...previous.warehousePrep.level1, createStaffEntry(GROUP_ID)],
              level2: [...previous.warehousePrep.level2, createStaffEntry(GROUP_ID)],
            }
          : {
              level1: [...previous.installation.level1, createStaffEntry(GROUP_ID)],
              level2: [...previous.installation.level2, createStaffEntry(GROUP_ID)],
              level3: [...previous.installation.level3, createStaffEntry(GROUP_ID)],
            }),
      },
    }));
  }

  /** 
   * Xóa một nhóm nhân sự dựa trên ID dùng chung.
   * Tại sao: Đảm bảo khi xóa 1 nhóm thì tất cả các levels của nhóm đó đều bị loại bỏ.
   */
  function removeNestedStaffGroup<T extends NestedStaffSectionKey>(section: T, id: string) {
    SET_FORM_DATA((previous) => ({
      ...previous,
      [section]: {
        ...previous[section],
        ...(section === 'warehousePrep'
          ? {
              level1: previous.warehousePrep.level1.filter((entry) => entry.id !== id),
              level2: previous.warehousePrep.level2.filter((entry) => entry.id !== id),
            }
          : {
              level1: previous.installation.level1.filter((entry) => entry.id !== id),
              level2: previous.installation.level2.filter((entry) => entry.id !== id),
              level3: previous.installation.level3.filter((entry) => entry.id !== id),
            }),
      },
    }));
  }

  /** 
   * Cập nhật ngày dùng chung cho cả nhóm nhân sự.
   * Tại sao: Người dùng chỉ cần chọn ngày một lần cho cả nhóm thay vì chọn cho từng level đơn lẻ.
   */
  function updateNestedSharedDate<T extends NestedStaffSectionKey>(
    section: T,
    id: string,
    value: string,
  ) {
    SET_FORM_DATA((previous) => ({
      ...previous,
      [section]: {
        ...previous[section],
        ...(section === 'warehousePrep'
          ? {
              level1: previous.warehousePrep.level1.map((entry) =>
                entry.id === id ? { ...entry, date: value } : entry,
              ),
              level2: previous.warehousePrep.level2.map((entry) =>
                entry.id === id ? { ...entry, date: value } : entry,
              ),
            }
          : {
              level1: previous.installation.level1.map((entry) =>
                entry.id === id ? { ...entry, date: value } : entry,
              ),
              level2: previous.installation.level2.map((entry) =>
                entry.id === id ? { ...entry, date: value } : entry,
              ),
              level3: previous.installation.level3.map((entry) =>
                entry.id === id ? { ...entry, date: value } : entry,
              ),
            }),
      },
    }));
  }

  /** 
   * Cập nhật thông tin cho các section nhân sự phẳng (không lồng level).
   * Tại sao: Xử lý các mục như Trông đồ đêm, Gửi xe... có cấu trúc dữ liệu đơn giản hơn.
   */
  function updateSimpleStaffEntry(
    section: SimpleStaffSectionKey,
    id: string,
    field: keyof StaffEntry,
    value: StaffEntry[keyof StaffEntry],
  ) {
    SET_FORM_DATA((previous) => ({
      ...previous,
      [section]: previous[section].map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry,
      ),
    }));
  }

  /** 
   * Thêm một bản ghi nhân sự mới vào section phẳng.
   * Tại sao: Cho phép người dùng bổ sung thêm nhân sự tham gia các công việc phụ trợ.
   */
  function addSimpleStaffEntry(section: SimpleStaffSectionKey) {
    SET_FORM_DATA((previous) => ({
      ...previous,
      [section]: [...previous[section], createStaffEntry()],
    }));
  }

  /** 
   * Xóa một bản ghi nhân sự khỏi section phẳng.
   * Tại sao: Loại bỏ thông tin sai sót hoặc nhân sự không tham gia.
   */
  function removeSimpleStaffEntry(section: SimpleStaffSectionKey, id: string) {
    SET_FORM_DATA((previous) => ({
      ...previous,
      [section]: previous[section].filter((entry) => entry.id !== id),
    }));
  }

  /** 
   * Chọn hoặc bỏ chọn một thành viên trong nhóm nhân sự lồng.
   * Tại sao: Quản lý danh sách staffIds gắn liền với từng level công việc.
   */
  function toggleNestedStaffMember<T extends NestedStaffSectionKey>(
    section: T,
    sub_section: NestedStaffSubSectionMap[T],
    id: string,
    staff_name: string,
  ) {
    /** Tìm kiếm bản ghi nhân sự cần tác động */
    const TARGET_ENTRY = FORM_DATA[section][sub_section].find((entry) => entry.id === id);

    // Dừng xử lý nếu không tìm thấy bản ghi (tránh lỗi Runtime)
    if (!TARGET_ENTRY) return;

    updateNestedStaffEntry(section, sub_section, id, 'staffIds', toggleSelection(TARGET_ENTRY.staffIds, staff_name));
  }

  /** 
   * Chọn hoặc bỏ chọn thành viên trong section nhân sự phẳng.
   * Tại sao: Đồng nhất logic thao tác staffIds cho mọi loại section.
   */
  function toggleSimpleStaffMember(section: SimpleStaffSectionKey, id: string, staff_name: string) {
    /** Tìm kiếm bản ghi nhân sự mục tiêu */
    const TARGET_ENTRY = FORM_DATA[section].find((entry) => entry.id === id);

    // Không thực hiện gì nếu ID không tồn tại trong danh sách
    if (!TARGET_ENTRY) return;

    updateSimpleStaffEntry(section, id, 'staffIds', toggleSelection(TARGET_ENTRY.staffIds, staff_name));
  }

  /** 
   * Kiểm tra thông tin khách hàng và chuyển sang bước nhập nhân sự.
   * Tại sao: Đảm bảo dữ liệu khách hàng đầy đủ và có mã tra cứu trước khi sang bước tiếp theo.
   */
  async function confirmCustomerStep() {
    /** Thực hiện validate các trường bắt buộc của Step 1 */
    const VALIDATION_ERRORS = validateCustomerForm(FORM_DATA);
    SET_ERROR_LIST(VALIDATION_ERRORS);
    SET_LOOKUP_CODE_ERROR('');

    // Nếu có lỗi thì dừng lại để người dùng điều chỉnh
    if (VALIDATION_ERRORS.length > 0) return false;

    /** Lưu trữ mã tra cứu hiện tại hoặc chuẩn bị tạo mới */
    let next_lookup_code = FORM_DATA.lookupCode;

    // Tự động tạo mã tra cứu nếu người dùng chưa có
    if (!next_lookup_code) {
      SET_IS_GENERATING_LOOKUP_CODE(true);

      try {
        next_lookup_code = await generateLookupCode();
        SET_FORM_DATA((previous) => ({
          ...previous,
          lookupCode: next_lookup_code,
        }));
      } catch (e) {
        SET_LOOKUP_CODE_ERROR(
          e instanceof Error ? e.message : 'Không thể tạo Mã tra cứu lúc này.',
        );
        SET_IS_GENERATING_LOOKUP_CODE(false);
        return false;
      }

      SET_IS_GENERATING_LOOKUP_CODE(false);
    }

    SET_IS_CUSTOMER_CONFIRMED(true);
    SET_STEP('staff');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return true;
  }

  /** 
   * Quay lại bước nhập thông tin khách hàng.
   * Tại sao: Cho phép người dùng sửa đổi thông tin ban đầu sau khi đã sang bước staff.
   */
  function goToCustomerStep() {
    SET_STEP('customer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /** 
   * Gửi toàn bộ dữ liệu phản hồi lên Google Form.
   * Tại sao: Hoàn tất quy trình thu thập ý kiến và lưu trữ vào cơ sở dữ liệu tập trung.
   */
  async function submitFeedback() {
    SET_IS_SUBMITTING_FORM(true);
    SET_SUBMIT_ERROR('');
    SET_SUBMIT_SUCCESS_MESSAGE('');

    try {
      await submitFeedbackToGoogleForm(FORM_DATA);
      SET_SUBMIT_SUCCESS_MESSAGE('Đã gửi dữ liệu thành công.');
      SET_IS_SUBMITTING_FORM(false);
      SET_STEP('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return true;
    } catch (e) {
      SET_SUBMIT_ERROR(e instanceof Error ? e.message : 'Không thể lưu dữ liệu lúc này.');
      SET_IS_SUBMITTING_FORM(false);
      return false;
    }
  }

  /** 
   * Xóa sạch dữ liệu và quay về trạng thái ban đầu.
   * Tại sao: Chuẩn bị cho một phiên ghi nhận phản hồi mới từ đầu.
   */
  function resetForm() {
    SET_FORM_DATA(createInitialFormData());
    SET_IS_CUSTOMER_CONFIRMED(false);
    SET_IS_GENERATING_LOOKUP_CODE(false);
    SET_IS_SUBMITTING_FORM(false);
    SET_LOOKUP_CODE_ERROR('');
    SET_SUBMIT_ERROR('');
    SET_SUBMIT_SUCCESS_MESSAGE('');
    SET_ERROR_LIST([]);
    SET_STEP('customer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Điền dữ liệu giả (Mock 1) và tự động chuyển sang bước chọn nhân viên.
   * Tại sao: Giúp đẩy nhanh quá trình kiểm thử giao diện và logic bước sau mà không mất công nhập lại thông tin khách hàng/sự kiện.
   */
  async function fillMockData() {
    // Nạp dữ liệu mô phỏng vào form state
    SET_FORM_DATA(MOCK_FORM_DATA);
    SET_ERROR_LIST([]);
    SET_LOOKUP_CODE_ERROR('');
    SET_SUBMIT_ERROR('');
    SET_SUBMIT_SUCCESS_MESSAGE('');
    SET_IS_GENERATING_LOOKUP_CODE(true);

    try {
      /** Tạo mã tra cứu cho bản ghi mock */
      const GENERATED_CODE = await generateLookupCode();
      SET_FORM_DATA((previous) => ({ ...previous, lookupCode: GENERATED_CODE }));
    } catch {
      // Trường hợp không có mạng thì vẫn gán mã temp để test UI
      SET_FORM_DATA((previous) => ({ ...previous, lookupCode: 'MOCK-TEST-0000' }));
    }

    SET_IS_GENERATING_LOOKUP_CODE(false);
    SET_IS_CUSTOMER_CONFIRMED(true);
    SET_STEP('staff');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Điền dữ liệu giả nâng cao (Mock 2) với nhiều ngày và nhiều nhóm nhân sự.
   * Tại sao: Kiểm tra khả năng render danh sách nhân viên phức tạp và logic lưu trữ mảng dữ liệu lớn.
   */
  async function fillMockData2() {
    // Sử dụng tập dữ liệu mock nâng cao
    SET_FORM_DATA(MOCK_FORM_DATA_2);
    SET_ERROR_LIST([]);
    SET_LOOKUP_CODE_ERROR('');
    SET_SUBMIT_ERROR('');
    SET_SUBMIT_SUCCESS_MESSAGE('');
    SET_IS_GENERATING_LOOKUP_CODE(true);

    try {
      /** Mã tra cứu tự động cho mock 2 */
      const NEW_CODE = await generateLookupCode();
      SET_FORM_DATA((previous) => ({ ...previous, lookupCode: NEW_CODE }));
    } catch {
      SET_FORM_DATA((previous) => ({ ...previous, lookupCode: 'MOCK-DATA-2-0000' }));
    }

    SET_IS_GENERATING_LOOKUP_CODE(false);
    SET_IS_CUSTOMER_CONFIRMED(true);
    SET_STEP('staff');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return {
    errors: ERROR_LIST,
    formData: FORM_DATA,
    handleInputChange,
    isGeneratingLookupCode: IS_GENERATING_LOOKUP_CODE,
    isSubmittingForm: IS_SUBMITTING_FORM,
    isCustomerConfirmed: IS_CUSTOMER_CONFIRMED,
    lookupCodeError: LOOKUP_CODE_ERROR,
    submitError: SUBMIT_ERROR,
    submitSuccessMessage: SUBMIT_SUCCESS_MESSAGE,
    step: STEP,
    addNestedStaffGroup,
    addSimpleStaffEntry,
    confirmCustomerStep,
    fillMockData,
    fillMockData2,
    goToCustomerStep,
    removeNestedStaffGroup,
    removeSimpleStaffEntry,
    resetForm,
    submitFeedback,
    toggleEquipment,
    toggleNestedStaffMember,
    toggleSimpleStaffMember,
    updateNestedStaffEntry,
    updateNestedSharedDate,
    updateSimpleStaffEntry,
    updateTextField,
  };
}
