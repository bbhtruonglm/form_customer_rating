import { AnimatePresence, motion } from 'motion/react';

import CustomerStep from '@/features/feedback/components/CustomerStep';
import PageHeader from '@/features/feedback/components/PageHeader';
import StaffStep from '@/features/feedback/components/StaffStep';
import { useFeedbackForm } from '@/features/feedback/hooks/useFeedbackForm';

export default function FeedbackApp() {
  const {
    addNestedStaffGroup,
    addSimpleStaffEntry,
    confirmCustomerStep,
    errors,
    formData,
    goToCustomerStep,
    handleInputChange,
    isGeneratingLookupCode,
    isSubmittingForm,
    isCustomerConfirmed,
    lookupCodeError,
    removeNestedStaffGroup,
    removeSimpleStaffEntry,
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
    <div className="min-h-screen bg-[#f8fafc] px-3 py-5 font-sans text-[17px] selection:bg-red-100 selection:text-red-900 sm:px-6 sm:py-8 sm:text-base">
      <div className="mx-auto max-w-5xl">
        <PageHeader step={step} />

        <main className="relative">
          <AnimatePresence mode="wait">
            {step === 'customer' ? (
              <motion.div
                key="customer-page"
                animate={{ opacity: 1, x: 0 }}
                className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl shadow-slate-200/50"
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
                className="overflow-hidden rounded-[2.5rem] border border-slate-300 bg-[linear-gradient(180deg,_#f8fafc_0%,_#edf2f7_100%)] shadow-2xl shadow-slate-200/80"
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

        <footer className="mt-10 text-center sm:mt-12">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-400 sm:text-[10px] sm:tracking-[0.4em]">
            © 2026 Công ty TNHH Sự kiện Trần Gia
          </p>
        </footer>
      </div>
    </div>
  );
}
