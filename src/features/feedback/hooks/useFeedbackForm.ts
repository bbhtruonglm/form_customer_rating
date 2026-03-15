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
import {
  createInitialFormData,
  createStaffEntry,
  toggleSelection,
  validateCustomerForm,
} from '@/features/feedback/utils/feedback-form';

type InputChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

export function useFeedbackForm() {
  const [formData, setFormData] = useState<FeedbackFormData>(() => createInitialFormData());
  const [step, setStep] = useState<FeedbackStep>('customer');
  const [isCustomerConfirmed, setIsCustomerConfirmed] = useState(false);
  const [isGeneratingLookupCode, setIsGeneratingLookupCode] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [lookupCodeError, setLookupCodeError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const updateTextField = (field: FeedbackTextField, value: string) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleInputChange = (event: InputChangeEvent) => {
    const { name, value } = event.target;
    updateTextField(name as FeedbackTextField, value);
  };

  const toggleEquipment = (equipmentItem: string) => {
    setFormData((previous) => ({
      ...previous,
      equipment: toggleSelection(previous.equipment, equipmentItem),
    }));
  };

  const updateNestedStaffEntry = <T extends NestedStaffSectionKey>(
    section: T,
    subSection: NestedStaffSubSectionMap[T],
    id: string,
    field: keyof StaffEntry,
    value: StaffEntry[keyof StaffEntry],
  ) => {
    setFormData((previous) => ({
      ...previous,
      [section]: {
        ...previous[section],
        [subSection]: previous[section][subSection].map((entry) =>
          entry.id === id ? { ...entry, [field]: value } : entry,
        ),
      },
    }));
  };

  const addNestedStaffGroup = <T extends NestedStaffSectionKey>(section: T) => {
    const id = createStaffEntry().id;

    setFormData((previous) => ({
      ...previous,
      [section]: {
        ...previous[section],
        ...(section === 'warehousePrep'
          ? {
              level1: [...previous.warehousePrep.level1, createStaffEntry(id)],
              level2: [...previous.warehousePrep.level2, createStaffEntry(id)],
            }
          : {
              level1: [...previous.installation.level1, createStaffEntry(id)],
              level2: [...previous.installation.level2, createStaffEntry(id)],
              level3: [...previous.installation.level3, createStaffEntry(id)],
            }),
      },
    }));
  };

  const removeNestedStaffGroup = <T extends NestedStaffSectionKey>(section: T, id: string) => {
    setFormData((previous) => ({
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
  };

  const updateNestedSharedDate = <T extends NestedStaffSectionKey>(
    section: T,
    id: string,
    value: string,
  ) => {
    setFormData((previous) => ({
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
  };

  const updateSimpleStaffEntry = (
    section: SimpleStaffSectionKey,
    id: string,
    field: keyof StaffEntry,
    value: StaffEntry[keyof StaffEntry],
  ) => {
    setFormData((previous) => ({
      ...previous,
      [section]: previous[section].map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry,
      ),
    }));
  };

  const addSimpleStaffEntry = (section: SimpleStaffSectionKey) => {
    setFormData((previous) => ({
      ...previous,
      [section]: [...previous[section], createStaffEntry()],
    }));
  };

  const removeSimpleStaffEntry = (section: SimpleStaffSectionKey, id: string) => {
    setFormData((previous) => ({
      ...previous,
      [section]: previous[section].filter((entry) => entry.id !== id),
    }));
  };

  const toggleNestedStaffMember = <T extends NestedStaffSectionKey>(
    section: T,
    subSection: NestedStaffSubSectionMap[T],
    id: string,
    staffName: string,
  ) => {
    const targetEntry = formData[section][subSection].find((entry) => entry.id === id);

    if (!targetEntry) {
      return;
    }

    updateNestedStaffEntry(section, subSection, id, 'staffIds', toggleSelection(targetEntry.staffIds, staffName));
  };

  const toggleSimpleStaffMember = (section: SimpleStaffSectionKey, id: string, staffName: string) => {
    const targetEntry = formData[section].find((entry) => entry.id === id);

    if (!targetEntry) {
      return;
    }

    updateSimpleStaffEntry(section, id, 'staffIds', toggleSelection(targetEntry.staffIds, staffName));
  };

  const confirmCustomerStep = async () => {
    const nextErrors = validateCustomerForm(formData);
    setErrors(nextErrors);
    setLookupCodeError('');

    if (nextErrors.length > 0) {
      return false;
    }

    let nextLookupCode = formData.lookupCode;

    if (!nextLookupCode) {
      setIsGeneratingLookupCode(true);

      try {
        nextLookupCode = await generateLookupCode();
        setFormData((previous) => ({
          ...previous,
          lookupCode: nextLookupCode,
        }));
      } catch (error) {
        setLookupCodeError(
          error instanceof Error ? error.message : 'Không thể tạo Mã tra cứu lúc này.',
        );
        setIsGeneratingLookupCode(false);
        return false;
      }

      setIsGeneratingLookupCode(false);
    }

    setIsCustomerConfirmed(true);
    setStep('staff');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return true;
  };

  const goToCustomerStep = () => {
    setStep('customer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitFeedback = async () => {
    setIsSubmittingForm(true);
    setSubmitError('');
    setSubmitSuccessMessage('');

    try {
      await submitFeedbackToGoogleForm(formData);
      setSubmitSuccessMessage('Đã gửi dữ liệu thành công. Bạn có thể kiểm tra trên form test.');
      setIsSubmittingForm(false);
      return true;
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Không thể lưu dữ liệu lúc này.');
      setIsSubmittingForm(false);
      return false;
    }
  };

  return {
    errors,
    formData,
    handleInputChange,
    isGeneratingLookupCode,
    isSubmittingForm,
    isCustomerConfirmed,
    lookupCodeError,
    submitError,
    submitSuccessMessage,
    step,
    addNestedStaffGroup,
    addSimpleStaffEntry,
    confirmCustomerStep,
    goToCustomerStep,
    removeNestedStaffGroup,
    removeSimpleStaffEntry,
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
