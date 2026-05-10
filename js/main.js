document.addEventListener('DOMContentLoaded', () => {
    console.log("Quantra Systems: Online");

    // --- 1. MOBILE MENU ---
    const hamburger = document.querySelector('.hamburger');
    const sideMenu = document.querySelector('.side-menu');
    const overlay = document.querySelector('.side-menu-overlay');
    const closeBtn = document.querySelector('.close-menu-btn');

    if (hamburger && sideMenu && overlay && closeBtn) {
        hamburger.addEventListener('click', () => {
            sideMenu.classList.add('active');
            overlay.classList.add('active');
        });
        const closeMenu = () => {
            sideMenu.classList.remove('active');
            overlay.classList.remove('active');
        };
        closeBtn.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu);
    }

    // --- 2. FOOTER TERMINAL ---
    function updateTerminal() {
        const timeEl = document.getElementById('live-time');
        const locEl = document.getElementById('live-location');
        const latEl = document.getElementById('live-latency');
        if (timeEl && locEl) {
            const now = new Date();
            timeEl.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            locEl.innerText = timeZone.split('/').pop().replace('_', ' ').toUpperCase();
        }
        if (latEl) {
            latEl.innerText = Math.floor(Math.random() * (35 - 18 + 1)) + 18;
        }
    }
    updateTerminal();
    setInterval(updateTerminal, 3000);

    // --- 3. SOURCE TRACKING (reads ?from= param on every page) ---
    const urlParams = new URLSearchParams(window.location.search);
    const fromSource = urlParams.get('from') || 'direct';

    // --- 4. CONTACT FORM ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const formSourceInput = document.getElementById('form-source');
        const formSourceDisplay = document.getElementById('form-source-display');

        if (formSourceInput) formSourceInput.value = fromSource;
        if (formSourceDisplay) formSourceDisplay.textContent = fromSource;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const source = formSourceInput ? formSourceInput.value : 'direct';
            console.log('Form submission:', {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                company: document.getElementById('company').value,
                bottleneck: document.getElementById('bottleneck').value,
                source
            });
            // TODO: integrate form backend (Formspree / Vercel function / etc.)
            // TODO: Consider changing bottleneck question based on source (e.g. "What's your biggest web challenge?" if from=web-dev)
            window.location.href = '/thank-you?from=' + encodeURIComponent(source);
        });
    }

    // --- 5. THANK-YOU PAGE — contextual back button ---
    const thankYouBackBtn = document.getElementById('thank-you-back-btn');
    if (thankYouBackBtn) {
        if (fromSource === 'web-dev' || fromSource === 'web-dev-final') {
            thankYouBackBtn.textContent = '← Back to Web Development';
            thankYouBackBtn.onclick = () => { window.location.href = '/web-dev'; };
        } else if (fromSource === 'design' || fromSource === 'design-final' || fromSource === 'design-retainer') {
            thankYouBackBtn.textContent = '← Back to Branding & Design';
            thankYouBackBtn.onclick = () => { window.location.href = '/design'; };
        } else if (fromSource === 'it-support') {
            thankYouBackBtn.textContent = '← Back to IT Support';
            thankYouBackBtn.onclick = () => { window.location.href = '/support'; };
        } else {
            thankYouBackBtn.textContent = '← Back to Home';
            thankYouBackBtn.onclick = () => { window.location.href = '/'; };
        }
    }

    // --- 6. FEATURE MODAL (feature cards, infra cards, logo tickers) ---
    const featureCards = document.querySelectorAll('.feature-card, .infra-card, .tier-card, .clickable-logo');
    const featureModal = document.getElementById('feature-modal');
    const closeFeatureBtn = document.getElementById('close-feature-modal');
    const termText = document.getElementById('modal-term-text');
    const paraText = document.getElementById('modal-paragraph-text');
    const modalIcon = document.getElementById('modal-icon');

    const modalContent = {
        // WEB DEV: Feature Cards
        convert: { prompt: ">_ Executing: conversion_protocol.sh", text: "SEO-optimized and engineered to drive traffic straight into your lead pipelines.<br><br>We don't just build pages that look pretty; we build pages that know how to sell and capture user data effectively." },
        mobile:  { prompt: ">_ Executing: responsive_grid.css", text: "Flawless rendering on every device. Because your clients are already on their phones.<br><br>We ensure that touch targets, navigation, and reading experiences are perfectly optimized for mobile screens." },
        custom:  { prompt: ">_ Executing: custom_architecture.js", text: "We write the code. If you can imagine it, we can build it.<br><br>No template restrictions. Whether you need a unique interactive element or a highly specific layout, full control means zero compromises." },
        speed:   { prompt: ">_ Executing: optimize_assets.exe", text: "Optimized assets and clean code ensure your site loads before your clients lose interest.<br><br>Fast load times don't just make for a better user experience; they directly improve your Google search rankings and your bounce rates." },

        // WEB DEV: 3-Tier Cards
        tier1: { prompt: ">_ Executing: init_solopreneur_funnel.sh", text: "Clean, highly-effective landing pages and booking funnels designed for freelancers and coaches.<br><br>Get visitors from reading to booking in seconds without overwhelming them with unnecessary pages or confusing navigation." },
        tier2: { prompt: ">_ Executing: deploy_sme_hub.js", text: "Advanced sites featuring custom lead forms, secure portals, and deep integrations with your existing CRM tools like Pipedrive and ClickUp.<br><br>This is where your website transcends being a brochure and becomes an active part of your daily operations." },
        tier3: { prompt: ">_ Executing: scale_heavyweight_infra.exe", text: "Complex builds for growing brands.<br><br>Robust product catalogs, custom React/JS functionality, and heavy-duty infrastructure that won't break under pressure when your traffic spikes. Built for long-term scalability." },

        // WEB DEV: Tech Stack
        html:    { prompt: ">_ Executing: compile_html5.sh", text: "HTML5 is the structural foundation of the web. We write clean, semantic markup that ensures your website is accessible, SEO-friendly, and structurally sound." },
        css:     { prompt: ">_ Executing: render_css3_styles.css", text: "CSS3 brings the visual magic. We use modern CSS techniques to create fluid animations, responsive layouts, and a pixel-perfect match to your brand's aesthetic." },
        js:      { prompt: ">_ Executing: init_vanilla_js.js", text: "JavaScript is the muscle. We use JS to build dynamic, interactive elements that engage users without relying on bloated, slow-loading third-party plugins." },
        react:   { prompt: ">_ Executing: start_react_app.js", text: "React allows us to build lightning-fast, component-based user interfaces. Perfect for complex dashboards, advanced web apps, and tier-3 scalable infrastructure." },
        webflow: { prompt: ">_ Executing: sync_webflow_cms.sh", text: "Webflow gives us the power to design custom sites visually while generating clean code. It's an excellent option for clients who want a powerful, easy-to-use CMS without the WordPress bloat." },

        // Automation: Feature Cards
        fatigue:   { prompt: ">_ Executing: data_fatigue_override.sh", text: "Let's be real—nobody started a business to spend 4 hours a day copying data from a spreadsheet into a CRM.<br><br>That kind of repetitive admin work doesn't just waste time; it drains your team's mental battery. We build background scripts that handle the copy-pasting for you. Imagine your team logging in and everything is just... there. Updated, synced, and ready to go. You get your time back, and your team gets their sanity back." },
        isolation: { prompt: ">_ Executing: sync_protocols.sh", text: "Ever noticed how Sales has no idea what Marketing is doing, and Operations is just confused?<br><br>That happens when your software tools don't talk to each other. Information gets trapped in silos. We build the digital bridges between your apps. When a lead comes in, the whole pipeline updates instantly. Everyone stays on the exact same page without needing to fire off an email to ask for updates." },
        capacity:  { prompt: ">_ Executing: human_potential.exe", text: "We have a simple rule: let bots do bot things, so humans can do human things.<br><br>Your team's superpower is empathy, strategy, and building relationships—not manual data entry. By automating the mechanical tasks, we free up your people to actually focus on growth. It's not about replacing your staff; it's about giving them iron-man suits." },
        chaos:     { prompt: ">_ Executing: scale_infrastructure.sh", text: "Growing fast is the dream, right? Until your lead volume triples and your current manual systems completely break down.<br><br>Things get missed, clients get dropped, and chaos takes over. True scaling requires infrastructure that doesn't care if you process 10 orders or 10,000. We build systems that absorb the impact of growth silently, so you can scale revenue without scaling your headaches." },

        // Automation: Infra Cards
        websites:  { prompt: ">_ Executing: deploy_optimized_site.sh", text: "A website shouldn't just be a digital business card. It needs to be your best salesperson, working 24/7.<br><br>Forget about broken links, slow load times, and confusing navigation. We build fast, conversion-optimized websites engineered to capture and qualify leads directly into your pipelines." },
        workflows: { prompt: ">_ Executing: init_automation_nodes.js", text: "Drowning in manual admin? We use advanced tools to connect your apps, automate your emails, and manage your tasks invisibly.<br><br>Imagine a world where your software does the heavy lifting. You get the results without the repetitive work, saving you countless hours every week." },
        tech:      { prompt: ">_ Executing: audit_tech_stack.sh", text: "Paying for software you barely use? We've all been there.<br><br>We audit your current tools, eliminate costly overlaps, and design a streamlined system tailored specifically to your business processes. Reduce your overhead, increase your clarity, and finally get tech that doesn't break the bank." },

        // Tools Ticker (Automation page)
        clickup:   { prompt: ">_ Executing: sync_clickup.sh", text: "ClickUp is our central nervous system for project management. We use it to build automated task sequences so nothing falls through the cracks and your operations stay perfectly organized." },
        figma:     { prompt: ">_ Executing: render_ui_assets.exe", text: "Figma is where we architect the visual flow of your platforms. We use it to design rapid, pixel-perfect prototypes before we write a single line of code." },
        gws:       { prompt: ">_ Executing: gws_integration.sh", text: "Google Workspace is essential infrastructure. We integrate Drive, Docs, and Gmail directly into your automated workflows to seamlessly generate and route documents." },
        n8n:       { prompt: ">_ Executing: deploy_n8n_nodes.js", text: "n8n is the invisible engine powering your backend. It's a highly customizable automation tool we use to build the complex bridges between all of your isolated SaaS apps." },
        pipedrive: { prompt: ">_ Executing: sync_pipeline.sh", text: "Pipedrive is a powerhouse for CRM. We configure and automate Pipedrive environments to ensure leads are captured, qualified, and progressed without manual data entry." },
        shopify:   { prompt: ">_ Executing: shopify_webhook.sh", text: "Shopify provides the robust e-commerce backbone. We hook into Shopify's API to trigger post-purchase workflows, sync inventory, and push customer data directly to your CRM." },
        wp:        { prompt: ">_ Executing: wp_headless.sh", text: "WordPress gives us the flexibility to build totally custom web experiences. We build blazing-fast, optimized sites that act as your 24/7 lead-generation engine." },

        // Client logos (empty — modal shows just the terminal prompt)
        tgtrack:    { prompt: ">_ Executing: load_client_profile.sh --target='TG Tracking'", text: "" },
        conveyclear:{ prompt: ">_ Executing: load_client_profile.sh --target='ConveyClear'", text: "" },
        margie:     { prompt: ">_ Executing: load_client_profile.sh --target='Margie'", text: "" },
        spxd:       { prompt: ">_ Executing: load_client_profile.sh --target='SPXD'", text: "" },
        gekko:      { prompt: ">_ Executing: load_client_profile.sh --target='Gekko'", text: "" },

        // --- DESIGN: Feature Cards ---
        memorable: { prompt: ">_ Executing: identity_protocol.sh", text: "Distinctive marks designed to outlive trends.<br><br>We don't chase what's hot this year — we design identities built on timeless principles of contrast, balance, and meaning. Your brand should still look right in five years." },
        scalable:  { prompt: ">_ Executing: vector_export.sh", text: "Every mark we build is vector-first.<br><br>That means it works at 16px on a favicon and at 16 metres on a billboard, without ever pixelating. We deliver every format you'll ever need — SVG, PNG, PDF, AI — so you're never stuck." },
        strategic: { prompt: ">_ Executing: brand_strategy.exe", text: "Beautiful design without strategy is just decoration.<br><br>Before we open Illustrator, we map your business goals, your audience's gut reactions, and what your competitors are already doing. Then we design the thing that cuts through." },
        ondemand:  { prompt: ">_ Executing: queue_design_request.js", text: "Design shouldn't be a panic.<br><br>Our retainer plans give you a dedicated designer on call. Submit a request, we deliver in 24-48 hours. Cancel anytime. It's design as a subscription — flat fee, no surprises." },

        // --- DESIGN: 3-Tier Cards ---
        logo_lite:      { prompt: ">_ Executing: init_logo_lite.sh", text: "The starter package. 2-3 logo concepts, 2 rounds of revisions, all the file formats you'll need, plus a basic color palette and font pairing.<br><br>Designed for solopreneurs who need to start trading and look credible doing it. Quick turnaround, sharp result." },
        brand_identity: { prompt: ">_ Executing: deploy_brand_identity.sh", text: "Logo + extended variations (horizontal, stacked, monochrome), full brand guidelines PDF, business cards, email signatures.<br><br>For businesses that need to look credible across every touchpoint — proposals, meetings, press, packaging. The full kit." },
        full_brand:     { prompt: ">_ Executing: scale_full_brand.exe", text: "Everything in the Brand Identity tier, plus social media template kits, pitch deck templates, print-ready signage, and a 1-page brand strategy document.<br><br>Built for launches, rebrands, and businesses scaling fast across multiple channels at once." },

        // --- DESIGN: Tools ---
        illustrator: { prompt: ">_ Executing: launch_illustrator.ai", text: "Adobe Illustrator is our vector workhorse — it's where every logo, icon, and infinitely scalable identity element lives. Industry standard for a reason." },
        photoshop:   { prompt: ">_ Executing: launch_photoshop.psd", text: "Photoshop handles the pixel-level work — composites, photo retouching, complex social graphics, and anything where raster meets vector." },
        indesign:    { prompt: ">_ Executing: launch_indesign.indd", text: "InDesign is where multi-page documents come to life — brand guidelines, pitch decks, brochures, magazines. Print-ready, properly typeset, no compromises." },
        affinity:    { prompt: ">_ Executing: launch_affinity.afdesign", text: "Affinity Designer is our nimble alternative for vector work — fast, powerful, and a fresh take when Adobe feels heavy. Great for rapid concept exploration." },
        procreate:   { prompt: ">_ Executing: launch_procreate.ipad", text: "Procreate on iPad is where rough concepts get sketched fast. Hand-drawn marks, illustrative ideas, anything that benefits from getting away from the cursor." },
        canva:       { prompt: ">_ Executing: launch_canva.web", text: "Canva is the right tool for one specific job: handing clients editable templates they can update themselves. We build the master, they do the variations." },

        // --- IT SUPPORT: Service Tiers ---
        support_lite: {
            prompt: "Lite plan &mdash; for small ongoing fixes",
            text: "5 support tasks per month, with a 48-hour turnaround on most requests.<br><br>This tier is built for business owners who don't need much help, but when they do, they want someone reliable. Spreadsheet fixes, document templates, getting that printer working, sorting out email &mdash; the stuff that piles up when you don't have an IT person.<br><br>Cancel any time. No annual contracts."
        },
        support_standard: {
            prompt: "Standard plan &mdash; where most clients live",
            text: "12 support tasks per month, with a 24-hour turnaround.<br><br>Everything in Lite, plus we'll set up software for you (CRMs, accounting tools, project management apps), build automated reports, and create small workflows that save you hours every week.<br><br>This is the sweet spot for most businesses. Enough capacity to actually move things forward, without paying for capacity you won't use."
        },
        support_pro: {
            prompt: "Pro plan &mdash; your IT department on retainer",
            text: "Unlimited tasks (queue-based, one at a time), same-day turnaround on simple things, plus direct WhatsApp access during business hours.<br><br>This tier is for business owners who want tech to stop being a thing they think about. Includes large data migrations, more complex automations, and the kind of \"can you just sort this out\" support that means you never need to Google how to do something again.<br><br>Cancel any time. No annual contracts."
        }
    };

    if (featureCards.length > 0 && featureModal) {
        featureCards.forEach(card => {
            card.addEventListener('click', () => {
                const modalId = card.getAttribute('data-modal');
                if (modalContent[modalId]) {
                    let cardIcon = '';
                    if (card.tagName.toLowerCase() === 'img') {
                        cardIcon = card.getAttribute('src');
                    } else {
                        const iconEl = card.querySelector('.feature-svg, .infra-icon');
                        cardIcon = iconEl ? iconEl.getAttribute('src') : '';
                    }
                    termText.innerHTML = modalContent[modalId].prompt;
                    if (modalContent[modalId].text === '') {
                        paraText.style.display = 'none';
                    } else {
                        paraText.style.display = 'block';
                        paraText.innerHTML = modalContent[modalId].text;
                    }
                    if (cardIcon) {
                        modalIcon.setAttribute('src', cardIcon);
                        modalIcon.style.display = 'block';
                    } else {
                        modalIcon.setAttribute('src', '');
                        modalIcon.style.display = 'none';
                    }
                    featureModal.classList.add('active');
                }
            });
        });
        closeFeatureBtn.addEventListener('click', () => featureModal.classList.remove('active'));
        featureModal.addEventListener('click', (e) => {
            if (e.target === featureModal) featureModal.classList.remove('active');
        });
    }

    // --- 7. PROCESS MODAL ---
    const processCards = document.querySelectorAll('.process-step-card');
    const processModal = document.getElementById('process-modal');
    const closeProcessBtn = document.getElementById('close-process-modal');
    const processModalCard = processModal ? processModal.querySelector('.glass-modal-card') : null;
    const processTermText = document.getElementById('process-term-text');
    const processParaText = document.getElementById('process-paragraph-text');

    const processModalContent = {
        discovery: {
            prompt: ">_ Executing: discovery_protocol.sh",
            text: "So, the 'Discovery Call' sounds corporate, but it's really just us getting to know each other. It's a zero-pressure chat—no selling, I promise.<br><br>We're basically 'peeking under the hood' of your business. We'll map out where you're wasting time on things like manual data entry, what software you use, and where the biggest bottlenecks are hiding. Think of it as a systems health-check. You'll leave with a clear picture of your operational gaps, whether you work with us or not.",
            tint: 'modal-step-green'
        },
        blueprint: {
            prompt: ">_ Executing: generate_architecture_blueprint.exe",
            text: "This is where the magic (or rather, the data science) happens. If the discovery call shows we're a good fit, I'll get to work creating your custom 'Digital Architecture Plan.'<br><br>This is a real-deal blueprint—a clear, visual flowchart of how we can connect your existing apps and automate your workflows, tailored for your specific needs. It's designed to solve the bottlenecks we found. No guesses. You also get a transparent, plain-English quote. It's your 'what, how, and how much' document, giving you total clarity before you commit.",
            tint: 'modal-step-blue'
        },
        build: {
            prompt: ">_ Executing: commit_to_production.sh",
            text: "Okay, you approve the blueprint and the quote, and we get building! This is where we bring your custom, invisible systems to life.<br><br>But here's the thing—a lot of builders build and then disappear. Not us. The 'Maintain' part is just as crucial. Our tailored retention packages mean we handle the boring-but-essential stuff like hosting, updates, and optimization. Essentially, we make sure the systems we build *never break*, so you can focus on running your newly-efficient business without becoming a part-time IT manager.",
            tint: 'modal-step-purple'
        },
        web_discovery: {
            prompt: ">_ Executing: strategy_mapping.sh",
            text: "We map out your goals, your target audience, and the exact functionality you need to succeed. No tech jargon, just business strategy.<br><br>We figure out exactly what your website needs to *do* to generate ROI before we even think about how it looks.",
            tint: 'modal-step-green'
        },
        web_design: {
            prompt: ">_ Executing: architect_prototype.exe",
            text: "We architect the site with full customizability. You get rapid, pixel-perfect prototypes in Figma before we write a single line of code.<br><br>This ensures you are 100% happy with the look, feel, and user journey before development begins.",
            tint: 'modal-step-blue'
        },
        web_launch: {
            prompt: ">_ Executing: deploy_to_client_hosting.sh",
            text: "We deploy your site on *your* hosting—you own all your assets and domains.<br><br>From there, we transition into a monthly Care Plan where we handle all updates, security patches, and minor changes so your site stays healthy, fast, and secure while you focus on running your business.",
            tint: 'modal-step-purple'
        },

        // --- DESIGN: Process Steps ---
        design_discovery: {
            prompt: ">_ Executing: brand_discovery.sh",
            text: "The discovery phase isn't a kickoff call — it's the foundation. You'll fill out a deep brand questionnaire covering your business, your audience, and what you want people to feel when they see your mark.<br><br>We'll also map your competition so we know what NOT to look like. By the end, we have a clear creative direction before any design work starts. No guesswork.",
            tint: 'modal-step-green'
        },
        design_concepts: {
            prompt: ">_ Executing: generate_concepts.exe",
            text: "We come back with 2-3 distinct concept directions — not minor variations of the same idea, but genuinely different approaches. You pick the one that resonates.<br><br>From there, 2 rounds of focused revisions to refine the chosen direction. We don't do design-by-committee. Clear feedback, decisive iterations, no endless tweaking. The brief is locked when you approve.",
            tint: 'modal-step-blue'
        },
        design_launch: {
            prompt: ">_ Executing: deliver_brand_assets.sh",
            text: "You get the works — every file format you'll ever need (PNG, SVG, PDF, AI), full brand guidelines documenting how your identity should be used, and source files in case your future designer needs them.<br><br>From there, you can roll into a retainer for ongoing design work, or just disappear into the sunset with your beautiful new brand. Both are fine.",
            tint: 'modal-step-purple'
        }
    };

    if (processCards.length > 0 && processModal) {
        processCards.forEach(card => {
            card.addEventListener('click', () => {
                const stepId = card.getAttribute('data-step');
                const content = processModalContent[stepId];
                if (content) {
                    processTermText.innerHTML = content.prompt;
                    processParaText.innerHTML = content.text;
                    processModalCard.classList.remove('modal-step-green', 'modal-step-blue', 'modal-step-purple');
                    processModalCard.classList.add(content.tint);
                    processModal.classList.add('active');
                }
            });
        });
        closeProcessBtn.addEventListener('click', () => processModal.classList.remove('active'));
        processModal.addEventListener('click', (e) => {
            if (e.target === processModal) processModal.classList.remove('active');
        });
    }

}); // DOMContentLoaded
