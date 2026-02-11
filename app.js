const { useState, useEffect, useRef } = React;

// --- GELİŞTİRİCİ FOTOĞRAFI AYARI ---
const DEVELOPER_PHOTO_URL = "images/profil.png"; 

// --- DUYURU VERİLERİ ---
const ANNOUNCEMENTS = [
    "📢 Yeni kayıtlar için son gün 15 Mart!",
    "⚠️ Pasaport sürelerinizi (en az 6 ay) kontrol ediniz.",
    "🚗 Araç bakımlarınızı yola çıkmadan yaptırmayı unutmayın.",
    "💊 Kronik rahatsızlığı olanlar ilaçlarını yedekli almalıdır.",
    "🕌 Cuma namazlarında Mescid-i Haram kapıları erken kapanmaktadır."
];

// --- ROTA VERİSİ ---
const ROUTE_STOPS = [
    { id: 1, name: "Cilvegözü", desc: "Hatay / Sınır Kapısı Çıkış", type: "border", km: 0 },
    { id: 2, name: "İdlib", desc: "Suriye Geçiş Güzergahı", type: "city", km: 45 },
    { id: 3, name: "Hama", desc: "Asi Nehri ve Su Dolapları", type: "city", km: 120 },
    { id: 4, name: "Humus", desc: "Halid bin Velid (r.a) Makamı", type: "ziyaret", km: 160 },
    { id: 5, name: "Şam", desc: "Bilad-ı Şam / Emevi Camii", type: "capital", km: 320 },
    { id: 6, name: "Amman", desc: "Ürdün Başkenti / Mola", type: "capital", km: 520 },
    { id: 7, name: "Medine", desc: "Mescid-i Nebevi / Vuslat", type: "holy", km: 1650 },
    { id: 8, name: "Mekke", desc: "Kabe-i Muazzama / Umre", type: "holy", km: 2100 }
];

// --- CHECKLIST VERİLERİ ---
const CHECKLISTS_DATA = {
    luggage: [
        { id: "l1", label: "İhram (2 Takım)", checked: false },
        { id: "l2", label: "Ortopedik Terlik", checked: false },
        { id: "l3", label: "Kokusuz Sabun", checked: false },
        { id: "l4", label: "Bel Çantası (Para için)", checked: false },
        { id: "l5", label: "Güneş Gözlüğü", checked: false }
    ],
    documents: [
        { id: "d1", label: "Pasaport", checked: false },
        { id: "d2", label: "Umre Vizesi Çıktısı", checked: false },
        { id: "d3", label: "Araç Ruhsatı", checked: false },
        { id: "d4", label: "Uluslararası Ehliyet", checked: false }
    ]
};

// --- NAMAZ VAKİTLERİ VERİSİ ---
const PRAYER_DATA = {
    Mekke: { 
        Imsak: "05:12", Gunes: "06:30", Ogle: "12:25", Ikindi: "15:48", Aksam: "18:15", Yatsi: "19:45" 
    },
    Medine: { 
        Imsak: "05:18", Gunes: "06:38", Ogle: "12:30", Ikindi: "15:52", Aksam: "18:20", Yatsi: "19:50" 
    }
};

// --- ACİL NUMARALAR ---
const EMERGENCY_NUMBERS = [
    { title: "T.C. Cidde Başkonsolosluğu", number: "+966126601607", icon: "building-2" },
    { title: "T.C. Riyad Büyükelçiliği", number: "+966114820101", icon: "flag" },
    { title: "Mekke Diyanet Ekibi", number: "+966500000000", icon: "phone" },
    { title: "Suudi Arabistan Polis", number: "999", icon: "alert-triangle" },
    { title: "Suudi Arabistan Ambulans", number: "997", icon: "ambulance" },
    { title: "Trafik Kazası", number: "993", icon: "car" }
];

// --- AYARLAR MODALI BİLEŞENİ ---
const SettingsModal = ({ isOpen, onClose, settings, updateSettings, installPrompt, onInstall }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl transform transition-transform duration-300 max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <h2 className="text-xl font-serif font-bold text-slate-800 dark:text-gold-400">Uygulama Ayarları</h2>
                    <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-red-500 transition">
                        <i data-lucide="x" className="w-5 h-5"></i>
                    </button>
                </div>

                <div className="space-y-6 overflow-y-auto pr-2 flex-1">
                    {/* Yazı Boyutu */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <i data-lucide="type" className="w-4 h-4 text-gold-500"></i> Yazı Boyutu
                        </label>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                            {['small', 'medium', 'large'].map((size) => (
                                <button
                                    key={size}
                                    onClick={() => updateSettings('fontSize', size)}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${settings.fontSize === size ? 'bg-white dark:bg-slate-700 shadow text-gold-600' : 'text-slate-400'}`}
                                >
                                    {size === 'small' ? 'Küçük' : size === 'medium' ? 'Orta' : 'Büyük'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tema */}
                    <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-lg">
                                <i data-lucide={settings.theme === 'dark' ? 'moon' : 'sun'} className="w-5 h-5"></i>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Gece Modu</h4>
                                <p className="text-[10px] text-slate-400">Göz yormayan karanlık tema.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => updateSettings('theme', settings.theme === 'dark' ? 'light' : 'dark')}
                            className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.theme === 'dark' ? 'bg-gold-500' : 'bg-slate-300'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${settings.theme === 'dark' ? 'translate-x-6' : ''}`}></div>
                        </button>
                    </div>

                    {/* Bildirimler */}
                    <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-lg">
                                <i data-lucide="bell" className="w-5 h-5"></i>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Bildirimler</h4>
                                <p className="text-[10px] text-slate-400">Namaz vakti hatırlatıcıları.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => updateSettings('notifications', !settings.notifications)}
                            className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.notifications ? 'bg-gold-500' : 'bg-slate-300'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${settings.notifications ? 'translate-x-6' : ''}`}></div>
                        </button>
                    </div>

                    {/* Konum */}
                    <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-lg">
                                <i data-lucide="map-pin" className="w-5 h-5"></i>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Konum Takibi</h4>
                                <p className="text-[10px] text-slate-400">Mekke/Medine arası mesafe hesabı.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => updateSettings('location', !settings.location)}
                            className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.location ? 'bg-gold-500' : 'bg-slate-300'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${settings.location ? 'translate-x-6' : ''}`}></div>
                        </button>
                    </div>

                    {/* Uygulamayı Yükle Butonu (Ayarlar içinde) */}
                    {installPrompt && (
                        <div className="bg-slate-900 dark:bg-slate-800 p-4 rounded-xl border border-gold-500/30 flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gold-500 text-slate-900 rounded-lg shrink-0">
                                    <i data-lucide="download" className="w-5 h-5"></i>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">Uygulamayı Yükle</h4>
                                    <p className="text-[10px] text-slate-300">İnternetsiz kullanım için.</p>
                                </div>
                            </div>
                            <button onClick={onInstall} className="w-full py-2 bg-gold-500 hover:bg-gold-600 text-slate-900 font-bold text-sm rounded-lg transition-colors">
                                Cihaza İndir
                            </button>
                        </div>
                    )}

                    {/* Gizlilik Uyarısı */}
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800 flex gap-3">
                        <i data-lucide="shield-check" className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0"></i>
                        <p className="text-[10px] text-emerald-800 dark:text-emerald-300 leading-relaxed text-justify">
                            <strong>Gizlilik:</strong> Bu uygulamada yaptığınız hiçbir ayar, konum bilgisi veya kişisel veri sunucularımıza yüklenmez. Tüm veriler sadece telefonunuzda saklanır.
                        </p>
                    </div>

                    <div className="pt-4 text-center border-t border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-bold text-slate-400">Karayolu Umre Rehberi</p>
                        <p className="text-[10px] text-slate-300 font-mono mt-1">Sürüm 2.3</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- BİLEŞENLER ---

const Header = ({ title, goBack, onOpenSettings, showSettingsBtn }) => (
    <div className="sticky top-0 z-50 glass-header px-4 py-3 flex items-center justify-between shadow-sm transition-all duration-300 min-h-[70px]">
        <div className="flex items-center gap-3">
            {goBack && (
                <button onClick={goBack} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300">
                    <i data-lucide="arrow-left" className="w-5 h-5"></i>
                </button>
            )}
            
            {/* Özel Tasarım Başlık */}
            {title === 'LOGO_STYLE' ? (
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gold-600 dark:text-gold-500 tracking-[0.2em] uppercase leading-none mb-0.5">Karayolu İle</span>
                    <span className="text-lg font-serif font-bold text-slate-900 dark:text-white leading-none tracking-tight">Umre Rehberi</span>
                </div>
            ) : (
                <h1 className="text-lg font-serif font-bold text-slate-900 dark:text-gold-400 tracking-wide leading-tight">
                    {title}
                </h1>
            )}
        </div>
        {showSettingsBtn && (
            <button onClick={onOpenSettings} className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-gold-600 dark:hover:text-gold-400 transition shadow-sm active:scale-95">
                <i data-lucide="settings" className="w-5 h-5"></i>
            </button>
        )}
    </div>
);

// --- YENİ MODERN DUYURU ALANI ---
const AnnouncementBar = () => {
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false); 
            setTimeout(() => {
                setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
                setFade(true); 
            }, 500);
        }, 5000); 

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="col-span-2 my-2">
            <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 h-12 flex items-center overflow-hidden pr-2">
                <div className="h-full bg-gold-500 w-12 flex items-center justify-center shrink-0 z-10">
                    <i data-lucide="megaphone" className="w-5 h-5 text-white animate-pulse-gold"></i>
                </div>
                {/* Dekoratif üçgen */}
                <div className="w-0 h-0 border-t-[48px] border-t-gold-500 border-r-[20px] border-r-transparent absolute left-0 top-0 z-0"></div>
                
                <div className={`flex-1 ml-4 text-sm font-medium text-slate-700 dark:text-slate-200 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="truncate pr-2">{ANNOUNCEMENTS[index]}</div>
                </div>
            </div>
        </div>
    );
};

// --- YÜKLEME BANNERI (Mantık Güncellendi) ---
const InstallBanner = ({ onInstall, onClose, show }) => {
    if (!show) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 animate-fade-in-up">
            <div className="bg-slate-900 dark:bg-slate-800 text-white p-4 rounded-2xl shadow-2xl border-t-4 border-gold-500 flex flex-col gap-3 relative">
                <button onClick={onClose} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white bg-white/10 rounded-full">
                    <i data-lucide="x" className="w-4 h-4"></i>
                </button>
                <div className="flex items-start gap-3 pr-6">
                    <div className="bg-gold-500 p-2.5 rounded-xl text-slate-900 shrink-0 shadow-lg shadow-gold-500/20">
                        <i data-lucide="download" className="w-6 h-6"></i>
                    </div>
                    <div>
                        <h4 className="font-bold text-gold-400">Uygulamayı Yükle</h4>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed opacity-90">
                            Çevrimdışı kullanım için rehberi telefonunuza indirin.
                        </p>
                    </div>
                </div>
                <button onClick={onInstall} className="w-full bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 active:scale-95 text-slate-900 font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                    <i data-lucide="smartphone" className="w-5 h-5"></i>
                    Ücretsiz Yükle
                </button>
            </div>
        </div>
    );
};

const MenuCard = ({ icon, label, subLabel, colorClass, onClick, featured }) => (
    <button 
        onClick={onClick}
        className={`group relative flex flex-col items-start p-5 rounded-2xl premium-card transition-all duration-300 hover:scale-[1.02] active:scale-95 text-left w-full h-full overflow-hidden border border-slate-100 dark:border-slate-700/50 ${featured ? 'col-span-2 bg-gradient-to-br from-gold-50/50 to-white dark:from-gold-900/10 dark:to-slate-800 border-gold-200 dark:border-gold-500/20' : 'bg-white dark:bg-slate-800'}`}
    >
        <div className={`p-3 rounded-xl mb-3 ${colorClass} bg-opacity-10 dark:bg-opacity-20 group-hover:bg-opacity-25 transition-colors shadow-sm`}>
            <i data-lucide={icon} className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`}></i>
        </div>
        <span className="text-sm font-bold text-slate-800 dark:text-slate-100 font-serif">{label}</span>
        {subLabel && <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">{subLabel}</span>}
        
        {/* Dekoratif Arkaplan İkonu */}
        <i data-lucide={icon} className="absolute -right-4 -bottom-4 w-20 h-20 opacity-[0.03] dark:opacity-[0.05] text-current transform rotate-12 pointer-events-none"></i>
    </button>
);

const RouteVisualizer = () => {
    const [visibleStops, setVisibleStops] = useState(0);

    useEffect(() => {
        let current = 0;
        const interval = setInterval(() => {
            if (current <= ROUTE_STOPS.length) { setVisibleStops(current); current++; } 
            else { clearInterval(interval); }
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const progressHeight = Math.max(0, ((visibleStops - 1) / (ROUTE_STOPS.length - 1)) * 100);

    return (
        <div className="p-6 pb-20 animate-fade-in">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white mb-8 shadow-xl relative overflow-hidden border border-gold-500/20">
                <div className="relative z-10">
                    <h3 className="font-serif text-2xl font-bold text-gold-400 mb-1">Mübarek Yolculuk</h3>
                    <p className="text-slate-400 text-sm">Türkiye - Mekke Güzergahı</p>
                </div>
                <i data-lucide="map" className="absolute right-4 bottom-4 w-24 h-24 text-white opacity-5"></i>
            </div>
            <div className="relative pl-2">
                <div className="route-line"></div>
                <div className="route-active-line" style={{ height: `${progressHeight}%` }}></div>
                <div className="space-y-8 relative z-10">
                    {ROUTE_STOPS.map((stop, index) => (
                        <div key={stop.id} className={`flex items-start gap-4 transition-all duration-500 transform ${index < visibleStops ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 z-20 ${index < visibleStops ? 'border-gold-500 bg-white dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800'} ${stop.type === 'holy' && index < visibleStops ? 'animate-pulse-gold' : ''}`}>
                                <i data-lucide={stop.type === 'holy' ? 'moon' : stop.type === 'border' ? 'flag' : 'map-pin'} className={`w-5 h-5 ${index < visibleStops ? 'text-gold-600' : 'text-slate-300'}`}></i>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex-1 premium-card">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-bold text-slate-800 dark:text-slate-100">{stop.name}</h4>
                                    <span className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-500">{stop.km} km</span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{stop.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const CurrencyConverter = () => {
    const [amount, setAmount] = useState(1);
    const [rate, setRate] = useState(8.95); 

    return (
        <div className="p-6 space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
                <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">Döviz Çevirici</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-slate-500 mb-1 block">Miktar (SAR)</label>
                        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full text-3xl font-bold bg-transparent border-b border-slate-200 dark:border-slate-700 focus:outline-none focus:border-gold-500 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 mb-1 block">Kur (1 SAR = ? TL)</label>
                        <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-lg" />
                    </div>
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-500">Sonuç (TL):</p>
                        <p className="text-4xl font-bold text-gold-600 dark:text-gold-400">{(amount * rate).toFixed(2)} ₺</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ChecklistManager = ({ type, title }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem(`checklist_${type}`);
        if (saved) setItems(JSON.parse(saved));
        else setItems(CHECKLISTS_DATA[type] || []);
    }, [type]);

    const toggleItem = (id) => {
        const newItems = items.map(item => item.id === id ? { ...item, checked: !item.checked } : item);
        setItems(newItems);
        localStorage.setItem(`checklist_${type}`, JSON.stringify(newItems));
    };

    return (
        <div className="p-4 space-y-4 animate-fade-in">
            <h3 className="font-bold text-lg px-2">{title}</h3>
            {items.map(item => (
                <div key={item.id} onClick={() => toggleItem(item.id)} className={`flex items-center p-4 rounded-xl border transition-all cursor-pointer ${item.checked ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${item.checked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-400'}`}>
                        {item.checked && <i data-lucide="check" className="w-4 h-4 text-white"></i>}
                    </div>
                    <span className={`${item.checked ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>{item.label}</span>
                </div>
            ))}
        </div>
    );
};

const UmrahGuideDetail = () => {
    const [activeStep, setActiveStep] = useState(null);
    const steps = [
        { id: 1, title: "1. İhram ve Niyet", icon: "shirt", content: "Mikat sınırını geçmeden ihrama girilir. 2 rekat namaz kılınır ve niyet edilir.", dua: "Allah'ım! Senin rızan için umre yapmak istiyorum." },
        { id: 2, title: "2. Harem'e Giriş", icon: "map-pin", content: "Mekke'ye girince tekbir ve tehlil getirilir. Otele yerleşip abdest tazelenir.", dua: "Allah'ım! Bu Beyt'in şerefini artır." },
        { id: 3, title: "3. Tavaf", icon: "repeat", content: "Kabe sola alınarak 7 şavt dönülür. Izdıba yapılır (omuz açılır).", dua: "Rabbena atina fi'd-dunya haseneten..." },
        { id: 4, title: "4. Sa'y", icon: "footprints", content: "Safa ve Merve arasında 4 gidiş 3 geliş yapılır.", dua: "İnnes-Safa vel-Mervete min şeâirillah..." },
        { id: 5, title: "5. Tıraş ve Çıkış", icon: "scissors", content: "Saçlar kısaltılarak ihramdan çıkılır. Umre tamamlanmış olur.", dua: "Elhamdülillah." }
    ];

    return (
        <div className="p-4 pb-24 animate-fade-in space-y-3">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800 mb-4">
                <h3 className="font-bold text-emerald-800 dark:text-emerald-400">Umre Rehberi</h3>
                <p className="text-xs text-emerald-600">Adım adım ibadet rehberi</p>
            </div>
            {steps.map((step) => (
                <div key={step.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                    <button onClick={() => setActiveStep(activeStep === step.id ? null : step.id)} className="w-full flex items-center justify-between p-4 text-left">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep === step.id ? 'bg-gold-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}><i data-lucide={step.icon} className="w-4 h-4"></i></div>
                            <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{step.title}</span>
                        </div>
                        <i data-lucide="chevron-down" className={`w-4 h-4 text-slate-400 transition-transform ${activeStep === step.id ? 'rotate-180' : ''}`}></i>
                    </button>
                    {activeStep === step.id && (
                        <div className="px-4 pb-4 pl-[3.25rem] animate-fade-in">
                            <p className="text-slate-600 dark:text-slate-300 text-sm mb-3">{step.content}</p>
                            <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded border-l-2 border-amber-400"><p className="text-xs font-serif italic text-slate-700 dark:text-amber-100">"{step.dua}"</p></div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

const PrayerTimesDetail = () => {
    const [city, setCity] = useState("Mekke");
    const [reminders, setReminders] = useState(() => {
        const saved = localStorage.getItem("prayer_reminders");
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem("prayer_reminders", JSON.stringify(reminders));
    }, [reminders]);

    const handleReminderChange = (vakit, minutes) => {
        setReminders(prev => ({ ...prev, [vakit]: parseInt(minutes) }));
        if (parseInt(minutes) > 0) {
            if (Notification.permission !== "granted") {
                Notification.requestPermission();
            }
        }
    };

    return (
        <div className="p-4 pb-24 animate-fade-in space-y-4">
            <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl mb-4">
                {["Mekke", "Medine"].map((c) => (
                    <button 
                        key={c}
                        onClick={() => setCity(c)}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${city === c ? 'bg-white dark:bg-slate-600 shadow text-gold-600' : 'text-slate-500'}`}
                    >
                        {c}
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="bg-gold-500 p-4 text-white flex justify-between items-center">
                    <div>
                        <h3 className="font-serif font-bold text-lg">Namaz Vakitleri</h3>
                        <p className="text-xs opacity-80">Ümmü'l-Kurra Üniversitesi, {city}</p>
                    </div>
                    <i data-lucide="clock" className="w-6 h-6 opacity-50"></i>
                </div>
                
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {Object.entries(PRAYER_DATA[city]).map(([vakit, saat]) => (
                        <div key={vakit} className="p-4 flex items-center justify-between">
                            <div>
                                <span className="block text-xs text-slate-400 uppercase tracking-wider">{vakit}</span>
                                <span className="font-mono text-xl font-bold text-slate-800 dark:text-slate-200">{saat}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <i data-lucide="bell" className={`w-4 h-4 ${reminders[vakit] > 0 ? 'text-gold-500' : 'text-slate-300'}`}></i>
                                <select 
                                    value={reminders[vakit] || 0}
                                    onChange={(e) => handleReminderChange(vakit, e.target.value)}
                                    className="bg-slate-100 dark:bg-slate-900 border-none text-xs rounded p-2 text-slate-600 dark:text-slate-300 focus:ring-0 cursor-pointer"
                                >
                                    <option value="0">Kapalı</option>
                                    <option value="5">5 dk önce</option>
                                    <option value="10">10 dk önce</option>
                                    <option value="15">15 dk önce</option>
                                    <option value="30">30 dk önce</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <p className="text-center text-xs text-slate-400 mt-2">
                * Vakitler internet bağlantısı olduğunda güncellenir. Çevrimdışı modda son veriler kullanılır.
            </p>
        </div>
    );
};

// --- YENİ ÖZELLİK: ACİL NUMARALAR ---
const EmergencyContacts = () => {
    return (
        <div className="p-4 pb-20 animate-fade-in space-y-4">
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 px-2">Önemli Numaralar</h3>
            <div className="space-y-3">
                {EMERGENCY_NUMBERS.map((item, idx) => (
                    <a href={`tel:${item.number}`} key={idx} className="flex items-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm active:scale-[0.98] transition-transform">
                        <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center mr-4">
                            <i data-lucide={item.icon} className="w-5 h-5"></i>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{item.title}</h4>
                            <span className="text-slate-500 dark:text-slate-400 text-xs font-mono">{item.number}</span>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-full text-green-600">
                            <i data-lucide="phone" className="w-4 h-4"></i>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

// --- HAKKINDA VE BİLDİRİM (YENİ TASARIM) ---
const About = () => {
    return (
        <div className="p-4 pb-24 animate-fade-in space-y-6">
            {/* Geliştirici Profil Kartı */}
            <div className="relative bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-700">
                {/* Üst Dekoratif Alan */}
                <div className="h-32 bg-gradient-to-r from-emerald-600 to-emerald-900 relative">
                     <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
                     <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 bg-gold-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg overflow-hidden">
                        {DEVELOPER_PHOTO_URL ? (
                            <img src={DEVELOPER_PHOTO_URL} alt="Geliştirici" className="w-full h-full object-cover" />
                        ) : (
                            "SG"
                        )}
                     </div>
                </div>
                
                <div className="pt-12 pb-6 px-6 text-center">
                    <h2 className="text-2xl font-serif font-bold text-slate-800 dark:text-white">Sami G.</h2>
                    <span className="inline-block mt-2 px-3 py-1 rounded-full bg-gold-50 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400 text-xs font-bold uppercase tracking-wider">
                        Uygulama Geliştiricisi
                    </span>
                    
                    <div className="mt-6 text-left space-y-4">
                         <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <p className="font-serif text-lg text-emerald-800 dark:text-emerald-400 mb-2 text-center">﷽</p>
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-serif text-justify">
                                <span className="font-bold block mb-2 text-slate-800 dark:text-slate-200 text-center">Esselamü Aleyküm ve Rahmetullah,</span>
                                Kıymetli Allah'ın misafirleri; bu çalışma, Haremeyn-i Şerifeyn'e vuslat yolculuğunda sizlere rehberlik etmek, bu meşakkatli ama kutlu seferde yükünüzü bir nebze olsun hafifletmek gayesiyle "Sadaka-i Cariye" niyetiyle hazırlanmıştır.
                                <br/><br/>
                                Dualarınızda bu aciz kardeşinizi de unutmamanız istirhamıyla... 
                                <br/>Rabbim yolunuzu açık, ibadetlerinizi kabul eylesin.
                            </p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SimplePage = ({ title, children }) => (<div className="p-4 pb-20 space-y-4 animate-fade-in">{children}</div>);

// --- ANA UYGULAMA (APP) ---
const App = () => {
    const [activeView, setActiveView] = useState('dashboard');
    const [installPrompt, setInstallPrompt] = useState(null);
    const [showInstallBanner, setShowInstallBanner] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    
    // Uygulama Ayarları State'i
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('app_settings');
        return saved ? JSON.parse(saved) : {
            fontSize: 'medium', // small, medium, large
            theme: 'light',
            notifications: false,
            location: false
        };
    });

    // İkonları yenileme
    useEffect(() => {
        if(window.lucide) window.lucide.createIcons();
    }, [activeView, showSettings, showInstallBanner, settings]);

    // Tema Değişikliği ve Ayar Kaydı
    useEffect(() => {
        localStorage.setItem('app_settings', JSON.stringify(settings));
        
        // Tema uygula
        if (settings.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Font boyutu uygula (Root elemente class ekleyerek)
        const root = document.documentElement;
        root.classList.remove('text-sm', 'text-base', 'text-lg');
        if (settings.fontSize === 'small') root.classList.add('text-sm');
        else if (settings.fontSize === 'large') root.classList.add('text-lg');
        else root.classList.add('text-base');

    }, [settings]);

    // Install Prompt Logic
    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setInstallPrompt(e);
            
            // Daha önce kapatılmadıysa veya yüklenmediyse göster
            const isDismissed = localStorage.getItem('install_dismissed');
            if (!isDismissed) {
                setShowInstallBanner(true);
            }
        };
        window.addEventListener('beforeinstallprompt', handler);

        // TEST AMAÇLI: Eğer "install_dismissed" yoksa 3 saniye sonra banner'ı aç
        const timer = setTimeout(() => {
            const isDismissed = localStorage.getItem('install_dismissed');
            if (!isDismissed) setShowInstallBanner(true);
        }, 3000);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
            clearTimeout(timer);
        };
    }, []);

    const handleInstallClick = () => {
        if (!installPrompt) {
            alert("Önizleme Modu: Gerçek cihazda yükleme penceresi açılır.");
            setShowInstallBanner(false);
            localStorage.setItem('install_dismissed', 'true'); // Yüklendi varsayarak gizle
            return;
        }
        installPrompt.prompt();
        installPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                setShowInstallBanner(false);
                localStorage.setItem('install_dismissed', 'true');
            }
            setInstallPrompt(null);
        });
    };

    const handleDismissInstall = () => {
        setShowInstallBanner(false);
        localStorage.setItem('install_dismissed', 'true');
    };

    const updateSettings = (key, value) => {
        // İZİN MANTIKLARI (Side Effects)
        if (key === 'notifications' && value === true) {
            if ("Notification" in window) {
                Notification.requestPermission().then(permission => {
                    if (permission !== "granted") {
                        alert("Bildirim izni verilmedi. Lütfen tarayıcı ayarlarından izin verin.");
                        // İzin verilmediyse toggle'ı geri kapat
                        setSettings(prev => ({ ...prev, notifications: false }));
                        return; // State'i güncelleme (aşağıdaki setSettings çalışmasın)
                    }
                });
            } else {
                alert("Tarayıcınız bildirimleri desteklemiyor.");
            }
        }
        
        if (key === 'location' && value === true) {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        // Başarılı olursa hiçbir şey yapma, toggle zaten açılacak
                        console.log("Konum izni alındı:", position);
                    },
                    (error) => {
                        alert("Konum izni alınamadı. Lütfen tarayıcı ayarlarından izin verin.");
                        // İzin verilmediyse toggle'ı geri kapat
                        setSettings(prev => ({ ...prev, location: false }));
                        return; // State'i güncelleme
                    }
                );
            } else {
                alert("Tarayıcınız konum özelliğini desteklemiyor.");
            }
        }

        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const renderView = () => {
        switch(activeView) {
            case 'dashboard': return (
                <div className="p-4 grid grid-cols-2 gap-3 pb-24 animate-fade-in">
                    
                    {/* Öne Çıkan Kart */}
                    <div className="col-span-2 mb-2">
                        <div onClick={() => setActiveView('route')} className="relative overflow-hidden bg-slate-900 rounded-2xl p-6 text-white shadow-xl cursor-pointer group border border-slate-700">
                            <div className="relative z-10 flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 rounded text-[10px] bg-gold-500 text-slate-900 font-bold uppercase tracking-wider">Öne Çıkan</span></div>
                                    <h2 className="text-3xl font-serif font-bold text-white mb-1">Yolculuk Rotası</h2>
                                    <p className="text-slate-400 text-sm">Cilvegözü <span className="text-gold-500">➔</span> Mekke</p>
                                </div>
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-gold-500 group-hover:text-slate-900 transition-colors"><i data-lucide="arrow-right" className="w-6 h-6"></i></div>
                            </div>
                            <i data-lucide="map" className="absolute -right-4 -bottom-8 w-40 h-40 text-white opacity-5 rotate-12"></i>
                        </div>
                    </div>

                    <AnnouncementBar />

                    <MenuCard icon="book-open" label="Umre Rehberi" subLabel="Adım adım ibadet" colorClass="bg-emerald-500 text-emerald-600" onClick={() => setActiveView('guide')} />
                    {/* Hava Durumu Kaldırıldı */}
                    <MenuCard icon="map-pin" label="Gezilecekler" subLabel="Mekke & Medine" colorClass="bg-blue-500 text-blue-600" onClick={() => setActiveView('places')} />
                    <MenuCard icon="clock" label="Namaz Vakitleri" subLabel="Ümmü'l-Kurra" colorClass="bg-cyan-500 text-cyan-600" onClick={() => setActiveView('times')} />
                    {/* Hava Durumu Widget'ı Buradan Kaldırıldı */}
                    <MenuCard icon="heart-handshake" label="Dualar" subLabel="Sesli & Metin" colorClass="bg-rose-500 text-rose-600" onClick={() => setActiveView('prayers')} />
                    <MenuCard icon="briefcase" label="İhtiyaç Listesi" subLabel="Bagaj & İlaç" colorClass="bg-purple-500 text-purple-600" onClick={() => setActiveView('luggage')} />
                    <MenuCard icon="arrow-left-right" label="Döviz" subLabel="Çevrimdışı" colorClass="bg-green-600 text-green-700" onClick={() => setActiveView('currency')} />
                    <MenuCard icon="file-text" label="Evraklar" subLabel="Pasaport & Vize" colorClass="bg-slate-500 text-slate-600" onClick={() => setActiveView('documents')} />
                    <MenuCard icon="phone" label="Acil Numaralar" subLabel="Konsolosluk & Sağlık" colorClass="bg-red-500 text-red-600" onClick={() => setActiveView('contacts')} />
                    <MenuCard icon="info" label="Hakkında" subLabel="Geliştirici" colorClass="bg-slate-400 text-slate-500" onClick={() => setActiveView('about')} />
                </div>
            );
            case 'route': return <RouteVisualizer />;
            case 'guide': return <UmrahGuideDetail />;
            case 'about': return <About />;
            case 'currency': return <CurrencyConverter />;
            case 'luggage': return <ChecklistManager type="luggage" title="İhtiyaç Listesi" />;
            case 'documents': return <ChecklistManager type="documents" title="Resmi Evraklar" />;
            case 'times': return <PrayerTimesDetail />;
            // case 'weather': return <WeatherWidget />; // Hava durumu route'u da pasif bırakılabilir veya silinebilir
            case 'contacts': return <EmergencyContacts />;
            case 'places': return <SimplePage title="Gezilecekler"><p className="text-slate-600 dark:text-slate-300">Uhud Dağı, Kuba Mescidi, Sevr Mağarası...</p></SimplePage>;
            case 'prayers': return <SimplePage title="Dualar"><p className="text-slate-600 dark:text-slate-300">Burada sesli ve yazılı dualar listelenecek.</p></SimplePage>;
            default: return <div className="p-10 text-center text-slate-500">Yapım aşamasında</div>;
        }
    };

    // Dinamik Başlık Belirleme
    const getHeaderTitle = () => {
        if (activeView === 'dashboard') return 'LOGO_STYLE';
        if (activeView === 'route') return 'Yolculuk Rotası';
        if (activeView === 'guide') return 'Umre Rehberi';
        // ... diğer durumlar ...
        return 'Rehber';
    };

    return (
        <div className={`min-h-screen transition-colors duration-500 relative ${settings.fontSize === 'small' ? 'text-sm' : settings.fontSize === 'large' ? 'text-lg' : 'text-base'}`}>
            <Header 
                title={getHeaderTitle()} 
                goBack={activeView !== 'dashboard' ? () => setActiveView('dashboard') : null}
                onOpenSettings={() => setShowSettings(true)}
                showSettingsBtn={true}
            />
            
            <main className="max-w-3xl mx-auto">{renderView()}</main>
            
            {/* FLOATING BACK BUTTON (Navigasyon Kolaylığı) */}
            {activeView !== 'dashboard' && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-fade-in-up">
                    <button 
                        onClick={() => setActiveView('dashboard')} 
                        className="bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-md text-gold-400 px-6 py-3 rounded-full shadow-2xl border border-gold-500/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                    >
                        <i data-lucide="layout-grid" className="w-5 h-5"></i>
                        <span className="font-bold text-sm">Ana Menü</span>
                    </button>
                </div>
            )}

            <SettingsModal 
                isOpen={showSettings} 
                onClose={() => setShowSettings(false)} 
                settings={settings}
                updateSettings={updateSettings}
                installPrompt={installPrompt}
                onInstall={handleInstallClick}
            />

            <InstallBanner 
                show={showInstallBanner}
                onInstall={handleInstallClick} 
                onClose={handleDismissInstall} 
            />
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
