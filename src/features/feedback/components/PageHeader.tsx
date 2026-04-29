import logoImage from '@/assets/imgs/logo_travel.jpg';
import type { FeedbackStep } from '@/features/feedback/types';

interface PageHeaderProps {
  step: FeedbackStep;
}

export default function PageHeader({ step }: PageHeaderProps) {
  return (
    <header className="mb-6 border border-slate-300 bg-white px-4 py-6 text-center sm:mb-8 sm:px-10 sm:py-8 pt-4">
      <div className="mx-auto max-w-4xl">
        <img
          alt="Tran Gia Travel & Event"
          className="mx-auto h-auto w-full max-w-[260px] object-contain sm:max-w-[300px]"
          src={logoImage}
        />

        <div className=" space-y-1 text-slate-900">
          <p className="text-[1.6rem] font-bold leading-tight sm:text-[2rem]">
            CÔNG TY TNHH SỰ KIỆN
          </p>
          <p className="text-[1.6rem] font-bold leading-tight sm:text-[2rem]">
            TRẦN GIA
          </p>
          <p className="text-[1.1rem] leading-tight sm:text-[1.25rem]">
            Email: support@trangia-co.com
          </p>
          <p className="text-[1.1rem] leading-tight sm:text-[1.25rem]">
            Website: www.trangiavn.com
          </p>
          <p className="text-[1.1rem] leading-tight sm:text-[1.25rem]">
            Hotline: 0966.126.070 - 0967.763.747
          </p>
        </div>

        {step === 'customer' ? (
          <div className="mt-5 text-slate-900">
            <p className="text-[1.3rem] font-bold leading-none tracking-[0.2em] sm:text-[1.5rem]">
              ****************
            </p>
            <h1 className="mt-5 text-2xl font-bold leading-tight sm:text-[3rem]">
              PHIẾU ĐÁNH GIÁ
            </h1>
            <h1 className="text-2xl font-bold leading-tight sm:text-[3rem]">
              CHẤT LƯỢNG DỊCH VỤ
            </h1>
            <div className="mt-4 space-y-2 text-[1.35rem] leading-tight sm:text-[1.65rem]">
              <p>
                Công ty TNHH Sự kiện Trần Gia xin trân trọng cảm ơn Quý khách hàng đã sử dụng
                dịch vụ do Trần Gia cung cấp. Nhằm nâng cao chất lượng phục vụ, chúng tôi kính
                mong Quý khách hàng phản hồi xác nhận một số thông tin dưới đây!
              </p>
              <p>
                Chúng tôi xin cam kết các thông tin hoàn này hoàn toàn được giữ bảo mật!
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
