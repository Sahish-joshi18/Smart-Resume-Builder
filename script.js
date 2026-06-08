// Smart Resume Builder - Complete Frontend Logic
const STORAGE_KEY = "smartResumeBuilderData";

// Sample default resume data
const defaultData = {
  template: "modern",
  personal: {
    fullName: "Your Name",
    jobTitle: "Frontend Developer",
    email: "example@gmail.com",
    phone: "+91 1234567890",
    location: "Mumbai, India",
    linkedin: "https://linkedin.com/in/yourprofile",
    github: "https://github.com/yourprofile",
    portfolio: "https://yourportfolio.com",
    photo: ""
  },
  summary: "Creative and detail-oriented frontend developer skilled in building responsive, user-friendly web applications using HTML, CSS, and JavaScript. Passionate about clean UI design, performance, and practical problem solving.",
  education: [
    { school: "ABC College", degree: "B.Sc. Computer Science", start: "2023", end: "2026" }
  ],
  experience: [
    { company: "Tech Startup", role: "Frontend Intern", start: "Jan 2025", end: "Apr 2025", description: "Built responsive landing pages, improved UI components, and collaborated with designers to create clean user experiences." }
  ],
  skills: ["HTML", "CSS", "JavaScript", "Responsive Design", "GitHub", "UI Design"],
  projects: [
    { name: "Smart Resume Builder", tech: "HTML, CSS, JavaScript", live: "https://example.com", github: "https://github.com/sahishjoshi18/resume-builder", description: "Created a modern resume builder with live preview, localStorage saving, template switching, and PDF export." }
  ],
  certifications: [
    { name: "Responsive Web Design", issuer: "freeCodeCamp", year: "2025" }
  ]
};

let resumeData = loadData();

// DOM references
const preview = document.getElementById("resumePreview");
const saveStatus = document.getElementById("saveStatus");
const photoInput = document.getElementById("photoInput");
const photoPreview = document.getElementById("photoPreview");
const removePhotoBtn = document.getElementById("removePhotoBtn");
const fields = ["fullName", "jobTitle", "email", "phone", "location", "linkedin", "github", "portfolio", "summary"];

// Load saved data or fallback to sample data
function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const data = saved ? JSON.parse(saved) : structuredClone(defaultData);

  // Keeps older saved versions compatible after adding profile photo.
  data.personal = { ...defaultData.personal, ...(data.personal || {}) };
  return data;
}

// Save data to localStorage
function saveData(showMessage = true) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
  if (showMessage) {
    saveStatus.textContent = "Saved";
    setTimeout(() => (saveStatus.textContent = "Auto saved"), 1200);
  }
}

// Escape HTML for safe rendering
function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Convert plain text URL into readable text
function cleanUrl(url = "") {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

// Initialize form values
function populateForm() {
  Object.entries(resumeData.personal).forEach(([key, value]) => {
    const input = document.getElementById(key);
    if (input) input.value = value;
  });
  document.getElementById("summary").value = resumeData.summary || "";
  updatePhotoPreview();

  document.querySelectorAll(".template-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.template === resumeData.template);
  });

  renderDynamicLists();
  renderSkillTags();
  renderPreview();
}


// Update small photo preview inside the form panel
function updatePhotoPreview() {
  const name = resumeData.personal.fullName || "Your Name";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join("") || "SR";

  if (resumeData.personal.photo) {
    photoPreview.innerHTML = `<img src="${resumeData.personal.photo}" alt="Profile photo">`;
    removePhotoBtn.style.display = "inline-flex";
  } else {
    photoPreview.textContent = initials;
    removePhotoBtn.style.display = "none";
  }
}

// Render dynamic form sections
function renderDynamicLists() {
  renderEducationInputs();
  renderExperienceInputs();
  renderProjectInputs();
  renderCertificateInputs();
}

function renderEducationInputs() {
  const list = document.getElementById("educationList");
  list.innerHTML = resumeData.education.map((item, index) => `
    <div class="item-card">
      <div class="item-head"><strong>Education ${index + 1}</strong><button type="button" class="remove-btn" onclick="removeItem('education', ${index})">Remove</button></div>
      <label>School/College<input value="${escapeHTML(item.school)}" oninput="updateItem('education', ${index}, 'school', this.value)"></label>
      <label>Degree/Class<input value="${escapeHTML(item.degree)}" oninput="updateItem('education', ${index}, 'degree', this.value)"></label>
      <div class="grid two">
        <label>Start Year<input value="${escapeHTML(item.start)}" oninput="updateItem('education', ${index}, 'start', this.value)"></label>
        <label>End Year<input value="${escapeHTML(item.end)}" oninput="updateItem('education', ${index}, 'end', this.value)"></label>
      </div>
    </div>`).join("");
}

function renderExperienceInputs() {
  const list = document.getElementById("experienceList");
  list.innerHTML = resumeData.experience.map((item, index) => `
    <div class="item-card">
      <div class="item-head"><strong>Experience ${index + 1}</strong><button type="button" class="remove-btn" onclick="removeItem('experience', ${index})">Remove</button></div>
      <label>Company<input value="${escapeHTML(item.company)}" oninput="updateItem('experience', ${index}, 'company', this.value)"></label>
      <label>Role<input value="${escapeHTML(item.role)}" oninput="updateItem('experience', ${index}, 'role', this.value)"></label>
      <div class="grid two">
        <label>Start Date<input value="${escapeHTML(item.start)}" oninput="updateItem('experience', ${index}, 'start', this.value)"></label>
        <label>End Date<input value="${escapeHTML(item.end)}" oninput="updateItem('experience', ${index}, 'end', this.value)"></label>
      </div>
      <label>Description<textarea rows="3" oninput="updateItem('experience', ${index}, 'description', this.value)">${escapeHTML(item.description)}</textarea></label>
    </div>`).join("");
}

function renderProjectInputs() {
  const list = document.getElementById("projectsList");
  list.innerHTML = resumeData.projects.map((item, index) => `
    <div class="item-card">
      <div class="item-head"><strong>Project ${index + 1}</strong><button type="button" class="remove-btn" onclick="removeItem('projects', ${index})">Remove</button></div>
      <label>Project Name<input value="${escapeHTML(item.name)}" oninput="updateItem('projects', ${index}, 'name', this.value)"></label>
      <label>Tech Stack<input value="${escapeHTML(item.tech)}" oninput="updateItem('projects', ${index}, 'tech', this.value)"></label>
      <div class="grid two">
        <label>Live Link<input value="${escapeHTML(item.live)}" oninput="updateItem('projects', ${index}, 'live', this.value)"></label>
        <label>GitHub Link<input value="${escapeHTML(item.github)}" oninput="updateItem('projects', ${index}, 'github', this.value)"></label>
      </div>
      <label>Description<textarea rows="3" oninput="updateItem('projects', ${index}, 'description', this.value)">${escapeHTML(item.description)}</textarea></label>
    </div>`).join("");
}

function renderCertificateInputs() {
  const list = document.getElementById("certificationsList");
  list.innerHTML = resumeData.certifications.map((item, index) => `
    <div class="item-card">
      <div class="item-head"><strong>Certificate ${index + 1}</strong><button type="button" class="remove-btn" onclick="removeItem('certifications', ${index})">Remove</button></div>
      <label>Certificate Name<input value="${escapeHTML(item.name)}" oninput="updateItem('certifications', ${index}, 'name', this.value)"></label>
      <label>Issuer<input value="${escapeHTML(item.issuer)}" oninput="updateItem('certifications', ${index}, 'issuer', this.value)"></label>
      <label>Year<input value="${escapeHTML(item.year)}" oninput="updateItem('certifications', ${index}, 'year', this.value)"></label>
    </div>`).join("");
}

// Update dynamic item
window.updateItem = function(section, index, key, value) {
  resumeData[section][index][key] = value;
  renderPreview();
  saveData(false);
};

// Remove dynamic item
window.removeItem = function(section, index) {
  resumeData[section].splice(index, 1);
  renderDynamicLists();
  renderPreview();
  saveData();
};

// Render skill tags in form
function renderSkillTags() {
  const tags = document.getElementById("skillsTags");
  tags.innerHTML = resumeData.skills.map((skill, index) => `
    <span class="skill-tag">${escapeHTML(skill)} <button type="button" onclick="removeSkill(${index})">×</button></span>
  `).join("");
}

window.removeSkill = function(index) {
  resumeData.skills.splice(index, 1);
  renderSkillTags();
  renderPreview();
  saveData();
};

// Add new entries
function addEducation() {
  resumeData.education.push({ school: "", degree: "", start: "", end: "" });
  renderEducationInputs();
  renderPreview();
}

function addExperience() {
  resumeData.experience.push({ company: "", role: "", start: "", end: "", description: "" });
  renderExperienceInputs();
  renderPreview();
}

function addProject() {
  resumeData.projects.push({ name: "", tech: "", live: "", github: "", description: "" });
  renderProjectInputs();
  renderPreview();
}

function addCertificate() {
  resumeData.certifications.push({ name: "", issuer: "", year: "" });
  renderCertificateInputs();
  renderPreview();
}

function addSkill() {
  const input = document.getElementById("skillInput");
  const skill = input.value.trim();
  if (!skill) return;
  if (!resumeData.skills.includes(skill)) resumeData.skills.push(skill);
  input.value = "";
  renderSkillTags();
  renderPreview();
  saveData();
}

// Render live resume preview
function renderPreview() {
  const p = resumeData.personal;
  preview.className = `resume-page template-${resumeData.template}`;
  updatePhotoPreview();

  const contactItems = [
    p.email,
    p.phone,
    p.location,
    p.linkedin ? cleanUrl(p.linkedin) : "",
    p.github ? cleanUrl(p.github) : "",
    p.portfolio ? cleanUrl(p.portfolio) : ""
  ].filter(Boolean);

  const photoMarkup = p.photo
    ? `<img class="resume-photo" src="${p.photo}" alt="Profile photo">`
    : `<div class="resume-photo placeholder-photo">${escapeHTML((p.fullName || "SR").split(" ").filter(Boolean).slice(0, 2).map(word => word[0]?.toUpperCase()).join("") || "SR")}</div>`;

  preview.innerHTML = `
    <header class="resume-header">
      <div class="resume-header-main">
        ${photoMarkup}
        <div class="resume-title-block">
          <h2>${escapeHTML(p.fullName) || "Your Name"}</h2>
          <div class="role">${escapeHTML(p.jobTitle) || "Your Job Title"}</div>
          <div class="contact-line">${contactItems.map(item => `<span>${escapeHTML(item)}</span>`).join("") || `<span class="empty-state">Contact details will appear here</span>`}</div>
        </div>
      </div>
    </header>

    <section class="resume-section">
      <h3>Professional Summary</h3>
      <p class="resume-summary">${escapeHTML(resumeData.summary) || `<span class="empty-state">Your summary will appear here.</span>`}</p>
    </section>

    <section class="resume-section">
      <h3>Education</h3>
      ${resumeData.education.length ? resumeData.education.map(item => `
        <div class="resume-item">
          <div class="resume-item-top">
            <h4>${escapeHTML(item.school) || "School/College Name"}</h4>
            <span class="meta">${escapeHTML(item.start)} - ${escapeHTML(item.end)}</span>
          </div>
          <div class="sub">${escapeHTML(item.degree) || "Degree/Class"}</div>
        </div>`).join("") : `<p class="empty-state">Education details will appear here.</p>`}
    </section>

    <section class="resume-section">
      <h3>Experience</h3>
      ${resumeData.experience.length ? resumeData.experience.map(item => `
        <div class="resume-item">
          <div class="resume-item-top">
            <h4>${escapeHTML(item.role) || "Role"}</h4>
            <span class="meta">${escapeHTML(item.start)} - ${escapeHTML(item.end)}</span>
          </div>
          <div class="sub">${escapeHTML(item.company) || "Company Name"}</div>
          <p>${escapeHTML(item.description) || "Experience description will appear here."}</p>
        </div>`).join("") : `<p class="empty-state">Experience details will appear here.</p>`}
    </section>

    <section class="resume-section">
      <h3>Skills</h3>
      <div class="resume-skills">
        ${resumeData.skills.length ? resumeData.skills.map(skill => `<span class="resume-skill">${escapeHTML(skill)}</span>`).join("") : `<span class="empty-state">Skills will appear here.</span>`}
      </div>
    </section>

    <section class="resume-section">
      <h3>Projects</h3>
      ${resumeData.projects.length ? resumeData.projects.map(item => `
        <div class="resume-item">
          <div class="resume-item-top">
            <h4>${escapeHTML(item.name) || "Project Name"}</h4>
            <span class="meta">${escapeHTML(item.tech)}</span>
          </div>
          <div class="sub">${[item.live ? cleanUrl(item.live) : "", item.github ? cleanUrl(item.github) : ""].filter(Boolean).map(escapeHTML).join(" | ")}</div>
          <p>${escapeHTML(item.description) || "Project description will appear here."}</p>
        </div>`).join("") : `<p class="empty-state">Projects will appear here.</p>`}
    </section>

    <section class="resume-section">
      <h3>Certifications</h3>
      ${resumeData.certifications.length ? resumeData.certifications.map(item => `
        <div class="resume-item">
          <div class="resume-item-top">
            <h4>${escapeHTML(item.name) || "Certificate Name"}</h4>
            <span class="meta">${escapeHTML(item.year)}</span>
          </div>
          <div class="sub">${escapeHTML(item.issuer) || "Issuer"}</div>
        </div>`).join("") : `<p class="empty-state">Certifications will appear here.</p>`}
    </section>
  `;
}

// Update personal fields instantly
fields.forEach(id => {
  const input = document.getElementById(id);
  input.addEventListener("input", () => {
    if (id === "summary") {
      resumeData.summary = input.value;
    } else {
      resumeData.personal[id] = input.value;
    }
    renderPreview();
    saveData(false);
  });
});

// Profile photo upload: stores image as base64 in localStorage
photoInput.addEventListener("change", event => {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please upload a valid image file.");
    photoInput.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    resumeData.personal.photo = reader.result;
    updatePhotoPreview();
    renderPreview();
    saveData();
  };
  reader.readAsDataURL(file);
});

removePhotoBtn.addEventListener("click", () => {
  resumeData.personal.photo = "";
  photoInput.value = "";
  updatePhotoPreview();
  renderPreview();
  saveData();
});

// Event listeners
document.getElementById("addEducation").addEventListener("click", addEducation);
document.getElementById("addExperience").addEventListener("click", addExperience);
document.getElementById("addProject").addEventListener("click", addProject);
document.getElementById("addCertificate").addEventListener("click", addCertificate);
document.getElementById("addSkill").addEventListener("click", addSkill);

document.getElementById("skillInput").addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    addSkill();
  }
});

document.querySelectorAll(".template-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    resumeData.template = btn.dataset.template;
    document.querySelectorAll(".template-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderPreview();
    saveData();
  });
});

document.getElementById("saveBtn").addEventListener("click", () => saveData());

document.getElementById("clearBtn").addEventListener("click", () => {
  const confirmClear = confirm("Are you sure you want to clear all data?");
  if (!confirmClear) return;
  localStorage.removeItem(STORAGE_KEY);
  resumeData = structuredClone(defaultData);
  populateForm();
  saveData();
});

// Download resume as A4 PDF
document.getElementById("downloadBtn").addEventListener("click", () => {
  const element = document.getElementById("resumePreview");
  const name = resumeData.personal.fullName?.trim() || "resume";

  const options = {
    margin: 0,
    filename: `${name.replaceAll(" ", "-").toLowerCase()}-resume.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait"
    },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] }
  };

  html2pdf().set(options).from(element).save();
});

// Start app
populateForm();
