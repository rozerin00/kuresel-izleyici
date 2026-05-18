import React, { useState, useEffect } from 'react';

function App() {
  // --- STATE 1: AKTİF SEKME TAKİBİ (Routing Simülasyonu) ---
  const [activeTab, setActiveTab] = useState('dashboard');

  // --- STATE 2: STAT CARD VERİLERİ (API'den Gelecek Küme) ---
  const [stats, setStats] = useState({
    gdp: 'Yükleniyor...',
    inflation: 'Yükleniyor...',
    currency: 'Yükleniyor...',
    unemployment: 'Yükleniyor...'
  });

  // --- STATE 3: GENİŞLETİLMİŞ DATA TABLE VERİ SETİ (9 Ülkelik Küresel Matris) ---
  const [countries, setCountries] = useState([
    { id: 1, name: 'Türkiye', code: 'TR', gdp: '1.1T USD', inflation: 64.7, unemployment: 9.4, population: '85.3 Milyon', lifeExpectancy: '78.5 Yıl' },
    { id: 2, name: 'Almanya', code: 'DE', gdp: '4.4T USD', inflation: 2.5, unemployment: 3.2, population: '84.4 Milyon', lifeExpectancy: '81.2 Yıl' },
    { id: 3, name: 'Amerika Birleşik Devletleri', code: 'US', gdp: '27.3T USD', inflation: 3.1, unemployment: 3.8, population: '335.8 Milyon', lifeExpectancy: '77.3 Yıl' },
    { id: 4, name: 'İngiltere', code: 'GB', gdp: '3.3T USD', inflation: 2.0, unemployment: 4.2, population: '67.3 Milyon', lifeExpectancy: '80.9 Yıl' },
    { id: 5, name: 'Japonya', code: 'JP', gdp: '4.2T USD', inflation: 2.8, unemployment: 2.6, population: '125.1 Milyon', lifeExpectancy: '84.6 Yıl' },
    { id: 6, name: 'Fransa', code: 'FR', gdp: '3.0T USD', inflation: 2.9, unemployment: 7.3, population: '68.0 Milyon', lifeExpectancy: '82.4 Yıl' },
    { id: 7, name: 'Güney Kore', code: 'KR', gdp: '1.7T USD', inflation: 2.7, unemployment: 2.8, population: '51.7 Milyon', lifeExpectancy: '83.6 Yıl' },
    { id: 8, name: 'Hindistan', code: 'IN', gdp: '3.7T USD', inflation: 5.1, unemployment: 7.8, population: '1.43 Milyar', lifeExpectancy: '67.2 Yıl' },
    { id: 9, name: 'Brezilya', code: 'BR', gdp: '2.1T USD', inflation: 4.5, unemployment: 7.5, population: '215.3 Milyon', lifeExpectancy: '76.2 Yıl' }
  ]);

  // --- STATE 4: MODAL VE ARAMA REAKSİYONLARI ---
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formGdp, setFormGdp] = useState('');
  const [formInflation, setFormInflation] = useState('');
  const [formUnemployment, setFormUnemployment] = useState('');

  // --- ARKA PLANDA CANLI API VERİSİ ÇEKME VE SEO SÜRECİ ---
  useEffect(() => {
    const fetchLiveMacroData = async () => {
      try {
        const gdpRes = await fetch('https://api.worldbank.org/v2/country/TR/indicator/NY.GDP.MKTP.CD?format=json');
        const gdpData = await gdpRes.json();
        const rawGdp = gdpData[1] ? (gdpData[1].find(item => item.value !== null)?.value / 1e9).toFixed(1) + ' Milyar USD' : '1.1T USD';

        const infRes = await fetch('https://api.worldbank.org/v2/country/TR/indicator/FP.CPI.TOTL.ZG?format=json');
        const infData = await infRes.json();
        const rawInflation = infData[1] ? '%' + infData[1].find(item => item.value !== null)?.value.toFixed(1) : '%64.7';

        const unempRes = await fetch('https://api.worldbank.org/v2/country/TR/indicator/SL.UEM.TOTL.ZS?format=json');
        const unempData = await unempRes.json();
        const rawUnemployment = unempData[1] ? '%' + unempData[1].find(item => item.value !== null)?.value.toFixed(1) : '%9.4';

        const currencyRes = await fetch('https://open.er-api.com/v6/latest/USD');
        const currencyData = await currencyRes.json();
        const rawCurrency = currencyData.rates ? currencyData.rates.TRY.toFixed(2) + ' TRY' : '32.45 TRY';

        setStats({ gdp: rawGdp, inflation: rawInflation, unemployment: rawUnemployment, currency: rawCurrency });

        // DİNAMİK SEO OPTİMİZASYONU
        document.title = "Makro Finans Gösterge Paneli | Nexus Analytics";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute("content", "Dünya Bankası API entegrasyonlu, anlık döviz kurları ve makroekonomik risk analiz takip paneli.");
        }

      } catch (error) {
        console.error("API Hatası:", error);
        setStats({ gdp: '1.1T USD', inflation: '%64.7', currency: '32.45 TRY', unemployment: '%9.4' });
      }
    };

    fetchLiveMacroData();
  }, []);

  // --- CRUD OPERASYONLARI ---
  const handleDelete = (id) => {
    if (window.confirm("Bu egemen devlet kaydını sistemden tamamen silmek istediğinize emin misiniz?")) {
      setCountries(countries.filter(c => c.id !== id));
    }
  };

  const openModal = (country = null) => {
    setSelectedCountry(country);
    if (country) {
      setFormName(country.name); setFormCode(country.code); setFormGdp(country.gdp);
      setFormInflation(country.inflation); setFormUnemployment(country.unemployment);
    } else {
      setFormName(''); setFormCode(''); setFormGdp(''); setFormInflation(''); setFormUnemployment('');
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const formData = {
      name: formName, code: formCode.toUpperCase(), gdp: formGdp,
      inflation: Number(formInflation), unemployment: Number(formUnemployment),
      population: 'Belirtilmedi', lifeExpectancy: 'Belirtilmedi'
    };

    if (selectedCountry) {
      setCountries(countries.map(c => c.id === selectedCountry.id ? { ...c, ...formData } : c));
    } else {
      setCountries([...countries, { id: Date.now(), ...formData }]);
    }
    setIsModalOpen(false);
  };

  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      
      {/* SIDEBAR (YAN MENÜ) */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800 shadow-xl">
        <div className="p-6 border-b border-slate-800 bg-slate-950/40">
          <h2 className="text-lg font-bold tracking-wider text-cyan-400">NEXUS ANALİTİK</h2>
          <p className="text-xs text-slate-400 mt-1">Küresel Makro Finans İstihbaratı</p>
        </div>
        <nav className="flex-1 p-4 space-y-1.5">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-900/30' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'}`}
          >
            <span>📊</span> <span>Makro Gösterge Paneli</span>
          </button>
          <button 
            onClick={() => setActiveTab('matrix')}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'matrix' ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-900/30' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'}`}
          >
            <span>🌐</span> <span>Ülkeler Arası Analiz Matrixi</span>
          </button>
        </nav>
      </aside>

      {/* ANA PANEL ALANI */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 pb-5 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Egemen Varlık ve Kalkınma Takip Sistemi</h1>
            <p className="text-xs text-slate-500 mt-1">
              {activeTab === 'dashboard' ? 'Genel makroekonomik performans özet paneli' : 'Gelişmiş çok değişkenli analiz tablosu'}
            </p>
          </div>
          {activeTab === 'matrix' && (
            <button onClick={() => openModal()} className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-all active:scale-95 text-xs tracking-wide">
              + YENİ KAYIT OLUŞTUR
            </button>
          )}
        </header>

        {/* --- DASHBOARD SEKME İÇERİĞİ --- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/80">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gayri Safi Yurt İçi Hasıla</span>
                <h3 className="text-2xl font-bold text-slate-900 mt-2 text-cyan-600">{stats.gdp}</h3>
                <div className="text-xs text-slate-400 mt-3">World Bank veri havuzundan anlık</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/80">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Enflasyon Endeksi (TÜFE)</span>
                <h3 className="text-2xl font-bold text-slate-900 mt-2 text-rose-600">{stats.inflation}</h3>
                <div className="text-xs text-slate-400 mt-3">Son açıklanan resmi endeks değeri</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/80">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Döviz Kuru (USD/TRY)</span>
                <h3 className="text-2xl font-bold text-slate-900 mt-2 text-emerald-600">{stats.currency}</h3>
                <div className="text-xs text-slate-400 mt-3">Para piyasaları eş zamanlı veri akışı</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/80">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">İşsizlik Oranı</span>
                <h3 className="text-2xl font-bold text-slate-900 mt-2 text-amber-600">{stats.unemployment}</h3>
                <div className="text-xs text-slate-400 mt-3">Aktif iş gücü analizi rasyosu</div>
              </div>
            </div>

            {/* TAMİR EDİLEN VE YENİLENEN KURUMSAL BİLGİLENDİRME PANELİ */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-xl shadow-md border border-slate-700/30">
              <div className="flex items-center space-x-2">
                <span className="text-cyan-400 text-base">🛡️</span>
                <h4 className="font-bold text-sm text-cyan-400 tracking-wide uppercase">Yönetici Analiz Notu & Sistem Durumu</h4>
              </div>
              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed font-normal">
                Bu terminal, egemen devletlerin makroekonomik risk, likidite ve kalkınma metriklerini konsolide etmek amacıyla tasarlanmış üst düzey bir analitik izleyicidir. Agregasyon şeması, Dünya Bankası (World Bank) ve küresel likidite sağlayıcıların açık veri protokolleri üzerinden eş zamanlı olarak doğrulanmaktadır. Gelişmiş çapraz sorgulama matrisine, egemen varlık kayıtlarına ve veri manipülasyon katmanına yan navigasyon paneli üzerinden erişim sağlanabilir.
              </p>
            </div>
          </div>
        )}

        {/* --- MATRİX SEKME İÇERİĞİ --- */}
        {activeTab === 'matrix' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Küresel Makroekonomik Göstergeler Matrisi</h3>
                <p className="text-xs text-slate-500 mt-0.5">Çok değişkenli kalkınma ve refah endeksleri takip tablosu</p>
              </div>
              <input 
                type="text" 
                placeholder="Ülke adı veya kodu ile arayın..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-72 border border-slate-200 rounded-lg px-3 py-1.5 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all shadow-sm"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase font-bold tracking-wider border-b border-slate-200/60">
                    <th className="p-4">Coğrafi Bölge / Ülke</th>
                    <th className="p-4">GSYH Büyüklüğü</th>
                    <th className="p-4">Enflasyon Oranı</th>
                    <th className="p-4">İşsizlik Oranı</th>
                    <th className="p-4">Toplam Nüfus</th>
                    <th className="p-4">Ortalama Yaşam Süresi</th>
                    <th className="p-4 text-right">Yönetimsel İşlemler</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 text-xs divide-y divide-slate-100 bg-white">
                  {filteredCountries.map((country) => (
                    <tr key={country.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-semibold text-slate-900">{country.name} <span className="text-slate-400 font-normal ml-1">({country.code})</span></td>
                      <td className="p-4">{country.gdp}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-md font-medium text-[11px] ${country.inflation > 10 ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                          %{country.inflation}
                        </span>
                      </td>
                      <td className="p-4">%{country.unemployment}</td>
                      <td className="p-4">{country.population}</td>
                      <td className="p-4 text-slate-500">{country.lifeExpectancy}</td>
                      <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                        <button onClick={() => openModal(country)} className="bg-slate-100 hover:bg-cyan-50 hover:text-cyan-700 text-slate-600 px-2.5 py-1 rounded transition-colors font-medium text-[11px]">Düzenle</button>
                        <button onClick={() => handleDelete(country.id)} className="bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 px-2.5 py-1 rounded transition-colors font-medium text-[11px]">Sil</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- MODAL FORM --- */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-slate-900 text-sm">{selectedCountry ? 'Egemen Varlık Verisini Güncelle' : 'Sisteme Yeni Ülke Tanımla'}</h3>
              </div>
              <form onSubmit={handleSave} className="p-5 space-y-4">
                <div>
                  <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1">Ülke Resmi Adı</label>
                  <input type="text" value={formName} onChange={e => setFormName(e.target.value)} required className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1">Ülke Kodu</label>
                  <input type="text" maxLength="3" value={formCode} onChange={e => setFormCode(e.target.value)} required className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1">GSYH Hacmi</label>
                  <input type="text" value={formGdp} onChange={e => setFormGdp(e.target.value)} required className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1">Enflasyon (%)</label>
                    <input type="number" step="0.1" value={formInflation} onChange={e => setFormInflation(e.target.value)} required className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1">İşsizlik (%)</label>
                    <input type="number" step="0.1" value={formUnemployment} onChange={e => setFormUnemployment(e.target.value)} required className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500" />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-xs font-medium">İptal</button>
                  <button type="submit" className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-medium shadow-sm">Kaydet</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;