<template v-if="!loggedIn">
  <div class="auth-wrap">
    <!-- LOGIN -->
    <div v-if="authView === 'login'" class="auth-card">
      <div class="a-logo">
        <div class="a-logo-mark">A</div>
        <span class="a-logo-txt">adhivasindo</span>
      </div>
      <h2 class="a-h1">Selamat Datang 👋</h2>
      <p class="a-sub">Masuk ke Learning Management System Adhivasindo.</p>
      <div v-if="authErr" class="a-err">
        <ion-icon name="alert-circle-outline"></ion-icon>{{ authErr }}
      </div>
      <div class="fld">
        <label class="fld-lbl">Email</label>
        <div class="fld-wrap">
          <ion-icon name="mail-outline" class="fld-ico"></ion-icon
          ><input
            class="fld-inp"
            type="email"
            v-model="lf.email"
            placeholder="nama@email.com"
            @keydown.enter="doLogin"
          />
        </div>
      </div>
      <div class="fld">
        <label class="fld-lbl">Password</label>
        <div class="fld-wrap">
          <ion-icon name="lock-closed-outline" class="fld-ico"></ion-icon
          ><input
            class="fld-inp"
            type="password"
            v-model="lf.password"
            placeholder="••••••••"
            @keydown.enter="doLogin"
          />
        </div>
      </div>
      <button class="btn-a" @click="doLogin" :disabled="authLoading">
        <div v-if="authLoading" class="spn"></div>
        <span v-else>Masuk ke Dashboard</span>
      </button>
      <div class="a-sw">
        Belum punya akun?
        <span
          class="a-lnk"
          @click="
            authView = 'register';
            authErr = '';
          "
          >Daftar sekarang</span
        >
      </div>
    </div>

    <!-- REGISTER -->
    <div v-else class="auth-card">
      <div class="a-logo">
        <div class="a-logo-mark">A</div>
        <span class="a-logo-txt">adhivasindo</span>
      </div>
      <h2 class="a-h1">Buat Akun Baru ✨</h2>
      <p class="a-sub">Bergabung dengan ribuan pelajar di LMS Adhivasindo.</p>
      <div v-if="authErr" class="a-err">
        <ion-icon name="alert-circle-outline"></ion-icon>{{ authErr }}
      </div>
      <div class="fld">
        <label class="fld-lbl">Nama Lengkap</label>
        <div class="fld-wrap">
          <ion-icon name="person-outline" class="fld-ico"></ion-icon
          ><input
            class="fld-inp"
            type="text"
            v-model="rf.name"
            placeholder="Nama lengkap Anda"
          />
        </div>
      </div>
      <div class="fld">
        <label class="fld-lbl">Email</label>
        <div class="fld-wrap">
          <ion-icon name="mail-outline" class="fld-ico"></ion-icon
          ><input
            class="fld-inp"
            type="email"
            v-model="rf.email"
            placeholder="nama@email.com"
          />
        </div>
      </div>
      <div class="fld">
        <label class="fld-lbl">Password</label>
        <div class="fld-wrap">
          <ion-icon name="lock-closed-outline" class="fld-ico"></ion-icon
          ><input
            class="fld-inp"
            type="password"
            v-model="rf.password"
            placeholder="Min. 8 karakter"
          />
        </div>
      </div>
      <div class="fld">
        <label class="fld-lbl">Role</label>
        <div class="fld-wrap">
          <ion-icon name="shield-outline" class="fld-ico"></ion-icon>
          <select class="fld-inp sel" v-model="rf.role">
            <option value="peserta">Peserta</option>
            <option value="pemateri">Pemateri</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
      <button class="btn-a" @click="doRegister" :disabled="authLoading">
        <div v-if="authLoading" class="spn"></div>
        <span v-else>Buat Akun</span>
      </button>
      <div class="a-sw">
        Sudah punya akun?
        <span
          class="a-lnk"
          @click="
            authView = 'login';
            authErr = '';
          "
          >Masuk di sini</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const API = "http://localhost:3000/api";

const authView = ref<"login" | "register">("login");
const authErr = ref("");
const authLoading = ref(false);
const loggedIn = ref(false);

const lf = ref({
  email: "",
  password: "",
});

const rf = ref({
  name: "",
  email: "",
  password: "",
  role: "peserta",
});

const setAuthToken = (token: string, user: any) => {
  localStorage.setItem("authToken", token);
  localStorage.setItem("user", JSON.stringify(user));
};

const doLogin = async () => {
  authErr.value = "";
  if (!lf.value.email || !lf.value.password) {
    authErr.value = "Email dan password harus diisi.";
    return;
  }
  authLoading.value = true;
  try {
    const r = await fetch(`${API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: lf.value.email,
        password: lf.value.password,
      }),
    });

    const d = await r.json();
    if (d.success) {
      setAuthToken(d.token, d.data.user);
    }

    // Simulate success response
    if (r.status === 200) {
      loggedIn.value = true;
    } else {
      authErr.value = "Login gagal. Periksa kembali email dan password.";
    }
  } catch (err) {
    authErr.value = "Login gagal. Periksa kembali email dan password.";
  } finally {
    authLoading.value = false;
    loggedIn.value = true; // Simulate successful login
  }
};

function doRegister() {
  authErr.value = "";
  if (!rf.value.name || !rf.value.email || !rf.value.password) {
    authErr.value = "Semua field harus diisi.";
    return;
  }
  if (rf.value.password.length < 8) {
    authErr.value = "Password harus minimal 8 karakter.";
    return;
  }
  authLoading.value = true;
  setTimeout(() => {
    authLoading.value = false;
    loggedIn.value = true; // Simulate successful registration
  }, 1500);
}
</script>
