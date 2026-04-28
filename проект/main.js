// main.js
(function() {
    // --------------------------------------------------------------
    // 1. Плавная прокрутка (Lenis)
    // --------------------------------------------------------------
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
    });
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // --------------------------------------------------------------
    // 2. Анимация появления текстовых блоков
    // --------------------------------------------------------------
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = "translate 1s ease-out forwards";
            }
        });
    });
    document.querySelectorAll(".hidden").forEach(el => observer.observe(el));

    // --------------------------------------------------------------
    // 3. Тест-опросник (ДДО)
    // --------------------------------------------------------------
    class ProfTest {
        constructor() {
            this.pairs = [
                { left: "Ухаживать за животными", right: "Обслуживать машины или приборы", leftCat: "nature", rightCat: "tech" },
                { left: "Помогать больным людям, лечить их", right: "Составлять таблицы, схемы, программы для компьютеров", leftCat: "human", rightCat: "sign" },
                { left: "Следить за качеством книжных иллюстраций, плакатов, художественных открыток", right: "Наблюдать и изучать жизнь растений", leftCat: "art", rightCat: "nature" },
                { left: "Обрабатывать различные материалы (дерево, ткань, металл, пластик)", right: "Доводить товары до потребителя, заниматься их рекламой и продажей", leftCat: "tech", rightCat: "human" },
                { left: "Обсуждать научно-популярные книги и статьи", right: "Обсуждать художественные произведения (спектакли, концерты, книги)", leftCat: "sign", rightCat: "art" },
                { left: "Содержать и ухаживать за животными (в зоопарке, питомнике)", right: "Тренировать товарищей, помогать им осваивать новые навыки", leftCat: "nature", rightCat: "human" },
                { left: "Копировать рисунки, настраивать музыкальные инструменты", right: "Управлять подъемным краном, трактором, тепловозом", leftCat: "art", rightCat: "tech" },
                { left: "Сообщать, разъяснять людям нужную информацию (в справочном бюро, на экскурсии)", right: "Художественно оформлять выставки, витрины, участвовать в подготовке спектаклей", leftCat: "human", rightCat: "art" },
                { left: "Ремонтировать вещи, жилище, технику", right: "Искать и исправлять ошибки в текстах, таблицах, рисунках", leftCat: "tech", rightCat: "sign" },
                { left: "Изучать состояние воды, почвы, воздуха, следить за экологией", right: "Выполнять различные вычисления и расчеты", leftCat: "nature", rightCat: "sign" },
                { left: "Изучать строение живых клеток, микроорганизмов", right: "Изучать причины поступков и внутренний мир людей", leftCat: "nature", rightCat: "human" },
                { left: "Работать в сфере рекламы, консультировать людей", right: "Работать с таблицами, чертежами, схемами", leftCat: "human", rightCat: "sign" },
                { left: "Декламировать стихи, прозу, играть на сцене", right: "Изучать особенности поведения животных", leftCat: "art", rightCat: "nature" },
                { left: "Регулировать работу приборов и машин", right: "Обучать и воспитывать детей", leftCat: "tech", rightCat: "human" },
                { left: "Редактировать и проверять тексты на ошибки", right: "Заниматься дизайном, оформлением", leftCat: "sign", rightCat: "art" },
                { left: "Выращивать овощи, фрукты или цветы", right: "Работать с посетителями в музее, экскурсоводом", leftCat: "nature", rightCat: "human" },
                { left: "Играть на сцене или петь в хоре", right: "Ремонтировать и настраивать технику", leftCat: "art", rightCat: "tech" },
                { left: "Помогать разрешать споры между людьми", right: "Создавать картины, иллюстрации", leftCat: "human", rightCat: "art" },
                { left: "Наблюдать за работой сложных механизмов", right: "Расшифровывать шифры, анализировать данные", leftCat: "tech", rightCat: "sign" },
                { left: "Заботиться о здоровье и развитии животных", right: "Работать с финансовой отчетностью, цифрами", leftCat: "nature", rightCat: "sign" }
            ];
            this.answers = new Array(this.pairs.length).fill(null);
            this.currentPair = 0;
            this.showPair(0);
            this.attachEvents();
        }

        showPair(index) {
            const container = document.querySelector('.test-container');
            if (!container) return;
            container.style.display = 'block';
            const resultCard = document.querySelector('.result-card');
            if (resultCard) resultCard.classList.add('hidden');
            const pair = this.pairs[index];
            const selected = this.answers[index];
            container.innerHTML = `
                <div class="test-progress">
                    <div class="progress-bar"><div class="progress-fill" style="width: ${(index+1)/this.pairs.length*100}%"></div></div>
                    <span class="progress-text">Выбор ${index+1} из ${this.pairs.length}</span>
                </div>
                <div class="test-instruction"> Выберите, что вам ближе </div>
                <div class="pair-options">
                    <label class="pair-option ${selected === 'left' ? 'selected' : ''}">
                        <input type="radio" name="pair" value="left" ${selected === 'left' ? 'checked' : ''}>
                        <span class="pair-text">${pair.left}</span>
                    </label>
                    <label class="pair-option ${selected === 'right' ? 'selected' : ''}">
                        <input type="radio" name="pair" value="right" ${selected === 'right' ? 'checked' : ''}>
                        <span class="pair-text">${pair.right}</span>
                    </label>
                </div>
                <div class="test-navigation">
                    <button class="nav-btn prev-btn" ${index === 0 ? 'disabled' : ''}>← Назад</button>
                    <button class="nav-btn next-btn" ${!selected ? 'disabled' : ''}>${index === this.pairs.length - 1 ? 'Узнать результат' : 'Далее →'}</button>
                </div>
            `;
        }

        attachEvents() {
            document.addEventListener('click', (e) => {
                if (e.target.matches('input[type="radio"]')) {
                    const value = e.target.value;
                    this.answers[this.currentPair] = value;
                    document.querySelectorAll('.pair-option').forEach(opt => opt.classList.remove('selected'));
                    e.target.closest('.pair-option').classList.add('selected');
                    const nextBtn = document.querySelector('.next-btn');
                    if (nextBtn) nextBtn.disabled = false;
                }
                if (e.target.matches('.next-btn') && !e.target.disabled) {
                    if (this.currentPair === this.pairs.length - 1) this.showResult();
                    else { this.currentPair++; this.showPair(this.currentPair); }
                }
                if (e.target.matches('.prev-btn') && !e.target.disabled) {
                    this.currentPair--;
                    this.showPair(this.currentPair);
                }
                if (e.target.matches('.restart-btn')) this.restartTest();
                if (e.target.matches('.vuz-btn')) {
                    const vuzSection = document.querySelector('#vuz');
                    if (vuzSection) vuzSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        calculateScores() {
            const scores = { tech: 0, human: 0, sign: 0, nature: 0, art: 0 };
            for (let i = 0; i < this.pairs.length; i++) {
                const answer = this.answers[i];
                if (!answer) continue;
                const pair = this.pairs[i];
                const category = answer === 'left' ? pair.leftCat : pair.rightCat;
                scores[category]++;
            }
            return scores;
        }

        getCategoryName(category) {
            const names = {
                tech: 'Человек-Техника (инженеры, программисты, механики)',
                human: 'Человек-Человек (врачи, учителя, менеджеры)',
                sign: 'Человек-Знак (бухгалтеры, аналитики, переводчики)',
                nature: 'Человек-Природа (экологи, агрономы, биологи)',
                art: 'Человек-Художественный образ (дизайнеры, актёры, музыканты)'
            };
            return names[category];
        }

        getProfessions(category) {
            const professions = {
                tech: ["Программист – создание сайтов, приложений", "Инженер-конструктор – проектирование техники", "Робототехник – разработка автоматизированных систем"],
                human: ["Врач – диагностика и лечение", "Психолог – консультирование, поддержка", "Учитель – обучение и воспитание"],
                sign: ["Бухгалтер – ведение финансовой отчётности", "Аналитик данных – обработка информации", "Экономист – планирование бюджета"],
                nature: ["Эколог – защита окружающей среды", "Агроном – сельское хозяйство", "Биолог – изучение живых организмов"],
                art: ["Графический дизайнер – создание визуала", "Актёр – театр и кино", "Музыкант – исполнение и сочинение музыки"]
            };
            return professions[category];
        }

        getCombinedProfessions(primary, secondary) {
            const combos = {
                "tech_art": ["3D-дизайнер – создание трёхмерных моделей для игр и кино", "Промышленный дизайнер – проектирование внешнего вида устройств", "UI/UX дизайнер – дизайн интерфейсов"],
                "tech_human": ["Инженер по эргономике – проектирование удобных рабочих мест", "Медицинский инженер – обслуживание диагностического оборудования", "Преподаватель робототехники"],
                "tech_sign": ["IT-аналитик – анализ требований и технических систем", "Инженер по качеству – контроль и стандартизация", "Системный администратор баз данных"],
                "tech_nature": ["Инженер-эколог – очистные сооружения, мониторинг", "Агроинженер – автоматизация сельского хозяйства", "Биотехнолог – использование микроорганизмов"],
                "human_art": ["Арт-терапевт – психотерапия через творчество", "Продюсер культурных проектов", "Event-менеджер – проведение мероприятий"],
                "human_sign": ["Бизнес-аналитик – анализ потребностей и данных", "HR-аналитик – подбор персонала с использованием статистики", "Социальный аналитик"],
                "human_nature": ["Ветеринарный реабилитолог – помощь животным", "Экопсихолог – психологическая помощь через общение с природой", "Организатор эковолонтёрства"],
                "art_sign": ["Веб-дизайнер – дизайн сайтов с учётом юзабилити", "Арт-директор – управление творческой командой", "Архитектор – сочетание чертежей и художественного замысла"],
                "art_nature": ["Ландшафтный дизайнер – озеленение", "Фотограф дикой природы", "Флорист – создание композиций"],
                "sign_nature": ["Экономист природопользования", "Картограф – создание цифровых карт", "Статистик в сфере экологии"]
            };
            const key = `${primary}_${secondary}`;
            const revKey = `${secondary}_${primary}`;
            return combos[key] || combos[revKey] || ["Подумайте о профессиях, объединяющих ваши интересы"];
        }

        showResult() {
            const scores = this.calculateScores();
            const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
            const primaryCat = sorted[0][0];
            const secondaryCat = sorted[1][0];
            const primaryPercent = Math.round((sorted[0][1] / this.pairs.length) * 100);
            const secondaryPercent = Math.round((sorted[1][1] / this.pairs.length) * 100);
            const testContainer = document.querySelector('.test-container');
            const resultCard = document.querySelector('.result-card');
            testContainer.style.display = 'none';
            resultCard.classList.remove('hidden');
            const resultContent = document.querySelector('.result-content');
            const standardProfessions = this.getProfessions(primaryCat);
            let combinedHtml = '';
            if (secondaryPercent > 0 && primaryCat !== secondaryCat) {
                const combined = this.getCombinedProfessions(primaryCat, secondaryCat);
                if (combined && combined.length) {
                    combinedHtml = `<div class="combined-professions-box"><h4>На стыке направлений</h4><ul class="professions-list">${combined.map(p => `<li>${p}</li>`).join('')}</ul></div>`;
                }
            }
            resultContent.innerHTML = `
                <div class="result-category"><h4>Основное направление</h4><p><strong>${this.getCategoryName(primaryCat)}</strong></p><div class="percent-badge">${primaryPercent}% совпадений</div></div>
                <div class="result-category"><h4>Дополнительное направление</h4><p><strong>${this.getCategoryName(secondaryCat)}</strong></p><div class="percent-badge">${secondaryPercent}% совпадений</div></div>
                <div class="professions-box"><h4>Классические профессии</h4><ul class="professions-list">${standardProfessions.map(p => `<li>${p}</li>`).join('')}</ul></div>
                ${combinedHtml}
            `;
        }

        restartTest() {
            this.answers = new Array(this.pairs.length).fill(null);
            this.currentPair = 0;
            this.showPair(0);
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (!window.profTestInstance) window.profTestInstance = new ProfTest();
    });

    // --------------------------------------------------------------
    // 4. Карусель вузов
    // --------------------------------------------------------------
    class SingleCarousel {
        constructor() {
            this.track = document.querySelector('.carousel-track');
            this.prevBtn = document.querySelector('.prev-arrow');
            this.nextBtn = document.querySelector('.next-arrow');
            this.currentSpan = document.querySelector('.current-slide');
            this.totalSpan = document.querySelector('.total-slides');
            this.cards = document.querySelectorAll('.vuz-card');
            this.currentIndex = 0;
            this.totalCards = this.cards.length;
            this.startX = 0;
            this.diffX = 0;
            this.isDragging = false;
            if (this.totalSpan) this.totalSpan.textContent = this.totalCards;
            this.updateButtons();
            this.initEvents();
            this.initSwipe();
            window.addEventListener('resize', () => this.moveToCurrentSlide());
        }

        initEvents() {
            if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.slide('prev'));
            if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.slide('next'));
        }

        initSwipe() {
            const viewport = document.querySelector('.carousel-viewport');
            if (!viewport) return;
            viewport.addEventListener('touchstart', (e) => { this.startX = e.touches[0].clientX; this.isDragging = true; });
            viewport.addEventListener('touchmove', (e) => { if (this.isDragging) this.diffX = e.touches[0].clientX - this.startX; });
            viewport.addEventListener('touchend', () => {
                if (!this.isDragging) return;
                if (Math.abs(this.diffX) > 60) this.diffX > 0 ? this.slide('prev') : this.slide('next');
                this.isDragging = false; this.diffX = 0;
            });
        }

        slide(direction) {
            if (direction === 'prev' && this.currentIndex > 0) this.currentIndex--;
            else if (direction === 'next' && this.currentIndex < this.totalCards - 1) this.currentIndex++;
            this.moveToCurrentSlide();
        }

        moveToCurrentSlide() {
            if (!this.track) return;
            const viewport = document.querySelector('.carousel-viewport');
            const viewportWidth = viewport ? viewport.offsetWidth : 600;
            this.track.style.transform = `translateX(${-this.currentIndex * viewportWidth}px)`;
            if (this.currentSpan) this.currentSpan.textContent = this.currentIndex + 1;
            this.updateButtons();
        }

        updateButtons() {
            if (this.prevBtn) this.prevBtn.disabled = this.currentIndex === 0;
            if (this.nextBtn) this.nextBtn.disabled = this.currentIndex === this.totalCards - 1;
        }
    }
    document.addEventListener('DOMContentLoaded', () => new SingleCarousel());

    // --------------------------------------------------------------
    // 5. Навигация по якорям + активный пункт меню
    // --------------------------------------------------------------
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                window.scrollTo({ top: target.offsetTop - navbarHeight, behavior: 'smooth' });
            }
        });
    });

    function updateActiveNavItem() {
        const sections = document.querySelectorAll('#home, #vuz, #test, #contacts');
        const navLinks = document.querySelectorAll('.nav-menu a');
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - navbarHeight - 100;
            const bottom = top + section.offsetHeight;
            if (window.scrollY >= top && window.scrollY < bottom) current = section.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) link.classList.add('active');
        });
    }
    window.addEventListener('scroll', updateActiveNavItem);
    window.addEventListener('load', updateActiveNavItem);
    if (window.lenis) lenis.on('scroll', updateActiveNavItem);

    // --------------------------------------------------------------
    // 6. Кнопка "Наверх"
    // --------------------------------------------------------------
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-to-top';
    scrollTopBtn.innerHTML = '↑';
    document.body.appendChild(scrollTopBtn);
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) scrollTopBtn.classList.add('visible');
        else scrollTopBtn.classList.remove('visible');
    });
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();