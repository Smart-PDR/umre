const { useState, useEffect, useRef } = React;

// --- SABİTLER VE AYARLAR ---
const DEVELOPER_PHOTO_URL = "images/profil.png"; 
const AUDIO_SRC = "audio/Telbiye.mp3"; 

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

const EMERGENCY_NUMBERS = [
    { title: "T.C. Cidde Başkonsolosluğu", number: "+966126601607", icon: "building-2" },
    { title: "T.C. Riyad Büyükelçiliği", number: "+966114820101", icon: "flag" },
    { title: "Mekke Diyanet Ekibi", number: "+966500000000", icon: "phone" },
    { title: "Suudi Arabistan Polis", number: "999", icon: "alert-triangle" },
    { title: "Suudi Arabistan Ambulans", number: "997", icon: "ambulance" },
    { title: "Trafik Kazası", number: "993", icon: "car" }
];

// --- BİLEŞENLER ---

// 1. AYARLAR MODALI
const SettingsModal = ({ isOpen, onClose, settings, updateSettings, installPrompt, onInstall }) => {
    if (!isOpen) return null;

    // Gerçek izin isteme mantığı
    const handleToggle = (key) => {
        const currentVal = settings[key];
        const newVal = !currentVal;

        if (newVal) {
            if (key === 'notifications') {
                if ("Notification" in window) {
                    Notification.requestPermission().then(permission => {
                        if (permission === "granted") updateSettings(key, true);
                        else { alert("Bildirim izni reddedildi."); updateSettings(key, false); }
                    });
                } else alert("Tarayıcınız bildirimleri desteklemiyor.");
            } else if (key === 'location') {
                if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(
                        (p) => { console.log("Konum alındı:", p); updateSettings(key, true); },
                        (e) => { alert("Konum izni alınamadı."); updateSettings(key, false); }
                    );
                } else alert("Tarayıcınız konumu desteklemiyor.");
            } else updateSettings(key, newVal);
        } else updateSettings(key, false);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl transform transition-transform duration-300 max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <h2 className="text-xl font-serif font-bold text-slate-800 dark:text-gold-400">Ayarlar</h2>
                    <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-red-500 transition"><i data-lucide="x" className="w-5 h-5"></i></button>
                </div>
                <div className="space-y-6 overflow-y-auto pr-2 flex-1">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"><i data-lucide="type" className="w-4 h-4 text-gold-500"></i> Yazı Boyutu</label>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                            {['small', 'medium', 'large'].map((size) => (
                                <button key={size} onClick={() => updateSettings('fontSize', size)} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${settings.fontSize === size ? 'bg-white dark:bg-slate-700 shadow text-gold-600' : 'text-slate-400'}`}>{size === 'small' ? 'Küçük' : size === 'medium' ? 'Orta' : 'Büyük'}</button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-xl">
                        <div className="flex items-center gap-3"><div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-lg"><i data-lucide={settings.theme === 'dark' ? 'moon' : 'sun'} className="w-5 h-5"></i></div><div><h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Gece Modu</h4><p className="text-[10px] text-slate-400">Karanlık tema.</p></div></div>
                        <button onClick={() => updateSettings('theme', settings.theme === 'dark' ? 'light' : 'dark')} className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.theme === 'dark' ? 'bg-gold-500' : 'bg-slate-300'}`}><div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${settings.theme === 'dark' ? 'translate-x-6' : ''}`}></div></button>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-xl">
                        <div className="flex items-center gap-3"><div className="p-2 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-lg"><i data-lucide="bell" className="w-5 h-5"></i></div><div><h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Bildirimler</h4><p className="text-[10px] text-slate-400">Namaz vakti.</p></div></div>
                        <button onClick={() => handleToggle('notifications')} className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.notifications ? 'bg-gold-500' : 'bg-slate-300'}`}><div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${settings.notifications ? 'translate-x-6' : ''}`}></div></button>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-xl">
                        <div className="flex items-center gap-3"><div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-lg"><i data-lucide="map-pin" className="w-5 h-5"></i></div><div><h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Konum</h4><p className="text-[10px] text-slate-400">Mesafe hesabı.</p></div></div>
                        <button onClick={() => handleToggle('location')} className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.location ? 'bg-gold-500' : 'bg-slate-300'}`}><div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${settings.location ? 'translate-x-6' : ''}`}></div></button>
                    </div>
                    <div className="bg-slate-900 dark:bg-slate-800 p-4 rounded-xl border border-gold-500/30 flex flex-col gap-3 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gold-500/5 group-hover:bg-gold-500/10 transition-colors"></div>
                        <div className="relative z-10 flex items-start gap-3"><div className="p-2 bg-gold-500 text-slate-900 rounded-lg shrink-0"><i data-lucide="smartphone" className="w-5 h-5"></i></div><div><h4 className="font-bold text-white text-sm">Uygulamayı Yükle</h4><p className="text-[10px] text-slate-300 mt-1">İnternetsiz kullanım için.</p></div></div>
                        {installPrompt ? ( <button onClick={onInstall} className="relative z-10 w-full py-2.5 bg-gold-500 hover:bg-gold-600 text-slate-900 font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"><i data-lucide="download" className="w-4 h-4"></i>Hemen Yükle</button> ) : ( <button disabled className="relative z-10 w-full py-2.5 bg-slate-700 text-slate-400 font-bold text-sm rounded-lg cursor-not-allowed">Zaten Yüklü / Desteklenmiyor</button> )}
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
        audioRef.current.onerror = (e) => console.log("Ses dosyası yüklenemedi", e);
        return () => { if(audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) { audioRef.current.pause(); } 
        else { const p = audioRef.current.play(); if (p !== undefined) p.catch(e => { alert("Ses dosyası çalınamıyor. Dosya yolu: " + AUDIO_SRC); setIsPlaying(false); }); }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="sticky top-0 z-50 glass-header px-4 py-3 flex items-center justify-between shadow-sm transition-all duration-300 min-h-[70px]">
            <div className="flex items-center gap-3">
                {goBack && ( <button onClick={goBack} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300"><i data-lucide="arrow-left" className="w-5 h-5"></i></button> )}
                {title === 'LOGO_STYLE' ? (
                    <div className="flex flex-col"><span className="text-[10px] font-bold text-gold-600 dark:text-gold-500 tracking-[0.2em] uppercase leading-none mb-0.5">Karayolu İle</span><span className="text-lg font-serif font-bold text-slate-900 dark:text-white leading-none tracking-tight">Umre Rehberi</span></div>
                ) : ( <h1 className="text-lg font-serif font-bold text-slate-900 dark:text-gold-400 tracking-wide leading-tight">{title}</h1> )}
            </div>
            {showSettingsBtn && (
                <div className="flex items-center gap-2">
                    <button onClick={togglePlay} className={`p-2 rounded-full transition-all border ${isPlaying ? 'bg-gold-500 border-gold-500 text-white animate-pulse-gold' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'}`}><i data-lucide={isPlaying ? "pause" : "play"} className="w-4 h-4 fill-current"></i></button>
                    <button onClick={onOpenSettings} className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-gold-600 dark:hover:text-gold-400 transition shadow-sm active:scale-95"><i data-lucide="settings" className="w-5 h-5"></i></button>
                </div>
            )}
        </div>
    );
};

// 3. GELİŞMİŞ NAMAZ VAKİTLERİ
const PrayerTimesDetail = () => {
    const [city, setCity] = useState("Mekke");
    const [times, setTimes] = useState(null);
    const [nextPrayer, setNextPrayer] = useState(null);
    const [countdown, setCountdown] = useState("");
    const [dataDate, setDataDate] = useState("");
    const [isOffline, setIsOffline] = useState(false);
    const [lastFetch, setLastFetch] = useState("");

    // Tarih Formatı
    const todayStr = new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Vakitleri hesapla ve sıradaki vakti bul
    useEffect(() => {
        if (!times) return;
        
        const timer = setInterval(() => {
            const now = new Date();
            const currentTime = now.getHours() * 60 + now.getMinutes();
            const currentSeconds = now.getSeconds();

            const prayerList = [
                { name: 'Imsak', time: times.Imsak },
                { name: 'Gunes', time: times.Gunes },
                { name: 'Ogle', time: times.Ogle },
                { name: 'Ikindi', time: times.Ikindi },
                { name: 'Aksam', time: times.Aksam },
                { name: 'Yatsi', time: times.Yatsi }
            ];

            let next = null;
            let minDiff = Infinity;

            for (let p of prayerList) {
                const [h, m] = p.time.split(':').map(Number);
                const pTime = h * 60 + m;
                let diff = pTime - currentTime;
                
                if (diff < 0) diff += 24 * 60; // Yarınki vakit

                if (diff < minDiff) {
                    minDiff = diff;
                    next = p;
                }
            }
            
            setNextPrayer(next);

            // Countdown hesapla
            const totalSecs = (minDiff * 60) - currentSeconds;
            const h = Math.floor(totalSecs / 3600);
            const m = Math.floor((totalSecs % 3600) / 60);
            const s = totalSecs % 60;
            setCountdown(`${h}:${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`);

        }, 1000);

        return () => clearInterval(timer);
    }, [times]);

    useEffect(() => {
        const fetchTimes = async () => {
            try {
                const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Saudi Arabia&method=4`);
                if (!response.ok) throw new Error("API Hatası");
                const data = await response.json();
                const t = data.data.timings;
                const formatted = { Imsak: t.Fajr, Gunes: t.Sunrise, Ogle: t.Dhuhr, Ikindi: t.Asr, Aksam: t.Maghrib, Yatsi: t.Isha };
                setTimes(formatted);
                setDataDate(data.data.date.readable);
                setLastFetch(new Date().toLocaleTimeString());
                setIsOffline(false);
                localStorage.setItem(`prayer_${city}`, JSON.stringify({ t: formatted, d: data.data.date.readable, lf: new Date().toLocaleTimeString() }));
            } catch (e) {
                const saved = localStorage.getItem(`prayer_${city}`);
                if (saved) {
                    const p = JSON.parse(saved);
                    setTimes(p.t);
                    setDataDate(p.d);
                    setLastFetch(p.lf || "Bilinmiyor");
                } else {
                    setTimes({ Imsak: "05:00", Gunes: "06:30", Ogle: "12:30", Ikindi: "15:45", Aksam: "18:20", Yatsi: "19:50" });
                }
                setIsOffline(true);
            }
        };
        fetchTimes();
    }, [city]);

    return (
        <div className="p-4 pb-20 animate-fade-in space-y-4">
            <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl mb-4">
                {["Mekke", "Medine"].map(c => ( <button key={c} onClick={() => setCity(c)} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${city === c ? 'bg-white dark:bg-slate-600 shadow text-gold-600' : 'text-slate-500'}`}>{c}</button> ))}
            </div>

            {/* Bilgi Kartı */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 text-center">
                    <p className="text-xs text-gold-400 font-bold uppercase tracking-widest mb-1">{city}</p>
                    <h2 className="text-xl font-serif font-bold mb-2">{todayStr}</h2>
                    {nextPrayer && (
                        <div className="mt-4 p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 inline-block">
                            <p className="text-xs text-slate-300 mb-1">{nextPrayer.name} Vaktine Kalan</p>
                            <p className="text-3xl font-mono font-bold text-gold-400">{countdown}</p>
                        </div>
                    )}
                </div>
                <i data-lucide="moon" className="absolute -right-4 -top-4 w-32 h-32 text-white opacity-5"></i>
            </div>

            {/* Vakitler Listesi */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden divide-y divide-slate-100 dark:divide-slate-700">
                {times && Object.entries(times).map(([v, s]) => {
                    const isActive = nextPrayer && nextPrayer.name === v ? false : (nextPrayer && v === 'Yatsi' && nextPrayer.name === 'Imsak' ? true : false); // Basit mantık, geliştirilebilir
                    // Daha doğru aktif vakit mantığı için:
                    // Bir önceki vakit şu anki vakittir. NextPrayer "Ogle" ise, şu an "Gunes" (Kerahat) veya "Imsak" sonrası olabilir.
                    // Burada görsel sadelik için bir sonraki vakti vurguluyoruz veya basit liste yapıyoruz.
                    // İsteğiniz: "Mevcut vakit ne ise onu belirt".
                    // Bunun için nextPrayer'ın bir öncesini bulmamız lazım.
                    
                    const pOrder = ['Imsak', 'Gunes', 'Ogle', 'Ikindi', 'Aksam', 'Yatsi'];
                    const nextIdx = nextPrayer ? pOrder.indexOf(nextPrayer.name) : -1;
                    const currentIdx = nextIdx === 0 ? 5 : nextIdx - 1; // Eğer sonraki İmsak ise, şu an Yatsı'dır.
                    const isCurrent = pOrder[currentIdx] === v;

                    return (
                        <div key={v} className={`p-4 flex justify-between items-center transition-colors ${isCurrent ? 'bg-gold-50 dark:bg-gold-900/20' : ''}`}>
                            <div className="flex items-center gap-3">
                                <span className={`text-xs font-bold uppercase tracking-wider ${isCurrent ? 'text-gold-600 dark:text-gold-400' : 'text-slate-400'}`}>{v}</span>
                                {isCurrent && <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span></span>}
                            </div>
                            <span className={`font-mono text-xl font-bold ${isCurrent ? 'text-gold-700 dark:text-gold-300' : 'text-slate-800 dark:text-slate-200'}`}>{s}</span>
                        </div>
                    );
                })}
            </div>
            
            {isOffline && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/50">
                    <i data-lucide="wifi-off" className="w-4 h-4 text-red-500"></i>
                    <div className="text-xs text-red-700 dark:text-red-300 leading-tight">
                        <span className="font-bold block">Çevrimdışı Mod</span>
                        Son güncelleme: {lastFetch}. Lütfen imsakiyenizi kontrol ediniz.
                    </div>
                </div>
            )}
        </div>
    );
};

// 4. MODERN DÖVİZ ÇEVİRİCİ
const CurrencyConverter = () => {
    const [amount, setAmount] = useState(1);
    const [fromCurr, setFromCurr] = useState('SAR');
    const [toCurr, setToCurr] = useState('TRY');
    const [rates, setRates] = useState(null);
    const [result, setResult] = useState(0);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const res = await fetch('https://api.exchangerate-api.com/v4/latest/SAR');
                const data = await res.json();
                setRates(data.rates);
                localStorage.setItem('rates_v2', JSON.stringify(data.rates));
            } catch (e) {
                setRates(JSON.parse(localStorage.getItem('rates_v2')));
            }
        };
        fetchRates();
    }, []);

    useEffect(() => {
        if (!rates) return;
        // Base is SAR.
        // Convert FROM to SAR, then SAR to TO.
        // Formula: (Amount / Rate[From]) * Rate[To]
        // But API base is SAR. So Rate[SAR] is 1.
        // If From is USD, Rate[USD] is e.g. 0.26 (1 SAR = 0.26 USD) => 1 USD = 1/0.26 SAR.
        // Wait, API gives 1 SAR = X USD.
        // So to convert 1 USD to SAR: 1 / Rate[USD].
        // Then SAR to TRY: * Rate[TRY].
        
        const fromRate = rates[fromCurr];
        const toRate = rates[toCurr];
        
        if (fromRate && toRate) {
            const inSar = amount / fromRate;
            const finalVal = inSar * toRate;
            setResult(finalVal.toFixed(2));
        }
    }, [amount, fromCurr, toCurr, rates]);

    const swap = () => {
        setFromCurr(toCurr);
        setToCurr(fromCurr);
    };

    return (
        <div className="p-6 animate-fade-in space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 relative">
                <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2"><i data-lucide="arrow-left-right" className="w-5 h-5 text-gold-500"></i> Döviz Çevirici</h3>
                
                {/* Giriş */}
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 mb-2">
                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1">Dönüştürülecek Tutar</label>
                    <div className="flex justify-between items-center">
                        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-transparent text-2xl font-bold text-slate-800 dark:text-slate-100 focus:outline-none w-1/2" />
                        <select value={fromCurr} onChange={(e) => setFromCurr(e.target.value)} className="bg-white dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200 p-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 outline-none">
                            <option value="SAR">🇸🇦 SAR</option>
                            <option value="USD">🇺🇸 USD</option>
                            <option value="TRY">🇹🇷 TRY</option>
                            <option value="EUR">🇪🇺 EUR</option>
                        </select>
                    </div>
                </div>

                {/* Swap Butonu */}
                <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 z-10">
                    <button onClick={swap} className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white dark:border-slate-800 hover:scale-110 transition-transform">
                        <i data-lucide="arrow-down-up" className="w-5 h-5"></i>
                    </button>
                </div>

                {/* Sonuç */}
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 mt-2">
                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1">Karşılık</label>
                    <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold text-gold-600 dark:text-gold-400">{result}</div>
                        <select value={toCurr} onChange={(e) => setToCurr(e.target.value)} className="bg-white dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200 p-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 outline-none">
                            <option value="SAR">🇸🇦 SAR</option>
                            <option value="USD">🇺🇸 USD</option>
                            <option value="TRY">🇹🇷 TRY</option>
                            <option value="EUR">🇪🇺 EUR</option>
                        </select>
                    </div>
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
                                {p.image.startsWith('[') ? (
                                    <div className="text-slate-400 text-xs flex flex-col items-center gap-2"><i data-lucide="image" className="w-8 h-8 opacity-50"></i><span>{p.title}</span></div>
                                ) : (
                                    <img src={p.image} className="w-full h-full object-cover" />
                                )}
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

// 7. DÜZELTİLMİŞ PREMIUM KIBLE PUSULASI
const QiblaCompass = () => {
    const [heading, setHeading] = useState(0); // Cihazın kuzeye açısı
    const [qibla, setQibla] = useState(0); // Kabe'nin kuzeye açısı
    const [perm, setPerm] = useState(false);
    const [calibrating, setCalibrating] = useState(false);

    // Kabe'nin cihaza göre açısı
    const calcQibla = (lat, lng) => {
        const K_LAT = 21.422487;
        const K_LNG = 39.826206;
        const pk = K_LAT * Math.PI/180;
        const lk = K_LNG * Math.PI/180;
        const p = lat * Math.PI/180;
        const l = lng * Math.PI/180;
        const y = Math.sin(lk - l);
        const x = Math.cos(p) * Math.tan(pk) - Math.sin(p) * Math.cos(lk - l);
        let q = Math.atan2(y, x) * 180 / Math.PI;
        return (q + 360) % 360;
    };

    const start = () => {
        // 1. Konum Al
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(p => {
                setQibla(calcQibla(p.coords.latitude, p.coords.longitude));
            }, () => {
                alert("Konum alınamadı, varsayılan açı (Türkiye Ort.) kullanılıyor.");
                setQibla(155); 
            });
        }

        // 2. Pusula İzni ve Event Listener
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            // iOS 13+
            DeviceOrientationEvent.requestPermission()
                .then(response => {
                    if (response === 'granted') {
                        setPerm(true);
                        window.addEventListener('deviceorientation', handleOrientation);
                    } else {
                        alert("İzin reddedildi.");
                    }
                })
                .catch(console.error);
        } else {
            // Android / Eski iOS
            setPerm(true);
            window.addEventListener('deviceorientationabsolute', handleOrientation, true); // Android için absolute
            window.addEventListener('deviceorientation', handleOrientation, true); // Fallback
        }
    };

    const handleOrientation = (e) => {
        let compass = 0;
        if (e.webkitCompassHeading) {
            // iOS
            compass = e.webkitCompassHeading;
        } else if (e.alpha !== null) {
            // Android (absolute ise alpha, kuzeyden saat yönünün tersinedir genelde, kontrol gerek)
            // Standart: alpha 0 = Kuzey.
            // Fakat absolute true değilse relative olabilir.
            compass = Math.abs(e.alpha - 360);
        }
        setHeading(compass);
    };

    useEffect(() => {
        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
            window.removeEventListener('deviceorientationabsolute', handleOrientation);
        };
    }, []);

    // İbreyi Döndür: (Qibla - Heading) 
    // Örnek: Kabe 150 derece. Ben 0 (Kuzey)'e bakıyorum. İbre 150 göstermeli.
    // Ben 90 (Doğu)'ya döndüm. İbre 60 göstermeli (sola doğru).
    const needleRot = (qibla - heading + 360) % 360;

    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] p-6 animate-fade-in">
            {!perm ? (
                <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-gold-100 dark:bg-gold-900/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                        <i data-lucide="compass" className="w-12 h-12 text-gold-600"></i>
                    </div>
                    <h3 className="font-bold text-xl text-slate-800 dark:text-slate-200">Kıble Pusulası</h3>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto">Sensörleri etkinleştirmek için butona basın.</p>
                    <button onClick={start} className="px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl shadow-lg">Pusulayı Başlat</button>
                </div>
            ) : (
                <div className="relative">
                    {/* Dış Çerçeve */}
                    <div className="w-72 h-72 rounded-full border-4 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-2xl relative flex items-center justify-center">
                        {/* Pusula Kartı (Dönen Kısım - Kuzeyi Gösterir) */}
                        <div className="w-full h-full absolute inset-0 rounded-full transition-transform duration-300 ease-out" style={{ transform: `rotate(${-heading}deg)` }}>
                            <span className="absolute top-2 left-1/2 -translate-x-1/2 text-red-500 font-bold text-lg">N</span>
                            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-slate-400 font-bold">S</span>
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 font-bold">W</span>
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 font-bold">E</span>
                            {[...Array(12)].map((_, i) => (<div key={i} className="absolute w-0.5 h-2 bg-slate-300 top-0 left-1/2 -translate-x-1/2 origin-bottom h-[50%]" style={{ transform: `rotate(${i * 30}deg)` }}></div>))}
                        </div>

                        {/* Kabe İbresi (Sanal Sabit - Hedefi Gösterir) */}
                        <div className="absolute inset-0 flex items-center justify-center z-10" style={{ transform: `rotate(${needleRot}deg)`, transition: 'transform 0.5s ease-out' }}>
                            <div className="h-28 w-1.5 bg-gold-500 origin-bottom relative -top-14 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.8)]">
                                <i data-lucide="moon" className="absolute -top-6 -left-2.5 w-6 h-6 text-gold-500 fill-gold-500"></i>
                            </div>
                        </div>
                        
                        {/* Merkez */}
                        <div className="w-4 h-4 bg-slate-800 dark:bg-white rounded-full z-20 border-2 border-gold-500"></div>
                    </div>
                    <div className="text-center mt-8">
                        <div className="text-3xl font-mono font-bold text-slate-800 dark:text-gold-400">{Math.round(heading)}°</div>
                        <div className="text-xs text-slate-400">Hedef (Kabe): {Math.round(qibla)}°</div>
                    </div>
                </div>
            )}
        </div>
    );
};

// 8. FADE EFECTLİ ÖNE ÇIKAN KARTLAR
const FeaturedCards = ({ setActiveView }) => {
    const [dist, setDist] = useState({ mk: null, md: null });
    const [activeIndex, setActiveIndex] = useState(0);
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        if (navigator.geolocation) navigator.geolocation.getCurrentPosition(p => {
            const l = p.coords.latitude, g = p.coords.longitude;
            setDist({ mk: calculateDistance(l, g, 21.4225, 39.8262), md: calculateDistance(l, g, 24.4672, 39.6109) });
        });
    }, []);

    const cards = [
        { id: 'c1', title: 'Yolculuk Rotası', sub: 'Cilvegözü ➔ Mekke', icon: 'map', bg: 'bg-gradient-to-br from-slate-900 to-slate-800', text: 'text-white', act: () => setActiveView('route') },
        { id: 'c2', title: 'Mesafe Durumu', sub: dist.mk ? `Mekke'ye ${dist.mk} km` : 'Konum Bekleniyor...', icon: 'navigation', bg: 'bg-gradient-to-br from-emerald-800 to-emerald-900', text: 'text-emerald-100', act: () => setActiveView('places') }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setOpacity(0);
            setTimeout(() => {
                setActiveIndex((prev) => (prev + 1) % cards.length);
                setOpacity(1);
            }, 500); // 500ms fade out süresi
        }, 5000); // 5 saniye bekleme
        return () => clearInterval(interval);
    }, [cards.length]);

    const c = cards[activeIndex];

    return (
        <div className="col-span-2 mb-2 h-36 relative">
             <div 
                onClick={c.act} 
                className={`absolute inset-0 rounded-2xl p-5 shadow-xl cursor-pointer border border-white/10 flex flex-col justify-between transition-opacity duration-500 ${c.bg}`}
                style={{ opacity: opacity }}
            >
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] bg-white/10 ${c.text} font-bold uppercase tracking-wider`}>Öne Çıkan</span>
                    </div>
                    <h2 className={`text-2xl font-serif font-bold ${c.text} mb-0.5`}>{c.title}</h2>
                    <p className={`${c.text} text-xs opacity-70`}>{c.sub}</p>
                </div>
                <i data-lucide={c.icon} className={`absolute -right-2 -bottom-4 w-24 h-24 ${c.text} opacity-10 rotate-12`}></i>
                <div className="absolute bottom-4 right-4 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white">
                    <i data-lucide="arrow-right" className="w-4 h-4"></i>
                </div>
            </div>
            
            {/* Dots Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                {cards.map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === activeIndex ? 'bg-white' : 'bg-white/30'}`}></div>
                ))}
            </div>
        </div>
    );
};

// 9. DİĞER KÜÇÜK BİLEŞENLER (Aynen korundu)
const AnnouncementBar = () => {
    const [idx, setIdx] = useState(0);
    const [fade, setFade] = useState(true);
    useEffect(() => { 
        const i = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setIdx(p => (p + 1) % ANNOUNCEMENTS.length);
                setFade(true);
            }, 500);
        }, 4000); 
        return () => clearInterval(i); 
    }, []);
    return (
        <div className="col-span-2 my-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 h-12 flex items-center pr-2 relative overflow-hidden">
            <div className="h-full bg-gold-500 w-12 flex items-center justify-center shrink-0 relative z-10"><i data-lucide="megaphone" className="w-5 h-5 text-white animate-pulse-gold"></i></div>
            <div className="w-0 h-0 border-t-[48px] border-t-gold-500 border-r-[20px] border-r-transparent absolute left-0 top-0 z-0"></div>
            <div className={`flex-1 ml-4 text-sm font-medium text-slate-700 dark:text-slate-200 truncate transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>{ANNOUNCEMENTS[idx]}</div>
        </div>
    );
};

const MenuCard = ({ icon, label, subLabel, colorClass, onClick, featured }) => (
    <button onClick={onClick} className={`group relative flex flex-col items-start p-5 rounded-2xl bg-white dark:bg-slate-800 transition-all hover:scale-[1.02] border border-slate-100 dark:border-slate-700 overflow-hidden ${featured ? 'col-span-2' : ''}`}>
        <div className={`p-3 rounded-xl mb-3 ${colorClass} bg-opacity-10 dark:bg-opacity-20`}><i data-lucide={icon} className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`}></i></div>
        <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{label}</span>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{subLabel}</span>
        <i data-lucide={icon} className="absolute -right-4 -bottom-4 w-20 h-20 opacity-[0.03] dark:opacity-[0.05] text-current transform rotate-12 pointer-events-none"></i>
    </button>
);

const InstallBanner = ({ onInstall, onClose, show }) => {
    if (!show) return null;
    return (
        <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 animate-fade-in-up">
            <div className="bg-slate-900 dark:bg-slate-800 text-white p-4 rounded-2xl shadow-2xl border-t-4 border-gold-500 flex flex-col gap-3 relative">
                <button onClick={onClose} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white bg-white/10 rounded-full"><i data-lucide="x" className="w-4 h-4"></i></button>
                <div className="flex items-start gap-3 pr-6">
                    <div className="bg-gold-500 p-2.5 rounded-xl text-slate-900 shrink-0 shadow-lg shadow-gold-500/20"><i data-lucide="download" className="w-6 h-6"></i></div>
                    <div><h4 className="font-bold text-gold-400">Uygulamayı Yükle</h4><p className="text-xs text-slate-300 mt-1 leading-relaxed opacity-90">Çevrimdışı kullanım için rehberi telefonunuza indirin.</p></div>
                </div>
                <button onClick={onInstall} className="w-full bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 active:scale-95 text-slate-900 font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"><i data-lucide="smartphone" className="w-5 h-5"></i>Ücretsiz Yükle</button>
            </div>
        </div>
    );
};

const RouteVisualizer = () => {
    const [vis, setVis] = useState(0);
    useEffect(() => { const i = setInterval(() => setVis(c => c <= ROUTE_STOPS.length ? c + 1 : c), 500); return () => clearInterval(i); }, []);
    return (
        <div className="p-6 pb-20 animate-fade-in">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white mb-8 shadow-xl relative overflow-hidden border border-gold-500/20">
                <div className="relative z-10"><h3 className="font-serif text-2xl font-bold text-gold-400 mb-1">Mübarek Yolculuk</h3><p className="text-slate-400 text-sm">Türkiye - Mekke</p></div>
                <i data-lucide="map" className="absolute right-4 bottom-4 w-24 h-24 text-white opacity-5"></i>
            </div>
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

const UmrahGuideDetail = () => {
    const [active, setActive] = useState(null);
    const steps = [
        {t:"İhram ve Niyet", d:"Mikat'ta girilir, 2 rekat namaz kılınır.", icon:"shirt", text:"Allah'ım senin rızan için umre yapmak istiyorum."},
        {t:"Tavaf", d:"Kabe sola alınarak 7 şavt dönülür.", icon:"repeat", text:"Bismillahi Allahu Ekber."},
        {t:"Sa'y", d:"Safa ve Merve arasında 4 gidiş 3 geliş.", icon:"footprints", text:"İnnes-safa vel-mervete min şeairillah..."},
        {t:"Tıraş ve Çıkış", d:"Saçlar kısaltılır, ihramdan çıkılır.", icon:"scissors", text:"Elhamdülillah."}
    ];
    return (
        <div className="p-4 space-y-3 pb-24">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800 mb-4">
                <h3 className="font-bold text-emerald-800 dark:text-emerald-400">Umre Rehberi</h3><p className="text-xs text-emerald-600">Adım adım ibadet rehberi</p>
            </div>
            {steps.map((s,i)=>(
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                    <button onClick={() => setActive(active===i?null:i)} className="w-full flex items-center justify-between p-4 text-left">
                        <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center"><i data-lucide={s.icon} className="w-4 h-4 text-slate-500"></i></div><span className="font-bold text-sm text-slate-700 dark:text-slate-200">{i+1}. {s.t}</span></div>
                        <i data-lucide="chevron-down" className={`w-4 h-4 transition-transform ${active===i?'rotate-180':''}`}></i>
                    </button>
                    {active===i && <div className="px-4 pb-4 pl-[3.25rem]"><p className="text-sm text-slate-600 mb-2">{s.d}</p><div className="p-2 bg-amber-50 rounded border-l-2 border-amber-400 text-xs italic text-slate-600">"{s.text}"</div></div>}
                </div>
            ))}
        </div>
    );
};

const About = () => (
    <div className="p-4 pb-24 animate-fade-in space-y-6">
        <div className="relative bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-700">
            <div className="h-32 bg-gradient-to-r from-emerald-600 to-emerald-900 relative">
                 <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
                 <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 bg-gold-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg overflow-hidden">
                    <img src={DEVELOPER_PHOTO_URL} alt="SG" className="w-full h-full object-cover" />
                 </div>
            </div>
            <div className="pt-12 pb-6 px-6 text-center">
                <h2 className="text-2xl font-serif font-bold text-slate-800 dark:text-white">Sami G.</h2>
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-gold-50 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400 text-xs font-bold uppercase tracking-wider">Uygulama Geliştiricisi</span>
                <div className="mt-6 text-left space-y-4">
                     <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <p className="font-serif text-lg text-emerald-800 dark:text-emerald-400 mb-2 text-center">﷽</p>
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-serif text-justify">
                            <span className="font-bold block mb-2 text-slate-800 dark:text-slate-200 text-center">Esselamü Aleyküm ve Rahmetullah,</span>
                            Kıymetli Allah'ın misafirleri; bu çalışma, Haremeyn-i Şerifeyn'e vuslat yolculuğunda sizlere rehberlik etmek, bu meşakkatli ama kutlu seferde yükünüzü bir nebze olsun hafifletmek gayesiyle "Sadaka-i Cariye" niyetiyle hazırlanmıştır.
                        </p>
                     </div>
                </div>
            </div>
        </div>
    </div>
);

const EmergencyContacts = () => (
    <div className="p-4 space-y-3 pb-24">
        <h3 className="font-bold text-lg px-2">Önemli Numaralar</h3>
        {EMERGENCY_NUMBERS.map((e,i)=>(
            <a href={`tel:${e.number}`} key={i} className="flex items-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm active:scale-[0.98]">
                <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center mr-4"><i data-lucide={e.icon} className="w-5 h-5"></i></div>
                <div className="flex-1"><h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{e.title}</h4><span className="text-xs text-slate-500">{e.number}</span></div>
                <div className="bg-green-50 p-2 rounded-full text-green-600"><i data-lucide="phone" className="w-4 h-4"></i></div>
            </a>
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
        document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg');
        document.documentElement.classList.add(settings.fontSize === 'small' ? 'text-sm' : settings.fontSize === 'large' ? 'text-lg' : 'text-base');
    }, [settings]);

    useEffect(() => {
        const h = (e) => { e.preventDefault(); setInstallPrompt(e); setShowBanner(true); }; // Always show on prompt
        window.addEventListener('beforeinstallprompt', h);
        // Force show for testing if not installed, mimicking "first launch" behavior more aggressively
        const timer = setTimeout(() => { if(!localStorage.getItem('dismiss_v2')) setShowBanner(true); }, 3000);
        return () => window.removeEventListener('beforeinstallprompt', h);
    }, []);

    const handleInstall = () => {
        if(!installPrompt) { alert("Gerçek cihazda yükleme penceresi açılır."); setShowBanner(false); localStorage.setItem('dismiss_v2', 'true'); return; }
        installPrompt.prompt();
        installPrompt.userChoice.then(r => { if(r.outcome === 'accepted') { setShowBanner(false); localStorage.setItem('dismiss_v2', 'true'); } setInstallPrompt(null); });
    };

    const updateSettings = (k, v) => setSettings(p => ({...p, [k]: v}));

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
            {view !== 'dashboard' && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"><button onClick={() => setView('dashboard')} className="bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-md text-gold-400 px-6 py-3 rounded-full shadow-2xl border border-gold-500/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"><i data-lucide="layout-grid" className="w-5 h-5"></i><span className="font-bold text-sm">Ana Menü</span></button></div>}
            <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} settings={settings} updateSettings={updateSettings} installPrompt={installPrompt} onInstall={handleInstall} />
            <InstallBanner show={showBanner} onInstall={handleInstall} onClose={() => {setShowBanner(false); localStorage.setItem('dismiss_v2', 'true');}} />
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
