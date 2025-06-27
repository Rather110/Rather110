<template>
  <div class="login-container">
    <div class="login-card">
      <div class="user-icon">
        <i class="fas fa-user"></i>
      </div>

      <p v-if="error" class="error-msg">{{ error }}</p>

      <div class="input-group">
        <i class="fas fa-user input-icon"></i>
        <input type="email" placeholder="Email ID" v-model="email" />
      </div>
      <div class="input-group">
        <i class="fas fa-lock input-icon"></i>
        <input type="password" placeholder="Password" v-model="password" />
      </div>
      <div class="options">
        <label><input type="checkbox" /> Remember me</label>
        <a href="#">Forgot Password?</a>
      </div>
      <button class="signup-btn" @click="goToSignUp">SIGN UP</button>
      <button @click="login">LOGIN</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

// ✅ Move this OUTSIDE of login()
const goToSignUp = () => {
  router.push('/signup')
}

const login = async () => {
  error.value = ''
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email.value || !password.value) {
    error.value = 'Email and password are required.'
    return
  }
  if (!emailPattern.test(email.value)) {
    error.value = 'Invalid email format.'
    return
  }
  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters.'
    return
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    const uid = userCredential.user.uid

    // ✅ Read role from Firestore using UID
    const userDoc = await getDoc(doc(db, 'users', uid))
    if (userDoc.exists()) {
      const role = userDoc.data().role

      if (role === 'admin') {
        router.push('/') // Admin Dashboard
      } else if (role === 'user') {
        router.push('/user') // Create this route if needed
      } else {
        error.value = 'Unauthorized role access.'
      }
    } else {
      error.value = 'User data not found in Firestore.'
    }

  } catch (err) {
    error.value = err.message || 'Login failed.'
  }
}
</script>


<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, #b993d6, #8ca6db);
}

.login-card {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 40px 30px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  width: 300px;
  text-align: center;
}

.user-icon {
  background-color: #133a6f;
  color: white;
  border-radius: 50%;
  padding: 20px;
  margin: auto;
  font-size: 24px;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.input-group {
  position: relative;
  margin-bottom: 20px;
}

.input-icon {
  position: absolute;
  top: 10px;
  left: 10px;
  color: #133a6f;
}

.signup-btn {
  width: 100%;
  background-color: #6a11cb;
  color: white;
  border: none;
  padding: 12px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 12px;
}
.signup-btn:hover {
  background-color: #4a089c;
}

input {
  width: 100%;
  padding: 10px 10px 10px 34px;
  border-radius: 4px;
  border: none;
  background-color: #fff;
  outline: none;
}

.options {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-bottom: 20px;
  color: #133a6f;
}

button {
  width: 100%;
  background-color: #133a6f;
  color: white;
  border: none;
  padding: 12px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
}
button:hover {
  background-color: #0b2652;
}

.error-msg {
  color: crimson;
  background-color: #ffe5e5;
  padding: 10px;
  border-radius: 6px;
  margin: 10px 0;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}
</style>
