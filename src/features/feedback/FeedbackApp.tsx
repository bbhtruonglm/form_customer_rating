import { AnimatePresence, motion } from 'motion/react';

import CustomerStep from '@/features/feedback/components/CustomerStep';
import PageHeader from '@/features/feedback/components/PageHeader';
import StaffStep from '@/features/feedback/components/StaffStep';
import { useFeedbackForm } from '@/features/feedback/hooks/useFeedbackForm';

/** 
 * Component gốc của ứng dụng Phản hồi Đánh giá Sự kiện.
 * Tại sao: Điểm tập trung logic của luồng Feedback, quản lý việc chuyển đổi giữa 
 * thông tin khách hàng, chọn nhân viên và màn hình thành công.
 */
export default function FeedbackApp() {
  const {
    addNestedStaffGroup,
    addSimpleStaffEntry,
    confirmCustomerStep,
    errors,
    fillMockData,
    fillMockData2,
    formData,
    goToCustomerStep,
    handleInputChange,
    isGeneratingLookupCode,
    isSubmittingForm,
    isCustomerConfirmed,
    lookupCodeError,
    removeNestedStaffGroup,
    removeSimpleStaffEntry,
    resetForm,
    submitSuccessMessage,
    submitError,
    step,
    submitFeedback,
    toggleEquipment,
    toggleNestedStaffMember,
    toggleSimpleStaffMember,
    updateNestedSharedDate,
    updateSimpleStaffEntry,
  } = useFeedbackForm();

  return (
    <div className="min-h-screen bg-white px-3 py-5 text-[17px] selection:bg-red-100 selection:text-red-900 sm:px-6 sm:py-8 sm:text-base">
      <div className="mx-auto max-w-4xl">
        <PageHeader step={step} />

        <main className="relative">
          <AnimatePresence mode="wait">
            {step === 'success' ? (
              <motion.div
                key="success-page"
                animate={{ opacity: 1, x: 0 }}
                className="relative flex min-h-[600px] flex-col items-center justify-center overflow-hidden border border-slate-300 bg-white p-4 text-center sm:p-16"
                exit={{ opacity: 0, x: -20 }}
                initial={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div className="relative z-10 max-w-4xl space-y-10 rounded-3xl bg-white/70 px-4 py-8 backdrop-blur-sm sm:p-12">
                  <h2 className="text-xl font-black uppercase leading-relaxed text-slate-800 md:text-2xl">
                    Công ty TNHH Sự kiện Trần Gia xin chân thành cảm ơn Quý khách <br className="hidden md:block" /> đã phản hồi đánh giá.
                  </h2>
                  <p className="text-lg font-bold leading-relaxed text-slate-800 md:text-xl">
                    Những ý kiến đóng góp của Quý khách sẽ giúp chúng tôi cải thiện <br className="hidden md:block" /> dịch vụ ngày càng tốt hơn.
                  </p>
                  <p className="text-xl font-black leading-relaxed text-slate-800 md:text-2xl">
                    Kính chúc Quý khách sức khỏe và nhiều thành công!
                  </p>
                  <div className="pt-8">
                    <button
                      className="rounded-full bg-sky-600 px-8 py-4 text-sm font-bold uppercase text-white shadow-lg shadow-sky-200 transition-all active:scale-95 hover:bg-sky-700"
                      onClick={resetForm}
                      type="button"
                    >
                      Gửi Đánh Giá Khác
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : step === 'customer' ? (
              <motion.div
                key="customer-page"
                animate={{ opacity: 1, x: 0 }}
                className="overflow-hidden border border-slate-300 bg-white"
                exit={{ opacity: 0, x: 20 }}
                initial={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <CustomerStep
                  errors={errors}
                  formData={formData}
                  isGeneratingLookupCode={isGeneratingLookupCode}
                  isCustomerConfirmed={isCustomerConfirmed}
                  onConfirm={confirmCustomerStep}
                  onInputChange={handleInputChange}
                  onToggleEquipment={toggleEquipment}
                  lookupCodeError={lookupCodeError}
                />
              </motion.div>
            ) : (
              <motion.div
                key="staff-page"
                animate={{ opacity: 1, x: 0 }}
                className="overflow-hidden border border-slate-300 bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)]"
                exit={{ opacity: 0, x: -20 }}
                initial={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <StaffStep
                  onAddNestedGroup={addNestedStaffGroup}
                  formData={formData}
                  isSaving={isSubmittingForm}
                  onAddSimpleEntry={addSimpleStaffEntry}
                  onBack={goToCustomerStep}
                  onInputChange={handleInputChange}
                  onRemoveNestedGroup={removeNestedStaffGroup}
                  onRemoveSimpleEntry={removeSimpleStaffEntry}
                  onSave={submitFeedback}
                  saveError={submitError}
                  saveSuccessMessage={submitSuccessMessage}
                  onToggleNestedStaff={toggleNestedStaffMember}
                  onToggleSimpleStaff={toggleSimpleStaffMember}
                  onUpdateNestedDate={updateNestedSharedDate}
                  onUpdateSimpleEntry={updateSimpleStaffEntry}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Nút dev chỉ hiện trong môi trường development */}
      {import.meta.env.DEV && step === 'customer' && (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
          <button
            aria-label="Dev: Fill mock data (Basic)"
            className="flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-xs font-bold text-amber-900 shadow-xl shadow-amber-200 transition-all hover:bg-amber-300 active:scale-95"
            onClick={fillMockData}
            title="Sự kiện 1 ngày, ít nhóm nhân sự."
            type="button"
          >
            ⚡ Dev: Mock 1 (Basic)
          </button>
          <button
            aria-label="Dev: Fill mock data (Advanced)"
            className="flex items-center gap-2 rounded-full bg-indigo-500 px-5 py-2.5 text-xs font-bold text-white shadow-xl shadow-indigo-200 transition-all hover:bg-indigo-400 active:scale-95"
            onClick={fillMockData2}
            title="Sự kiện nhiều ngày, 3 nhóm kho, 2 nhóm lắp đặt."
            type="button"
          >
            🔥 Dev: Mock 2 (Advanced)
          </button>
        </div>
      )}
    </div>
  );
}
