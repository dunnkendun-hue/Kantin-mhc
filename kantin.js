let cart = [];

let username = "";


/* ================= LOGIN ================= */

function login() {

    const input = document.getElementById("username");
    const passInput = document.getElementById("password");

    username = input.value;
    const password = passInput.value;


    if (username === "") {

        alert("Silakan masukkan nama!");

        return;
    }


    if (password === "") {

        alert("Silakan masukkan password!");

        return;
    }


    // Password default
    if (password !== "12345") {

        alert("Password salah!");

        return;
    }


    localStorage.setItem("username", username);
    localStorage.setItem("password", password);


    document.getElementById("loginPage").style.display = "none";

    document.getElementById("appPage").style.display = "block";


    document.getElementById("userName").innerText =
        "👤 " + username;


    loadCart();

    updateCart();

}


/* ================= LOGOUT ================= */

function logout() {

    localStorage.removeItem("username");

    document.getElementById("loginPage").style.display = "flex";

    document.getElementById("appPage").style.display = "none";

}


/* ================= TAMBAH KERANJANG ================= */

function addToCart(name, price) {

    const item = cart.find(
        product => product.name === name
    );


    if (item) {

        item.quantity++;

    } else {

        cart.push({

            name: name,

            price: price,

            quantity: 1

        });

    }


    saveCart();

    updateCart();


    alert(name + " berhasil ditambahkan!");
}


/* ================= UPDATE KERANJANG ================= */

function updateCart() {

    let cartItems =
        document.getElementById("cartItems");


    let cartCount =
        document.getElementById("cartCount");


    let totalPrice =
        document.getElementById("totalPrice");


    cartItems.innerHTML = "";


    let total = 0;

    let totalItem = 0;


    cart.forEach((item, index) => {

        total +=
            item.price * item.quantity;


        totalItem += item.quantity;


        cartItems.innerHTML += `

            <div class="cart-item">

                <div>

                    <h3>${item.name}</h3>

                    <p>
                        Rp ${item.price.toLocaleString()}
                    </p>

                </div>


                <div>

                    <button onclick="changeQuantity(${index}, -1)">
                        -
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button onclick="changeQuantity(${index}, 1)">
                        +
                    </button>


                    <button onclick="removeItem(${index})">
                        Hapus
                    </button>

                </div>

            </div>

        `;

    });


    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p>Keranjang masih kosong.</p>";

    }


    cartCount.innerText = totalItem;


    totalPrice.innerText =
        "Rp " + total.toLocaleString();
}


/* ================= UBAH JUMLAH ================= */

function changeQuantity(index, amount) {

    cart[index].quantity += amount;


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }


    saveCart();

    updateCart();
}


/* ================= HAPUS ================= */

function removeItem(index) {

    cart.splice(index, 1);

    saveCart();

    updateCart();
}


/* ================= SIMPAN KERANJANG ================= */

function saveCart() {

    localStorage.setItem(

        "cart",

        JSON.stringify(cart)

    );
}


/* ================= LOAD KERANJANG ================= */

function loadCart() {

    const savedCart =
        localStorage.getItem("cart");


    if (savedCart) {

        cart =
            JSON.parse(savedCart);

    }
}


/* ================= CHECKOUT ================= */

function checkout() {

    if (cart.length === 0) {

        alert("Keranjang masih kosong!");

        return;
    }


    let total = 0;


    cart.forEach(item => {

        total +=
            item.price * item.quantity;

    });


    const order = {

        customer: username,

        items: cart,

        total: total,

        date: new Date().toLocaleString()

    };


    let history =

        JSON.parse(
            localStorage.getItem("history")
        ) || [];


    history.push(order);


    localStorage.setItem(

        "history",

        JSON.stringify(history)

    );


    alert(
        "Pesanan berhasil dibuat!\n\n" +
        "Total pembayaran: Rp " +
        total.toLocaleString()
    );


    cart = [];


    saveCart();

    updateCart();

    showHistory();
}


/* ================= RIWAYAT ================= */

function showHistory() {

    document
        .getElementById("menuPage")
        .classList.add("hidden");


    document
        .getElementById("cartPage")
        .classList.add("hidden");


    document
        .getElementById("historyPage")
        .classList.remove("hidden");


    const historyList =

        document.getElementById(
            "historyList"
        );


    let history =

        JSON.parse(
            localStorage.getItem("history")
        ) || [];


    historyList.innerHTML = "";


    if (history.length === 0) {

        historyList.innerHTML =
            "<p>Belum ada riwayat pesanan.</p>";

        return;
    }

  historyList.innerHTML += `

<button onclick="deleteHistory()" 
style="
background:red;
color:white;
padding:10px 20px;
border:none;
border-radius:8px;
cursor:pointer;
margin-bottom:15px;
">
🗑 Hapus Semua Riwayat
</button>

`;


    history.forEach(order => {

        let items = "";


        order.items.forEach(item => {

            items += `
                <li>
                    ${item.name}
                    (${item.quantity}x)
                </li>
            `;

        });


        historyList.innerHTML += `

            <div class="history-item">

                <h3>
                    👤 ${order.customer}
                </h3>

                <p>
                    📅 ${order.date}
                </p>


                <ul>

                    ${items}

                </ul>


                <h3>

                    Total:
                    Rp ${order.total.toLocaleString()}

                </h3>

            </div>

        `;

    });

}

function deleteHistory() {

    let confirmDelete =
        confirm("Yakin ingin menghapus semua riwayat pesanan?");


    if (confirmDelete) {

        localStorage.removeItem("history");


        alert("Riwayat pesanan berhasil dihapus!");


        showHistory();

    }

}


/* ================= TAMPIL MENU ================= */

function showMenu() {

    document
        .getElementById("menuPage")
        .classList.remove("hidden");


    document
        .getElementById("cartPage")
        .classList.add("hidden");


    document
        .getElementById("historyPage")
        .classList.add("hidden");

}


/* ================= TAMPIL KERANJANG ================= */

function showCart() {

    document
        .getElementById("menuPage")
        .classList.add("hidden");


    document
        .getElementById("cartPage")
        .classList.remove("hidden");


    document
        .getElementById("historyPage")
        .classList.add("hidden");


    updateCart();
}


/* ================= AUTO LOGIN ================= */

window.onload = function () {

    const savedUsername =
        localStorage.getItem("username");


    if (savedUsername) {

        username = savedUsername;


        document
            .getElementById("loginPage")
            .style.display = "none";


        document
            .getElementById("appPage")
            .style.display = "block";


        document
            .getElementById("userName")
            .innerText =
            "👤 " + username;


        loadCart();

        updateCart();

    }

};

