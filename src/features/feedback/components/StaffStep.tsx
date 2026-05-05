import type { ChangeEvent } from 'react';
import { ArrowRight, Briefcase, ChevronLeft, Package, Plus } from 'lucide-react';

import DateSelect from '@/components/ui/DateSelect';
import SearchableMultiSelect from '@/components/ui/SearchableMultiSelect';
import SearchableSingleSelect from '@/components/ui/SearchableSingleSelect';
import {
  NESTED_STAFF_SECTIONS,
  SALES_STAFF,
  SIMPLE_STAFF_SECTIONS,
  TECH_STAFF,
} from '@/features/feedback/config/options';
import type {
  FeedbackFormData,
  NestedStaffSectionKey,
  NestedStaffSubSectionMap,
  SimpleStaffSectionKey,
  StaffEntry,
} from '@/features/feedback/types';

interface StaffStepProps {
  formData: FeedbackFormData;
  isSaving: boolean;
  onAddNestedGroup: <T extends NestedStaffSectionKey>(section: T) => void;
  onAddSimpleEntry: (section: SimpleStaffSectionKey) => void;
  onBack: () => void;
  onInputChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
  onRemoveNestedGroup: <T extends NestedStaffSectionKey>(section: T, id: string) => void;
  onRemoveSimpleEntry: (section: SimpleStaffSectionKey, id: string) => void;
  onSave: () => Promise<boolean>;
  onToggleNestedStaff: <T extends NestedStaffSectionKey>(
    section: T,
    subSection: NestedStaffSubSectionMap[T],
    id: string,
    staffName: string,
  ) => void;
  onToggleSimpleStaff: (section: SimpleStaffSectionKey, id: string, staffName: string) => void;
  onUpdateNestedDate: <T extends NestedStaffSectionKey>(
    section: T,
    id: string,
    value: string,
  ) => void;
  onUpdateSimpleEntry: (
    section: SimpleStaffSectionKey,
    id: string,
    field: keyof StaffEntry,
    value: StaffEntry[keyof StaffEntry],
  ) => void;
  saveError: string;
  saveSuccessMessage: string;
}

function StaffEntryCard({
  availableStaff,
  entry,
  onToggleStaff,
}: {
  availableStaff: string[];
  entry: StaffEntry;
  onToggleStaff: (id: string, staffName: string) => void;
}) {
  return (
    <SearchableMultiSelect
      items={availableStaff}
      onToggle={(staffName) => onToggleStaff(entry.id, staffName)}
      placeholder="Chọn nhân sự tham gia"
      searchPlaceholder="Tìm theo tên nhân sự..."
      selectedItems={entry.staffIds}
      variant="staff"
    />
  );
}

function SimpleStaffEntryCard({
  entries,
  onDateChange,
  onRemove,
  onToggleStaff,
}: {
  entries: StaffEntry[];
  onDateChange: (id: string, value: string) => void;
  onRemove: (id: string) => void;
  onToggleStaff: (id: string, staffName: string) => void;
}) {
  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div key={entry.id} className="space-y-3 rounded-2xl border border-sky-100 bg-white p-3.5">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <DateSelect
                name={entry.id}
                onChange={(event) => onDateChange(entry.id, event.target.value)}
                placeholder="Chọn ngày thực hiện"
                value={entry.date}
              />
            </div>
            {entries.length > 1 ? (
              <button
                className="text-sm font-bold text-slate-500 transition-colors hover:text-red-500"
                onClick={() => onRemove(entry.id)}
                type="button"
              >
                Xóa
              </button>
            ) : null}
          </div>
          <SearchableMultiSelect
            items={TECH_STAFF}
            onToggle={(staffName) => onToggleStaff(entry.id, staffName)}
            placeholder="Chọn nhân sự"
            searchPlaceholder="Tìm theo tên nhân sự..."
            selectedItems={entry.staffIds}
          />
        </div>
      ))}
    </div>
  );
}

export default function StaffStep({
  onAddNestedGroup,
  formData,
  isSaving,
  onAddSimpleEntry,
  onBack,
  onInputChange,
  onRemoveNestedGroup,
  onRemoveSimpleEntry,
  onSave,
  onToggleNestedStaff,
  onToggleSimpleStaff,
  onUpdateNestedDate,
  onUpdateSimpleEntry,
  saveError,
  saveSuccessMessage,
}: StaffStepProps) {
  const warehouseSections = NESTED_STAFF_SECTIONS.filter(
    (sectionConfig) => sectionConfig.section === 'warehousePrep',
  );
  const installationSections = NESTED_STAFF_SECTIONS.filter(
    (sectionConfig) => sectionConfig.section === 'installation',
  );

  const getExcludedNestedStaff = (
    section: NestedStaffSectionKey,
    subSection: string,
  ) => {
    const sectionEntries = formData[section] as unknown as Record<string, StaffEntry[]>;

    return Object.entries(sectionEntries)
      .filter(([key]) => key !== subSection)
      .flatMap(([, entries]) => entries.flatMap((entry) => entry.staffIds));
  };

  const getAvailableStaff = (entry: StaffEntry, excludedStaff: string[]) =>
    TECH_STAFF.filter(
      (staffName) => entry.staffIds.includes(staffName) || !excludedStaff.includes(staffName),
    );

  const getGroupedEntries = <T extends NestedStaffSectionKey>(
    section: T,
    configs: Array<
      Extract<(typeof NESTED_STAFF_SECTIONS)[number], { section: T }>
    >,
  ) =>
    formData[section][configs[0].subSection].map((baseEntry) => ({
      id: baseEntry.id,
      date: baseEntry.date,
      items: configs
        .map((config) => {
          const entry = formData[section][config.subSection].find(
            (sectionEntry) => sectionEntry.id === baseEntry.id,
          );

          if (!entry) {
            return null;
          }

          return { config, entry };
        })
        .filter((item): item is { config: (typeof configs)[number]; entry: StaffEntry } => item !== null),
    }));

  const handleSingleSelectChange =
    (field: 'salesInCharge' | 'techInCharge') => (value: string) => {
      onInputChange({
        target: {
          name: field,
          value,
        },
      } as ChangeEvent<HTMLSelectElement>);
    };

  return (
    <div className="space-y-3 px-1 py-1.5 sm:space-y-4 sm:px-2 sm:py-2">
      <div className="flex flex-col items-center justify-between gap-2.5 sm:flex-row">
        <button
          className="flex items-center gap-2 text-sm font-black uppercase text-slate-950 transition-colors hover:text-sky-700 "
          onClick={onBack}
          type="button"
        >
          <ChevronLeft className="h-5 w-5" /> Quay lại phản hồi
        </button>
        <div className="text-center sm:text-right">
          <h2 className="text-3xl font-black uppercase text-slate-900 sm:text-2xl">Nội bộ Trần Gia</h2>
         
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-black uppercase text-black sm:text-[10px]">
            Kinh doanh phụ trách
          </label>
          <SearchableSingleSelect
            items={SALES_STAFF}
            onSelect={handleSingleSelectChange('salesInCharge')}
            placeholder="Chọn nhân viên kinh doanh"
            searchPlaceholder="Tìm nhân viên kinh doanh..."
            value={formData.salesInCharge}
            variant="staff"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-black uppercase text-black sm:text-[10px]">
            Kỹ thuật phụ trách
          </label>
          <SearchableSingleSelect
            items={TECH_STAFF}
            onSelect={handleSingleSelectChange('techInCharge')}
            placeholder="Chọn nhân viên kỹ thuật"
            searchPlaceholder="Tìm nhân viên kỹ thuật..."
            value={formData.techInCharge}
            variant="staff"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-300" />
          <h3 className="text-sm font-black uppercase text-slate-900 sm:text-xs ">Nhân sự tham gia</h3>
          <div className="h-px flex-1 bg-slate-300" />
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="space-y-2.5 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm shadow-slate-200/70">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 pr-3 text-sm font-black uppercase text-slate-900">
1. Chuẩn bị tại kho
              </div>
              <button
                className="flex h-8 items-center gap-1.5 rounded-full border border-slate-300 bg-white px-2.5 text-[10px] font-black uppercase text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-100"
                onClick={() => onAddNestedGroup('warehousePrep')}
                type="button"
              >
                <Plus className="h-3.5 w-3.5" /> Thêm ngày
              </button>
            </div>
            <div className="space-y-2.5">
              {getGroupedEntries('warehousePrep', warehouseSections).map((group) => (
                <div key={group.id} className="space-y-2.5 rounded-2xl border border-slate-200 bg-[#f5f7fa] p-2.5">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <DateSelect
                        name={`${group.id}-warehouse-date`}
                        onChange={(event) => onUpdateNestedDate('warehousePrep', group.id, event.target.value)}
                        placeholder="Chọn ngày chuẩn bị"
                        value={group.date}
                        variant="staff"
                      />
                    </div>
                    {formData.warehousePrep.level1.length > 1 ? (
                      <button
                        className="mt-1 text-sm font-bold text-slate-500 transition-colors hover:text-red-500"
                        onClick={() => onRemoveNestedGroup('warehousePrep', group.id)}
                        type="button"
                      >
                        Xóa
                      </button>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2">
                    {group.items.map(({ config, entry }) => {
                      const excludedStaff = getExcludedNestedStaff(config.section, config.subSection);
                      const availableStaff = getAvailableStaff(entry, excludedStaff);
                      const Icon = config.icon;

                      return (
                        <div key={`${group.id}-${config.subSection}`} className="space-y-1.5">
                          <div className="flex items-center gap-2.5 text-xs font-black uppercase text-slate-700">
                            <Icon className="h-4.5 w-4.5 text-slate-800" /> {config.label}
                          </div>
                          <StaffEntryCard
                            availableStaff={availableStaff}
                            entry={entry}
                            onToggleStaff={(id, staffName) =>
                              onToggleNestedStaff(config.section, config.subSection, id, staffName)
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm shadow-slate-200/70">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 pr-3 text-sm font-black uppercase text-slate-900 sm:text-xs">
                2. Lắp đặt
              </div>
              <button
                className="flex h-8 items-center gap-1.5 rounded-full border border-slate-300 bg-white px-2.5 text-[10px] font-black uppercase text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-100"
                onClick={() => onAddNestedGroup('installation')}
                type="button"
              >
                <Plus className="h-3.5 w-3.5" /> Thêm ngày
              </button>
            </div>
            <div className="space-y-2.5">
              {getGroupedEntries('installation', installationSections).map((group) => (
                <div key={group.id} className="space-y-2.5 rounded-2xl border border-slate-200 bg-[#f5f7fa] p-2.5">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <DateSelect
                        name={`${group.id}-installation-date`}
                        onChange={(event) => onUpdateNestedDate('installation', group.id, event.target.value)}
                        placeholder="Chọn ngày lắp đặt"
                        value={group.date}
                        variant="staff"
                      />
                    </div>
                    {formData.installation.level1.length > 1 ? (
                      <button
                        className="mt-1 text-sm font-bold text-slate-500 transition-colors hover:text-red-500"
                        onClick={() => onRemoveNestedGroup('installation', group.id)}
                        type="button"
                      >
                        Xóa
                      </button>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-3">
                    {group.items.map(({ config, entry }) => {
                      const excludedStaff = getExcludedNestedStaff(config.section, config.subSection);
                      const availableStaff = getAvailableStaff(entry, excludedStaff);
                      const Icon = config.icon;

                      return (
                        <div key={`${group.id}-${config.subSection}`} className="space-y-1.5">
                          <div className="flex items-center gap-2.5 text-[12px] font-black uppercase text-slate-700">
                            <Icon className="h-4.5 w-4.5 text-slate-800" /> {config.label}
                          </div>
                          <StaffEntryCard
                            availableStaff={availableStaff}
                            entry={entry}
                            onToggleStaff={(id, staffName) =>
                              onToggleNestedStaff(config.section, config.subSection, id, staffName)
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {SIMPLE_STAFF_SECTIONS.map((section, index) => (
            <div
              key={section.key}
              className="space-y-2.5 rounded-[1rem] border border-slate-200 bg-white p-2.5 shadow-sm shadow-slate-200/70"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black uppercase text-slate-700">
                  {index + 3}. {section.label}
                </h4>
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white transition-colors hover:bg-slate-800 sm:h-6 sm:w-6"
                  onClick={() => onAddSimpleEntry(section.key)}
                  type="button"
                >
                  <Plus className="h-4 w-4 sm:h-3 sm:w-3" />
                </button>
              </div>

              <SimpleStaffEntryCard
                entries={formData[section.key]}
                onDateChange={(id, value) => onUpdateSimpleEntry(section.key, id, 'date', value)}
                onRemove={(id) => onRemoveSimpleEntry(section.key, id)}
                onToggleStaff={(id, staffName) => onToggleSimpleStaff(section.key, id, staffName)}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-black uppercase text-black ">
            9. Thông tin khác
          </label>
          <textarea
            className="min-h-28 resize-none rounded-[1.75rem] border border-slate-300 bg-white px-5 py-4 text-base text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-200/70 sm:min-h-0"
            name="otherInfo"
            onChange={onInputChange}
            placeholder="Nhập ghi chú bổ sung cho sự kiện này..."
            rows={5}
            value={formData.otherInfo}
          />
        </div>
      </div>

      <div className="flex justify-center pt-1 sm:pt-2">
        <button
          className="group flex w-full items-center justify-center gap-4 rounded-4xl bg-slate-900 px-8 py-4 text-base font-black uppercase tracking-[0.12em] text-white shadow-lg shadow-slate-300/70 transition-all active:scale-95 hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none sm:w-auto sm:px-14 sm:py-5"
          disabled={isSaving}
          onClick={onSave}
          type="button"
        >
          {isSaving ? 'Đang lưu dữ liệu...' : 'Hoàn tất & Lưu trữ'}
          <ArrowRight className="h-7 w-7 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {saveError ? (
        <p className="text-center text-sm font-medium text-red-600">{saveError}</p>
      ) : null}

      {saveSuccessMessage ? (
        <p className="text-center text-sm font-medium text-emerald-700">{saveSuccessMessage}</p>
      ) : null}
    </div>
  );
}
