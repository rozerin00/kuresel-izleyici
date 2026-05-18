# Nexus Analytics - Egemen Varlık ve Kalkınma Takip Sistemi

Nexus Analytics; egemen devletlerin makroekonomik performans, likidite, kalkınma ve refah metriklerini tek bir merkezden izlemek, konsolide etmek ve analiz etmek amacıyla üretim (production) standartlarında tasarlanmış üst düzey bir analitik finans terminalidir. 

Proje, modern **React** mimarisi ve **Tailwind CSS** framework'ü kullanılarak Single Page Application (SPA) prensiplerine uygun olarak asenkron veri akışlarıyla inşa edilmiştir.

---

## Öne Çıkan Temel Özellikler

Platform, modern bir SaaS platformunun ve kurumsal yönetim panellerinin sahip olması gereken tüm dinamik işlevleri eksiksiz barındırmaktadır:

- **Canlı Makroekonomik Veri Akışı (API Entegrasyonu):** Özet gösterge kartları (Stat Cards) statik olmayıp, sayfa yüklendiği an **Dünya Bankası (World Bank) Open Data API** sunucularına bağlanarak güncel GSYH, Enflasyon ve İşsizlik rasyolarını asenkron olarak çeker.
- **Eş Zamanlı Döviz Entegrasyonu:** Küresel para piyasaları veri sağlayıcıları üzerinden anlık USD/TRY döviz kuru rasyosu sisteme canlı olarak beslenir.
- **State-Tabanlı Dinamik Sekme Yönetimi (Tab-Routing):** Kullanıcı deneyimini (UX) maksimumda tutmak amacıyla sekmeler arası geçişler React State mimarisiyle yönetilir. Tarayıcı yenilenmeden içerikler sıfır gecikmeyle değişir ve API'den çekilen verilerin önbellekte (cache) korunması sağlanır.
- **Tam Fonksiyonel CRUD Matrisi:** Ülkeler arası analiz matrisi sekmesinde yer alan veri tablosu üzerinde ekleme, silme ve düzenleme operasyonları gerçek zamanlı ve reaktif (reactive) olarak çalışır.
- **Gelişmiş Modal Form Yapısı:** Veri manipülasyon süreçlerinde (Create/Update) kullanıcının odaktan kopmasını engellemek amacıyla ekran üzerinde katmanlaşan modern açılır pencereler (Modal Components) kurgulanmıştır.
- **Dinamik SEO Optimizasyonu:** Arama motoru botlarının (Google Crawler) sayfayı hatasız endeksleyebilmesi için `useEffect` döngüsü içinde tarayıcı seviyesinde dinamik başlık (`document.title`) ve meta açıklama (`description`) enjeksiyonu uygulanmıştır.
- **Karar Destek Algoritması:** Enflasyon rasyosu gibi kritik risk barındıran metrikler, sistem tarafından otomatik analiz edilerek risk seviyesine göre (Kırmızı/Yeşil rozetler) koşullu biçimlendirmeye (Conditional Rendering) tabi tutulur.

---

##  Kullanılan Teknolojiler ve Bağımlılıklar

| Teknoloji / Kütüphane | Görevi / İşlevi |
| :--- | :--- |
| **React (v18+)** | Bileşen tabanlı reaktif arayüz mimarisi ve durum (State) yönetimi. |
| **Vite** | Yeni nesil, ultra hızlı frontend derleme ve geliştirme motoru. |
| **Tailwind CSS (v3)** | Utility-first yaklaşımıyla tamamen esnek (responsive) grid ve kurumsal arayüz tasarımı. |
| **World Bank API** | Egemen devletlere ait doğrulanmış makroekonomik makro veri seti sağlayıcısı. |

---

##  Kurulum ve Lokalde Çalıştırma

Projeyi yerel bilgisayarınızda simüle etmek ve kaynak kodlarını çalıştırmak için aşağıdaki adımları takip edebilirsiniz:

1. **Depoyu Bilgisayarınıza Klonlayın:**
   ```bash
   git clone [https://github.com/rozerin00/kuresel-izleyici.git](https://github.com/rozerin00/kuresel-izleyici.git)
