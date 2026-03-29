import re

def update_html():
    with open('inex.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update CSS
    new_css = """<style>
    /* ROOT COLORS */
    :root {
      --bg: #0d0d12;
      --surface: #14141e;
      --surface2: #1c1c2a;
      --border: rgba(255, 255, 255, 0.07);
      --border2: rgba(255, 255, 255, 0.13);
      --accent: #06b6d4;      /* Vibrant Teal */
      --accent2: #22d3ee;     /* Lighter Teal */
      --accent-glow: rgba(6, 182, 212, 0.25);
      --green: #34d399;
      --amber: #fbbf24;
      --red: #f87171;
      --text: #f1f0ff;
      --muted: #8b8aaa;
      --muted2: #5a5978;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: "DM Sans", sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      overflow-x: hidden;
    }

    /* Noise Background */
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      opacity: 0.03;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      z-index: 0;
    }

    /* Glow Blobs */
    .blob {
      position: fixed;
      border-radius: 50%;
      filter: blur(80px);
      pointer-events: none;
      z-index: 0;
    }

    .blob1 {
      width: 400px;
      height: 400px;
      background: rgba(6, 182, 212, 0.12); /* Teal */
      top: -100px;
      left: -80px;
    }

    .blob2 {
      width: 300px;
      height: 300px;
      background: rgba(52, 211, 153, 0.08); /* Green */
      bottom: -60px;
      right: -60px;
    }

    .wrapper {
      max-width: 960px;
      margin: 0 auto;
      padding: 0 24px 80px;
      position: relative;
      z-index: 1;
    }

    /* HEADER */
    header {
      display: flex;
      justify-content: space-between;
      padding: 28px 0 36px;
      border-bottom: 0.5px solid var(--border);
      margin-bottom: 40px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: "Syne", sans-serif;
      font-size: 22px;
      font-weight: 800;
      color: var(--text);
    }

    .logo-dot {
      width: 10px;
      height: 10px;
      background: var(--accent);
      border-radius: 50%;
      box-shadow: 0 0 12px var(--accent-glow);
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(0.8); opacity: 0.6; }
    }

    .status-pill {
      font-size: 12px;
      padding: 6px 14px;
      border-radius: 999px;
      border: 0.5px solid var(--border2);
      background: rgba(28, 28, 42, 0.4);
      backdrop-filter: blur(8px);
      color: var(--muted);
      display: flex;
      align-items: center;
    }

    .status-pill span {
      color: var(--green);
      margin-right: 6px;
    }

    .status-pill.offline span {
      color: var(--red);
    }

    /* SECTION TITLE */
    .section-title {
      font-family: "Syne", sans-serif;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--muted2);
      margin-bottom: 16px;
    }

    /* PANELS (Glassmorphism & Fade-in) */
    .panel {
      display: none;
      background: rgba(20, 20, 30, 0.4);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 32px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);
    }

    .panel.active {
      display: block;
      animation: fadeIn 0.5s ease-out forwards;
    }

    @keyframes fadeIn {
      0% { opacity: 0; transform: translateY(10px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    /* UPLOAD BOX */
    .upload-area {
      border: 2px dashed var(--border2);
      border-radius: 20px;
      padding: 40px 24px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: rgba(28, 28, 42, 0.5);
      position: relative;
    }

    .upload-area:hover {
      border-color: var(--accent);
      background: rgba(6, 182, 212, 0.08);
      box-shadow: 0 0 20px var(--accent-glow); /* Glowing border effect */
    }

    .upload-area.drag-over {
      border-color: var(--accent);
      background: rgba(6, 182, 212, 0.15);
      transform: scale(1.02);
      box-shadow: 0 0 25px var(--accent-glow);
    }

    .upload-area input {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
    }

    .upload-icon {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      background: rgba(6, 182, 212, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      margin: 0 auto 16px;
      transition: transform 0.3s;
    }

    .upload-area.drag-over .upload-icon {
      transform: translateY(-8px) scale(1.1);
      animation: bounce 0.5s infinite alternate;
    }

    @keyframes bounce {
      from { transform: translateY(-8px) scale(1.1); }
      to { transform: translateY(-2px) scale(1.1); }
    }

    .upload-types {
      display: flex;
      gap: 8px;
      justify-content: center;
      margin-top: 16px;
    }

    .type-badge {
      font-size: 11px;
      border-radius: 999px;
      padding: 4px 12px;
      border: 0.5px solid var(--border2);
      background: var(--surface2);
      color: var(--muted);
    }

    /* FILE LIST */
    .file-list {
      margin-top: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .file-item {
      background: rgba(28, 28, 42, 0.6);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 0.5px solid var(--border2);
      border-radius: 16px;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      animation: slideUpFade 0.4s ease-out;
    }

    @keyframes slideUpFade {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .file-ext {
      background: rgba(6, 182, 212, 0.15);
      color: var(--accent2);
      width: 44px;
      height: 44px;
      border-radius: 12px;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
    }

    .file-name {
      font-size: 15px;
      font-weight: 500;
      color: var(--text);
    }

    .file-size {
      font-size: 13px;
      color: var(--muted);
      margin-top: 4px;
    }

    .badge {
      font-size: 11px;
      padding: 3px 10px;
      border-radius: 999px;
    }

    .badge-green {
      background: rgba(52, 211, 153, 0.12);
      color: var(--green);
    }

    .remove-btn {
      margin-left: auto;
      background: transparent;
      border: none;
      color: var(--muted2);
      cursor: pointer;
      font-size: 24px;
      transition: 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }

    .remove-btn:hover {
      color: var(--red);
      background: rgba(248, 113, 113, 0.1);
    }

    /* STEPS */
    .steps {
      display: flex;
      gap: 0;
      margin-bottom: 40px;
      position: relative;
    }

    /* Connecting Line */
    .steps::before {
      content: '';
      position: absolute;
      top: 20px;
      left: 10%;
      right: 10%;
      height: 2px;
      background: var(--border2);
      z-index: 0;
    }

    .steps-progress {
      position: absolute;
      top: 20px;
      left: 10%;
      height: 2px;
      background: var(--accent);
      z-index: 0;
      transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .step {
      flex: 1;
      text-align: center;
      cursor: pointer;
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .step-num {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: var(--surface);
      border: 2px solid var(--border2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: "Syne";
      font-weight: 700;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      color: var(--text);
    }

    .step.active .step-num {
      background: var(--accent);
      border-color: var(--accent);
      color: #0d0d12;
      transform: scale(1.15);
      box-shadow: 0 0 16px var(--accent-glow);
    }

    .step-label {
      font-size: 13px;
      margin-top: 12px;
      color: var(--muted);
      font-weight: 500;
      transition: color 0.3s;
    }

    .step.active .step-label {
      color: var(--text);
    }

    /* BUTTONS */
    .btn-primary {
      padding: 14px 28px;
      border-radius: 20px; /* Enhanced border-radius */
      background: var(--accent);
      color: #0d0d12;
      border: none;
      cursor: pointer;
      font-weight: 600;
      font-size: 15px;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .btn-primary:hover:not(:disabled) {
      background: var(--accent2);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px var(--accent-glow);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--muted2);
      color: var(--muted);
      box-shadow: none;
      transform: none;
    }

    .btn-outline {
      padding: 13px 26px;
      border-radius: 20px; /* Enhanced border-radius */
      border: 1px solid var(--border2);
      background: transparent;
      color: var(--text);
      cursor: pointer;
      font-weight: 500;
      font-size: 15px;
      transition: all 0.2s;
      margin-right: 12px;
      margin-top: 12px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .btn-outline:hover {
      border-color: var(--accent);
      background: rgba(6, 182, 212, 0.08);
      color: var(--accent2);
    }

    /* SPINNER */
    .spinner {
      display: inline-block;
      width: 18px;
      height: 18px;
      border: 2.5px solid rgba(255, 255, 255, 0.2);
      border-top: 2.5px solid currentColor;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* TOAST */
    #toast {
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      padding: 14px 24px;
      background: rgba(28, 28, 42, 0.9);
      backdrop-filter: blur(12px);
      border: 1px solid var(--border2);
      color: white;
      opacity: 0;
      visibility: hidden;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 100px;
      z-index: 1000;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 500;
    }

    #toast.show {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(0);
    }

    #toast.error {
      border-color: rgba(248, 113, 113, 0.3);
      background: rgba(40, 15, 15, 0.9);
      color: var(--red);
    }

    #toast.success {
      border-color: rgba(52, 211, 153, 0.3);
      background: rgba(15, 35, 25, 0.9);
      color: var(--green);
    }

    /* TOPICS GRID & SKELETONS */
    .topics-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      position: relative;
    }

    .topic-card {
      background: rgba(28, 28, 42, 0.5);
      backdrop-filter: blur(10px);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 20px;
      transition: all 0.2s;
    }

    .topic-card:hover {
      border-color: var(--border2);
      background: rgba(28, 28, 42, 0.8);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    .topic-title {
      font-family: "Syne", sans-serif;
      font-size: 17px;
      font-weight: 700;
      color: var(--accent2);
      margin-bottom: 10px;
    }

    .topic-text {
      font-size: 14px;
      color: var(--text);
      line-height: 1.7;
      opacity: 0.9;
    }

    /* Skeletons */
    .skeleton {
      background: linear-gradient(90deg, var(--surface2) 25%, rgba(6, 182, 212, 0.05) 50%, var(--surface2) 75%);
      background-size: 200% 100%;
      animation: shimmer 2s infinite linear;
      border-radius: 8px;
    }

    .skeleton-title {
      height: 20px;
      width: 40%;
      margin-bottom: 16px;
    }

    .skeleton-text {
      height: 14px;
      width: 100%;
      margin-bottom: 8px;
    }
    
    .skeleton-text.short {
      width: 70%;
    }

    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    /* FORMAT SELECT */
    .format-select {
      display: flex;
      gap: 20px;
      margin-bottom: 28px;
    }

    .format-radio {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      background: rgba(28, 28, 42, 0.5);
      padding: 12px 20px;
      border-radius: 16px;
      border: 1px solid var(--border);
      transition: 0.2s;
    }
    
    .format-radio:has(input:checked) {
      border-color: var(--accent);
      background: rgba(6, 182, 212, 0.1);
    }

    .format-radio input[type="radio"] {
      cursor: pointer;
      accent-color: var(--accent);
      width: 16px;
      height: 16px;
    }

    .format-radio label {
      cursor: pointer;
      user-select: none;
      font-weight: 500;
    }

    /* RESPONSIVE DESIGN */
    @media (max-width: 768px) {
      .wrapper {
        padding: 0 16px 40px;
      }
      header {
        flex-direction: column;
        align-items: center;
        gap: 16px;
        padding: 20px 0;
      }
      .steps::before, .steps-progress {
        display: none;
      }
      .panel {
        padding: 20px;
      }
      .format-select {
        flex-direction: column;
        gap: 12px;
      }
    }
  </style>"""
    content = re.sub(r'<style>.*?</style>', new_css, content, flags=re.DOTALL)

    # 2. Update Steps HTML
    new_steps = """<div class="steps">
      <div class="steps-progress" id="stepsLine" style="width: 0%;"></div>
      <div class="step active" id="step1" onclick="goStep(1)">
        <div class="step-num">1</div>
        <div class="step-label">📤 Upload</div>
      </div>

      <div class="step" id="step2" onclick="goStep(2)">
        <div class="step-num">2</div>
        <div class="step-label">🔍 Analyze</div>
      </div>

      <div class="step" id="step3" onclick="goStep(3)">
        <div class="step-num">3</div>
        <div class="step-label">🪄 Merged Notes</div>
      </div>

      <div class="step" id="step4" onclick="goStep(4)">
        <div class="step-num">4</div>
        <div class="step-label">⬇️ Download</div>
      </div>
    </div>"""
    content = re.sub(r'<div class="steps">.*?</div>\s*</div>\s*</div>\s*</div>', new_steps, content, flags=re.DOTALL) # Need to be more robust
    
    # Better to find exactly the steps div:
    steps_match = re.search(r'<div class="steps">(.*?)</div>\s*<!-- PANEL 1', content, flags=re.DOTALL)
    if steps_match:
        content = content[:steps_match.start()] + new_steps + '\n\n    <!-- PANEL 1' + content[steps_match.end():]

    # 3. Update goStep logic
    new_goStep = """function goStep(n) {
      currentStep = n;

      document.querySelectorAll(".panel").forEach((p, i) => {
        p.classList.toggle("active", i + 1 === n);
      });

      document.querySelectorAll(".step").forEach((s, i) => {
        s.classList.toggle("active", i + 1 === n);
      });
      
      const line = document.getElementById("stepsLine");
      if (line) {
        const percent = ((n - 1) / 3) * 80;
        line.style.width = percent + '%';
      }
    }"""
    content = re.sub(r'function goStep\(n\)\s*{.*?}', new_goStep, content, flags=re.DOTALL)

    # 4. Add showSkeletons utility
    skeletons_code = """function showSkeletons(containerId, count) {
      const container = document.getElementById(containerId);
      container.innerHTML = "";
      for (let i = 0; i < count; i++) {
        container.innerHTML += `
          <div class="topic-card">
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text short"></div>
          </div>
        `;
      }
    }
"""
    if 'function showSkeletons' not in content:
        content = content.replace('function escapeHtml(text)', skeletons_code + '\n    function escapeHtml(text)')

    # 5. Update analyzeTopics to use skeletons
    new_analyze = """async function analyzeTopics() {
      isLoading = true;
      updateButtonState();
      showSkeletons("topicsGrid", 3);
      goStep(2);

      try {
        const res = await fetch(API + "/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ files: serverFileNames })
        });

        if (!res.ok) {
          throw new Error("Analysis failed: " + res.statusText);
        }

        const data = await res.json();
        analyzedTopics = data.topics;

        renderTopics(analyzedTopics, "topicsGrid");
        showToast(`✅ Found ${data.total} topics!`, "success");

        document.getElementById("mergeBtn").disabled = false;

      } catch (error) {
        showToast("❌ Analysis error: " + error.message, "error");
        console.error("Analysis error:", error);
      } finally {
        isLoading = false;
        updateButtonState();
      }
    }"""
    content = re.sub(r'async function analyzeTopics\(\)\s*{.*?finally\s*{.*?}\s*}', new_analyze, content, flags=re.DOTALL)

    # 6. Update mergeNotes to use skeletons
    new_merge = """async function mergeNotes() {
      isLoading = true;
      updateButtonState();
      showSkeletons("mergedGrid", 3);

      try {
        const fmt = document.querySelector('input[name="format"]:checked').value;

        const res = await fetch(API + "/merge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            files: serverFileNames,
            format: fmt
          })
        });

        if (!res.ok) {
          throw new Error("Merge failed: " + res.statusText);
        }

        const data = await res.json();
        renderTopics(analyzedTopics, "mergedGrid");
        showToast(`✅ Merged ${data.topics_merged} topics!`, "success");

      } catch (error) {
        showToast("❌ Merge error: " + error.message, "error");
        console.error("Merge error:", error);
      } finally {
        isLoading = false;
        updateButtonState();
      }
    }"""
    content = re.sub(r'async function mergeNotes\(\)\s*{.*?finally\s*{.*?}\s*}', new_merge, content, flags=re.DOTALL)

    # Write changes
    with open('inex.html', 'w', encoding='utf-8') as f:
        f.write(content)

update_html()
