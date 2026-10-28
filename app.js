const pages = ["home","shop","custom","about","contact"];
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const toast = document.getElementById("toast");

function showToast(message){
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(()=>toast.classList.remove("show"), 2800);
}

function navigate(page){
  if(!pages.includes(page)) page = "home";
  document.querySelectorAll(".page").forEach(el => el.classList.remove("active"));
  document.getElementById(page).classList.add("active");
  document.querySelectorAll("[data-page]").forEach(el=>{
    el.classList.toggle("current", el.dataset.page === page);
  });
  window.scrollTo({top:0, behavior:"smooth"});
  mobileMenu.classList.remove("open");
  menuBtn.setAttribute("aria-expanded","false");
  if(location.hash !== "#"+page) history.pushState({page}, "", "#"+page);
}

document.querySelectorAll("[data-page]").forEach(link=>{
  link.addEventListener("click", e=>{
    e.preventDefault();
    navigate(link.dataset.page);
  });
});

menuBtn.addEventListener("click", ()=>{
  const open = mobileMenu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});

window.addEventListener("popstate", ()=>{
  navigate(location.hash.replace("#","") || "home");
});

const initial = location.hash.replace("#","");
if(initial && pages.includes(initial)) navigate(initial);

document.querySelectorAll(".filter").forEach(button=>{
  button.addEventListener("click", ()=>{
    document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    document.querySelectorAll(".product-card").forEach(card=>{
      card.style.display = filter==="all" || card.dataset.category===filter ? "" : "none";
    });
  });
});

document.querySelectorAll(".add-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const product = btn.dataset.product;
    sessionStorage.setItem("enquiryProduct", product);
    showToast(`${product} added to your enquiry ♡`);
    setTimeout(()=>navigate("custom"),500);
  });
});

document.getElementById("customForm").addEventListener("submit", e=>{
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const idea = document.getElementById("idea").value;
  sessionStorage.setItem("customEnquiry", JSON.stringify({
    name, idea,
    message: document.getElementById("message").value.trim(),
    contact: document.getElementById("contact").value.trim()
  }));
  showToast(`Thank you ${name || "♡"} — your enquiry is ready!`);
  e.target.reset();
});

const savedProduct = sessionStorage.getItem("enquiryProduct");
if(savedProduct){
  const msg = document.getElementById("message");
  msg.value = `I'm interested in "${savedProduct}". `;
  sessionStorage.removeItem("enquiryProduct");
}
