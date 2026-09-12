


const PRICING_CATALOGUE = {
    "t_shirt_chemise": { name: "T-shirt / Chemise", price: 1000 },
    "pantalon": { name: "Pantalon", price: 1500 },
    "robe": { name: "Robe", price: 2000 },
    "costume": { name: "Costume", price: 3000 },
    "couverture": { name: "Couverture", price: 3000 },
    "drap": { name: "Drap", price: 1500 },
    "chaussures": { name: "Chaussures", price: 2000 },
    "lavage_kilo": { name: "Lavage au kilo", price: 1000 }
};


const DELIVERY_FEE = 1500; // Fixed delivery fee in FCFA
const LAUNDRY_WHATSAPP_NUMBER = "2290190230024"; // Format to initiate direct WhatsApp chat


let orderCart = {
    "t_shirt_chemise": 0,
    "pantalon": 0,
    "robe": 0,
    "costume": 0,
    "couverture": 0,
    "drap": 0,
    "chaussures": 0,
    "lavage_kilo": 0
};


let customArticles = [];

document.addEventListener("DOMContentLoaded", () => {

    if (window.lucide) {
        window.lucide.createIcons();
    }


    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const menuIcon = document.getElementById("menu-icon");

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener("click", () => {
            const isHidden = mobileMenu.classList.contains("hidden");
            if (isHidden) {
                mobileMenu.classList.remove("hidden");
                menuIcon.setAttribute("data-lucide", "x");
            } else {
                mobileMenu.classList.add("hidden");
                menuIcon.setAttribute("data-lucide", "menu");
            }
            if (window.lucide) {
                window.lucide.createIcons();
            }
        });
    }


    const mobileLinks = document.querySelectorAll(".mobile-nav-link");
    mobileLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (mobileMenu) {
                mobileMenu.classList.add("hidden");
                menuIcon.setAttribute("data-lucide", "menu");
                if (window.lucide) {
                    window.lucide.createIcons();
                }
            }
        });
    });


    populatePricingSection();


    populateFormSteppers();


    setupDeliveryToggle();


    setupCustomItemBtn();


    setupGlobalServiceRadios();


    calculateTotal();


    initPinecrestMap();


    const orderForm = document.getElementById("order-form");
    if (orderForm) {
        orderForm.addEventListener("submit", handleOrderSubmit);
    }
});


function populatePricingSection() {
    const container = document.getElementById("pricing-rows-container");
    if (!container) return;

    container.innerHTML = "";
    Object.keys(PRICING_CATALOGUE).forEach(key => {
        const item = PRICING_CATALOGUE[key];
        const row = document.createElement("div");
        row.className = "px-6 py-4.5 flex justify-between items-center hover:bg-navy-50/80 transition-colors";
        row.innerHTML = `
            <span class="font-semibold text-navy-900">${item.name}</span>
            <span class="font-bold text-accent-dark text-right">${formatPrice(item.price)} FCFA</span>
        `;
        container.appendChild(row);
    });
}


function populateFormSteppers() {
    const container = document.getElementById("stepper-items-container");
    if (!container) return;

    container.innerHTML = "";
    Object.keys(PRICING_CATALOGUE).forEach(key => {
        const item = PRICING_CATALOGUE[key];
        
        const row = document.createElement("div");
        row.className = "flex items-center justify-between p-4 bg-navy-50 rounded-2xl border border-navy-100 hover:border-navy-200 transition-colors";
        row.innerHTML = `
            <div>
                <span class="block text-sm font-bold text-navy-900">${item.name}</span>
                <span class="text-xs text-gray-500">${formatPrice(item.price)} FCFA / unitaire</span>
            </div>
            
            <div class="flex items-center space-x-3 bg-white border border-navy-100 rounded-xl p-1 shadow-sm">
                <button type="button" class="minus-btn w-9 h-9 flex items-center justify-center text-navy-900 bg-navy-50 hover:bg-navy-100 rounded-lg transition-colors font-extrabold" data-key="${key}">
                    <i data-lucide="minus" class="w-4 h-4"></i>
                </button>
                <span class="quantity-value w-8 text-center text-sm font-bold text-navy-900" id="qty-${key}">0</span>
                <button type="button" class="plus-btn w-9 h-9 flex items-center justify-center text-white bg-navy-900 hover:bg-navy-800 rounded-lg transition-colors font-extrabold" data-key="${key}">
                    <i data-lucide="plus" class="w-4 h-4"></i>
                </button>
            </div>
        `;
        container.appendChild(row);
    });


    container.querySelectorAll(".plus-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const key = btn.getAttribute("data-key");
            orderCart[key] += 1;
            updateCounterDisplay(key);
            calculateTotal();
        });
    });

    container.querySelectorAll(".minus-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const key = btn.getAttribute("data-key");
            if (orderCart[key] > 0) {
                orderCart[key] -= 1;
                updateCounterDisplay(key);
                calculateTotal();
            }
        });
    });

    if (window.lucide) {
        window.lucide.createIcons();
    }
}


function updateCounterDisplay(key) {
    const valSpan = document.getElementById(`qty-${key}`);
    if (valSpan) {
        valSpan.innerText = orderCart[key];
    }
}


function setupDeliveryToggle() {
    const deliveryRadios = document.getElementsByName("delivery-mode");
    const detailsSection = document.getElementById("delivery-details-section");
    const deliveryFeeBadge = document.getElementById("delivery-fee-badge");
    

    if (deliveryFeeBadge) {
        deliveryFeeBadge.innerText = `${formatPrice(DELIVERY_FEE)} FCFA`;
    }

    deliveryRadios.forEach(radio => {
        radio.addEventListener("change", (e) => {
            if (e.target.value === "home") {
                detailsSection.classList.remove("hidden");

                document.getElementById("delivery-address").setAttribute("required", "required");
                document.getElementById("delivery-date").setAttribute("required", "required");
            } else {
                detailsSection.classList.add("hidden");

                document.getElementById("delivery-address").removeAttribute("required");
                document.getElementById("delivery-date").removeAttribute("required");
            }
            calculateTotal();
        });
    });
}


function setupCustomItemBtn() {
    const addBtn = document.getElementById("add-item-btn");
    const container = document.getElementById("dynamic-custom-items");
    if (!addBtn || !container) return;

    addBtn.addEventListener("click", () => {
        const customId = Date.now().toString();
        const customRow = document.createElement("div");
        customRow.className = "flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 bg-accent-light/30 border border-dashed border-accent-dark/30 rounded-2xl gap-4";
        customRow.id = `custom-row-${customId}`;
        
        customRow.innerHTML = `
            <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" placeholder="Ex: Tapis de bain, Rideaux" class="custom-name-input block w-full px-4 py-2.5 bg-white border border-navy-100 rounded-xl text-sm placeholder-gray-400" required>
                <div class="relative">
                    <input type="number" placeholder="Estimation prix (FCFA)" min="0" value="1000" class="custom-price-input block w-full pl-4 pr-16 py-2.5 bg-white border border-navy-100 rounded-xl text-sm placeholder-gray-400">
                    <span class="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-400 font-bold">FCFA</span>
                </div>
            </div>

            <div class="flex items-center justify-between sm:justify-end gap-4">
                <div class="flex items-center space-x-3 bg-white border border-navy-100 rounded-xl p-1 shadow-sm">
                    <button type="button" class="custom-minus-btn w-9 h-9 flex items-center justify-center text-navy-900 bg-navy-50 hover:bg-navy-100 rounded-lg transition-colors font-extrabold">
                        <i data-lucide="minus" class="w-4 h-4"></i>
                    </button>
                    <span class="custom-quantity-value w-8 text-center text-sm font-bold text-navy-900">1</span>
                    <button type="button" class="custom-plus-btn w-9 h-9 flex items-center justify-center text-white bg-navy-900 hover:bg-navy-800 rounded-lg transition-colors font-extrabold">
                        <i data-lucide="plus" class="w-4 h-4"></i>
                    </button>
                </div>

                <button type="button" class="custom-delete-btn p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors" title="Retirer l'article">
                    <i data-lucide="trash-2" class="w-5 h-5"></i>
                </button>
            </div>
        `;

        container.appendChild(customRow);


        const qVal = customRow.querySelector(".custom-quantity-value");
        const nameInput = customRow.querySelector(".custom-name-input");
        const priceInput = customRow.querySelector(".custom-price-input");

        const customItemObj = {
            id: customId,
            name: "",
            price: 1000,
            quantity: 1
        };
        customArticles.push(customItemObj);


        nameInput.addEventListener("input", (e) => {
            customItemObj.name = e.target.value;
            calculateTotal();
        });


        priceInput.addEventListener("input", (e) => {
            const val = parseFloat(e.target.value);
            customItemObj.price = isNaN(val) ? 0 : val;
            calculateTotal();
        });


        customRow.querySelector(".custom-plus-btn").addEventListener("click", () => {
            customItemObj.quantity += 1;
            qVal.innerText = customItemObj.quantity;
            calculateTotal();
        });

        customRow.querySelector(".custom-minus-btn").addEventListener("click", () => {
            if (customItemObj.quantity > 1) {
                customItemObj.quantity -= 1;
                qVal.innerText = customItemObj.quantity;
                calculateTotal();
            }
        });


        customRow.querySelector(".custom-delete-btn").addEventListener("click", () => {
            customRow.remove();
            customArticles = customArticles.filter(item => item.id !== customId);
            calculateTotal();
        });

        if (window.lucide) {
            window.lucide.createIcons();
        }
        calculateTotal();
    });
}


function setupGlobalServiceRadios() {
    const radioLabels = document.querySelectorAll("input[name='service-global']");
    radioLabels.forEach(radio => {

        updateRadioLabelStyles();

        radio.addEventListener("change", () => {
            updateRadioLabelStyles();
        });
    });
}

function updateRadioLabelStyles() {
    const radios = document.getElementsByName("service-global");
    radios.forEach(r => {
        const label = r.closest("label");
        if (!label) return;
        if (r.checked) {
            label.className = "relative flex items-center justify-center px-4 py-3 bg-navy-900 border border-navy-900 rounded-xl cursor-pointer text-white shadow-md transition-all select-none";
            label.querySelector("span").className = "text-xs sm:text-sm font-bold text-white text-center";
        } else {
            label.className = "relative flex items-center justify-center px-4 py-3 bg-navy-50 border border-navy-100 rounded-xl cursor-pointer hover:bg-accent-light/50 transition-all select-none";
            label.querySelector("span").className = "text-xs sm:text-sm font-semibold text-navy-900 text-center";
        }
    });
}


function calculateTotal() {
    let subtotal = 0;


    Object.keys(orderCart).forEach(key => {
        const qty = orderCart[key];
        if (qty > 0) {
            subtotal += qty * PRICING_CATALOGUE[key].price;
        }
    });


    customArticles.forEach(item => {
        if (item.quantity > 0) {
            subtotal += item.quantity * item.price;
        }
    });


    let finalDeliveryFee = 0;
    const deliveryRadioValue = document.querySelector("input[name='delivery-mode']:checked")?.value;
    if (deliveryRadioValue === "home") {
        finalDeliveryFee = DELIVERY_FEE;
    }

    const totalCalculated = subtotal + finalDeliveryFee;


    const totalSpan = document.getElementById("estimated-total-amount");
    if (totalSpan) {
        totalSpan.innerText = `${formatPrice(totalCalculated)} FCFA`;
    }

    return {
        subtotal,
        deliveryFee: finalDeliveryFee,
        total: totalCalculated
    };
}


function handleOrderSubmit(event) {
    event.preventDefault();

    const totals = calculateTotal();
    

    const hasPredefined = Object.values(orderCart).some(qty => qty > 0);
    const hasCustom = customArticles.some(item => item.name.trim() !== "" && item.quantity > 0);

    if (!hasPredefined && !hasCustom) {
        alert("⚠️ Veuillez sélectionner au moins un article ou ajouter un vêtement personnalisé avant de commander.");
        return;
    }


    const clientName = document.getElementById("client-name").value.trim();
    const clientPhone = document.getElementById("client-whatsapp").value.trim();
    const selectedServiceGlobal = document.querySelector("input[name='service-global']:checked")?.value || "Lavage";
    const deliveryMode = document.querySelector("input[name='delivery-mode']:checked")?.value;
    
    const deliveryAddress = document.getElementById("delivery-address").value.trim();
    const deliveryDate = document.getElementById("delivery-date").value;
    const deliveryTime = document.getElementById("delivery-time").value;
    const orderMessage = document.getElementById("order-message").value.trim();


    let msg = `Bonjour 👋\n\nJe souhaite passer une commande auprès de Pinecrest Cleaning and Laundry Service.\n\n`;
    msg += `👤 *Nom :* ${clientName}\n`;
    msg += `📞 *WhatsApp :* ${clientPhone}\n\n`;
    msg += `🧺 *MA COMMANDE :*\n`;


    Object.keys(orderCart).forEach(key => {
        const qty = orderCart[key];
        if (qty > 0) {
            const itemObj = PRICING_CATALOGUE[key];
            const priceVal = qty * itemObj.price;
            msg += `• ${qty}x ${itemObj.name} — [${selectedServiceGlobal}] (${formatPrice(priceVal)} FCFA)\n`;
        }
    });


    customArticles.forEach(item => {
        const nameClean = item.name.trim() !== "" ? item.name.trim() : "Article Personnalisé";
        const priceVal = item.quantity * item.price;
        msg += `• ${item.quantity}x ${nameClean} — [${selectedServiceGlobal}] (${formatPrice(priceVal)} FCFA)\n`;
    });

    msg += `\n🚚 *Livraison :* ${deliveryMode === "home" ? "Oui (Livraison à domicile)" : "Non (Dépôt direct au pressing)"}\n`;

    if (deliveryMode === "home") {
        msg += `📍 *Adresse :* ${deliveryAddress}\n`;

        if (deliveryDate) {
            const formattedDate = new Date(deliveryDate).toLocaleDateString("fr-FR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            msg += `📅 *Date souhaitée :* ${formattedDate}\n`;
        }
        if (deliveryTime) {
            msg += `⏰ *Heure souhaitée :* ${deliveryTime}\n`;
        }
    }

    msg += `\n💰 *Total estimé :* *${formatPrice(totals.total)} FCFA*\n`;

    if (orderMessage) {
        msg += `\n📝 *Message supplémentaire :*\n${orderMessage}\n`;
    }

    msg += `\nMerci de me confirmer la commande et le montant final. 😊`;


    const encodedMessage = encodeURIComponent(msg);
    const whatsappUrl = `https://wa.me/${LAUNDRY_WHATSAPP_NUMBER}?text=${encodedMessage}`;


    window.open(whatsappUrl, '_blank');
}


function formatPrice(number) {
    const regexPattern = new RegExp("\\B(?=(\\d{3})+(?!\\d))", "g");
    return number.toString().replace(regexPattern, " ");
}


function initPinecrestMap() {
    const mapContainer = document.getElementById("pinecrest-map");
    if (!mapContainer) return;


    const lat = 6.3688;
    const lng = 2.4147;


    const map = L.map('pinecrest-map', {
        center: [lat, lng],
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: false // disable scrolling map with mousewheel for better page scrolling
    });


    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);


    const marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup(`
        <div class="text-center p-1">
            <h4 class="font-extrabold text-navy-900 text-sm m-0">PINECREST</h4>
            <p class="text-xs text-gray-500 my-1 leading-normal">Cleaning and Laundry Service</p>
            <span class="text-[10px] bg-accent-light px-2 py-0.5 rounded text-navy-900 font-bold">Suru-Léré, Padmé</span>
        </div>
    `).openPopup();
}
