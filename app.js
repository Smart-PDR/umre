const { useState, useEffect, useRef } = React;

// --- SABİTLER VE AYARLAR ---
const DEVELOPER_PHOTO_URL = "images/profil.png"; 
const AUDIO_SRC = "audio/Tebliye.mp3"; 

// --- YARDIMCI FONKSİYONLAR ---
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
};

// --- VERİ SETLERİ ---
const PLACES_DATA = [
    {
        category: "Mekke-i Mükerreme",
        items: [
            { id: "m1", title: "Mescid-i Haram", desc: "Kabe'nin de içinde bulunduğu, yeryüzündeki en faziletli mescit.", lat: 21.422487, lng: 39.826206, image: "" },
            { id: "m2", title: "Sevr Dağı", desc: "Hicret sırasında Peygamber Efendimiz'in saklandığı mağara.", lat: 21.3779, lng: 39.8579, image: "" },
            { id: "m3", title: "Arafat", desc: "Haccın en önemli rüknü olan vakfenin yapıldığı yer.", lat: 21.3549, lng: 39.9841, image: "" }
        ]
    },
    {
        category: "Medine-i Münevvere",
        items: [
            { id: "md1", title: "Mescid-i Nebevi", desc: "Peygamber Efendimiz'in (s.a.v) kabrinin bulunduğu mescit.", lat: 24.4672, lng: 39.6109, image: "" },
            { id: "md2", title: "Kuba Mescidi", desc: "İslam tarihinde inşa edilen ilk mescit.", lat: 24.4393, lng: 39.6173, image: "" },
            { id: "md3", title: "Uhud Dağı", desc: "Uhud Savaşı'nın yapıldığı tarihi alan.", lat: 24.5034, lng: 39.6117, image: "" }
        ]
    },
    {
        category: "Ürdün",
        items: [
            { id: "jo1", title: "Ashab-ı Kehf", desc: "Yedi Uyurlar mağarası (Amman).", lat: 31.9286, lng: 35.9529, image: "" },
            { id: "jo2", title: "Mute Savaşı Alanı", desc: "İlk İslam-Bizans savaşı alanı.", lat: 31.0772, lng: 35.7042, image: "" }
        ]
    },
    {
        category: "Suriye",
        items: [
            { id: "sy1", title: "Emevi Camii", desc: "Şam'daki tarihi cami.", lat: 33.5116, lng: 36.3065, image: "" },
            { id: "sy2", title: "Halid bin Velid Camii", desc: "Humus şehrindeki sahabe kabri.", lat: 34.7346, lng: 36.7139, image: "" }
        ]
    }
];

const ANNOUNCEMENTS = [
    "📢 Yeni kayıtlar için son gün 15 Mart!",
    "⚠️ Pasaport sürelerinizi (en az 6 ay) kontrol ediniz.",
    "🚗 Araç bakımlarınızı yola çıkmadan yaptırmayı unutmayın.",
    "💊 Kronik rahatsızlığı olanlar ilaçlarını yedekli almalıdır."
];

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

// --- BİLEŞENLER ---

// 1. AYARLAR MODALI
const SettingsModal = ({ isOpen, onClose, settings, updateSettings, installPrompt, onInstall }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl transform transition-transform duration-300 max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <h2 className="text-xl font-serif font-bold text-slate-800 dark:text-gold-400">Ayarlar</h2>
                    <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-red-500 transition">
                        <i data-lucide="x" className="w-5 h-5"></i>
                    </button>
                </div>

                <div className="space-y-6 overflow-y-auto pr-2 flex-1">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <i data-lucide="type" className="w-4 h-4 text-gold-500"></i> Yazı Boyutu
                        </label>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                            {['small', 'medium', 'large'].map((size) => (
                                <button key={size} onClick={() => updateSettings('fontSize', size)} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${settings.fontSize === size ? 'bg-white dark:bg-slate-700 shadow text-gold-600' : 'text-slate-400'}`}>
                                    {size === 'small' ? 'Küçük' : size === 'medium' ? 'Orta' : 'Büyük'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-lg"><i data-lucide={settings.theme === 'dark' ? 'moon' : 'sun'} className="w-5 h-5"></i></div>
                            <div><h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Gece Modu</h4><p className="text-[10px] text-slate-400">Karanlık tema.</p></div>
                        </div>
                        <button onClick={() => updateSettings('theme', settings.theme === 'dark' ? 'light' : 'dark')} className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.theme === 'dark' ? 'bg-gold-500' : 'bg-slate-300'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${settings.theme === 'dark' ? 'translate-x-6' : ''}`}></div>
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-lg"><i data-lucide="bell" className="w-5 h-5"></i></div>
                            <div><h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Bildirimler</h4><p className="text-[10px] text-slate-400">Namaz vakti.</p></div>
                        </div>
                        <button onClick={() => updateSettings('notifications', !settings.notifications)} className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.notifications ? 'bg-gold-500' : 'bg-slate-300'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${settings.notifications ? 'translate-x-6' : ''}`}></div>
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-lg"><i data-lucide="map-pin" className="w-5 h-5"></i></div>
                            <div><h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Konum</h4><p className="text-[10px] text-slate-400">Mesafe hesabı.</p></div>
                        </div>
                        <button onClick={() => updateSettings('location', !settings.location)} className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.location ? 'bg-gold-500' : 'bg-slate-300'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${settings.location ? 'translate-x-6' : ''}`}></div>
                        </button>
                    </div>

                    <div className="bg-slate-900 dark:bg-slate-800 p-4 rounded-xl border border-gold-500/30 flex flex-col gap-3 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gold-500/5 group-hover:bg-gold-500/10 transition-colors"></div>
                        <div className="relative z-10 flex items-start gap-3">
                            <div className="p-2 bg-gold-500 text-slate-900 rounded-lg shrink-0"><i data-lucide="smartphone" className="w-5 h-5"></i></div>
                            <div><h4 className="font-bold text-white text-sm">Uygulamayı Yükle</h4><p className="text-[10px] text-slate-300 mt-1">İnternetsiz kullanım için.</p></div>
                        </div>
                        {installPrompt ? (
                            <button onClick={onInstall} className="relative z-10 w-full py-2.5 bg-gold-500 hover:bg-gold-600 text-slate-900 font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"><i data-lucide="download" className="w-4 h-4"></i>Hemen Yükle</button>
                        ) : (
                            <button disabled className="relative z-10 w-full py-2.5 bg-slate-700 text-slate-400 font-bold text-sm rounded-lg cursor-not-allowed">Zaten Yüklü / Desteklenmiyor</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// 2. HEADER ve SES OYNATICI
const Header = ({ title, goBack, onOpenSettings, showSettingsBtn }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        audioRef.current = new Audio(AUDIO_SRC);
        audioRef.current.onended = () => setIsPlaying(false);
        return () => { if(audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) audioRef.current.pause();
        else audioRef.current.play().catch(e => console.log("Ses hatası:", e));
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="sticky top-0 z-50 glass-header px-4 py-3 flex items-center justify-between shadow-sm transition-all duration-300 min-h-[70px]">
            <div className="flex items-center gap-3">
                {goBack && (
                    <button onClick={goBack} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300">
                        <i data-lucide="arrow-left" className="w-5 h-5"></i>
                    </button>
                )}
                {title === 'LOGO_STYLE' ? (
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gold-600 dark:text-gold-500 tracking-[0.2em] uppercase leading-none mb-0.5">Karayolu İle</span>
                        <span className="text-lg font-serif font-bold text-slate-900 dark:text-white leading-none tracking-tight">Umre Rehberi</span>
                    </div>
                ) : (
                    <h1 className="text-lg font-serif font-bold text-slate-900 dark:text-gold-400 tracking-wide leading-tight">{title}</h1>
                )}
            </div>
            {showSettingsBtn && (
                <div className="flex items-center gap-2">
                    <button onClick={togglePlay} className={`p-2 rounded-full transition-all border ${isPlaying ? 'bg-gold-500 border-gold-500 text-white animate-pulse-gold' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'}`}>
                        <i data-lucide={isPlaying ? "pause" : "play"} className="w-4 h-4 fill-current"></i>
                    </button>
                    <button onClick={onOpenSettings} className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-gold-600 dark:hover:text-gold-400 transition shadow-sm active:scale-95">
                        <i data-lucide="settings" className="w-5 h-5"></i>
                    </button>
                </div>
            )}
        </div>
    );
};

// 3. NAMAZ VAKİTLERİ
const PrayerTimesDetail = () => {
    const [city, setCity] = useState("Mekke");
    const [times, setTimes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOffline, setIsOffline] = useState(false);
    const [dataDate, setDataDate] = useState("");

    useEffect(() => {
        const fetchTimes = async () => {
            setLoading(true);
            try {
                const today = new Date();
                const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Saudi Arabia&method=4`);
                if (!response.ok) throw new Error("API Hatası");
                const data = await response.json();
                const t = data.data.timings;
                const formatted = { Imsak: t.Fajr, Gunes: t.Sunrise, Ogle: t.Dhuhr, Ikindi: t.Asr, Aksam: t.Maghrib, Yatsi: t.Isha };
                setTimes(formatted);
                setDataDate(data.data.date.readable);
                setIsOffline(false);
                localStorage.setItem(`prayer_${city}`, JSON.stringify({ t: formatted, d: data.data.date.readable }));
            } catch (e) {
                const saved = localStorage.getItem(`prayer_${city}`);
                if (saved) {
                    const p = JSON.parse(saved);
                    setTimes(p.t);
                    setDataDate(p.d);
                } else {
                    setTimes({ Imsak: "--:--", Gunes: "--:--", Ogle: "--:--", Ikindi: "--:--", Aksam: "--:--", Yatsi: "--:--" });
                }
                setIsOffline(true);
            } finally { setLoading(false); }
        };
        fetchTimes();
    }, [city]);

    return (
        <div className="p-4 pb-20 animate-fade-in space-y-4">
            <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl mb-4">
                {["Mekke", "Medine"].map(c => (
                    <button key={c} onClick={() => setCity(c)} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${city === c ? 'bg-white dark:bg-slate-600 shadow text-gold-600' : 'text-slate-500'}`}>{c}</button>
                ))}
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="bg-gold-500 p-4 text-white flex justify-between items-center">
                    <div><h3 className="font-serif font-bold text-lg">Namaz Vakitleri</h3><p className="text-xs">{city} - {dataDate}</p></div>
                    <i data-lucide="clock" className="w-6 h-6 opacity-50"></i>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {times && Object.entries(times).map(([v, s]) => (
                        <div key={v} className="p-4 flex justify-between items-center">
                            <span className="text-xs text-slate-400 uppercase tracking-wider">{v}</span>
                            <span className="font-mono text-xl font-bold text-slate-800 dark:text-slate-200">{s}</span>
                        </div>
                    ))}
                </div>
            </div>
            {isOffline && <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 text-xs rounded-xl">İnternet yok. Çevrimdışı veri gösteriliyor.</div>}
        </div>
    );
};

// 4. DÖVİZ ÇEVİRİCİ
const CurrencyConverter = () => {
    const [rates, setRates] = useState(null);
    const [vals, setVals] = useState({ SAR: 1, USD: 0, TRY: 0 });
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const res = await fetch('https://api.exchangerate-api.com/v4/latest/SAR');
                if (!res.ok) throw new Error("Err");
                const data = await res.json();
                setRates(data.rates);
                setVals(v => ({ ...v, USD: (v.SAR * data.rates.USD).toFixed(2), TRY: (v.SAR * data.rates.TRY).toFixed(2) }));
                localStorage.setItem('rates', JSON.stringify(data.rates));
            } catch (e) {
                const s = localStorage.getItem('rates');
                if (s) {
                    const r = JSON.parse(s);
                    setRates(r);
                    setVals(v => ({ ...v, USD: (v.SAR * r.USD).toFixed(2), TRY: (v.SAR * r.TRY).toFixed(2) }));
                }
                setIsOffline(true);
            }
        };
        fetchRates();
    }, []);

    const handleChange = (val, type) => {
        if (!rates) return;
        let v = parseFloat(val) || 0;
        if (type === 'SAR') setVals({ SAR: v, USD: (v * rates.USD).toFixed(2), TRY: (v * rates.TRY).toFixed(2) });
        else if (type === 'USD') { const s = v / rates.USD; setVals({ SAR: s.toFixed(2), USD: v, TRY: (s * rates.TRY).toFixed(2) }); }
        else if (type === 'TRY') { const s = v / rates.TRY; setVals({ SAR: s.toFixed(2), USD: (s * rates.USD).toFixed(2), TRY: v }); }
    };

    return (
        <div className="p-6 space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between mb-4"><h3 className="font-bold text-slate-800 dark:text-white">Döviz Çevirici</h3>{isOffline ? <i data-lucide="wifi-off" className="w-4 h-4 text-red-500"></i> : <i data-lucide="wifi" className="w-4 h-4 text-green-500"></i>}</div>
                <div className="space-y-4">
                    {['SAR', 'USD', 'TRY'].map(c => (
                        <div key={c} className="flex items-center bg-slate-50 dark:bg-slate-900 rounded-xl p-1">
                            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg font-bold text-gold-600 shadow-sm w-16 text-center">{c}</div>
                            <input type="number" value={vals[c]} onChange={e => handleChange(e.target.value, c)} className="w-full bg-transparent p-3 text-right font-mono font-bold text-slate-800 dark:text-slate-100 focus:outline-none" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// 5. İHTİYAÇ LİSTESİ
const ChecklistManager = ({ type, title }) => {
    const [items, setItems] = useState([]);
    useEffect(() => {
        const s = localStorage.getItem(`chk_${type}`);
        if (s) setItems(JSON.parse(s));
        else setItems(CHECKLISTS_DATA[type] || []);
    }, [type]);

    const toggle = (id) => {
        const n = items.map(i => i.id === id ? { ...i, checked: !i.checked } : i);
        setItems(n);
        localStorage.setItem(`chk_${type}`, JSON.stringify(n));
    };

    return (
        <div className="p-4 space-y-4 animate-fade-in">
            <h3 className="font-bold text-lg px-2">{title}</h3>
            {items.map(i => (
                <div key={i.id} onClick={() => toggle(i.id)} className={`flex items-center p-4 rounded-xl border cursor-pointer ${i.checked ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700'}`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${i.checked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-400'}`}>{i.checked && <i data-lucide="check" className="w-4 h-4 text-white"></i>}</div>
                    <span className={i.checked ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}>{i.label}</span>
                </div>
            ))}
        </div>
    );
};

// 6. GEZİLECEK YERLER
const PlacesDetail = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [userLoc, setUserLoc] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) navigator.geolocation.getCurrentPosition(p => setUserLoc({ lat: p.coords.latitude, lng: p.coords.longitude }));
    }, []);

    const openMap = (lat, lng) => window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');

    return (
        <div className="p-4 pb-24 animate-fade-in space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {PLACES_DATA.map((c, i) => (
                    <button key={i} onClick={() => setActiveTab(i)} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold border ${activeTab === i ? 'bg-gold-500 border-gold-500 text-slate-900' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200'}`}>{c.category}</button>
                ))}
            </div>
            <div className="space-y-4">
                {PLACES_DATA[activeTab].items.map(p => {
                    const dist = userLoc ? calculateDistance(userLoc.lat, userLoc.lng, p.lat, p.lng) : null;
                    return (
                        <div key={p.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
                            <div className="h-40 bg-slate-200 dark:bg-slate-700 relative flex items-center justify-center">
                                <div className="text-slate-400 text-xs flex flex-col items-center gap-2"><i data-lucide="image" className="w-8 h-8 opacity-50"></i><span>{p.title}</span></div>
                                {dist && <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full">{dist} km</div>}
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{p.title}</h3>
                                <p className="text-xs text-slate-500 mb-4">{p.desc}</p>
                                <button onClick={() => openMap(p.lat, p.lng)} className="w-full py-2 bg-gold-50 text-gold-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2"><i data-lucide="map" className="w-4 h-4"></i> Yol Tarifi</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// 7. KIBLE PUSULASI
const QiblaCompass = () => {
    const [heading, setHeading] = useState(0);
    const [qibla, setQibla] = useState(0);
    const [perm, setPerm] = useState(false);

    const calcQibla = (lat, lng) => {
        const K_LAT = 21.422487, K_LNG = 39.826206;
        const pk = K_LAT * Math.PI/180, lk = K_LNG * Math.PI/180;
        const p = lat * Math.PI/180, l = lng * Math.PI/180;
        const y = Math.sin(lk - l);
        const x = Math.cos(p) * Math.tan(pk) - Math.sin(p) * Math.cos(lk - l);
        return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    };

    const start = () => {
        if (navigator.geolocation) navigator.geolocation.getCurrentPosition(p => setQibla(calcQibla(p.coords.latitude, p.coords.longitude)));
        if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission().then(r => { if(r === 'granted') { setPerm(true); window.addEventListener('deviceorientation', handleOr); }});
        } else { setPerm(true); window.addEventListener('deviceorientation', handleOr); }
    };
    
    const handleOr = (e) => setHeading(e.webkitCompassHeading || Math.abs(e.alpha - 360));
    useEffect(() => () => window.removeEventListener('deviceorientation', handleOr), []);

    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] p-6">
            {!perm ? (
                <div className="text-center">
                    <button onClick={start} className="px-8 py-3 bg-gold-500 text-white font-bold rounded-xl shadow-lg">Pusulayı Başlat</button>
                    <p className="text-xs text-slate-400 mt-4">Pusula için izin verin ve konumu açın.</p>
                </div>
            ) : (
                <div className="relative">
                    <div className="w-72 h-72 rounded-full border-8 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xl flex items-center justify-center transition-transform" style={{ transform: `rotate(${-heading}deg)` }}>
                        <span className="absolute top-2 text-red-500 font-bold">N</span>
                        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `rotate(${(qibla - heading + 360 + heading)%360}deg)` }}>
                            <div className="h-32 w-1 bg-gold-500 origin-bottom relative -top-16"><i data-lucide="moon" className="absolute -top-4 -left-2 w-5 h-5 text-gold-500 fill-current"></i></div>
                        </div>
                    </div>
                    <div className="text-center mt-8"><div className="text-3xl font-mono font-bold text-slate-800 dark:text-gold-400">{Math.round(heading)}°</div></div>
                </div>
            )}
        </div>
    );
};

// 8. ÖNE ÇIKAN KARTLAR (SLIDER)
const FeaturedCards = ({ setActiveView }) => {
    const [dist, setDist] = useState({ mk: null, md: null });
    useEffect(() => {
        if (navigator.geolocation) navigator.geolocation.getCurrentPosition(p => {
            const l = p.coords.latitude, g = p.coords.longitude;
            setDist({ mk: calculateDistance(l, g, 21.4225, 39.8262), md: calculateDistance(l, g, 24.4672, 39.6109) });
        });
    }, []);

    const cards = [
        { id: 'c1', title: 'Yolculuk Rotası', sub: 'Cilvegözü ➔ Mekke', icon: 'map', bg: 'bg-slate-900', text: 'text-white', act: () => setActiveView('route') },
        { id: 'c2', title: 'Mesafe Durumu', sub: dist.mk ? `Mekke'ye ${dist.mk} km` : 'Konum Bekleniyor...', icon: 'navigation', bg: 'bg-emerald-800', text: 'text-white', act: () => setActiveView('places') }
    ];

    return (
        <div className="col-span-2 mb-2 flex gap-3 overflow-x-auto pb-4 pt-1 px-1 snap-x scrollbar-hide">
            {cards.map(c => (
                <div key={c.id} onClick={c.act} className={`relative overflow-hidden ${c.bg} rounded-2xl p-5 shadow-xl cursor-pointer border border-white/10 min-w-[85%] snap-center shrink-0 flex flex-col justify-between h-32`}>
                    <div className="relative z-10"><h2 className={`text-2xl font-serif font-bold ${c.text} mb-0.5`}>{c.title}</h2><p className={`${c.text} text-xs opacity-70`}>{c.sub}</p></div>
                    <i data-lucide={c.icon} className={`absolute -right-2 -bottom-4 w-24 h-24 ${c.text} opacity-10 rotate-12`}></i>
                </div>
            ))}
        </div>
    );
};

// 9. DİĞER KÜÇÜK BİLEŞENLER
const AnnouncementBar = () => {
    const [idx, setIdx] = useState(0);
    useEffect(() => { const i = setInterval(() => setIdx(p => (p + 1) % ANNOUNCEMENTS.length), 4000); return () => clearInterval(i); }, []);
    return (
        <div className="col-span-2 my-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 h-12 flex items-center pr-2">
            <div className="h-full bg-gold-500 w-12 flex items-center justify-center shrink-0"><i data-lucide="megaphone" className="w-5 h-5 text-white"></i></div>
            <div className="flex-1 ml-4 text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{ANNOUNCEMENTS[idx]}</div>
        </div>
    );
};

const MenuCard = ({ icon, label, subLabel, colorClass, onClick, featured }) => (
    <button onClick={onClick} className={`group relative flex flex-col items-start p-5 rounded-2xl bg-white dark:bg-slate-800 transition-all hover:scale-[1.02] border border-slate-100 dark:border-slate-700 overflow-hidden ${featured ? 'col-span-2' : ''}`}>
        <div className={`p-3 rounded-xl mb-3 ${colorClass} bg-opacity-10 dark:bg-opacity-20`}><i data-lucide={icon} className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`}></i></div>
        <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{label}</span>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{subLabel}</span>
    </button>
);

const InstallBanner = ({ onInstall, onClose, show }) => {
    if (!show) return null;
    return (
        <div className="fixed bottom-0 left-0 right-0 z-[60] p-4">
            <div className="bg-slate-900 dark:bg-slate-800 text-white p-4 rounded-2xl shadow-2xl border-t-4 border-gold-500 flex flex-col gap-3 relative">
                <button onClick={onClose} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white bg-white/10 rounded-full"><i data-lucide="x" className="w-4 h-4"></i></button>
                <div className="flex items-start gap-3"><div className="bg-gold-500 p-2.5 rounded-xl text-slate-900"><i data-lucide="download" className="w-6 h-6"></i></div><div><h4 className="font-bold text-gold-400">Uygulamayı Yükle</h4><p className="text-xs text-slate-300">İnternetsiz kullanım için.</p></div></div>
                <button onClick={onInstall} className="w-full bg-gold-500 hover:bg-gold-600 text-slate-900 font-bold py-3 rounded-xl flex justify-center gap-2"><i data-lucide="smartphone" className="w-5 h-5"></i>Ücretsiz Yükle</button>
            </div>
        </div>
    );
};

const RouteVisualizer = () => {
    const [vis, setVis] = useState(0);
    useEffect(() => { const i = setInterval(() => setVis(c => c <= ROUTE_STOPS.length ? c + 1 : c), 500); return () => clearInterval(i); }, []);
    return (
        <div className="p-6 pb-20 animate-fade-in">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white mb-8 shadow-xl"><h3 className="font-bold text-gold-400">Mübarek Yolculuk</h3><p className="text-slate-400 text-sm">Türkiye - Mekke</p></div>
            <div className="space-y-8 relative pl-2 border-l-2 border-slate-200 dark:border-slate-700 ml-4">
                {ROUTE_STOPS.map((s, i) => (
                    <div key={s.id} className={`flex items-start gap-4 transition-all ${i < vis ? 'opacity-100' : 'opacity-0'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center -ml-[1.1rem] border-4 ${i < vis ? 'bg-gold-500 border-gold-500 text-white' : 'bg-slate-200 border-slate-200'}`}><i data-lucide="map-pin" className="w-3 h-3"></i></div>
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex-1">
                            <div className="flex justify-between"><h4 className="font-bold text-slate-800 dark:text-slate-100">{s.name}</h4><span className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{s.km} km</span></div>
                            <p className="text-xs text-slate-500">{s.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const UmrahGuideDetail = () => (
    <div className="p-4 space-y-3">
        {[{t:"İhram", d:"Mikat'ta girilir."}, {t:"Tavaf", d:"7 şavt."}, {t:"Sa'y", d:"Safa-Merve arası."}, {t:"Tıraş", d:"İhramdan çıkış."}].map((s,i)=>(
            <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700"><h4 className="font-bold text-slate-800 dark:text-slate-100">{i+1}. {s.t}</h4><p className="text-sm text-slate-500">{s.d}</p></div>
        ))}
    </div>
);

const About = () => (
    <div className="p-4 pb-20 text-center space-y-4">
        <div className="w-24 h-24 mx-auto rounded-full bg-slate-200 overflow-hidden"><img src={DEVELOPER_PHOTO_URL} className="w-full h-full object-cover" /></div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Sami G.</h2>
        <p className="text-slate-500 text-sm">Allah'ın misafirlerine hizmet etmek şereftir.</p>
    </div>
);

const EmergencyContacts = () => (
    <div className="p-4 space-y-3">
        {[{t:"Konsolosluk", n:"+966126601607"}, {t:"Ambulans", n:"997"}, {t:"Polis", n:"999"}].map((e,i)=>(
            <div key={i} className="flex items-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700"><i data-lucide="phone" className="w-5 h-5 text-red-500 mr-4"></i><div><h4 className="font-bold text-slate-800 dark:text-slate-200">{e.t}</h4><span className="text-xs text-slate-500">{e.n}</span></div></div>
        ))}
    </div>
);

// --- ANA UYGULAMA ---
const App = () => {
    const [view, setView] = useState('dashboard');
    const [installPrompt, setInstallPrompt] = useState(null);
    const [showBanner, setShowBanner] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState(() => JSON.parse(localStorage.getItem('sets')) || { fontSize: 'medium', theme: 'light', notifications: false, location: false });

    useEffect(() => { if(window.lucide) window.lucide.createIcons(); }, [view, showSettings, showBanner, settings]);
    useEffect(() => {
        localStorage.setItem('sets', JSON.stringify(settings));
        document.documentElement.className = settings.theme === 'dark' ? 'dark' : '';
        document.documentElement.classList.add(settings.fontSize === 'small' ? 'text-sm' : settings.fontSize === 'large' ? 'text-lg' : 'text-base');
    }, [settings]);

    useEffect(() => {
        const h = (e) => { e.preventDefault(); setInstallPrompt(e); if(!localStorage.getItem('dismiss')) setShowBanner(true); };
        window.addEventListener('beforeinstallprompt', h);
        setTimeout(() => { if(!localStorage.getItem('dismiss')) setShowBanner(true); }, 3000);
        return () => window.removeEventListener('beforeinstallprompt', h);
    }, []);

    const handleInstall = () => {
        if(!installPrompt) { alert("Gerçek cihazda yükleme açılır."); setShowBanner(false); localStorage.setItem('dismiss', 'true'); return; }
        installPrompt.prompt();
        installPrompt.userChoice.then(r => { if(r.outcome === 'accepted') { setShowBanner(false); localStorage.setItem('dismiss', 'true'); } setInstallPrompt(null); });
    };

    const updateSettings = (k, v) => {
        if(k==='notifications' && v) Notification.requestPermission();
        if(k==='location' && v) navigator.geolocation.getCurrentPosition(()=>{}, ()=>{});
        setSettings(p => ({...p, [k]: v}));
    };

    const renderView = () => {
        switch(view) {
            case 'dashboard': return (
                <div className="p-4 grid grid-cols-2 gap-3 pb-24 animate-fade-in">
                    <FeaturedCards setActiveView={setView} />
                    <AnnouncementBar />
                    <MenuCard icon="book-open" label="Umre Rehberi" subLabel="Adım adım" colorClass="bg-emerald-500 text-emerald-600" onClick={() => setView('guide')} />
                    <MenuCard icon="map" label="Gezilecek Yerler" subLabel="Mekke & Medine" colorClass="bg-blue-500 text-blue-600" onClick={() => setView('places')} />
                    <MenuCard icon="compass" label="Kıble Pusulası" subLabel="Canlı Yön" colorClass="bg-slate-700 text-slate-800 dark:text-slate-100" onClick={() => setView('compass')} />
                    <MenuCard icon="clock" label="Namaz Vakitleri" subLabel="Güncel" colorClass="bg-cyan-500 text-cyan-600" onClick={() => setView('times')} />
                    <MenuCard icon="briefcase" label="İhtiyaç Listesi" subLabel="Bagaj" colorClass="bg-purple-500 text-purple-600" onClick={() => setView('luggage')} />
                    <MenuCard icon="arrow-left-right" label="Döviz" subLabel="Hesapla" colorClass="bg-green-600 text-green-700" onClick={() => setView('currency')} />
                    <MenuCard icon="file-text" label="Evraklar" subLabel="Pasaport" colorClass="bg-slate-500 text-slate-600" onClick={() => setView('documents')} />
                    <MenuCard icon="phone" label="Acil Numaralar" subLabel="Yardım" colorClass="bg-red-500 text-red-600" onClick={() => setView('contacts')} />
                    <MenuCard icon="info" label="Hakkında" subLabel="Künye" colorClass="bg-slate-400 text-slate-500" onClick={() => setView('about')} />
                </div>
            );
            case 'route': return <RouteVisualizer />;
            case 'guide': return <UmrahGuideDetail />;
            case 'places': return <PlacesDetail />;
            case 'compass': return <QiblaCompass />;
            case 'times': return <PrayerTimesDetail />;
            case 'currency': return <CurrencyConverter />;
            case 'luggage': return <ChecklistManager type="luggage" title="İhtiyaç Listesi" />;
            case 'documents': return <ChecklistManager type="documents" title="Resmi Evraklar" />;
            case 'contacts': return <EmergencyContacts />;
            case 'about': return <About />;
            default: return <div className="p-10 text-center">Yapım aşamasında</div>;
        }
    };

    return (
        <div className="min-h-screen transition-colors duration-500 relative">
            <Header title={view === 'dashboard' ? 'LOGO_STYLE' : 'Rehber'} goBack={view !== 'dashboard' ? () => setView('dashboard') : null} onOpenSettings={() => setShowSettings(true)} showSettingsBtn={true} />
            <main className="max-w-3xl mx-auto">{renderView()}</main>
            {view !== 'dashboard' && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"><button onClick={() => setView('dashboard')} className="bg-slate-900/90 text-gold-400 px-6 py-3 rounded-full shadow-2xl flex items-center gap-2"><i data-lucide="layout-grid" className="w-5 h-5"></i><span className="font-bold text-sm">Ana Menü</span></button></div>}
            <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} settings={settings} updateSettings={updateSettings} installPrompt={installPrompt} onInstall={handleInstall} />
            <InstallBanner show={showBanner} onInstall={handleInstall} onClose={() => {setShowBanner(false); localStorage.setItem('dismiss', 'true');}} />
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
