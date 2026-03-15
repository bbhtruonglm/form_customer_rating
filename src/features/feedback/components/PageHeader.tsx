import { ClipboardCheck, Users } from 'lucide-react';

import logoImage from '@/assets/imgs/logo.jpg';
import type { FeedbackStep } from '@/features/feedback/types';

interface PageHeaderProps {
  step: FeedbackStep;
}

export default function PageHeader({ step }: PageHeaderProps) {
  return (
    <header className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:mb-8 sm:p-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full lg:w-auto">
            <img
              alt="Tran Gia Event"
              className="mx-auto h-auto w-full max-w-[360px] object-contain sm:mx-0 sm:max-w-[320px]"
              src={logoImage}
            />
          </div>

          <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-700 sm:px-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              Công Ty TNHH Sự Kiện Trần Gia
            </p>
            <div className="mt-3 space-y-2 text-sm leading-relaxed sm:text-[13px]">
              <p>Hanoi Office: No. 65 Lien Hoa Lane, Kham Thien Street, Dong Da District, Hanoi.</p>
              <p>Add2: Hai Boi Commune, Dong Anh District, Hanoi.</p>
              <p>HCM Branch Office: No. 29/23 Huynh Tan Phat Street, District 7, HCM City.</p>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2 sm:text-[13px]">
              <p>
                <span className="font-bold text-slate-900">Mail:</span> support@trangia-co.com
              </p>
              <p>
                <span className="font-bold text-slate-900">Website:</span> www.trangiavn.com
              </p>
              <p className="sm:col-span-2">
                <span className="font-bold text-slate-900">Hotline:</span> 0984.410.005 - 0246.756.326
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2.5 sm:w-auto sm:px-4 sm:py-2">
          <div
            className={`flex items-center gap-2 rounded-xl px-3 py-2 transition-all sm:px-3 sm:py-1.5 ${
              step === 'customer' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400'
            }`}
          >
            <ClipboardCheck className="h-5 w-5 sm:h-4 sm:w-4" />
            <span className="text-sm font-black uppercase sm:text-xs">Khách hàng</span>
          </div>
          <div className="h-px w-4 bg-slate-200" />
          <div
            className={`flex items-center gap-2 rounded-xl px-3 py-2 transition-all sm:px-3 sm:py-1.5 ${
              step === 'staff' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400'
            }`}
          >
            <Users className="h-5 w-5 sm:h-4 sm:w-4" />
            <span className="text-sm font-black uppercase sm:text-xs">Nhân viên</span>
          </div>
        </div>
      </div>
    </header>
  );
}
