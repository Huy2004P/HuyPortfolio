import { useState } from 'react';
import { Heart, Wallet, Coffee, Check, Copy, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Donation = () => {
  const { t } = useLanguage();
  const [copiedText, setCopiedText] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const parseMarkdown = (md) => {
    if (!md) return '';
    let html = md;
    
    // Headings
    html = html.replace(/^#\s+(.*)$/gm, '<h1 class="text-3xl font-bold tracking-tight my-6">$1</h1>');
    html = html.replace(/^##\s+(.*)$/gm, '<h2 class="text-2xl font-semibold tracking-tight my-4">$1</h2>');
    html = html.replace(/^###\s+(.*)$/gm, '<h3 class="text-xl font-medium my-3">$1</h3>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // List items
    html = html.replace(/^\*\s+(.*)$/gm, '<li>$1</li>');
    html = html.replace(/^-\s+(.*)$/gm, '<li>$1</li>');
    
    // Format paragraphs
    const blocks = html.split(/\n\n+/);
    const formattedBlocks = blocks.map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<h')) return trimmed;
      if (trimmed.startsWith('<li>')) {
        return `<ul class="list-disc pl-5 my-4 space-y-1">${trimmed}</ul>`;
      }
      return `<p class="my-4 leading-relaxed">${trimmed.replace(/\n/g, '<br/>')}</p>`;
    });
    
    return formattedBlocks.join('\n');
  };

  const title = t('donation_title', 'Ủng hộ tác giả (Support My Work)');
  const contentHtml = parseMarkdown(t('donation_content', '# Hỗ trợ & Quyên góp\n\nNếu bạn yêu thích các sản phẩm ứng dụng di động hoặc trò chơi indie của mình, bạn có thể ủng hộ mình thông qua chuyển khoản ngân hàng hoặc các ví điện tử dưới đây. Sự đóng góp của bạn là động lực rất lớn giúp mình duy trì và phát triển thêm nhiều sản phẩm chất lượng hơn nữa!'));
  
  const bankTransfer = {
    bankName: t('donation_bank_name', 'Vietcombank'),
    accountNumber: t('donation_account_number', '999988887777'),
    accountName: t('donation_account_name', 'NGUYEN GIA HUY'),
    branch: t('donation_branch', 'Hồ Chí Minh Branch'),
    qrCodeUrl: t('donation_qr_code_url', 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80&w=300')
  };

  const eWallets = [
    { name: t('donation_momo_name', 'MoMo'), phone: t('donation_momo_phone', '0901234567'), accountName: t('donation_account_name', 'NGUYEN GIA HUY') },
    { name: t('donation_zalopay_name', 'ZaloPay'), phone: t('donation_zalopay_phone', '0901234567'), accountName: t('donation_account_name', 'NGUYEN GIA HUY') }
  ];

  const externalPlatforms = {
    buyMeACoffee: t('donation_buymeacoffee_url', 'https://buymeacoffee.com'),
    kofi: t('donation_kofi_url', 'https://ko-fi.com')
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-4 animate-fade-in text-apple-ink dark:text-apple-white">
      
      {/* HEADER SECTION */}
      <section className="text-center space-y-6 max-w-2xl mx-auto">
        <div className="inline-flex p-4 rounded-full bg-red-500/10 text-red-500 animate-pulse">
          <Heart className="w-8 h-8 fill-current" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight">{title}</h1>
        <div 
          className="text-apple-grayNeutral dark:text-gray-300 text-sm sm:text-base font-light leading-relaxed"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </section>

      {/* DONATION TILES & BANK CARD MOCKUP */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* ATM Card Visual Column */}
        {bankTransfer.accountNumber && (
          <div className="md:col-span-7 space-y-6 flex flex-col items-center">
            
            {/* Visual ATM Credit Card */}
            <div className="relative w-full max-w-[420px] aspect-[1.586/1] rounded-3xl p-6 sm:p-8 text-white bg-gradient-to-br from-indigo-950 via-slate-900 to-[#121214] border border-white/10 shadow-2xl overflow-hidden flex flex-col justify-between group ring-4 ring-indigo-500/5 hover:-rotate-1 hover:scale-[1.02] transition-all duration-300">
              
              {/* Iridescent background glare effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-blue-500/10 opacity-60 group-hover:scale-150 transition-all duration-700 pointer-events-none"></div>
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none"></div>

              {/* Bank Name Top Right */}
              <div className="flex justify-between items-start z-10">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white/50 tracking-wider">PREMIUM PARTNER</span>
                  <span className="text-xl font-black italic tracking-tight text-white/95">{bankTransfer.bankName}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-bold text-white/40 tracking-widest">DEBIT</span>
                  <ShieldCheck className="w-6 h-6 text-emerald-400 opacity-80 mt-1" />
                </div>
              </div>

              {/* SIM Chip and Contactless logo */}
              <div className="flex items-center gap-4 z-10 my-1">
                {/* Gold SIM chip simulator */}
                <div className="relative w-12 h-9 rounded bg-gradient-to-r from-yellow-500/70 to-yellow-600/80 border border-yellow-400/40 p-1 flex flex-col justify-between">
                  <div className="flex justify-between h-[30%] border-b border-yellow-700/20"><div className="w-1/3 border-r border-yellow-700/20"></div><div className="w-1/3"></div></div>
                  <div className="flex justify-between h-[40%] border-b border-yellow-700/20"><div className="w-1/2 border-r border-yellow-700/20"></div><div className="w-1/2"></div></div>
                  <div className="h-[30%]"></div>
                </div>
                {/* Contactless waves */}
                <svg className="w-5 h-5 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 17.5c1.65-2.2 4.35-3.5 7-3.5s5.35 1.3 7 3.5" />
                  <path d="M7 14c1.35-1.5 3.35-2.5 5-2.5s3.65 1 5 2.5" />
                  <path d="M9.5 10.5c.7-.7 1.7-1 2.5-1s1.8.3 2.5 1" />
                </svg>
              </div>

              {/* Card Number (Account Number) */}
              <div className="space-y-1.5 z-10">
                <span className="text-[9px] font-bold tracking-widest text-white/40 block">ACCOUNT NUMBER</span>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xl sm:text-2xl font-bold tracking-widest text-white/95">
                    {bankTransfer.accountNumber}
                  </span>
                  
                  {/* Embedded Copy Button */}
                  <button
                    onClick={() => handleCopy(bankTransfer.accountNumber)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/5 text-white/80 active:scale-95"
                    title="Copy Account Number"
                  >
                    {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Card Holder & Branch Footer */}
              <div className="flex justify-between items-end z-10 pt-2 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold tracking-widest text-white/40">CARD HOLDER</span>
                  <span className="font-mono font-bold text-sm tracking-wide text-white/95 uppercase">{bankTransfer.accountName}</span>
                </div>
                {bankTransfer.branch && (
                  <div className="flex flex-col items-end max-w-[150px]">
                    <span className="text-[8px] tracking-widest text-white/35">BRANCH</span>
                    <span className="text-[10px] font-semibold text-white/80 text-right truncate w-full">{bankTransfer.branch}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Pay QR code Box */}
            {bankTransfer.qrCodeUrl && (
              <div className="w-full max-w-[420px] glass-panel rounded-3xl p-5 border-white/20 dark:border-white/5 flex flex-col items-center">
                <div className="bg-white p-3 rounded-2xl shadow-inner border border-zinc-100">
                  <img 
                    src={bankTransfer.qrCodeUrl} 
                    alt="Quick Pay QR" 
                    className="w-44 h-44 sm:w-52 sm:h-52 object-contain"
                  />
                </div>
                <span className="text-[10px] text-apple-grayNeutral font-bold uppercase tracking-widest mt-3">
                  {t('donation_scan_qr_instruction', 'Scan QR code inside banking app')}
                </span>
              </div>
            )}
          </div>
        )}

        {/* E-Wallets & Coffee Links (Right Column) */}
        <div className="md:col-span-5 space-y-6">
          
          {/* E-Wallets Card */}
          {eWallets && eWallets.length > 0 && (
            <div className="glass-panel border-white/20 dark:border-white/5 rounded-3xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-black flex items-center gap-2 text-pink-500 uppercase tracking-wide">
                <Wallet className="w-5 h-5" /> {t('donation_ewallets', 'Ví điện tử')}
              </h2>
              
              <div className="space-y-3 pt-1">
                {eWallets.map((wallet) => (
                  <div key={wallet.name} className="flex justify-between items-center p-3 rounded-2xl bg-white/40 dark:bg-[#09090b]/40 border border-white/50 dark:border-white/5 shadow-sm hover:border-pink-500/20 transition-colors">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20">
                        {wallet.name}
                      </span>
                      <p className="font-bold font-mono mt-1 text-sm text-apple-ink dark:text-apple-white">{wallet.phone}</p>
                    </div>
                    <div className="text-right text-[11px]">
                      <p className="text-apple-grayNeutral">{t('donation_account_holder', 'Chủ tài khoản')}</p>
                      <p className="font-bold text-apple-ink dark:text-apple-white uppercase">{wallet.accountName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coffee Platform Links */}
          {externalPlatforms && (Object.keys(externalPlatforms).length > 0) && (
            <div className="glass-panel border-white/20 dark:border-white/5 rounded-3xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-black flex items-center gap-2 text-yellow-600 dark:text-yellow-500 uppercase tracking-wide">
                <Coffee className="w-5 h-5" /> Buy a Coffee
              </h2>
              
              <div className="flex flex-col gap-3 pt-1">
                {externalPlatforms.buyMeACoffee && (
                  <a 
                    href={externalPlatforms.buyMeACoffee} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl bg-[#FFDD00] hover:bg-[#ffe536] text-black text-xs font-black transition-all hover:scale-105 shadow-sm uppercase tracking-wider"
                  >
                    Buy Me a Coffee
                  </a>
                )}
                {externalPlatforms.kofi && (
                  <a 
                    href={externalPlatforms.kofi} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl bg-[#29ABE2] hover:bg-[#3dbdf5] text-white text-xs font-black transition-all hover:scale-105 shadow-sm uppercase tracking-wider"
                  >
                    Ko-Fi
                  </a>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Donation;
