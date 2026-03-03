<template>
  <ion-page>
    <ion-content>
      <div class="auth-wrap">
        <!-- LOGIN -->
        <div v-if="view === 'login'" class="auth-card" key="login">
          <div class="a-logo">
            <img src="/public/logo2.png" alt="Adhivasindo Logo" />
          </div>
          <h2 class="a-h1">Selamat Datang 👋</h2>
          <p class="a-sub">Masuk ke Learning Management System Adhivasindo.</p>

          <div v-if="errMsg" class="a-err">
            <ion-icon :icon="alertCircleOutline" />
            {{ errMsg }}
          </div>

          <div class="fld">
            <label class="fld-lbl">Email</label>
            <div class="fld-wrap">
              <ion-icon :icon="mailOutline" class="fld-ico" />
              <input
                v-model="lf.email"
                class="fld-inp"
                type="email"
                placeholder="nama@email.com"
                @keydown.enter="doLogin"
              />
            </div>
          </div>
          <div class="fld">
            <label class="fld-lbl">Password</label>
            <div class="fld-wrap">
              <ion-icon :icon="lockClosedOutline" class="fld-ico" />
              <input
                v-model="lf.password"
                class="fld-inp"
                type="password"
                placeholder="••••••••"
                @keydown.enter="doLogin"
              />
            </div>
          </div>

          <button class="btn-auth" @click="doLogin" :disabled="loading">
            <div v-if="loading" class="spn" />
            <span v-else>Masuk ke Dashboard</span>
          </button>

          <div class="a-sw">
            Belum punya akun?
            <span
              class="a-lnk"
              @click="
                view = 'register';
                errMsg = '';
              "
              >Daftar sekarang</span
            >
          </div>
        </div>

        <!-- REGISTER -->
        <div v-else class="auth-card" key="register">
          <div class="a-logo">
            <div class="a-mark">A</div>
            <span class="a-txt">adhivasindo</span>
          </div>
          <h2 class="a-h1">Buat Akun Baru ✨</h2>
          <p class="a-sub">
            Bergabung dengan ribuan pelajar di LMS Adhivasindo.
          </p>

          <div v-if="errMsg" class="a-err">
            <ion-icon :icon="alertCircleOutline" />
            {{ errMsg }}
          </div>

          <div class="fld">
            <label class="fld-lbl">Nama Lengkap</label>
            <div class="fld-wrap">
              <ion-icon :icon="mailOutline" class="fld-ico" />
              <input
                v-model="rf.name"
                class="fld-inp"
                type="text"
                placeholder="Nama lengkap Anda"
              />
            </div>
          </div>
          <div class="fld">
            <label class="fld-lbl">Email</label>
            <div class="fld-wrap">
              <ion-icon :icon="mailOutline" class="fld-ico" />
              <input
                v-model="rf.email"
                class="fld-inp"
                type="email"
                placeholder="nama@email.com"
              />
            </div>
          </div>
          <div class="fld">
            <label class="fld-lbl">Password</label>
            <div class="fld-wrap">
              <ion-icon :icon="lockClosedOutline" class="fld-ico" />
              <input
                v-model="rf.password"
                class="fld-inp"
                type="password"
                placeholder="Min. 8 karakter"
              />
            </div>
          </div>
          <div class="fld">
            <label class="fld-lbl">Role</label>
            <div class="fld-wrap">
              <ion-icon :icon="shieldOutline" class="fld-ico" />
              <select v-model="rf.role" class="fld-inp sel">
                <option value="peserta">Peserta</option>
                <option value="pemateri">Pemateri</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <button class="btn-auth" @click="doRegister" :disabled="loading">
            <div v-if="loading" class="spn" />
            <span v-else>Buat Akun</span>
          </button>

          <div class="a-sw">
            Sudah punya akun?
            <span
              class="a-lnk"
              @click="
                view = 'login';
                errMsg = '';
              "
              >Masuk di sini</span
            >
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import api from "@/services/api";
import { actions } from "@/services/store";
import { IonContent, IonIcon, IonPage } from "@ionic/vue";
import {
  alertCircleOutline,
  lockClosedOutline,
  mailOutline,
  shieldOutline,
} from "ionicons/icons";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const view = ref<"login" | "register">("login");
const errMsg = ref("");
const loading = ref(false);

const lf = reactive({ email: "", password: "" });
const rf = reactive({ name: "", email: "", password: "", role: "peserta" });

async function doLogin() {
  if (!lf.email || !lf.password) {
    errMsg.value = "Email dan password wajib diisi.";
    return;
  }
  loading.value = true;
  errMsg.value = "";
  try {
    const data = await api.login(lf.email, lf.password);
    if (data.success) {
      actions.setAuth(data.data.token, data.data.user);
      router.push("/app/dashboard");
    } else {
      errMsg.value = data.message || "Login gagal.";
    }
  } catch {
    // Demo mode — langsung masuk dengan data simulasi
    const name = lf.email
      .split("@")[0]
      .replace(/[._-]/g, " ")
      .replace(/\b\w/g, (c: string) => c.toUpperCase());
    actions.setAuth("demo_token", {
      id: "1",
      name,
      email: lf.email,
      role: "peserta",
    });
    router.push("/app/dashboard");
  }
  loading.value = false;
}

async function doRegister() {
  if (!rf.name || !rf.email || !rf.password) {
    errMsg.value = "Semua field wajib diisi.";
    return;
  }
  if (rf.password.length < 8) {
    errMsg.value = "Password minimal 8 karakter.";
    return;
  }
  loading.value = true;
  errMsg.value = "";
  try {
    const data = await api.register(rf);
    if (data.success) {
      actions.setAuth(data.data.token, data.data.user);
      router.push("/app/dashboard");
    } else {
      errMsg.value = data.message || "Registrasi gagal.";
    }
  } catch {
    // Demo mode
    actions.setAuth("demo_token", {
      id: "1",
      name: rf.name,
      email: rf.email,
      role: rf.role,
    });
    router.push("/app/dashboard");
  }
  loading.value = false;
}
</script>

<style scoped>
.auth-wrap {
  min-height: 100vh;
  background: linear-gradient(145deg, #0f172a 0%, #1e3a5f 55%, #0f172a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;
  overflow: hidden;
}
.auth-wrap::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      ellipse at 25% 20%,
      rgba(26, 86, 219, 0.2) 0%,
      transparent 55%
    ),
    radial-gradient(
      ellipse at 80% 80%,
      rgba(109, 40, 217, 0.15) 0%,
      transparent 55%
    );
}
.auth-card {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 24px;
  padding: 40px 36px;
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
  box-shadow: 0 32px 96px rgba(0, 0, 0, 0.4);
  animation: cardIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.a-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: -10px;
}
.a-mark {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #1a56db, #6d28d9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 20px;
  color: white;
  box-shadow: 0 6px 18px rgba(26, 86, 219, 0.4);
}
.a-txt {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 22px;
  background: linear-gradient(135deg, #1a56db, #6d28d9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.a-h1 {
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 5px;
}
.a-sub {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 28px;
  line-height: 1.55;
}

.a-err {
  background: #fee2e2;
  border: 1px solid #fca5a5;
  color: #dc2626;
  padding: 11px 14px;
  border-radius: 10px;
  font-size: 13px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: shk 0.35s;
}
.fld {
  margin-bottom: 17px;
}
.fld-lbl {
  display: block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #475569;
  margin-bottom: 7px;
}
.fld-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.fld-ico {
  position: absolute;
  left: 14px;
  color: #94a3b8;
  font-size: 16px;
  pointer-events: none;
  z-index: 1;
}
.fld-inp {
  width: 100%;
  padding: 13px 16px 13px 42px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  font-family: inherit;
  font-size: 14px;
  color: #0f172a;
  background: #f8fafc;
  outline: none;
  transition: all 0.2s;
}
.fld-inp:focus {
  border-color: var(--primary);
  background: white;
  box-shadow: 0 0 0 3px rgba(26, 86, 219, 0.12);
}
.fld-inp.sel {
  appearance: none;
  cursor: pointer;
}
.btn-auth {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #1a56db 0%, #6d28d9 100%);
  color: white;
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.15s;
  box-shadow: 0 6px 24px rgba(26, 86, 219, 0.38);
}
.btn-auth:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 32px rgba(26, 86, 219, 0.45);
}
.btn-auth:disabled {
  opacity: 0.65;
  cursor: default;
  transform: none;
}
.a-sw {
  text-align: center;
  margin-top: 22px;
  font-size: 14px;
  color: #64748b;
}
.a-lnk {
  color: var(--primary);
  font-weight: 700;
  cursor: pointer;
}
.a-lnk:hover {
  text-decoration: underline;
}
.spn {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.65s linear infinite;
}
</style>
