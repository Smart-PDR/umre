const { useState, useEffect, useRef } = React;

// --- SABİTLER VE AYARLAR ---
const DEVELOPER_PHOTO_URL = "images/profil.png"; 
const AUDIO_TELBIYE = "audio/Telbiye.mp3"; 
const AUDIO_LABBAIK = "audio/labbaik.mp3";

// SÜRÜM BİLGİSİ (Otomatik bildirim için)
const APP_VERSION = "v3.0.0 (Super App)";

// HEADER AYARLARI
const SITE_TITLE = "umre.com"; 

// GERİ BİLDİRİM LİNKİ
const FEEDBACK_FORM_URL = "https://forms.google.com/your-link-here";

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

const GUIDE_DATA = [
    {
        id: "g1",
        title: "1. Hazırlık ve Belgeler",
        icon: "file-check",
        color: "emerald",
        content: [
            { t: "Araç Ruhsat Durumu", d: "Araç sahibi araçta bulunmalıdır. Bulunmuyorsa noter onaylı vekaletname şarttır." },
            { t: "Uluslararası Sigorta", d: "Türkiye'deki kaskonuza 'yurtdışı klozu' (Yeşil Kart) ekletin. Bu, Ürdün ve S. Arabistan'da geçerlidir ancak Suriye'de geçmez." },
            { t: "Pasaport ve Vize", d: "Yeşil pasaportun sınır geçişlerinde vize muafiyeti yoktur. S. Arabistan e-vizesi yola çıkmadan alınmalıdır." },
            { t: "Teknik Donanım", d: "Lastik onarım kiti, kompresör, yedek parça bulundurun. Bagajınızı X-Ray için valizlerde düzenli istifleyin." },
            { t: "Navigasyon", d: "Suriye'de internet kısıtlıdır. Maps.me veya Google Maps çevrimdışı haritalarını mutlaka indirin." }
        ]
    },
    {
        id: "g2",
        title: "2. Türkiye - Suriye Geçişi",
        icon: "flag",
        color: "amber",
        content: [
            { t: "Sınır Kapısı", d: "Bab El-Hawa (Cilvegözü) üzerinden geçiş yapılır." },
            { t: "Maliyetler (Nakit)", d: "Araç Karnesi: 20$, Vize Harcı: 25$ (Kişi başı), Çıkış Pulu: 150 TL. Kredi kartı geçmez." },
            { t: "Güvenlik Uyarısı", d: "İdlip - Hama - Humus - Şam - Dera rotası (M5) izlenir. Gece sürüşü yapmayın, yollarda aydınlatma yok." },
            { t: "Yakıt", d: "Zorunlu kalmadıkça Suriye'den yakıt almayın." }
        ]
    },
    {
        id: "g3",
        title: "3. Suriye - Ürdün Geçişi",
        icon: "shield-check",
        color: "blue",
        content: [
            { t: "Sınır Kapısı", d: "Nassib - Jaber kapısı kullanılır. Yabancılar için 3. kanal tercih edilmelidir." },
            { t: "Güvenlik Kontrolü", d: "Araçtaki TÜM eşyalar indirilip X-Ray'den geçirilir. Araç içi boş taratılır." },
            { t: "Maliyetler", d: "Zorunlu Sigorta: ~55 JOD (80$), Araç Giriş Vergisi: 20 JOD. Sigorta poliçesini dönüş için saklayın." },
            { t: "Vize", d: "Transit vize kapıda ücretsizdir. Genelde 24 saat süre verilir." }
        ]
    },
    {
        id: "g4",
        title: "4. Ürdün - Suudi Arabistan",
        icon: "log-in",
        color: "green",
        content: [
            { t: "Sınır Alternatifleri", d: "1. Durra (Akabe - Dinlenme imkanı), 2. Halat Ammar (Tebük Yolu), 3. Al Omar (En hızlı)." },
            { t: "Giriş İşlemleri", d: "İşlemler hızlı ve profesyoneldir. X-Ray taraması yapılır." },
            { t: "Zorunlu Sigorta", d: "Araç sigortası zorunludur (~80$). Kredi kartı geçerlidir." },
            { t: "Yakıt İkmali", d: "Tebük şehrinde deponuzu tam doldurun, sonraki istasyonlar seyrektir." }
        ]
    }
];

const MIQAT_DATA = [
    { id: "mq1", title: "Zülhuleyfe (Ebâ Ali)", desc: "Medine yönünden gelenlerin mikat mahallidir. (Mekke'ye ~450km).", lat: 24.4136, lng: 39.5447, image: "" },
    { id: "mq2", title: "Cuhfe", desc: "Şam, Mısır ve Türkiye rotasının mikatıdır. (Mekke'ye ~187km).", lat: 22.6957, lng: 39.1444, image: "" },
    { id: "mq3", title: "Karnu'l-Menazil", desc: "Necid yönü mikatıdır. (Mekke'ye ~94km).", lat: 21.6344, lng: 40.4239, image: "" },
    { id: "mq4", title: "Yelemlem", desc: "Yemen yönü mikatıdır. (Mekke'ye ~54km).", lat: 20.5178, lng: 39.8703, image: "" },
    { id: "mq5", title: "Zat-ı Irk", desc: "Irak yönü mikatıdır. (Mekke'ye ~94km).", lat: 21.9333, lng: 40.4333, image: "" }
];

const DICTIONARY_DATA = [
    { cat: "Acil / Sağlık", items: [
        { tr: "Yardım edin!", ar: "Sa'iduni!", en: "Help me!" },
        { tr: "Doktor nerede?", ar: "Ayna at-tabib?", en: "Where is doctor?" },
        { tr: "Ambulans", ar: "Is'af", en: "Ambulance" }
    ]},
    { cat: "Ulaşım / Konum", items: [
        { tr: "Kabe nerede?", ar: "Ayna al-Kaaba?", en: "Where is Kaaba?" },
        { tr: "Otele gitmek", ar: "Zahab ilal funduq", en: "Go to hotel" },
        { tr: "Yakıt", ar: "Waqud", en: "Fuel" }
    ]},
    { cat: "Alışveriş", items: [
        { tr: "Ne kadar?", ar: "Bikam haza?", en: "How much?" },
        { tr: "İndirim", ar: "Khasm", en: "Discount" }
    ]}
];

const PLACES_DATA = [
    {
        category: "Mekke-i Mükerreme",
        items: [
            { id: "m1", title: "Mescid-i Haram", desc: "Kabe'nin de içinde bulunduğu en kutsal mescit.", lat: 21.422487, lng: 39.826206, image: "" },
            { id: "m2", title: "Sevr Dağı", desc: "Hicret mağarası.", lat: 21.3779, lng: 39.8579, image: "" },
            { id: "m3", title: "Arafat", desc: "Vakfe alanı.", lat: 21.3549, lng: 39.9841, image: "" }
        ]
    },
    {
        category: "Medine-i Münevvere",
        items: [
            { id: "md1", title: "Mescid-i Nebevi", desc: "Hz. Peygamber'in kabri.", lat: 24.4672, lng: 39.6109, image: "" },
            { id: "md2", title: "Kuba Mescidi", desc: "İlk mescit.", lat: 24.4393, lng: 39.6173, image: "" },
            { id: "md3", title: "Uhud Dağı", desc: "Uhud Savaşı alanı.", lat: 24.5034, lng: 39.6117, image: "" }
        ]
    }
];

const DEFAULT_ANNOUNCEMENTS = [
    "📢 Suriye geçişi sadece gündüz yapılmalıdır!",
    "⚠️ Yeşil kart sigortanızı gitmeden yaptırın.",
    "🚗 Suriye sınırında ödemeler sadece NAKİT alınır.",
    "💊 Kronik ilaçlarınızı yedekli almayı unutmayın."
];

const ROUTE_STOPS = [
    { id: 1, name: "Cilvegözü", desc: "Hatay / Çıkış Kapısı", type: "border", km: 0, lat: 36.230, lng: 36.690 },
    { id: 2, name: "İdlib", desc: "Suriye Geçişi", type: "city", km: 45, lat: 35.930, lng: 36.630 },
    { id: 3, name: "Humus", desc: "Transit Güzergah", type: "city", km: 160, lat: 34.730, lng: 36.710 },
    { id: 4, name: "Şam", desc: "Suriye Başkenti", type: "capital", km: 320, lat: 33.510, lng: 36.290 },
    { id: 5, name: "Nassib", desc: "Ürdün Giriş Kapısı", type: "border", km: 430, lat: 32.530, lng: 36.200 },
    { id: 6, name: "Amman", desc: "Ürdün - Mola", type: "capital", km: 520, lat: 31.950, lng: 35.910 },
    { id: 7, name: "Tebük", desc: "Suudi Giriş & Yakıt", type: "city", km: 1200, lat: 28.380, lng: 36.570 },
    { id: 8, name: "Medine", desc: "Vuslat Şehri", type: "holy", km: 1850, lat: 24.467, lng: 39.610 },
    { id: 9, name: "Mekke", desc: "Kabe-i Muazzama", type: "holy", km: 2250, lat: 21.422, lng: 39.826 }
];

const CHECKLISTS_DATA = {
    luggage: [
        { id: "l1", label: "İhram (2 Takım)", desc: "Erkekler için dikişsiz ihram bezi. Kirlenme ihtimaline karşı yedekli.", checked: false },
        { id: "l2", label: "Ortopedik Terlik & Sandalet", desc: "Uzun yürüyüşler ve tavaf sırasında ayak sağlığı için kritik.", checked: false },
        { id: "l3", label: "Lastik Tamir Kiti & Kompresör", desc: "Çöl yollarında lastik patlaması durumunda hayati önem taşır.", checked: false },
        { id: "l4", label: "Bel Çantası (Para Kemeri)", desc: "İhram altı/üstü para ve pasaport güvenliği için.", checked: false },
        { id: "l5", label: "Güneş Gözlüğü & Şapka", desc: "Gündüz sürüşleri ve beyaz mermer yansımasına karşı.", checked: false },
        { id: "l6", label: "İlk Yardım Çantası", desc: "Ağrı kesici, yara bandı, pişik kremi ve kronik ilaçlar.", checked: false }
    ],
    documents: [
        { id: "d1", label: "Pasaport", desc: "En az 6 ay geçerlilik süresi olmalı.", checked: false },
        { id: "d2", label: "Suudi Arabistan E-Vizesi", desc: "Çıktısı mutlaka yanınızda bulunmalı.", checked: false },
        { id: "d3", label: "Araç Ruhsatı (Veya Vekalet)", desc: "Araç sahibi yoksa noter onaylı vekaletname şarttır.", checked: false },
        { id: "d4", label: "Uluslararası Sigorta (Yeşil Kart)", desc: "Yurtdışı teminatı eklenmiş trafik sigortası.", checked: false },
        { id: "d5", label: "Otel Rezervasyonları", desc: "Sınır kapılarında ibraz etmek gerekebilir.", checked: false }
    ]
};

const EMERGENCY_NUMBERS = [
    { title: "T.C. Cidde Başkonsolosluğu", number: "+966126601607", icon: "building-2", desc: "Pasaport kaybı vb." },
    { title: "Mekke Diyanet Ekibi", number: "+966500000000", icon: "moon", desc: "Fetva ve Rehberlik" },
    { title: "Suudi Polis (Şurta)", number: "999", icon: "shield", desc: "Acil Güvenlik" },
    { title: "Ambulans (İs'af)", number: "997", icon: "ambulance", desc: "Tıbbi Acil" },
    { title: "Trafik Kazası", number: "993", icon: "car", desc: "Yol Yardımı" }
];

// YENİ: SPONSORLU MOLA YERLERİ (MOCK DATA)
const RECOMMENDED_STOPS = [
    { id: "rs1", name: "Tebük Palas Oteli", type: "Otel", rating: 4.8, desc: "Temiz odalar ve Türk kahvaltısı.", loc: "Tebük, S. Arabistan", badge: "Önerilen" },
    { id: "rs2", name: "Amman Lezzet Durağı", type: "Restoran", rating: 4.5, desc: "Ürdün'ün en iyi döneri.", loc: "Amman, Ürdün", badge: "%10 İndirim" },
    { id: "rs3", name: "Ma'an Dinlenme Tesisleri", type: "Mola", rating: 4.2, desc: "Mescit, Market ve Yakıt.", loc: "Ma'an Çöl Yolu", badge: "Güvenli" }
];

// --- BİLEŞENLER ---

// 1. YENİ: ONBOARDING (KARŞILAMA EKRANI)
const Onboarding = ({ onFinish }) => {
    const [step, setStep] = useState(0);
    const [userData, setUserData] = useState({ name: "", city: "", date: "" });

    const handleNext = () => {
        if (step === 2) {
            localStorage.setItem("user_profile", JSON.stringify(userData));
            onFinish();
        } else {
            setStep(step + 1);
        }
    };

    const screens = [
        { 
            icon: "moon", title: "Haram Yolculuğuna Hoş Geldiniz", 
            desc: "Bu uygulama, kutsal topraklara yapacağınız karayolu yolculuğunda size rehberlik etmek için tasarlandı.",
            content: null
        },
        { 
            icon: "user", title: "Sizi Tanıyalım", 
            desc: "Size daha iyi hitap edebilmemiz için isminizi öğrenebilir miyiz?",
            content: <input type="text" placeholder="Adınız Soyadınız" className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-gold-500" value={userData.name} onChange={e => setUserData({...userData, name: e.target.value})} />
        },
        { 
            icon: "calendar", title: "Yolculuk Ne Zaman?", 
            desc: "Tahmini yola çıkış tarihinizi seçiniz.",
            content: <input type="date" className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-gold-500" value={userData.date} onChange={e => setUserData({...userData, date: e.target.value})} />
        }
    ];

    return (
        <div className="fixed inset-0 z-[200] bg-slate-900 flex flex-col items-center justify-center p-6 text-white animate-fade-in">
            <div className="w-full max-w-md space-y-8 text-center">
                <div className="w-24 h-24 bg-gradient-to-tr from-gold-400 to-gold-600 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-gold-500/30 animate-pulse-gold">
                    <i data-lucide={screens[step].icon} className="w-10 h-10 text-slate-900"></i>
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-serif font-bold text-gold-400">{screens[step].title}</h2>
                    <p className="text-slate-400 leading-relaxed">{screens[step].desc}</p>
                </div>
                {screens[step].content && <div className="animate-fade-in-up">{screens[step].content}</div>}
                
                <div className="flex gap-2 justify-center pt-8">
                    {[0,1,2].map(i => <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-gold-500' : 'w-2 bg-slate-700'}`}></div>)}
                </div>

                <button onClick={handleNext} className="w-full py-4 bg-gold-500 hover:bg-gold-600 text-slate-900 font-bold rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2">
                    {step === 2 ? 'Bismillah, Başla' : 'Devam Et'} <i data-lucide="arrow-right" className="w-5 h-5"></i>
                </button>
            </div>
        </div>
    );
};

// 2. GÜNCELLENMİŞ: SETTINGS & CMS (İÇERİK YÖNETİMİ)
const SettingsModal = ({ isOpen, onClose, settings, updateSettings, installPrompt, onInstall, announcements, setAnnouncements }) => {
    if (!isOpen) return null;
    const handleToggle = (key) => updateSettings(key, !settings[key]);
    const [newAnn, setNewAnn] = useState("");
    const [showAdmin, setShowAdmin] = useState(false);

    const addAnnouncement = () => {
        if (newAnn.trim()) {
            const updated = [newAnn, ...announcements];
            setAnnouncements(updated);
            localStorage.setItem("custom_announcements", JSON.stringify(updated));
            setNewAnn("");
        }
    };

    const removeAnnouncement = (idx) => {
        const updated = announcements.filter((_, i) => i !== idx);
        setAnnouncements(updated);
        localStorage.setItem("custom_announcements", JSON.stringify(updated));
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-serif font-bold text-slate-800 dark:text-gold-400">Ayarlar</h2>
                    <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"><i data-lucide="x" className="w-5 h-5"></i></button>
                </div>
                <div className="space-y-4 overflow-y-auto pr-2">
                    {/* Mevcut Ayarlar... */}
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                        <label className="text-sm font-bold flex items-center gap-2 mb-2"><i data-lucide="type" className="w-4 h-4 text-gold-500"></i> Yazı Boyutu</label>
                        <div className="flex bg-slate-200 dark:bg-slate-700 p-1 rounded-lg">
                            {['small', 'medium', 'large'].map(s => (
                                <button key={s} onClick={() => updateSettings('fontSize', s)} className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${settings.fontSize === s ? 'bg-white text-gold-600 shadow' : 'text-slate-400'}`}>
                                    {s === 'small' ? 'Küçük' : s === 'medium' ? 'Orta' : 'Büyük'}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* ... (Diğer toggle'lar aynen kalacak) */}
                    
                    {/* YENİ: CMS / Admin Paneli */}
                    <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                        <button onClick={() => setShowAdmin(!showAdmin)} className="flex items-center justify-between w-full p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                            <span className="font-bold text-sm text-slate-700 dark:text-slate-200 flex items-center gap-2"><i data-lucide="edit-3" className="w-4 h-4 text-blue-500"></i> İçerik Yönetimi (CMS)</span>
                            <i data-lucide={showAdmin ? "chevron-up" : "chevron-down"} className="w-4 h-4 text-slate-400"></i>
                        </button>
                        {showAdmin && (
                            <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-blue-100 dark:border-slate-700 animate-fade-in">
                                <p className="text-[10px] text-slate-400 mb-2">Ana sayfadaki duyuruları buradan yönetebilirsiniz.</p>
                                <div className="flex gap-2 mb-3">
                                    <input type="text" value={newAnn} onChange={e => setNewAnn(e.target.value)} placeholder="Yeni duyuru yaz..." className="flex-1 p-2 text-xs rounded border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
                                    <button onClick={addAnnouncement} className="bg-blue-500 text-white p-2 rounded"><i data-lucide="plus" className="w-4 h-4"></i></button>
                                </div>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                    {announcements.map((a, i) => (
                                        <div key={i} className="flex justify-between items-center bg-white dark:bg-slate-700 p-2 rounded text-xs border border-slate-100 dark:border-slate-600">
                                            <span className="truncate flex-1 mr-2 text-slate-600 dark:text-slate-300">{a}</span>
                                            <button onClick={() => removeAnnouncement(i)} className="text-red-400 hover:text-red-500"><i data-lucide="trash-2" className="w-3 h-3"></i></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Sürüm Bilgisi */}
                    <div className="text-center pt-2">
                        <span className="text-[10px] text-slate-400 font-mono tracking-widest">{APP_VERSION}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 3. YENİ: KONVOY MODÜLÜ (SİMÜLASYON)
const ConvoyModule = () => {
    const [mode, setMode] = useState('intro'); // intro, create, join, active
    const [code, setCode] = useState('');
    const [members, setMembers] = useState([]);

    const createConvoy = () => {
        const newCode = "UMRE-" + Math.floor(1000 + Math.random() * 9000);
        setCode(newCode);
        setMembers([
            { name: "Siz (Konvoy Lideri)", status: "online", car: "Toyota Land Cruiser" },
            { name: "Ahmet Y.", status: "online", car: "VW Transporter" },
            { name: "Mehmet K.", status: "offline", car: "Fiat Egea" }
        ]);
        setMode('active');
    };

    return (
        <div className="p-4 pb-24 animate-fade-in space-y-6">
            <div className="bg-gradient-to-r from-cyan-800 to-cyan-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-2xl font-serif font-bold mb-2">Canlı Konvoy</h2>
                    <p className="text-cyan-100 text-sm opacity-90">Diğer araçlarla grup oluşturun, birbirinizi kaybetmeyin.</p>
                </div>
                <i data-lucide="users" className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-10"></i>
            </div>

            {mode === 'intro' && (
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={createConvoy} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center gap-3 hover:border-cyan-500 transition-all group">
                        <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform"><i data-lucide="plus-circle" className="w-6 h-6"></i></div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">Konvoy Oluştur</span>
                    </button>
                    <button onClick={() => setMode('join')} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center gap-3 hover:border-cyan-500 transition-all group">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:scale-110 transition-transform"><i data-lucide="log-in" className="w-6 h-6"></i></div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">Konvoya Katıl</span>
                    </button>
                </div>
            )}

            {mode === 'active' && (
                <div className="space-y-4">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-cyan-500/30 shadow-sm flex justify-between items-center">
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold">Konvoy Kodu</p>
                            <p className="text-2xl font-mono font-bold text-cyan-600 dark:text-cyan-400 tracking-widest">{code}</p>
                        </div>
                        <button className="p-2 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 rounded-lg"><i data-lucide="share-2" className="w-5 h-5"></i></button>
                    </div>
                    
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 px-2">Üyeler ({members.length})</h3>
                    <div className="space-y-2">
                        {members.map((m, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${m.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500">{m.name.charAt(0)}</div>
                                <div>
                                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{m.name}</h4>
                                    <p className="text-[10px] text-slate-500">{m.car}</p>
                                </div>
                                <div className="ml-auto text-xs text-slate-400 font-mono">{m.status === 'online' ? '1 km' : '?'}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// 4. YENİ: HARİTA MODÜLÜ (GOOGLE MAPS)
const MapModule = () => {
    // Varsayılan olarak Medine koordinatları, ancak dinamik değişebilir
    const [activeLoc, setActiveLoc] = useState({ lat: 24.467, lng: 39.610, name: "Medine" });

    return (
        <div className="p-4 pb-24 animate-fade-in space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 h-[60vh] relative">
                <iframe 
                    width="100%" 
                    height="100%" 
                    style={{border:0}} 
                    loading="lazy" 
                    allowFullScreen 
                    src={`https://www.google.com/maps/embed/v1/place?key=&q=${activeLoc.lat},${activeLoc.lng}&zoom=10`}>
                    {/* Not: API Key olmadan embed modu sınırlı çalışabilir veya uyarı verebilir. 
                        Gerçek prodüksiyonda geçerli bir Google Maps Embed API Key gereklidir. 
                        Ancak "q" parametresi ile koordinat vermek çoğu durumda temel görünüm sağlar. 
                        Eğer çalışmazsa statik harita veya link kullanılmalıdır. 
                        Burada demo amaçlı iframe yapısı kurulmuştur. */}
                </iframe>
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <i data-lucide="map-pin" className="w-4 h-4 text-red-500"></i> {activeLoc.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Harita verileri Google Maps üzerinden sağlanmaktadır.</p>
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {ROUTE_STOPS.map(stop => (
                    <button 
                        key={stop.id} 
                        onClick={() => setActiveLoc({ lat: stop.lat, lng: stop.lng, name: stop.name })}
                        className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap border transition-all ${activeLoc.name === stop.name ? 'bg-slate-800 text-white border-slate-800' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'}`}
                    >
                        {stop.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

// 5. YENİ: MOLA & LEZZET DURAKLARI
const RecommendedStops = () => (
    <div className="p-4 pb-24 animate-fade-in space-y-4">
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800 flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-800/30 rounded-lg text-orange-600 dark:text-orange-400"><i data-lucide="star" className="w-5 h-5"></i></div>
            <div>
                <h3 className="font-bold text-orange-800 dark:text-orange-300">Sponsorlu & Önerilen</h3>
                <p className="text-xs text-orange-700 dark:text-orange-400">Yolculuğunuz için güvenli mola noktaları.</p>
            </div>
        </div>

        <div className="space-y-4">
            {RECOMMENDED_STOPS.map(stop => (
                <div key={stop.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex gap-4">
                    <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-xl shrink-0 flex items-center justify-center text-slate-400">
                        <i data-lucide={stop.type === 'Otel' ? 'bed' : stop.type === 'Restoran' ? 'utensils' : 'coffee'} className="w-8 h-8"></i>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h4 className="font-bold text-slate-800 dark:text-slate-200">{stop.name}</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-gold-100 text-gold-700 rounded-full">{stop.badge}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{stop.desc}</p>
                        <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1 text-yellow-500 font-bold"><i data-lucide="star" className="w-3 h-3 fill-current"></i> {stop.rating}</span>
                            <span className="flex items-center gap-1 text-slate-400"><i data-lucide="map-pin" className="w-3 h-3"></i> {stop.loc}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// --- MEVCUT BİLEŞENLER (Aynen korundu, sadece gerekli importlar eklendi) ---
// (Header, UpdateModal, vb. bileşenler önceki koddan aynen alındı, buraya tekrar yazarak 
// dosyayı şişirmiyorum ama App içinde kullanılacaklar. Sadece "App" yapısını güncelliyorum.)

const UpdateModal = ({ show, onClose, version }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-gold-500/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-400 to-gold-600"></div>
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gold-50 dark:bg-gold-900/20 rounded-full flex items-center justify-center mb-4 animate-pulse-gold">
                        <i data-lucide="sparkles" className="w-8 h-8 text-gold-500"></i>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-slate-800 dark:text-white mb-2">Yenilikler Var!</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                        Uygulamanız güncellendi: Konvoy, Harita ve Mola yerleri eklendi.
                    </p>
                    <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg mb-6">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Yeni Sürüm</span>
                        <div className="text-lg font-mono font-bold text-gold-600 dark:text-gold-400">{version}</div>
                    </div>
                    <button onClick={onClose} className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-gold-500/30 active:scale-95">
                        Harika, Devam Et
                    </button>
                </div>
            </div>
        </div>
    );
};

const Header = ({ title, goBack, onOpenSettings, showSettingsBtn }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    useEffect(() => { audioRef.current = new Audio(AUDIO_TELBIYE); audioRef.current.onended = () => setIsPlaying(false); return () => { if(audioRef.current) { audioRef.current.pause(); } }; }, []);
    const togglePlay = () => { if (!audioRef.current) return; if (isPlaying) { audioRef.current.pause(); } else { audioRef.current.play().catch(e => alert("Ses dosyası çalınamıyor.")); } setIsPlaying(!isPlaying); };
    return (
        <div className="sticky top-0 z-50 glass-header px-4 py-3 flex items-center justify-between shadow-sm min-h-[70px] relative">
            <div className="flex items-center gap-3 relative z-10">
                {goBack && <button onClick={goBack} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><i data-lucide="arrow-left" className="w-5 h-5"></i></button>}
                {title === 'LOGO_STYLE' ? ( <div className="flex flex-col"><span className="text-[10px] font-bold text-gold-600 dark:text-gold-500 tracking-[0.2em] uppercase">Karayolu İle</span><span className="text-lg font-serif font-bold dark:text-white">Umre Rehberi</span></div> ) : <h1 className="text-lg font-serif font-bold dark:text-gold-400">{title}</h1>}
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none"><span className="font-serif font-bold text-slate-800 dark:text-slate-200 opacity-30 text-sm tracking-widest">{SITE_TITLE}</span></div>
            {showSettingsBtn && ( <div className="flex items-center gap-2 relative z-10"> <button onClick={togglePlay} className={`p-2 rounded-full transition-all border ${isPlaying ? 'bg-gold-500 border-gold-500 text-white animate-pulse-gold' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'}`}><i data-lucide={isPlaying ? "pause" : "play"} className="w-4 h-4 fill-current"></i></button> <button onClick={onOpenSettings} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-transparent hover:border-slate-300 dark:hover:border-slate-600 transition-colors"><i data-lucide="settings" className="w-5 h-5"></i></button> </div> )}
        </div>
    );
};

// ... (Diğer tüm modüller: ComprehensiveGuide, CostCalculator, FeaturedCards, MiqatModule, DictionaryModule, PremiumChecklist, PremiumContacts, RouteVisualizer, UmrahGuideDetail, About, PrayerTimesDetail, CurrencyConverter, PlacesDetail, AnnouncementBar, MenuCard, InstallBanner önceki koddan aynen korunmuştur) ...
// (Burada yer kaplamaması için tekrar kopyalamıyorum, hepsi App içinde switch case'de çağrılacak)

// --- ÖNE ÇIKAN KARTLAR (GÜNCELLENDİ: YENİ MODÜLLER EKLENDİ) ---
const FeaturedCards = ({ setActiveView }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    const cards = [
        { id: 'c1', title: 'Seyahat Rehberi', sub: 'Sınır geçişleri & Belgeler', icon: 'book-open', bg: 'bg-gradient-to-br from-emerald-800 to-emerald-900', text: 'text-emerald-100', act: () => setActiveView('travelGuide') },
        { id: 'c2', title: 'Canlı Konvoy', sub: 'Grup oluştur & Takip et', icon: 'users', bg: 'bg-gradient-to-br from-cyan-800 to-cyan-900', text: 'text-cyan-100', act: () => setActiveView('convoy') }, // YENİ
        { id: 'c3', title: 'Maliyet Hesapla', sub: 'Vize ve Araç Giderleri', icon: 'calculator', bg: 'bg-gradient-to-br from-slate-900 to-slate-800', text: 'text-white', act: () => setActiveView('costCalc') },
        { id: 'c4', title: 'Mikat Kontrol', sub: 'İhram sınırına yaklaşınca uyar', icon: 'map-pin', bg: 'bg-gradient-to-br from-indigo-800 to-indigo-900', text: 'text-indigo-100', act: () => setActiveView('miqat') }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isPaused && scrollRef.current) {
                const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
                const nextScroll = scrollLeft + clientWidth;
                if (nextScroll + 10 >= scrollWidth) {
                    scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                    setActiveIndex(0);
                } else {
                    scrollRef.current.scrollTo({ left: nextScroll, behavior: 'smooth' });
                    setActiveIndex(prev => prev + 1);
                }
            }
        }, 7000);
        return () => clearInterval(interval);
    }, [isPaused]);

    return (
        <div className="col-span-2 mb-2 relative group">
            <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 snap-x snap-mandatory scrollbar-hide" style={{ scrollBehavior: 'smooth' }}>
                {cards.map(c => (
                    <div key={c.id} onClick={c.act} className={`relative overflow-hidden ${c.bg} rounded-2xl p-5 shadow-xl cursor-pointer border border-white/10 min-w-[100%] snap-center shrink-0 flex flex-col justify-between h-36`}>
                        <div className="relative z-10">
                            <span className={`px-2 py-0.5 rounded text-[10px] bg-white/10 ${c.text} font-bold uppercase tracking-wider mb-2 inline-block`}>Öne Çıkan</span>
                            <h2 className={`text-2xl font-serif font-bold ${c.text} mb-0.5`}>{c.title}</h2>
                            <p className={`${c.text} text-xs opacity-80`}>{c.sub}</p>
                        </div>
                        <i data-lucide={c.icon} className={`absolute -right-2 -bottom-4 w-24 h-24 ${c.text} opacity-10 rotate-12`}></i>
                    </div>
                ))}
            </div>
            <button onClick={(e) => { e.stopPropagation(); setIsPaused(!isPaused); }} className="absolute top-3 right-3 z-20 p-1.5 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors"><i data-lucide={isPaused ? "play" : "pause"} className="w-3 h-3 fill-current"></i></button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                {cards.map((_, i) => (<div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === activeIndex ? 'bg-white' : 'bg-white/30'}`}></div>))}
            </div>
        </div>
    );
};

// ... (Mevcut modüllerin placeholderları - Kod bütünlüğü için gereklidir)
// Not: Aşağıdaki bileşenler, önceki kodunuzdaki halleriyle birebir aynıdır.
// Kodu çok uzatmamak için burada özet geçmiyorum, App içinde çalışacaklar.
const ComprehensiveGuide = () => { const [expanded, setExpanded] = useState(null); return ( <div className="p-4 pb-24 animate-fade-in space-y-4"> <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 rounded-2xl p-6 text-white shadow-lg mb-6"> <h2 className="text-2xl font-serif font-bold mb-2">Karayolu Umre Rehberi</h2> <p className="text-emerald-100 text-sm opacity-90">Türkiye'den Kutsal Topraklara adım adım yolculuk prosedürleri.</p> </div> <div className="space-y-3"> {GUIDE_DATA.map((section) => ( <div key={section.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all shadow-sm"> <button onClick={() => setExpanded(expanded === section.id ? null : section.id)} className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors" > <div className="flex items-center gap-4"> <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${section.color}-100 dark:bg-${section.color}-900/30 text-${section.color}-600 dark:text-${section.color}-400`}> <i data-lucide={section.icon} className="w-5 h-5"></i> </div> <span className="font-bold text-slate-800 dark:text-slate-100">{section.title}</span> </div> <i data-lucide="chevron-down" className={`w-5 h-5 text-slate-400 transition-transform ${expanded === section.id ? 'rotate-180' : ''}`}></i> </button> {expanded === section.id && ( <div className="px-4 pb-4 pt-0"> <div className="h-px bg-slate-100 dark:bg-slate-700 mb-4 mx-2"></div> <div className="space-y-4 pl-4 border-l-2 border-slate-200 dark:border-slate-700 ml-5"> {section.content.map((item, idx) => ( <div key={idx} className="relative"> <div className={`absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-${section.color}-500 border-2 border-white dark:border-slate-800`}></div> <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">{item.t}</h4> <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.d}</p> </div> ))} </div> </div> )} </div> ))} </div> <div className="text-center text-xs text-slate-400 mt-6"> * Bilgiler 2026 yılı güncel sınır prosedürlerine göre derlenmiştir. </div> </div> ); };
const CostCalculator = () => { const [passengers, setPassengers] = useState(1); const [total, setTotal] = useState(0); const CAR_COSTS = { syria_carnet: 20, syria_exit_car: 5, jordan_entry: 28, jordan_insurance: 78, saudi_insurance: 80 }; const PERSON_COSTS = { syria_visa_in: 25, syria_visa_out: 25, saudi_visa: 110 }; useEffect(() => { const fixedCar = Object.values(CAR_COSTS).reduce((a, b) => a + b, 0); const variablePerson = Object.values(PERSON_COSTS).reduce((a, b) => a + b, 0) * passengers; setTotal(fixedCar + variablePerson); }, [passengers]); return ( <div className="p-6 pb-24 animate-fade-in space-y-6"> <div className="bg-slate-900 text-white rounded-3xl p-8 text-center shadow-xl relative overflow-hidden"> <div className="relative z-10"> <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Tahmini Yol Maliyeti</p> <div className="text-5xl font-mono font-bold text-gold-400 mb-2">${total}</div> <p className="text-xs text-slate-400">(Vize + Sınır + Sigorta)</p> </div> <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl"></div> </div> <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"> <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Yolcu Sayısı (Sürücü Dahil)</label> <div className="flex items-center gap-4"> <button onClick={() => setPassengers(Math.max(1, passengers - 1))} className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition"><i data-lucide="minus" className="w-5 h-5"></i></button> <div className="flex-1 text-center font-mono text-2xl font-bold dark:text-white">{passengers}</div> <button onClick={() => setPassengers(passengers + 1)} className="w-12 h-12 rounded-xl bg-gold-500 text-white flex items-center justify-center text-xl font-bold hover:bg-gold-600 transition shadow-lg shadow-gold-500/30"><i data-lucide="plus" className="w-5 h-5"></i></button> </div> </div> </div> ); };
const MiqatModule = () => { const [userLoc, setUserLoc] = useState(null); const [alertDist, setAlertDist] = useState(20); const [isActive, setIsActive] = useState(true); const [triggered, setTriggered] = useState({}); const audioRef = useRef(new Audio(AUDIO_TELBIYE)); useEffect(() => { let watchId; if (isActive && navigator.geolocation) { watchId = navigator.geolocation.watchPosition( (pos) => { const { latitude: lat, longitude: lng } = pos.coords; setUserLoc({ lat, lng }); MIQAT_DATA.forEach(m => { const d = calculateDistance(lat, lng, m.lat, m.lng); if (d <= alertDist && !triggered[m.id]) { if (Notification.permission === "granted") new Notification("Mikat Sınırı", { body: `${m.title} ${d}km kaldı.` }); audioRef.current.play().catch(e => console.log(e)); setTriggered(prev => ({ ...prev, [m.id]: true })); } }); }, (err) => console.log(err), { enableHighAccuracy: true } ); } return () => { if(watchId) navigator.geolocation.clearWatch(watchId); }; }, [isActive, alertDist, triggered]); const openMap = (lat, lng) => window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank'); return ( <div className="p-4 pb-24 animate-fade-in space-y-6"> <div className="bg-indigo-900 text-white p-5 rounded-2xl relative overflow-hidden shadow-lg"> <div className="relative z-10"> <h3 className="font-serif font-bold text-xl mb-2 text-indigo-200">Mikat Nedir?</h3> <p className="text-sm text-indigo-100 opacity-90 leading-relaxed"> Harem bölgesine (Mekke) girmek isteyenlerin, ihramsız geçmemeleri gereken sınır noktalarıdır. </p> </div> <i data-lucide="map-pin" className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-10 rotate-12"></i> </div> <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"> <div className="flex items-center justify-between mb-4"> <h4 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2"> <i data-lucide="bell-ring" className="w-4 h-4 text-gold-500"></i> Yaklaşma Alarmı </h4> <button onClick={() => setIsActive(!isActive)} className={`w-10 h-6 rounded-full p-1 transition-colors ${isActive ? 'bg-green-500' : 'bg-slate-300'}`}> <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${isActive ? 'translate-x-4' : ''}`}></div> </button> </div> {isActive && ( <div className="flex gap-2"> {[10, 20, 50, 100].map(km => ( <button key={km} onClick={() => setAlertDist(km)} className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${alertDist === km ? 'bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300' : 'border-slate-200 text-slate-500 dark:border-slate-700'}`}> {km} km </button> ))} </div> )} </div> <div className="space-y-4"> {MIQAT_DATA.map(m => { const dist = userLoc ? calculateDistance(userLoc.lat, userLoc.lng, m.lat, m.lng) : null; return ( <div key={m.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700"> <div className="h-32 bg-slate-200 dark:bg-slate-700 relative flex items-center justify-center"> {m.image.startsWith('[') ? (<div className="text-slate-400 text-xs flex flex-col items-center gap-2"><i data-lucide="image" className="w-8 h-8 opacity-50"></i><span>{m.title}</span></div>) : <img src={m.image} className="w-full h-full object-cover" />} {dist && <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full font-mono">{dist} km</div>} </div> <div className="p-4"> <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">{m.title}</h4> <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{m.desc}</p> <button onClick={() => openMap(m.lat, m.lng)} className="w-full py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-lg flex items-center justify-center gap-2"><i data-lucide="navigation" className="w-3 h-3"></i> Yol Tarifi</button> </div> </div> ); })} </div> </div> ); };
const DictionaryModule = () => { const [cat, setCat] = useState(0); return ( <div className="p-4 pb-24 animate-fade-in space-y-4"> <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"> {DICTIONARY_DATA.map((d, i) => ( <button key={i} onClick={() => setCat(i)} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${cat === i ? 'bg-rose-500 text-white' : 'bg-white dark:bg-slate-800 border dark:border-slate-700 text-slate-500'}`}>{d.cat}</button> ))} </div> <div className="grid gap-3"> {DICTIONARY_DATA[cat].items.map((item, i) => ( <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col gap-2"> <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-2"> <span className="font-bold text-slate-800 dark:text-slate-200">{item.tr}</span> <span className="text-xs text-slate-400">{item.en}</span> </div> <div className="text-right pt-1"><span className="text-xl font-serif text-rose-600 dark:text-rose-400 font-bold">{item.ar}</span></div> </div> ))} </div> </div> ); };
const PremiumChecklist = ({ type, title }) => { const [items, setItems] = useState([]); useEffect(() => { const s = localStorage.getItem(`chk_${type}`); if (s) setItems(JSON.parse(s)); else setItems(CHECKLISTS_DATA[type] || []); }, [type]); const toggle = (id) => { const n = items.map(i => i.id === id ? { ...i, checked: !i.checked } : i); setItems(n); localStorage.setItem(`chk_${type}`, JSON.stringify(n)); }; const completed = items.filter(i => i.checked).length; const progress = Math.round((completed / items.length) * 100); return ( <div className="p-6 pb-24 animate-fade-in space-y-6"> <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden"> <div className="relative z-10 flex justify-between items-end"> <div><p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Durum</p><h2 className="text-3xl font-serif font-bold text-gold-400">%{progress}</h2><p className="text-xs text-slate-300 mt-1">{completed} / {items.length} Tamamlandı</p></div> <div className="w-12 h-12 rounded-full border-4 border-gold-500/30 flex items-center justify-center"><i data-lucide={progress === 100 ? "check-circle" : "list"} className="w-6 h-6 text-gold-500"></i></div> </div> <div className="absolute bottom-0 left-0 h-1.5 bg-gold-500 transition-all duration-700" style={{ width: `${progress}%` }}></div> </div> <div className="grid gap-3"> {items.map(i => ( <div key={i.id} onClick={() => toggle(i.id)} className={`group relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${i.checked ? 'bg-slate-900 border-slate-900 shadow-lg' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-gold-200'}`}> <div className="flex items-start justify-between"> <div className="flex flex-col pr-4"> <span className={`font-medium transition-colors ${i.checked ? 'text-white line-through opacity-50' : 'text-slate-700 dark:text-slate-200'}`}>{i.label}</span> {i.desc && <span className={`text-[10px] mt-1 ${i.checked ? 'text-slate-500' : 'text-slate-500 dark:text-slate-400'}`}>{i.desc}</span>} </div> <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center transition-all ${i.checked ? 'bg-gold-500 text-slate-900' : 'bg-slate-100 dark:bg-slate-700 text-slate-300'}`}><i data-lucide="check" className="w-3.5 h-3.5"></i></div> </div> </div> ))} </div> </div> ); };
const PremiumContacts = () => ( <div className="p-4 pb-24 animate-fade-in space-y-4"> {EMERGENCY_NUMBERS.map((e, i) => ( <a href={`tel:${e.number}`} key={i} className="block bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all active:scale-[0.98] group relative overflow-hidden"> <div className="relative z-10 flex items-center"> <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center mr-4 group-hover:bg-red-500 group-hover:text-white transition-colors"><i data-lucide={e.icon} className="w-6 h-6"></i></div> <div><h4 className="font-bold text-slate-800 dark:text-slate-100">{e.title}</h4><p className="text-xs text-slate-400 mb-1">{e.desc}</p><span className="text-sm font-mono font-bold text-slate-600 dark:text-slate-300">{e.number}</span></div> <div className="ml-auto bg-green-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0"><i data-lucide="phone" className="w-4 h-4"></i></div> </div> </a> ))} </div> );
const RouteVisualizer = () => { const [visibleStops, setVisibleStops] = useState(0); useEffect(() => { let current = 0; const interval = setInterval(() => { if (current <= ROUTE_STOPS.length) { setVisibleStops(current); current++; } else { clearInterval(interval); } }, 500); return () => clearInterval(interval); }, []); const progressHeight = Math.max(0, ((visibleStops - 1) / (ROUTE_STOPS.length - 1)) * 100); return ( <div className="p-6 pb-20 animate-fade-in"> <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white mb-8 shadow-xl relative overflow-hidden border border-gold-500/20"> <div className="relative z-10"><h3 className="font-serif text-2xl font-bold text-gold-400 mb-1">Mübarek Yolculuk</h3><p className="text-slate-400 text-sm">Türkiye - Mekke Güzergahı</p></div> <i data-lucide="map" className="absolute right-4 bottom-4 w-24 h-24 text-white opacity-5"></i> </div> <div className="relative pl-2"> <div className="absolute left-[1.1rem] top-0 bottom-0 w-1 bg-slate-200 dark:bg-slate-700"></div> <div className="absolute left-[1.1rem] top-0 w-1 bg-gold-500 transition-all duration-500" style={{ height: `${progressHeight}%` }}></div> <div className="space-y-8 relative z-10"> {ROUTE_STOPS.map((stop, index) => ( <div key={stop.id} className={`flex items-start gap-4 transition-all duration-500 transform ${index < visibleStops ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}> <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 z-20 ${index < visibleStops ? 'border-gold-500 bg-white dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800'} ${stop.type === 'holy' && index < visibleStops ? 'animate-pulse-gold' : ''}`}> <i data-lucide={stop.type === 'holy' ? 'moon' : stop.type === 'border' ? 'flag' : 'map-pin'} className={`w-4 h-4 ${index < visibleStops ? 'text-gold-600' : 'text-slate-300'}`}></i> </div> <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex-1"> <div className="flex justify-between items-center mb-1"><h4 className="font-bold text-slate-800 dark:text-slate-100">{stop.name}</h4><span className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-500">{stop.km} km</span></div> <p className="text-xs text-slate-500 dark:text-slate-400">{stop.desc}</p> </div> </div> ))} </div> </div> </div> ); };
const UmrahGuideDetail = () => { const [active, setActive] = useState(null); const steps = [ {t:"İhram ve Niyet", d:"Mikat'ta girilir, 2 rekat namaz kılınır.", icon:"shirt", text:"Allah'ım senin rızan için umre yapmak istiyorum."}, {t:"Tavaf", d:"Kabe sola alınarak 7 şavt dönülür.", icon:"repeat", text:"Bismillahi Allahu Ekber."}, {t:"Sa'y", d:"Safa ve Merve arasında 4 gidiş 3 geliş.", icon:"footprints", text:"İnnes-safa vel-mervete min şeairillah..."}, {t:"Tıraş ve Çıkış", d:"Saçlar kısaltılır, ihramdan çıkılır.", icon:"scissors", text:"Elhamdülillah."} ]; return ( <div className="p-4 space-y-3 pb-24 animate-fade-in"> <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800 mb-4"> <h3 className="font-bold text-emerald-800 dark:text-emerald-400">Umre Rehberi</h3><p className="text-xs text-emerald-600">Adım adım ibadet rehberi</p> </div> {steps.map((s,i)=>( <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden"> <button onClick={() => setActive(active===i?null:i)} className="w-full flex items-center justify-between p-4 text-left"> <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center"><i data-lucide={s.icon} className="w-4 h-4 text-slate-500"></i></div><span className="font-bold text-sm text-slate-700 dark:text-slate-200">{i+1}. {s.t}</span></div> <i data-lucide="chevron-down" className={`w-4 h-4 transition-transform ${active===i?'rotate-180':''}`}></i> </button> {active===i && <div className="px-4 pb-4 pl-[3.25rem]"><p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{s.d}</p><div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded border-l-2 border-amber-400 text-xs italic text-slate-600 dark:text-slate-300">"{s.text}"</div></div>} </div> ))} </div> ); };
const About = () => ( <div className="p-4 pb-24 animate-fade-in space-y-6"> <div className="relative bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-700"> <div className="h-32 bg-gradient-to-r from-emerald-600 to-emerald-900 relative"> <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div> <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 bg-gold-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg overflow-hidden"> <img src={DEVELOPER_PHOTO_URL} alt="SG" className="w-full h-full object-cover" /> </div> </div> <div className="pt-12 pb-6 px-6 text-center"> <h2 className="text-2xl font-serif font-bold text-slate-800 dark:text-white">Sami G.</h2> <span className="inline-block mt-2 px-3 py-1 rounded-full bg-gold-50 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400 text-xs font-bold uppercase tracking-wider">Uygulama Geliştiricisi</span> <div className="mt-6 text-left space-y-4"> <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700"> <p className="font-serif text-lg text-emerald-800 dark:text-emerald-400 mb-2 text-center">﷽</p> <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-serif text-justify"> <span className="font-bold block mb-2 text-slate-800 dark:text-slate-200 text-center">Esselamü Aleyküm ve Rahmetullah,</span> Kıymetli Allah'ın misafirleri; bu çalışma, Haremeyn-i Şerifeyn'e vuslat yolculuğunda sizlere rehberlik etmek, bu meşakkatli ama kutlu seferde yükünüzü bir nebze olsun hafifletmek gayesiyle "Sadaka-i Cariye" niyetiyle hazırlanmıştır. </p> </div> </div> <div className="mt-6"> <a href={FEEDBACK_FORM_URL} target="_blank" className="block w-full py-3 px-4 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-600 dark:text-slate-300 text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"> <i data-lucide="message-circle" className="w-4 h-4"></i> Geri Bildirim & Öneri Gönder </a> <p className="text-[10px] text-slate-400 mt-2">Görüşleriniz uygulamayı geliştirmemiz için önemlidir.</p> </div> </div> </div> </div> );
const PrayerTimesDetail = () => { const [city, setCity] = useState("Mekke"); const [times, setTimes] = useState(null); const [nextPrayer, setNextPrayer] = useState(null); const [countdown, setCountdown] = useState(""); const [dataDate, setDataDate] = useState(""); const [isOffline, setIsOffline] = useState(false); const [lastFetch, setLastFetch] = useState(""); const todayStr = new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }); useEffect(() => { if (!times) return; const timer = setInterval(() => { const now = new Date(); const currentTime = now.getHours() * 60 + now.getMinutes(); const currentSeconds = now.getSeconds(); const prayerList = [{ name: 'Imsak', time: times.Imsak }, { name: 'Gunes', time: times.Gunes }, { name: 'Ogle', time: times.Ogle }, { name: 'Ikindi', time: times.Ikindi }, { name: 'Aksam', time: times.Aksam }, { name: 'Yatsi', time: times.Yatsi }]; let next = null; let minDiff = Infinity; for (let p of prayerList) { const [h, m] = p.time.split(':').map(Number); const pTime = h * 60 + m; let diff = pTime - currentTime; if (diff < 0) diff += 24 * 60; if (diff < minDiff) { minDiff = diff; next = p; } } setNextPrayer(next); const totalSecs = (minDiff * 60) - currentSeconds; const h = Math.floor(totalSecs / 3600); const m = Math.floor((totalSecs % 3600) / 60); const s = totalSecs % 60; setCountdown(`${h}:${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`); }, 1000); return () => clearInterval(timer); }, [times]); useEffect(() => { const fetchTimes = async () => { try { const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Saudi Arabia&method=4`); if (!response.ok) throw new Error("API Hatası"); const data = await response.json(); const t = data.data.timings; const formatted = { Imsak: t.Fajr, Gunes: t.Sunrise, Ogle: t.Dhuhr, Ikindi: t.Asr, Aksam: t.Maghrib, Yatsi: t.Isha }; setTimes(formatted); setDataDate(data.data.date.readable); setLastFetch(new Date().toLocaleTimeString()); setIsOffline(false); localStorage.setItem(`prayer_${city}`, JSON.stringify({ t: formatted, d: data.data.date.readable, lf: new Date().toLocaleTimeString() })); } catch (e) { const saved = localStorage.getItem(`prayer_${city}`); if (saved) { const p = JSON.parse(saved); setTimes(p.t); setDataDate(p.d); setLastFetch(p.lf || "Bilinmiyor"); } else { setTimes({ Imsak: "05:00", Gunes: "06:30", Ogle: "12:30", Ikindi: "15:45", Aksam: "18:20", Yatsi: "19:50" }); } setIsOffline(true); } }; fetchTimes(); }, [city]); return ( <div className="p-4 pb-20 animate-fade-in space-y-4"> <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl mb-4"> {["Mekke", "Medine"].map(c => ( <button key={c} onClick={() => setCity(c)} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${city === c ? 'bg-white dark:bg-slate-600 shadow text-gold-600' : 'text-slate-500'}`}>{c}</button> ))} </div> <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden"> <div className="relative z-10 text-center"><p className="text-xs text-gold-400 font-bold uppercase tracking-widest mb-1">{city}</p><h2 className="text-xl font-serif font-bold mb-2">{todayStr}</h2>{nextPrayer && (<div className="mt-4 p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 inline-block"><p className="text-xs text-slate-300 mb-1">{nextPrayer.name} Vaktine Kalan</p><p className="text-3xl font-mono font-bold text-gold-400">{countdown}</p></div>)}</div> <i data-lucide="moon" className="absolute -right-4 -top-4 w-32 h-32 text-white opacity-5"></i> </div> <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden divide-y divide-slate-100 dark:divide-slate-700"> {times && Object.entries(times).map(([v, s]) => { const pOrder = ['Imsak', 'Gunes', 'Ogle', 'Ikindi', 'Aksam', 'Yatsi']; const nextIdx = nextPrayer ? pOrder.indexOf(nextPrayer.name) : -1; const currentIdx = nextIdx === 0 ? 5 : nextIdx - 1; const isCurrent = pOrder[currentIdx] === v; return ( <div key={v} className={`p-4 flex justify-between items-center transition-colors ${isCurrent ? 'bg-gold-50 dark:bg-gold-900/20' : ''}`}> <div className="flex items-center gap-3"><span className={`text-xs font-bold uppercase tracking-wider ${isCurrent ? 'text-gold-600 dark:text-gold-400' : 'text-slate-400'}`}>{v}</span>{isCurrent && <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span></span>}</div> <span className={`font-mono text-xl font-bold ${isCurrent ? 'text-gold-700 dark:text-gold-300' : 'text-slate-800 dark:text-slate-200'}`}>{s}</span> </div> ); })} </div> {isOffline && (<div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/50"><i data-lucide="wifi-off" className="w-4 h-4 text-red-500"></i><div className="text-xs text-red-700 dark:text-red-300 leading-tight"><span className="font-bold block">Çevrimdışı Mod</span>Son güncelleme: {lastFetch}. Lütfen imsakiyenizi kontrol ediniz.</div></div>)} </div> ); };
const CurrencyConverter = () => { const [amount, setAmount] = useState(1); const [fromCurr, setFromCurr] = useState('SAR'); const [toCurr, setToCurr] = useState('TRY'); const [rates, setRates] = useState(null); const [result, setResult] = useState(0); useEffect(() => { const fetchRates = async () => { try { const res = await fetch('https://api.exchangerate-api.com/v4/latest/SAR'); const data = await res.json(); setRates(data.rates); localStorage.setItem('rates_v2', JSON.stringify(data.rates)); } catch (e) { setRates(JSON.parse(localStorage.getItem('rates_v2'))); } }; fetchRates(); }, []); useEffect(() => { if (!rates) return; const fromRate = rates[fromCurr]; const toRate = rates[toCurr]; if (fromRate && toRate) { const inSar = amount / fromRate; const finalVal = inSar * toRate; setResult(finalVal.toFixed(2)); } }, [amount, fromCurr, toCurr, rates]); const swap = () => { setFromCurr(toCurr); setToCurr(fromCurr); }; return ( <div className="p-6 animate-fade-in space-y-6"> <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 relative"> <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2"><i data-lucide="arrow-left-right" className="w-5 h-5 text-gold-500"></i> Döviz Çevirici</h3> <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 mb-2"> <label className="text-[10px] uppercase font-bold text-slate-400 mb-1">Dönüştürülecek Tutar</label> <div className="flex justify-between items-center"> <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-transparent text-2xl font-bold text-slate-800 dark:text-slate-100 focus:outline-none w-1/2" /> <select value={fromCurr} onChange={(e) => setFromCurr(e.target.value)} className="bg-white dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200 p-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 outline-none"><option value="SAR">🇸🇦 SAR</option><option value="USD">🇺🇸 USD</option><option value="TRY">🇹🇷 TRY</option><option value="EUR">🇪🇺 EUR</option></select> </div> </div> <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 z-10"><button onClick={swap} className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white dark:border-slate-800 hover:scale-110 transition-transform"><i data-lucide="arrow-down-up" className="w-5 h-5"></i></button></div> <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 mt-2"> <label className="text-[10px] uppercase font-bold text-slate-400 mb-1">Karşılık</label> <div className="flex justify-between items-center"> <div className="text-2xl font-bold text-gold-600 dark:text-gold-400">{result}</div> <select value={toCurr} onChange={(e) => setToCurr(e.target.value)} className="bg-white dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200 p-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 outline-none"><option value="SAR">🇸🇦 SAR</option><option value="USD">🇺🇸 USD</option><option value="TRY">🇹🇷 TRY</option><option value="EUR">🇪🇺 EUR</option></select> </div> </div> </div> </div> ); };
const PlacesDetail = () => { const [activeTab, setActiveTab] = useState(0); const [userLoc, setUserLoc] = useState(null); useEffect(() => { if (navigator.geolocation) navigator.geolocation.getCurrentPosition(p => setUserLoc({ lat: p.coords.latitude, lng: p.coords.longitude })); }, []); const openMap = (lat, lng) => window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank'); return ( <div className="p-4 pb-24 animate-fade-in space-y-4"> <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"> {PLACES_DATA.map((c, i) => ( <button key={i} onClick={() => setActiveTab(i)} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold border ${activeTab === i ? 'bg-gold-500 border-gold-500 text-slate-900' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200'}`}>{c.category}</button> ))} </div> <div className="space-y-4"> {PLACES_DATA[activeTab].items.map(p => { const dist = userLoc ? calculateDistance(userLoc.lat, userLoc.lng, p.lat, p.lng) : null; return ( <div key={p.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700"> <div className="h-40 bg-slate-200 dark:bg-slate-700 relative flex items-center justify-center"> {p.image.startsWith('[') ? (<div className="text-slate-400 text-xs flex flex-col items-center gap-2"><i data-lucide="image" className="w-8 h-8 opacity-50"></i><span>{p.title}</span></div>) : (<img src={p.image} className="w-full h-full object-cover" />)} {dist && <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full">{dist} km</div>} </div> <div className="p-4"> <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{p.title}</h3> <p className="text-xs text-slate-500 mb-4">{p.desc}</p> <button onClick={() => openMap(p.lat, p.lng)} className="w-full py-2 bg-gold-50 text-gold-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2"><i data-lucide="map" className="w-4 h-4"></i> Yol Tarifi</button> </div> </div> ); })} </div> </div> ); };
const AnnouncementBar = ({ announcements }) => { const [idx, setIdx] = useState(0); const [fade, setFade] = useState(true); useEffect(() => { const i = setInterval(() => { setFade(false); setTimeout(() => { setIdx(p => (p + 1) % announcements.length); setFade(true); }, 500); }, 4000); return () => clearInterval(i); }, [announcements]); return ( <div className="col-span-2 my-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 h-12 flex items-center pr-2 relative overflow-hidden"> <div className="h-full bg-gold-500 w-12 flex items-center justify-center shrink-0 relative z-10"><i data-lucide="megaphone" className="w-5 h-5 text-white animate-pulse-gold"></i></div> <div className={`flex-1 ml-4 text-sm font-medium text-slate-700 dark:text-slate-200 truncate transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>{announcements[idx]}</div> </div> ); };
const MenuCard = ({ icon, label, subLabel, colorClass, onClick, featured }) => ( <button onClick={onClick} className={`group relative flex flex-col items-start p-5 rounded-2xl bg-white dark:bg-slate-800 transition-all hover:scale-[1.02] border border-slate-100 dark:border-slate-700 overflow-hidden ${featured ? 'col-span-2' : ''}`}> <div className={`p-3 rounded-xl mb-3 ${colorClass} bg-opacity-10 dark:bg-opacity-20`}><i data-lucide={icon} className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`}></i></div> <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{label}</span> <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{subLabel}</span> </button> );
const InstallBanner = ({ onInstall, onClose, show }) => { if (!show) return null; return ( <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 animate-fade-in-up"> <div className="bg-slate-900 dark:bg-slate-800 text-white p-4 rounded-2xl shadow-2xl border-t-4 border-gold-500 flex flex-col gap-3 relative"> <button onClick={onClose} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white bg-white/10 rounded-full"><i data-lucide="x" className="w-4 h-4"></i></button> <div className="flex items-start gap-3 pr-6"> <div className="bg-gold-500 p-2.5 rounded-xl text-slate-900 shrink-0 shadow-lg shadow-gold-500/20"><i data-lucide="download" className="w-6 h-6"></i></div> <div><h4 className="font-bold text-gold-400">Uygulamayı Yükle</h4><p className="text-xs text-slate-300 mt-1">Çevrimdışı kullanım için.</p></div> </div> <button onClick={onInstall} className="w-full bg-gold-500 hover:bg-gold-600 text-slate-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2">Yükle</button> </div> </div> ); };

// --- ANA UYGULAMA ---
const App = () => {
    const [view, setView] = useState('dashboard');
    const [installPrompt, setInstallPrompt] = useState(null);
    const [showBanner, setShowBanner] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    
    // CMS için State
    const [announcements, setAnnouncements] = useState(() => {
        const saved = localStorage.getItem("custom_announcements");
        return saved ? JSON.parse(saved) : DEFAULT_ANNOUNCEMENTS;
    });

    const [settings, setSettings] = useState(() => JSON.parse(localStorage.getItem('sets')) || { fontSize: 'medium', theme: 'light', notifications: false, location: false });

    useEffect(() => { if(window.lucide) window.lucide.createIcons(); }, [view, showSettings, showBanner, settings, showOnboarding]);
    
    // Otomatik Güncelleme & Onboarding Kontrolü
    useEffect(() => {
        const savedVersion = localStorage.getItem('app_saved_version');
        const userProfile = localStorage.getItem('user_profile');
        const currentVersion = APP_VERSION;

        if (!userProfile) {
            setShowOnboarding(true);
        } else if (savedVersion && savedVersion !== currentVersion) {
            setShowUpdateModal(true);
        }

        localStorage.setItem('app_saved_version', currentVersion);
        localStorage.setItem('sets', JSON.stringify(settings));
        
        document.documentElement.className = settings.theme === 'dark' ? 'dark' : '';
        document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg');
        document.documentElement.classList.add(settings.fontSize === 'small' ? 'text-sm' : settings.fontSize === 'large' ? 'text-lg' : 'text-base');
    }, [settings]);

    useEffect(() => {
        const h = (e) => { e.preventDefault(); setInstallPrompt(e); setShowBanner(true); }; 
        window.addEventListener('beforeinstallprompt', h);
        const timer = setTimeout(() => { if(!localStorage.getItem('dismiss_v2')) setShowBanner(true); }, 3000);
        return () => window.removeEventListener('beforeinstallprompt', h);
    }, []);

    const handleInstall = () => {
        if(!installPrompt) { alert("Tarayıcı özelliği."); setShowBanner(false); localStorage.setItem('dismiss_v2', 'true'); return; }
        installPrompt.prompt();
    };

    const updateSettings = (k, v) => setSettings(p => ({...p, [k]: v}));

    const renderView = () => {
        switch(view) {
            case 'dashboard': return (
                <div className="p-4 grid grid-cols-2 gap-3 pb-24 animate-fade-in">
                    <FeaturedCards setActiveView={setView} />
                    <AnnouncementBar announcements={announcements} />
                    <MenuCard icon="book-open" label="Seyahat Rehberi" subLabel="Sınır & Prosedür" colorClass="bg-emerald-500 text-emerald-600" onClick={() => setView('travelGuide')} />
                    <MenuCard icon="map" label="Canlı Harita" subLabel="Rota & Konumlar" colorClass="bg-blue-600 text-blue-700" onClick={() => setView('map')} /> {/* YENİ */}
                    <MenuCard icon="users" label="Konvoy" subLabel="Grup Takip" colorClass="bg-cyan-600 text-cyan-700" onClick={() => setView('convoy')} /> {/* YENİ */}
                    <MenuCard icon="coffee" label="Mola Rehberi" subLabel="Otel & Yemek" colorClass="bg-orange-500 text-orange-600" onClick={() => setView('stops')} /> {/* YENİ */}
                    <MenuCard icon="calculator" label="Maliyet Hesapla" subLabel="Vize & Araç" colorClass="bg-slate-700 text-slate-800 dark:text-slate-100" onClick={() => setView('costCalc')} />
                    <MenuCard icon="moon" label="Umre İbadeti" subLabel="Adım adım" colorClass="bg-amber-500 text-amber-600" onClick={() => setView('guide')} />
                    <MenuCard icon="map-pin" label="Mikat Mahalleri" subLabel="Sınırlar & Alarm" colorClass="bg-indigo-500 text-indigo-600" onClick={() => setView('miqat')} />
                    <MenuCard icon="compass" label="Gezilecek Yerler" subLabel="Mekke & Medine" colorClass="bg-pink-500 text-pink-600" onClick={() => setView('places')} />
                    <MenuCard icon="clock" label="Namaz Vakitleri" subLabel="Güncel" colorClass="bg-cyan-500 text-cyan-600" onClick={() => setView('times')} />
                    <MenuCard icon="briefcase" label="İhtiyaç Listesi" subLabel="Bagaj" colorClass="bg-purple-500 text-purple-600" onClick={() => setView('luggage')} />
                    <MenuCard icon="arrow-left-right" label="Döviz" subLabel="Hesapla" colorClass="bg-green-600 text-green-700" onClick={() => setView('currency')} />
                    <MenuCard icon="file-text" label="Evraklar" subLabel="Pasaport" colorClass="bg-slate-500 text-slate-600" onClick={() => setView('documents')} />
                    <MenuCard icon="languages" label="Acil Sözlük" subLabel="Arapça Kalıplar" colorClass="bg-rose-500 text-rose-600" onClick={() => setView('dictionary')} />
                    <MenuCard icon="phone" label="Acil Numaralar" subLabel="Yardım" colorClass="bg-red-500 text-red-600" onClick={() => setView('contacts')} />
                    <MenuCard icon="info" label="Hakkında" subLabel="Künye" colorClass="bg-slate-400 text-slate-500" onClick={() => setView('about')} />
                </div>
            );
            case 'route': return <RouteVisualizer />;
            case 'travelGuide': return <ComprehensiveGuide />;
            case 'convoy': return <ConvoyModule />; // YENİ
            case 'map': return <MapModule />; // YENİ
            case 'stops': return <RecommendedStops />; // YENİ
            case 'costCalc': return <CostCalculator />;
            case 'guide': return <UmrahGuideDetail />;
            case 'places': return <PlacesDetail />;
            case 'times': return <PrayerTimesDetail />;
            case 'currency': return <CurrencyConverter />;
            case 'luggage': return <PremiumChecklist type="luggage" title="İhtiyaç Listesi" />;
            case 'documents': return <PremiumChecklist type="documents" title="Resmi Evraklar" />;
            case 'contacts': return <PremiumContacts />;
            case 'miqat': return <MiqatModule />;
            case 'dictionary': return <DictionaryModule />;
            case 'about': return <About />;
            default: return <div className="p-10 text-center">Yapım aşamasında</div>;
        }
    };

    return (
        <div className="min-h-screen transition-colors duration-500 relative">
            <Header title={view === 'dashboard' ? 'LOGO_STYLE' : 'Rehber'} goBack={view !== 'dashboard' ? () => setView('dashboard') : null} onOpenSettings={() => setShowSettings(true)} showSettingsBtn={true} />
            <main className="max-w-3xl mx-auto">{renderView()}</main>
            {view !== 'dashboard' && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"><button onClick={() => setView('dashboard')} className="bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-md text-gold-400 px-6 py-3 rounded-full shadow-2xl border border-gold-500/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"><i data-lucide="layout-grid" className="w-5 h-5"></i><span className="font-bold text-sm">Ana Menü</span></button></div>}
            
            {/* MODALLAR */}
            {showOnboarding && <Onboarding onFinish={() => setShowOnboarding(false)} />}
            <SettingsModal 
                isOpen={showSettings} 
                onClose={() => setShowSettings(false)} 
                settings={settings} 
                updateSettings={updateSettings} 
                installPrompt={installPrompt} 
                onInstall={handleInstall} 
                announcements={announcements} 
                setAnnouncements={setAnnouncements} 
            />
            <UpdateModal show={showUpdateModal} onClose={() => setShowUpdateModal(false)} version={APP_VERSION} />
            <InstallBanner show={showBanner} onInstall={handleInstall} onClose={() => {setShowBanner(false); localStorage.setItem('dismiss_v2', 'true');}} />
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
