document.addEventListener('DOMContentLoaded', () => {
  // 1. إضاءة الماوس
  const mouseGlow = document.querySelector('.mouse-glow');
  document.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
  });

  // 2. أنيميشن الظهور
  const revealElements = document.querySelectorAll('.reveal-elem');
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { root: null, threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // =========================================================================
  // 3. الحل الجذري للتنقل صعوداً وهبوطاً مع تجاهل خدعة الـ Sticky
  // =========================================================================
  const sections = document.querySelectorAll('.stacking-section');
  const navLinks = document.querySelectorAll('.nav-link');
  let sectionPositions = {};

  // دالة لحساب الأماكن الحقيقية للأقسام في الصفحة
  function calculatePositions() {
    // بنوقف الـ sticky لحظياً عشان ناخد المكان الحقيقي في الصفحة
    sections.forEach((sec) => (sec.style.position = 'relative'));

    sections.forEach((sec) => {
      sectionPositions[sec.id] =
        sec.getBoundingClientRect().top + window.scrollY;
    });

    // بنرجع الـ sticky تاني
    sections.forEach((sec) => (sec.style.position = ''));
  }

  // تشغيل الدالة أول ما الصفحة تفتح ولما الشاشة تتغير
  calculatePositions();
  window.addEventListener('load', calculatePositions);
  window.addEventListener('resize', calculatePositions);

  // سكريبت التنقل لما تضغط على أي رابط
  navLinks.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);

      // بيسحب الشاشة للمكان اللي إحنا حسبناه فوق (بيطلع وبينزل عادي جداً)
      if (targetId && sectionPositions[targetId] !== undefined) {
        window.scrollTo({
          top: sectionPositions[targetId],
          behavior: 'smooth',
        });
      }

      // قفل القائمة في الموبايل
      const navbarCollapse = document.getElementById('navbarNav');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        new bootstrap.Collapse(navbarCollapse).hide();
      }
    });
  });

  // =========================================================================
  // 4. تتبع الخط تحت الأقسام أثناء التمرير بدقة
  // =========================================================================
  window.addEventListener('scroll', () => {
    let currentSection = 'hero';
    // بنحسب السكرول ونضيف عليه ثلث الشاشة عشان القسم ينشط بمجرد ما يظهر قدامك
    const currentScroll = window.scrollY + window.innerHeight / 3;

    for (const [id, position] of Object.entries(sectionPositions)) {
      if (currentScroll >= position) {
        currentSection = id;
      }
    }

    // تفعيل الكلاس active
    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // 5. زر تغيير اللغة
  const langBtnDesktop = document.getElementById('lang-btn');
  const langBtnMobile = document.getElementById('lang-btn-mobile');
  let currentLang = 'en';

  function toggleLanguage() {
    const html = document.documentElement;

    if (currentLang === 'en') {
      currentLang = 'ar';
      html.setAttribute('dir', 'rtl');
      html.setAttribute('lang', 'ar');
      langBtnDesktop.innerText = 'EN / English';
      langBtnMobile.innerText = 'EN';

      document
        .querySelectorAll('.lang-en')
        .forEach((el) => el.classList.add('d-none'));
      document
        .querySelectorAll('.lang-ar')
        .forEach((el) => el.classList.remove('d-none'));
    } else {
      currentLang = 'en';
      html.setAttribute('dir', 'ltr');
      html.setAttribute('lang', 'en');
      langBtnDesktop.innerText = 'عربى / AR';
      langBtnMobile.innerText = 'AR';

      document
        .querySelectorAll('.lang-ar')
        .forEach((el) => el.classList.add('d-none'));
      document
        .querySelectorAll('.lang-en')
        .forEach((el) => el.classList.remove('d-none'));
    }
  }

  if (langBtnDesktop) langBtnDesktop.addEventListener('click', toggleLanguage);
  if (langBtnMobile) langBtnMobile.addEventListener('click', toggleLanguage);
});
