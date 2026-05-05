import type { ChangeEvent } from 'react';
import { ArrowRight, CheckCircle2, Info } from 'lucide-react';
import { motion } from 'motion/react';

import DateSelect from '@/components/ui/DateSelect';
import FormInput from '@/components/ui/FormInput';
import FormTextarea from '@/components/ui/FormTextarea';
import ChipMultiSelect from '@/components/ui/ChipMultiSelect';
import { EQUIPMENT_ITEMS } from '@/features/feedback/config/options';
import type { FeedbackFormData } from '@/features/feedback/types';

interface CustomerStepProps {
  errors: string[];
  formData: FeedbackFormData;
  isGeneratingLookupCode: boolean;
  isCustomerConfirmed: boolean;
  onConfirm: () => void;
  onInputChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
  onToggleEquipment: (item: string) => void;
  lookupCodeError: string;
}

function SectionTitle({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-base font-bold text-white sm:h-8 sm:w-8 sm:text-sm">
        {index}
      </div>
      <h3 className="text-lg font-black uppercase text-slate-800 sm:text-base">{title}</h3>
    </div>
  );
}

export default function CustomerStep({
  errors,
  formData,
  isGeneratingLookupCode,
  isCustomerConfirmed,
  onConfirm,
  onInputChange,
  onToggleEquipment,
  lookupCodeError,
}: CustomerStepProps) {
  return (
    <div className="space-y-10 p-5 sm:space-y-12 sm:p-12">
      <section className="space-y-7 sm:space-y-8">
        <SectionTitle index="I" title="Thông tin khách hàng" />
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
              <p className="text-base font-bold uppercase text-slate-700 sm:text-sm">
                Mã tra cứu
              </p>
              <div className="mt-2 flex items-center justify-between gap-4">
                <p className="text-xl font-black text-slate-900 sm:text-lg">
                  {formData.lookupCode || (isGeneratingLookupCode ? 'Đang tạo mã...' : 'Chưa tạo')}
                </p>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase text-slate-500">
                  {isGeneratingLookupCode
                    ? 'Đang xử lý'
                    : formData.lookupCode
                      ? 'Sẵn sàng'
                      : 'Tự động tạo'}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Mã tra cứu sẽ được tạo tự động khi bạn xác nhận chuyển sang bước tiếp theo.
              </p>
            </div>
          </div>
          <FormInput
            disabled={isCustomerConfirmed}
            label="Ông (Bà)"
            name="customerName"
            onChange={onInputChange}
            required
            value={formData.customerName}
          />
          <FormInput
            disabled={isCustomerConfirmed}
            label="Số điện thoại"
            name="phoneNumber"
            onChange={onInputChange}
            required
            value={formData.phoneNumber}
          />
          <FormInput
            disabled={isCustomerConfirmed}
            label="Chức vụ"
            name="position"
            onChange={onInputChange}
            value={formData.position}
          />
          <FormInput
            disabled={isCustomerConfirmed}
            label="Email"
            name="email"
            onChange={onInputChange}
            required
            type="email"
            value={formData.email}
          />
          <div className="md:col-span-2">
            <FormInput
              disabled={isCustomerConfirmed}
              label="Đơn vị"
              name="organization"
              onChange={onInputChange}
              value={formData.organization}
            />
          </div>
        </div>
      </section>

      <section className="space-y-7 sm:space-y-8">
        <SectionTitle index="II" title="Thông tin sự kiện" />
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <FormInput
              disabled={isCustomerConfirmed}
              label="Tên sự kiện"
              name="eventName"
              onChange={onInputChange}
              required
              value={formData.eventName}
            />
          </div>
          <div className="md:col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2.5">
              <label className="text-base font-bold uppercase text-slate-700 sm:text-sm">
                Từ ngày <span className="text-red-500">*</span>
              </label>
              <DateSelect
                name="eventStartDate"
                nameTime="eventStartTime"
                onChange={onInputChange}
                placeholder="Chọn từ ngày"
                value={formData.eventStartDate}
                valueTime={formData.eventStartTime}
              />
            </div>
            <div className="flex flex-col gap-2.5">
              <label className="text-base font-bold uppercase text-slate-700 sm:text-sm">
                Đến ngày <span className="text-red-500">*</span>
              </label>
              <DateSelect
                name="eventEndDate"
                nameTime="eventEndTime"
                onChange={onInputChange}
                placeholder="Chọn đến ngày"
                value={formData.eventEndDate}
                valueTime={formData.eventEndTime}
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <FormTextarea
              disabled={isCustomerConfirmed}
              label="Địa điểm"
              name="location"
              onChange={onInputChange}
              placeholder="Nhập địa điểm tổ chức sự kiện..."
              rows={4}
              value={formData.location}
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-4 block text-base font-bold uppercase text-slate-700 sm:text-sm">
              Hạng mục thiết bị sử dụng
            </label>
            <ChipMultiSelect
              disabled={isCustomerConfirmed}
              items={EQUIPMENT_ITEMS}
              onToggle={onToggleEquipment}
              selectedItems={formData.equipment}
            />
            <div className="mt-4">
              <FormInput
                disabled={isCustomerConfirmed}
                label="Hạng mục khác"
                name="otherEquipment"
                onChange={onInputChange}
                placeholder="Nhập hạng mục khác bằng tay..."
                value={formData.otherEquipment}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-7 sm:space-y-8">
        <SectionTitle index="III" title="Đánh giá & Góp ý" />
        <div className="space-y-8">
          <div className="flex flex-col gap-3">
            <label className="text-base font-bold uppercase text-slate-700 sm:text-sm">
              Chất lượng thiết bị - dịch vụ <span className="text-red-500">*</span>
            </label>
            <textarea
              className="min-h-36 resize-none rounded-2xl border border-slate-200 px-5 py-4 text-base outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-100 disabled:bg-slate-50 disabled:text-slate-400 sm:min-h-0"
              disabled={isCustomerConfirmed}
              name="serviceQuality"
              onChange={onInputChange}
              placeholder="Chia sẻ cảm nhận của bạn về chất lượng thiết bị..."
              rows={4}
              value={formData.serviceQuality}
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-base font-bold uppercase text-slate-700 sm:text-sm">
              Thái độ phục vụ của kỹ thuật viên <span className="text-red-500">*</span>
            </label>
            <textarea
              className="min-h-36 resize-none rounded-2xl border border-slate-200 px-5 py-4 text-base outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-100 disabled:bg-slate-50 disabled:text-slate-400 sm:min-h-0"
              disabled={isCustomerConfirmed}
              name="staffAttitude"
              onChange={onInputChange}
              placeholder="Nhận xét về sự chuyên nghiệp và thái độ của đội ngũ..."
              rows={4}
              value={formData.staffAttitude}
            />
          </div>
        </div>
      </section>

      {errors.length > 0 ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4 rounded-3xl border border-red-100 bg-red-50 p-5 text-base text-red-700 sm:p-6 sm:text-sm"
          initial={{ opacity: 0, y: 10 }}
        >
          <Info className="h-6 w-6 shrink-0" />
          <div>
            <p className="mb-2 text-base font-black uppercase  sm:text-sm">Vui lòng kiểm tra lại:</p>
            <ul className="list-inside list-disc space-y-1 font-medium">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      ) : null}

      {lookupCodeError ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-base text-amber-800 sm:p-6 sm:text-sm"
          initial={{ opacity: 0, y: 10 }}
        >
          <p className="font-black uppercase ">Không tạo được Mã tra cứu</p>
          <p className="mt-2 leading-relaxed">{lookupCodeError}</p>
        </motion.div>
      ) : null}

      <div className="flex justify-center pt-4 sm:pt-6">
        <button
          className="group flex w-full items-center justify-center gap-4 rounded-xl bg-red-600 px-4 py-3 text-base font-black uppercase  text-white shadow-xl shadow-red-200 transition-all active:scale-95 hover:bg-red-700 md:rounded-4xl md:px-8 md:py-5 sm:w-auto "
          disabled={isGeneratingLookupCode}
          onClick={onConfirm}
          type="button"
        >
          <CheckCircle2 className="h-7 w-7" />
          {isGeneratingLookupCode ? 'Đang tạo mã tra cứu...' : 'Xác nhận & Chuyển tiếp'}
          <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
